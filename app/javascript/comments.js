// Initialize ActionCable for comments when the page loads
document.addEventListener('DOMContentLoaded', function() {
  // Find all posts with comments sections
  const commentSections = document.querySelectorAll('[data-post-id]')
  
  commentSections.forEach(section => {
    const postId = section.getAttribute('data-post-id')
    
    // Initialize CommentsChannel for this post
    if (window.CommentsChannel) {
      const commentsChannel = new window.CommentsChannel(postId)
      commentsChannel.subscribe()
      
      // Store the channel instance for cleanup if needed
      section.commentsChannel = commentsChannel
    }
  })
})

// Cleanup when leaving the page
window.addEventListener('beforeunload', function() {
  const commentSections = document.querySelectorAll('[data-post-id]')
  commentSections.forEach(section => {
    if (section.commentsChannel) {
      section.commentsChannel.unsubscribe()
    }
  })
})
