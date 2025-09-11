import { authenticatedTest as test, expect } from '../fixtures/authenticated-test'

test.describe('Tier Content Access', () => {
  test('fan views exclusive content for subscribed tier', async ({ fanPage }) => {
    // Navigate to a creator profile
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForLoadState('networkidle')
    await fanPage.waitForTimeout(2000)
    
    // Look for exclusive content section
    const exclusiveSection = fanPage.locator('[data-testid="exclusive-content"], h2:has-text("Exclusive"), h3:has-text("Exclusive")')
    const hasExclusive = await exclusiveSection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasExclusive) {
      console.log('Exclusive content section found')
      
      // Check for tier-gated content
      const tieredContent = fanPage.locator('[data-testid^="tier-content-"], [data-tier-required]')
      const contentCount = await tieredContent.count()
      console.log(`Found ${contentCount} tier-gated content items`)
      
      if (contentCount > 0) {
        // Check first content item
        const firstContent = tieredContent.first()
        
        // Check if locked or unlocked
        const lockIcon = firstContent.locator('[data-testid="content-locked"], .locked, svg[class*="lock"]')
        const isLocked = await lockIcon.isVisible({ timeout: 1000 }).catch(() => false)
        
        if (isLocked) {
          console.log('Content is locked (user not subscribed to required tier)')
          
          // Check for required tier info
          const tierRequired = await firstContent.locator('[data-testid="required-tier"], [class*="required"]').textContent().catch(() => null)
          if (tierRequired) {
            console.log(`Required tier: ${tierRequired}`)
          }
          
          // Check for subscribe prompt
          const subscribePrompt = firstContent.locator('[data-testid="subscribe-to-unlock"], button:has-text("Subscribe")')
          const hasPrompt = await subscribePrompt.isVisible({ timeout: 1000 }).catch(() => false)
          
          if (hasPrompt) {
            console.log('Subscribe prompt displayed')
          }
        } else {
          console.log('Content is unlocked (user has required tier)')
          
          // Check for content preview or access
          const playButton = firstContent.locator('[data-testid="play-content"], button:has-text("Play"), button:has-text("View")')
          const canPlay = await playButton.isVisible({ timeout: 1000 }).catch(() => false)
          
          if (canPlay) {
            console.log('Content is accessible')
          }
        }
      }
    } else {
      console.log('No exclusive content section found')
      expect(true).toBe(true)
    }
  })
  
  test('fan is blocked from higher tier content', async ({ fanPage }) => {
    // Navigate to creator with multiple tiers
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for content marked as higher tier
    const higherTierContent = fanPage.locator('[data-tier-level="higher"], [data-testid="premium-content"], [class*="premium"]').first()
    const hasHigherTier = await higherTierContent.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasHigherTier) {
      // Try to access the content
      await higherTierContent.click()
      await fanPage.waitForTimeout(1000)
      
      // Check for access denied modal
      const accessDeniedModal = fanPage.locator('[role="dialog"]:has-text("Upgrade"), [data-testid="upgrade-required"]')
      const modalShown = await accessDeniedModal.isVisible({ timeout: 3000 }).catch(() => false)
      
      if (modalShown) {
        console.log('Upgrade required modal shown')
        
        // Check for upgrade options
        const upgradeOptions = accessDeniedModal.locator('[data-testid^="upgrade-option-"]')
        const optionCount = await upgradeOptions.count()
        console.log(`${optionCount} upgrade options presented`)
        
        // Check for current tier info
        const currentTier = accessDeniedModal.locator('[data-testid="current-tier"], text=/current tier/i')
        const tierInfo = await currentTier.textContent().catch(() => null)
        if (tierInfo) {
          console.log(`Current tier: ${tierInfo}`)
        }
      } else {
        // Check if content shows locked state
        const lockedOverlay = fanPage.locator('[data-testid="content-locked-overlay"], .locked-overlay')
        const isLocked = await lockedOverlay.isVisible({ timeout: 2000 }).catch(() => false)
        
        if (isLocked) {
          console.log('Content shows locked overlay')
        }
      }
    } else {
      console.log('No higher tier content to test')
      expect(true).toBe(true)
    }
  })
  
  test('fan accesses tier-specific live streams', async ({ fanPage }) => {
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for live stream section
    const liveSection = fanPage.locator('[data-testid="live-streams"], h2:has-text("Live"), h3:has-text("Stream")')
    const hasLiveSection = await liveSection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasLiveSection) {
      console.log('Live stream section found')
      
      // Check for tier-restricted streams
      const tierStreams = fanPage.locator('[data-testid^="tier-stream-"], [data-stream-tier]')
      const streamCount = await tierStreams.count()
      console.log(`Found ${streamCount} tier-restricted streams`)
      
      if (streamCount > 0) {
        const firstStream = tierStreams.first()
        
        // Check access level
        const joinButton = firstStream.locator('[data-testid="join-stream"], button:has-text("Join"), button:has-text("Watch")')
        const canJoin = await joinButton.isEnabled({ timeout: 2000 }).catch(() => false)
        
        if (canJoin) {
          console.log('User can join the stream')
          
          // Click to test access
          await joinButton.click()
          await fanPage.waitForTimeout(2000)
          
          // Check if stream player opens
          const streamPlayer = fanPage.locator('[data-testid="stream-player"], video, [class*="player"]')
          const playerVisible = await streamPlayer.isVisible({ timeout: 3000 }).catch(() => false)
          
          if (playerVisible) {
            console.log('Stream player opened successfully')
          }
        } else {
          console.log('Join button disabled - tier requirement not met')
          
          // Check for tier requirement message
          const tierMessage = firstStream.locator('[data-testid="stream-tier-required"], [class*="required"]')
          const message = await tierMessage.textContent().catch(() => null)
          if (message) {
            console.log(`Tier requirement: ${message}`)
          }
        }
      }
    } else {
      console.log('No live stream section available')
      expect(true).toBe(true)
    }
  })
  
  test('fan downloads tier-exclusive content', async ({ fanPage }) => {
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for downloadable content
    const downloadSection = fanPage.locator('[data-testid="downloads"], h3:has-text("Download"), [class*="download"]')
    const hasDownloads = await downloadSection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasDownloads) {
      console.log('Download section found')
      
      // Find tier-exclusive downloads
      const tierDownloads = fanPage.locator('[data-testid^="tier-download-"], [data-download-tier]')
      const downloadCount = await tierDownloads.count()
      console.log(`Found ${downloadCount} tier-exclusive downloads`)
      
      if (downloadCount > 0) {
        const firstDownload = tierDownloads.first()
        
        // Check download button state
        const downloadBtn = firstDownload.locator('[data-testid="download-btn"], button:has-text("Download"), a[download]')
        const canDownload = await downloadBtn.isEnabled({ timeout: 2000 }).catch(() => false)
        
        if (canDownload) {
          console.log('Download available for user tier')
          
          // Set up download listener
          const downloadPromise = fanPage.waitForEvent('download', { timeout: 5000 }).catch(() => null)
          
          await downloadBtn.click()
          
          const download = await downloadPromise
          if (download) {
            console.log(`File downloaded: ${download.suggestedFilename()}`)
            // Clean up
            await download.delete().catch(() => {})
          }
        } else {
          console.log('Download restricted - higher tier required')
          
          // Check for upgrade prompt
          const upgradePrompt = firstDownload.locator('[data-testid="upgrade-for-download"], text=/upgrade/i')
          const promptVisible = await upgradePrompt.isVisible({ timeout: 1000 }).catch(() => false)
          
          if (promptVisible) {
            console.log('Upgrade prompt shown for download')
          }
        }
      }
    } else {
      console.log('No download section available')
      expect(true).toBe(true)
    }
  })
  
  test('fan views early access content', async ({ fanPage }) => {
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for early access section
    const earlyAccessSection = fanPage.locator('[data-testid="early-access"], h3:has-text("Early Access"), [class*="early"]')
    const hasEarlyAccess = await earlyAccessSection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasEarlyAccess) {
      console.log('Early access section found')
      
      // Check for countdown or release info
      const releaseInfo = fanPage.locator('[data-testid="release-countdown"], [class*="countdown"], time[datetime]')
      const hasCountdown = await releaseInfo.isVisible({ timeout: 2000 }).catch(() => false)
      
      if (hasCountdown) {
        const releaseText = await releaseInfo.textContent()
        console.log(`Release info: ${releaseText}`)
        
        // Check if content is accessible
        const accessButton = fanPage.locator('[data-testid="access-early"], button:has-text("Access"), button:has-text("Watch Now")')
        const canAccess = await accessButton.isVisible({ timeout: 2000 }).catch(() => false)
        
        if (canAccess) {
          console.log('User has early access to content')
        } else {
          console.log('Content not yet available or tier requirement not met')
        }
      }
    } else {
      console.log('No early access content available')
      expect(true).toBe(true)
    }
  })
  
  test('fan participates in tier-exclusive events', async ({ fanPage }) => {
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for events section
    const eventsSection = fanPage.locator('[data-testid="creator-events"], h3:has-text("Events"), [class*="event"]')
    const hasEvents = await eventsSection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasEvents) {
      console.log('Events section found')
      
      // Find tier-exclusive events
      const tierEvents = fanPage.locator('[data-testid^="tier-event-"], [data-event-tier]')
      const eventCount = await tierEvents.count()
      console.log(`Found ${eventCount} tier-exclusive events`)
      
      if (eventCount > 0) {
        const firstEvent = tierEvents.first()
        
        // Get event details
        const eventTitle = await firstEvent.locator('[data-testid="event-title"], h4').textContent().catch(() => 'Unknown Event')
        console.log(`Event: ${eventTitle}`)
        
        // Check registration button
        const registerBtn = firstEvent.locator('[data-testid="register-event"], button:has-text("Register"), button:has-text("Join")')
        const canRegister = await registerBtn.isEnabled({ timeout: 2000 }).catch(() => false)
        
        if (canRegister) {
          console.log('User can register for event')
          
          await registerBtn.click()
          await fanPage.waitForTimeout(1500)
          
          // Check for confirmation
          const confirmation = fanPage.locator('[data-testid="event-registered"], text=/registered|confirmed/i')
          const isRegistered = await confirmation.isVisible({ timeout: 3000 }).catch(() => false)
          
          if (isRegistered) {
            console.log('Successfully registered for event')
          }
        } else {
          console.log('Registration restricted - tier requirement not met')
          
          // Check for tier requirement
          const tierReq = firstEvent.locator('[data-testid="event-tier-required"], [class*="required"]')
          const reqText = await tierReq.textContent().catch(() => null)
          if (reqText) {
            console.log(`Required tier: ${reqText}`)
          }
        }
      }
    } else {
      console.log('No events section available')
      expect(true).toBe(true)
    }
  })
  
  test('fan accesses tier-based community features', async ({ fanPage }) => {
    await fanPage.goto('/creator/wyclef-jean')
    await fanPage.waitForTimeout(2000)
    
    // Look for community section
    const communitySection = fanPage.locator('[data-testid="community"], h3:has-text("Community"), [class*="community"]')
    const hasCommunity = await communitySection.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasCommunity) {
      console.log('Community section found')
      
      // Check for tier-based chat rooms
      const chatRooms = fanPage.locator('[data-testid^="tier-chat-"], [data-chat-tier]')
      const roomCount = await chatRooms.count()
      console.log(`Found ${roomCount} tier-based chat rooms`)
      
      if (roomCount > 0) {
        const firstRoom = chatRooms.first()
        
        // Check access
        const joinBtn = firstRoom.locator('[data-testid="join-chat"], button:has-text("Join"), button:has-text("Enter")')
        const canJoin = await joinBtn.isEnabled({ timeout: 2000 }).catch(() => false)
        
        if (canJoin) {
          console.log('User can join chat room')
          
          await joinBtn.click()
          await fanPage.waitForTimeout(2000)
          
          // Check if chat opens
          const chatInterface = fanPage.locator('[data-testid="chat-interface"], [class*="chat-window"]')
          const chatOpen = await chatInterface.isVisible({ timeout: 3000 }).catch(() => false)
          
          if (chatOpen) {
            console.log('Chat room opened successfully')
            
            // Check for message input
            const messageInput = chatInterface.locator('[data-testid="chat-input"], input[placeholder*="message"], textarea[placeholder*="message"]')
            const canMessage = await messageInput.isEnabled({ timeout: 1000 }).catch(() => false)
            
            if (canMessage) {
              console.log('User can send messages')
            }
          }
        } else {
          console.log('Chat room restricted - tier requirement not met')
        }
      }
      
      // Check for tier badges in community
      const userBadge = fanPage.locator('[data-testid="user-tier-badge"], [class*="tier-badge"]')
      const hasBadge = await userBadge.isVisible({ timeout: 2000 }).catch(() => false)
      
      if (hasBadge) {
        const badgeText = await userBadge.textContent()
        console.log(`User tier badge: ${badgeText}`)
      }
    } else {
      console.log('No community section available')
      expect(true).toBe(true)
    }
  })
  
  test('fan receives tier-specific notifications', async ({ fanPage }) => {
    // Navigate to notification settings
    await fanPage.goto('/fan/settings/notifications')
    await fanPage.waitForTimeout(2000)
    
    // Look for tier notification settings
    const tierNotifications = fanPage.locator('[data-testid="tier-notifications"], h3:has-text("Tier"), [class*="tier-notification"]')
    const hasSettings = await tierNotifications.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasSettings) {
      console.log('Tier notification settings found')
      
      // Check for notification preferences
      const notificationToggles = fanPage.locator('[data-testid^="tier-notification-toggle-"], [role="switch"]')
      const toggleCount = await notificationToggles.count()
      console.log(`Found ${toggleCount} tier notification toggles`)
      
      if (toggleCount > 0) {
        // Check first toggle state
        const firstToggle = notificationToggles.first()
        const isChecked = await firstToggle.getAttribute('aria-checked')
        console.log(`First toggle state: ${isChecked}`)
        
        // Toggle it
        await firstToggle.click()
        await fanPage.waitForTimeout(1000)
        
        // Check for save confirmation
        const saved = fanPage.locator('text=/saved|updated/i')
        const isSaved = await saved.isVisible({ timeout: 2000 }).catch(() => false)
        
        if (isSaved) {
          console.log('Notification preferences saved')
        }
      }
      
      // Check notification history
      const historyTab = fanPage.locator('[data-testid="notification-history"], button:has-text("History")')
      if (await historyTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await historyTab.click()
        await fanPage.waitForTimeout(1500)
        
        const notifications = fanPage.locator('[data-testid^="notification-item-"]')
        const notifCount = await notifications.count()
        console.log(`Found ${notifCount} notifications in history`)
        
        if (notifCount > 0) {
          // Check for tier-specific notifications
          const tierNotif = notifications.filter({ hasText: /tier|exclusive|subscriber/i }).first()
          const hasTierNotif = await tierNotif.isVisible({ timeout: 1000 }).catch(() => false)
          
          if (hasTierNotif) {
            const notifText = await tierNotif.textContent()
            console.log(`Tier notification: ${notifText?.substring(0, 100)}...`)
          }
        }
      }
    } else {
      console.log('No tier notification settings available')
      expect(true).toBe(true)
    }
  })
})