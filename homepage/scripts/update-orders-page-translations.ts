#!/usr/bin/env npx tsx

import * as fs from 'fs/promises'

async function updateOrdersPage() {
  const filePath = '/Users/dustinjasmin/AnnPale/homepage/app/[locale]/fan/orders/page.tsx'

  let content = await fs.readFile(filePath, 'utf-8')

  // Update the useTranslations hook to use the correct namespace
  content = content.replace(
    `const t = useTranslations()`,
    `const t = useTranslations('fan.orders')`
  )

  // Update all hardcoded strings to use translations
  const replacements = [
    // Header
    [`'My Orders'`, `t('title')`],
    [`'Track and manage all your orders'`, `t('subtitle')`],

    // Stats
    [`>Total Orders</p>`, `>{t('totalOrders')}</p>`],
    [`>Active</p>`, `>{t('active')}</p>`],
    [`>Completed</p>`, `>{t('completed')}</p>`],
    [`>Total Spent</p>`, `>{t('totalSpent')}</p>`],
    [`>This Month</p>`, `>{t('thisMonth')}</p>`],

    // Search and filter
    [`placeholder={'Search orders...'}`, `placeholder={t('searchPlaceholder')}`],
    [`placeholder="Search orders..."`, `placeholder={t('searchPlaceholder')}`],

    // Tabs
    [`All Orders (`, `{t('allOrders')} (`],
    [`Active (`, `{t('active')} (`],
    [`Completed (`, `{t('completed')} (`],
    [`Cancelled/Refunded`, `{t('cancelledRefunded')}`],

    // No orders state
    [`No orders found`, `{t('noOrdersFound')}`],
    [`'You haven\\'t placed any orders yet'`, `t('noOrdersMessage')`],
    [`Browse Creators`, `{t('browseCreators')}`],

    // Order card
    [`>Video</span>`, `>{t('video')}</span>`],
    [`Order #`, `{t('orderNumber')}`],
    [`'Loading...'`, `t('loading')`],
    [`'Watch'`, `t('watch')`],
    [`>Rate</`, `>{t('rate')}</`],
    [`>Contact</`, `>{t('contact')}</`],
    [`View Details`, `{t('viewDetails')}`],

    // Dialog
    [`>Order Details</`, `>{t('orderDetails')}</`],
    [`>Order Date</p>`, `>{t('orderDate')}</p>`],
    [`>Amount Paid</p>`, `>{t('amountPaid')}</p>`],
    [`>Completed Date</p>`, `>{t('completedDate')}</p>`],
    [`>Occasion</p>`, `>{t('occasion')}</p>`],
    [`>Instructions</p>`, `>{t('instructions')}</p>`],
    [`'Watch Video'`, `t('watchVideo')`],
    [`>Download</`, `>{t('download')}</`],
    [`>Rate</`, `>{t('rate')}</`],
    [`Contact Creator`, `{t('contactCreator')}`],
    [`Cancel Order`, `{t('cancelOrder')}`],
    [`Request Refund`, `{t('requestRefund')}`],
    [`Try again`, `{t('tryAgain')}`],
    [`'Video URL not available. Please contact support.'`, `t('videoNotAvailable')`],

    // Select options
    [`>All Types</`, `>{t('allTypes')}</`],
    [`>Videos</`, `>{t('videos')}</`],
    [`>Calls</`, `>{t('calls')}</`],
    [`>Livestreams</`, `>{t('livestreams')}</`],
    [`>Gifts</`, `>{t('gifts')}</`],
  ]

  for (const [from, to] of replacements) {
    content = content.replaceAll(from, to)
  }

  // Handle the "No orders matching" message which needs special treatment
  content = content.replace(
    `\`No orders matching "\${searchQuery}"\``,
    `\`\${t('noOrdersSearchMessage')} "\${searchQuery}"\``
  )

  await fs.writeFile(filePath, content, 'utf-8')
  console.log('✅ Updated orders page with translations')
}

updateOrdersPage().catch(console.error)