-- Trigger function for new video requests
CREATE OR REPLACE FUNCTION notify_new_video_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_creator_name TEXT;
  v_fan_name TEXT;
BEGIN
  -- Get creator and fan names
  SELECT name INTO v_creator_name
  FROM profiles
  WHERE id = NEW.creator_id;

  SELECT name INTO v_fan_name
  FROM profiles
  WHERE id = NEW.fan_id;

  -- Create notification for creator
  PERFORM create_notification(
    NEW.creator_id,
    'order_new',
    'New Video Request!',
    format('You have a new video request from %s', COALESCE(v_fan_name, 'a fan')),
    jsonb_build_object(
      'order_id', NEW.id,
      'fan_id', NEW.fan_id,
      'fan_name', v_fan_name,
      'amount', NEW.price,
      'occasion', NEW.occasion,
      'instructions', NEW.instructions
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for new video requests
DROP TRIGGER IF EXISTS trigger_notify_new_video_request ON video_requests;
CREATE TRIGGER trigger_notify_new_video_request
  AFTER INSERT ON video_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_video_request();

-- Trigger function for video request status changes
CREATE OR REPLACE FUNCTION notify_video_request_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_creator_name TEXT;
  v_notification_type VARCHAR(50);
  v_title TEXT;
  v_message TEXT;
BEGIN
  -- Only proceed if status actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get creator name
  SELECT name INTO v_creator_name
  FROM profiles
  WHERE id = NEW.creator_id;

  -- Determine notification type and message based on status
  CASE NEW.status
    WHEN 'accepted' THEN
      v_notification_type := 'order_accepted';
      v_title := 'Video Request Accepted!';
      v_message := format('%s has accepted your video request', COALESCE(v_creator_name, 'The creator'));
    WHEN 'completed' THEN
      v_notification_type := 'order_completed';
      v_title := 'Your Video is Ready!';
      v_message := format('%s has completed your video request', COALESCE(v_creator_name, 'The creator'));
    WHEN 'cancelled' THEN
      v_notification_type := 'order_cancelled';
      v_title := 'Video Request Cancelled';
      v_message := format('Your video request to %s has been cancelled', COALESCE(v_creator_name, 'the creator'));
    ELSE
      -- Don't notify for other status changes
      RETURN NEW;
  END CASE;

  -- Create notification for fan
  PERFORM create_notification(
    NEW.fan_id,
    v_notification_type,
    v_title,
    v_message,
    jsonb_build_object(
      'order_id', NEW.id,
      'creator_id', NEW.creator_id,
      'creator_name', v_creator_name,
      'status', NEW.status
    )
  );

  RETURN NEW;
END;
$$;

-- Create trigger for video request status changes
DROP TRIGGER IF EXISTS trigger_notify_video_request_status_change ON video_requests;
CREATE TRIGGER trigger_notify_video_request_status_change
  AFTER UPDATE ON video_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_video_request_status_change();

-- Trigger function for payment notifications
CREATE OR REPLACE FUNCTION notify_payment_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_details RECORD;
BEGIN
  -- Get order details if this is related to a video request
  IF NEW.metadata ? 'order_id' THEN
    SELECT vr.creator_id, p.name as fan_name
    INTO v_order_details
    FROM video_requests vr
    JOIN profiles p ON p.id = vr.fan_id
    WHERE vr.id = (NEW.metadata->>'order_id')::UUID;

    -- Create notification for creator
    IF v_order_details.creator_id IS NOT NULL THEN
      PERFORM create_notification(
        v_order_details.creator_id,
        'payment_received',
        'Payment Received!',
        format('You received a payment of $%.2f from %s', NEW.amount / 100.0, COALESCE(v_order_details.fan_name, 'a fan')),
        jsonb_build_object(
          'payment_id', NEW.id,
          'amount', NEW.amount,
          'order_id', NEW.metadata->>'order_id'
        )
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for payment notifications
DROP TRIGGER IF EXISTS trigger_notify_payment_received ON payments;
CREATE TRIGGER trigger_notify_payment_received
  AFTER INSERT ON payments
  FOR EACH ROW
  WHEN (NEW.status = 'succeeded')
  EXECUTE FUNCTION notify_payment_received();

-- Trigger function for review notifications
CREATE OR REPLACE FUNCTION notify_review_received()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_reviewer_name TEXT;
  v_creator_id UUID;
BEGIN
  -- Get reviewer name
  SELECT name INTO v_reviewer_name
  FROM profiles
  WHERE id = NEW.reviewer_id;

  -- Get creator ID from the video request
  SELECT creator_id INTO v_creator_id
  FROM video_requests
  WHERE id = NEW.video_request_id;

  -- Create notification for creator
  IF v_creator_id IS NOT NULL THEN
    PERFORM create_notification(
      v_creator_id,
      'review_received',
      format('New %s-star Review!', NEW.rating),
      format('%s left a review: "%s"',
        COALESCE(v_reviewer_name, 'A fan'),
        LEFT(NEW.comment, 100) || CASE WHEN LENGTH(NEW.comment) > 100 THEN '...' ELSE '' END
      ),
      jsonb_build_object(
        'review_id', NEW.id,
        'rating', NEW.rating,
        'reviewer_name', v_reviewer_name,
        'video_request_id', NEW.video_request_id
      )
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for review notifications
DROP TRIGGER IF EXISTS trigger_notify_review_received ON reviews;
CREATE TRIGGER trigger_notify_review_received
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION notify_review_received();

-- Function to send system announcement
CREATE OR REPLACE FUNCTION send_system_announcement(
  p_title TEXT,
  p_message TEXT,
  p_user_ids UUID[] DEFAULT NULL
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id UUID;
  v_count INTEGER := 0;
BEGIN
  IF p_user_ids IS NULL THEN
    -- Send to all users
    FOR v_user_id IN (SELECT id FROM auth.users)
    LOOP
      PERFORM create_notification(
        v_user_id,
        'system_announcement',
        p_title,
        p_message,
        jsonb_build_object('broadcast', true)
      );
      v_count := v_count + 1;
    END LOOP;
  ELSE
    -- Send to specific users
    FOREACH v_user_id IN ARRAY p_user_ids
    LOOP
      PERFORM create_notification(
        v_user_id,
        'system_announcement',
        p_title,
        p_message,
        jsonb_build_object('broadcast', false)
      );
      v_count := v_count + 1;
    END LOOP;
  END IF;

  RETURN v_count;
END;
$$;