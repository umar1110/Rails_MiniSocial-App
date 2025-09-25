import consumer from "channels/consumer"

// Create the subscription directly like TempChannel
const postsSubscription = consumer.subscriptions.create("PostsChannel", {
  connected() {
    console.log("✅ Connected to PostsChannel")
  },

  disconnected() {
    console.log("❌ Disconnected from PostsChannel")
  },

  received(data) {
    console.log("📨 Received post update:", data)
    this.handlePostUpdate(data)
  },

  handlePostUpdate(data) {
    if (data.type === "post_updated") {
      this.updatePostSummary(data.post_id, data.summary)
    }
  },

  updatePostSummary(postId, summary) {
    // Find the post element
    const postElement = document.querySelector(`[data-post-id="${postId}"]`)
    
    // Show test post if it's a test broadcast
    if (postId == 999) {
      postElement.style.display = 'block'
    }
    
    if (postElement && summary) {
      // Find or create the summary container
      let summaryContainer = postElement.querySelector('.post-summary')
      
      if (!summaryContainer) {
        // Create summary container if it doesn't exist
        summaryContainer = document.createElement('div')
        summaryContainer.className = 'post-summary text-gray-900 whitespace-pre-wrap mb-4'
        
        // Insert after the content but before images
        const contentElement = postElement.querySelector('.text-gray-900.whitespace-pre-wrap')
        if (contentElement) {
          contentElement.parentNode.insertBefore(summaryContainer, contentElement.nextSibling)
        }
      }
      
      // Update the summary content
      summaryContainer.innerHTML = `
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <div class="flex items-center mb-2">
            <svg class="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm font-medium text-blue-800">Summary</span>
          </div>
          <p class="text-sm text-blue-700">${summary}</p>
        </div>
      `
      
      // Hide the summarize button
      const summarizeButton = postElement.querySelector('a[href*="summarize"]')
      if (summarizeButton) {
        summarizeButton.style.display = 'none'
      }
      
      // Hide loading state
      this.hideLoadingState(postId)
      
      // Show a success message briefly
      this.showSuccessMessage(postElement)
    }
  },

  showSuccessMessage(postElement) {
    const message = document.createElement('div')
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300'
    message.textContent = 'Post summarized successfully!'
    
    document.body.appendChild(message)
    
    // Remove after 3 seconds
    setTimeout(() => {
      message.style.opacity = '0'
      setTimeout(() => {
        if (message.parentNode) {
          message.parentNode.removeChild(message)
        }
      }, 300)
    }, 3000)
  },

  showLoadingState(postId) {
    const button = document.getElementById(`summarize-btn-${postId}`)
    if (button) {
      button.innerHTML = '<span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>Summarizing...'
      button.disabled = true
      button.classList.add('opacity-50', 'cursor-not-allowed')
    }
  },

  hideLoadingState(postId) {
    const button = document.getElementById(`summarize-btn-${postId}`)
    if (button) {
      button.innerHTML = 'Summarize'
      button.disabled = false
      button.classList.remove('opacity-50', 'cursor-not-allowed')
    }
  }
})

// Store subscription globally for testing
window.postsSubscription = postsSubscription

// Handle UI interactions when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up PostsChannel UI handlers...')
  
  // Test ActionCable connection
  const testButton = document.getElementById('test-actioncable')
  const testBroadcastButton = document.getElementById('test-broadcast')
  const statusDiv = document.getElementById('actioncable-status')
  
  if (testButton && statusDiv) {
    testButton.addEventListener('click', () => {
      statusDiv.textContent = 'Testing connection...'
      
      // Test if we can access the subscription
      if (window.postsSubscription) {
        statusDiv.textContent = '✅ ActionCable connected! Subscription active.'
        statusDiv.className = 'mt-2 text-sm text-green-700'
      } else {
        statusDiv.textContent = '❌ ActionCable not connected. Check console for errors.'
        statusDiv.className = 'mt-2 text-sm text-red-700'
      }
    })
  }
  
  if (testBroadcastButton && statusDiv) {
    testBroadcastButton.addEventListener('click', () => {
      statusDiv.textContent = 'Sending test broadcast...'
      
      // Send test broadcast request
      fetch('/posts/1/test_broadcast', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(data => {
        statusDiv.textContent = '✅ Test broadcast sent! Check console for received message.'
        statusDiv.className = 'mt-2 text-sm text-green-700'
        console.log('Test broadcast response:', data)
      })
      .catch(error => {
        statusDiv.textContent = '❌ Test broadcast failed. Check console for errors.'
        statusDiv.className = 'mt-2 text-sm text-red-700'
        console.error('Test broadcast error:', error)
      })
    })
  }
  
  // Handle summarize button clicks
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('summarize-btn')) {
      console.log('Summarize button clicked for post:', e.target.id)
      e.preventDefault()
      const postId = e.target.id.replace('summarize-btn-', '')
      postsSubscription.showLoadingState(postId)
      
      // Make the AJAX request
      fetch(e.target.href, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Summarize request sent:', data)
      })
      .catch(error => {
        console.error('Error:', error)
        postsSubscription.hideLoadingState(postId)
      })
    }
  })
})
