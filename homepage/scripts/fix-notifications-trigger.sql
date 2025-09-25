-- Drop the existing trigger that's causing issues
DROP TRIGGER IF EXISTS trigger_notify_new_video_request ON video_requests;

-- Create a fixed version of the trigger function that matches the actual notifications table structure
CREATE OR REPLACE FUNCTION notify_new_video_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_creator_name TEXT;
  v_fan_name TEXT;
BEGIN
  -- Get creator name
  SELECT display_name INTO v_creator_name
  FROM profiles
  WHERE id = NEW.creator_id;

  -- Get fan name
  SELECT display_name INTO v_fan_name
  FROM profiles
  WHERE id = NEW.fan_id;

  -- Create notification for creator - using the actual column structure
  INSERT INTO notifications (
    user_id,
    type,
    message,
    data
  ) VALUES (
    NEW.creator_id,
    'order_new',
    COALESCE(v_fan_name, 'A fan') || ' has requested a video for ' || NEW.occasion,
    jsonb_build_object(
      'video_request_id', NEW.id,
      'fan_id', NEW.fan_id,
      'fan_name', v_fan_name,
      'occasion', NEW.occasion,
      'price', NEW.price
    )
  );

  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER trigger_notify_new_video_request
  AFTER INSERT ON video_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_video_request();

-- Also fix the video request status change trigger
CREATE OR REPLACE FUNCTION notify_video_request_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_creator_name TEXT;
  v_fan_name TEXT;
  v_message TEXT;
  v_notification_type TEXT;
BEGIN
  -- Only notify on certain status changes
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get names
  SELECT display_name INTO v_creator_name FROM profiles WHERE id = NEW.creator_id;
  SELECT display_name INTO v_fan_name FROM profiles WHERE id = NEW.fan_id;

  -- Determine notification type and message based on status change
  CASE NEW.status
    WHEN 'accepted' THEN
      v_notification_type := 'order_accepted';
      v_message := COALESCE(v_creator_name, 'The creator') || ' has accepted your video request';

      -- Notify fan
      INSERT INTO notifications (user_id, type, message, data)
      VALUES (
        NEW.fan_id,
        v_notification_type,
        v_message,
        jsonb_build_object(
          'video_request_id', NEW.id,
          'creator_id', NEW.creator_id,
          'creator_name', v_creator_name
        )
      );

    WHEN 'completed' THEN
      v_notification_type := 'order_completed';
      v_message := 'Your video from ' || COALESCE(v_creator_name, 'the creator') || ' is ready!';

      -- Notify fan
      INSERT INTO notifications (user_id, type, message, data)
      VALUES (
        NEW.fan_id,
        v_notification_type,
        v_message,
        jsonb_build_object(
          'video_request_id', NEW.id,
          'creator_id', NEW.creator_id,
          'creator_name', v_creator_name,
          'video_url', NEW.video_url
        )
      );

    WHEN 'rejected' THEN
      v_notification_type := 'order_cancelled';
      v_message := COALESCE(v_creator_name, 'The creator') || ' has declined your video request';

      -- Notify fan
      INSERT INTO notifications (user_id, type, message, data)
      VALUES (
        NEW.fan_id,
        v_notification_type,
        v_message,
        jsonb_build_object(
          'video_request_id', NEW.id,
          'creator_id', NEW.creator_id,
          'creator_name', v_creator_name
        )
      );

    ELSE
      -- No notification for other status changes
      RETURN NEW;
  END CASE;

  RETURN NEW;
END;
$$;

-- Recreate the status change trigger
DROP TRIGGER IF EXISTS trigger_notify_video_request_status_change ON video_requests;
CREATE TRIGGER trigger_notify_video_request_status_change
  AFTER UPDATE ON video_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_video_request_status_change();