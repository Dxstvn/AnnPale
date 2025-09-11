import { createClient } from '@supabase/supabase-js'
import { faker } from '@faker-js/faker'

// Initialize Supabase client with service role key for seeding
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Sample creator and fan IDs (these should exist in your profiles table)
const CREATORS = [
  { id: 'creator-1', name: 'Jean Baptiste', category: 'Music' },
  { id: 'creator-2', name: 'Marie Claire', category: 'Comedy' },
  { id: 'creator-3', name: 'Pierre Louis', category: 'Sports' }
]

const FANS = [
  { id: 'fan-1', name: 'Alex Johnson' },
  { id: 'fan-2', name: 'Sarah Williams' },
  { id: 'fan-3', name: 'Michael Brown' },
  { id: 'fan-4', name: 'Emily Davis' },
  { id: 'fan-5', name: 'James Wilson' }
]

const OCCASIONS = [
  'Birthday',
  'Anniversary',
  'Graduation',
  'Pep Talk',
  'Roast',
  'Wedding',
  'Get Well Soon',
  'Congratulations',
  'Holiday Greeting',
  'Just Because'
]

const ORDER_STATUSES = ['pending', 'accepted', 'in_progress', 'completed', 'rejected']

async function seedDemoData() {
  console.log('🌱 Starting to seed demo data...')

  try {
    // Create sample orders
    const orders = []
    const now = new Date()
    
    for (let i = 0; i < 50; i++) {
      const creator = CREATORS[Math.floor(Math.random() * CREATORS.length)]
      const fan = FANS[Math.floor(Math.random() * FANS.length)]
      const occasion = OCCASIONS[Math.floor(Math.random() * OCCASIONS.length)]
      const status = ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)]
      
      // Random date within last 30 days
      const createdAt = new Date(now)
      createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30))
      
      const basePrice = Math.floor(Math.random() * 200) + 50 // $50-$250
      const platformFee = basePrice * 0.3 // 30% platform fee
      const creatorEarnings = basePrice * 0.7 // 70% creator earnings
      
      const order = {
        id: `order-${i + 1}`,
        fan_id: fan.id,
        creator_id: creator.id,
        status,
        total_amount: basePrice,
        platform_fee: platformFee,
        creator_earnings: creatorEarnings,
        occasion,
        instructions: `Please make this ${occasion} video special for my friend!`,
        delivery_days: 7,
        is_public: Math.random() > 0.5,
        created_at: createdAt.toISOString(),
        updated_at: createdAt.toISOString()
      }
      
      // Add additional timestamps based on status
      if (status !== 'pending') {
        const acceptedAt = new Date(createdAt)
        acceptedAt.setHours(acceptedAt.getHours() + Math.floor(Math.random() * 24))
        order.accepted_at = acceptedAt.toISOString()
      }
      
      if (status === 'completed') {
        const completedAt = new Date(createdAt)
        completedAt.setDate(completedAt.getDate() + Math.floor(Math.random() * 5) + 1)
        order.completed_at = completedAt.toISOString()
      }
      
      orders.push(order)
    }
    
    // Insert orders
    const { data: insertedOrders, error: ordersError } = await supabase
      .from('orders')
      .insert(orders)
      .select()
    
    if (ordersError) {
      console.error('Error inserting orders:', ordersError)
      throw ordersError
    }
    
    console.log(`✅ Inserted ${insertedOrders?.length || 0} sample orders`)
    
    // Create sample payment intents for completed orders
    const paymentIntents = []
    const completedOrders = orders.filter(o => o.status === 'completed')
    
    for (const order of completedOrders) {
      const paymentIntent = {
        id: `pi_${order.id}`,
        stripe_payment_intent_id: `pi_test_${faker.string.alphanumeric(24)}`,
        amount: order.total_amount * 100, // Stripe uses cents
        currency: 'usd',
        status: 'succeeded',
        creator_id: order.creator_id,
        fan_id: order.fan_id,
        order_id: order.id,
        metadata: {
          occasion: order.occasion,
          fan_name: FANS.find(f => f.id === order.fan_id)?.name,
          creator_name: CREATORS.find(c => c.id === order.creator_id)?.name
        },
        created_at: order.created_at,
        updated_at: order.completed_at
      }
      
      paymentIntents.push(paymentIntent)
    }
    
    if (paymentIntents.length > 0) {
      const { data: insertedPayments, error: paymentsError } = await supabase
        .from('payment_intents')
        .insert(paymentIntents)
        .select()
      
      if (paymentsError) {
        console.error('Error inserting payment intents:', paymentsError)
      } else {
        console.log(`✅ Inserted ${insertedPayments?.length || 0} sample payment intents`)
      }
    }
    
    // Create sample video uploads for completed orders
    const videoUploads = []
    
    for (const order of completedOrders) {
      const videoUpload = {
        id: `video_${order.id}`,
        order_id: order.id,
        creator_id: order.creator_id,
        video_url: `https://example.com/videos/${order.id}.mp4`,
        thumbnail_url: `https://example.com/thumbnails/${order.id}.jpg`,
        duration: Math.floor(Math.random() * 120) + 30, // 30-150 seconds
        file_size: Math.floor(Math.random() * 50000000) + 10000000, // 10-60 MB
        processing_status: 'completed',
        metadata: {
          resolution: '1920x1080',
          fps: 30,
          codec: 'h264'
        },
        created_at: order.completed_at,
        updated_at: order.completed_at
      }
      
      videoUploads.push(videoUpload)
    }
    
    if (videoUploads.length > 0) {
      const { data: insertedVideos, error: videosError } = await supabase
        .from('video_uploads')
        .insert(videoUploads)
        .select()
      
      if (videosError) {
        console.error('Error inserting video uploads:', videosError)
      } else {
        console.log(`✅ Inserted ${insertedVideos?.length || 0} sample video uploads`)
      }
    }
    
    // Create sample payments/transactions
    const payments = []
    
    for (const order of completedOrders) {
      const payment = {
        id: `payment_${order.id}`,
        order_id: order.id,
        payment_intent_id: `pi_${order.id}`,
        amount: order.total_amount,
        currency: 'usd',
        status: 'completed',
        provider: Math.random() > 0.3 ? 'stripe' : 'paypal',
        creator_id: order.creator_id,
        fan_id: order.fan_id,
        platform_fee: order.platform_fee,
        creator_earnings: order.creator_earnings,
        metadata: {
          occasion: order.occasion
        },
        created_at: order.completed_at,
        updated_at: order.completed_at
      }
      
      payments.push(payment)
    }
    
    if (payments.length > 0) {
      const { data: insertedPayments, error: paymentsTableError } = await supabase
        .from('payments')
        .insert(payments)
        .select()
      
      if (paymentsTableError) {
        console.error('Error inserting payments:', paymentsTableError)
      } else {
        console.log(`✅ Inserted ${insertedPayments?.length || 0} sample payments`)
      }
    }
    
    console.log('\n🎉 Demo data seeding complete!')
    
    // Display summary statistics
    const summary = {
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      acceptedOrders: orders.filter(o => o.status === 'accepted').length,
      inProgressOrders: orders.filter(o => o.status === 'in_progress').length,
      completedOrders: orders.filter(o => o.status === 'completed').length,
      rejectedOrders: orders.filter(o => o.status === 'rejected').length,
      totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0),
      totalPlatformFees: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.platform_fee, 0),
      totalCreatorEarnings: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.creator_earnings, 0)
    }
    
    console.log('\n📊 Summary:')
    console.log(`  Total Orders: ${summary.totalOrders}`)
    console.log(`  - Pending: ${summary.pendingOrders}`)
    console.log(`  - Accepted: ${summary.acceptedOrders}`)
    console.log(`  - In Progress: ${summary.inProgressOrders}`)
    console.log(`  - Completed: ${summary.completedOrders}`)
    console.log(`  - Rejected: ${summary.rejectedOrders}`)
    console.log(`  Total Revenue: $${summary.totalRevenue.toFixed(2)}`)
    console.log(`  Platform Fees (30%): $${summary.totalPlatformFees.toFixed(2)}`)
    console.log(`  Creator Earnings (70%): $${summary.totalCreatorEarnings.toFixed(2)}`)
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error)
    process.exit(1)
  }
}

// Run the seeding function
seedDemoData().then(() => {
  console.log('\n✨ Done!')
  process.exit(0)
})