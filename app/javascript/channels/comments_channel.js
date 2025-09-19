import { createConsumer } from "@rails/actioncable"

const consumer = createConsumer()

class CommentsChannel {
  constructor(postId) {
    this.postId = postId
    this.subscription = null
  }

  subscribe() {
    this.subscription = consumer.subscriptions.create(
      { 
        channel: "CommentsChannel", 
        post_id: this.postId 
      },
      {
        connected() {
          console.log("Connected to CommentsChannel for post", this.postId)
        },

        disconnected() {
          console.log("Disconnected from CommentsChannel")
        },

        received(data) {
          console.log("Received comment data:", data)
          this.handleNewComment(data)
        },

        handleNewComment(data) {
          // Find the comments container for this post
          const commentsContainer = document.querySelector(`[data-post-id="${data.post_id}"] .comments-list`)
          
          if (commentsContainer) {
            // Create new comment element
            const commentElement = this.createCommentElement(data.comment)
            
            // Add to the top of comments list (most recent first)
            commentsContainer.insertBefore(commentElement, commentsContainer.firstChild)
            
            // Update comment count
            this.updateCommentCount(data.post_id, data.total_comments)
            
            // Clear the comment form
            this.clearCommentForm(data.post_id)
          }
        },

        createCommentElement(comment) {
          const commentDiv = document.createElement('div')
          commentDiv.className = 'flex items-start space-x-3 py-3 border-b border-gray-100'
          commentDiv.innerHTML = `
            <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              ${comment.user_avatar ? 
                `<img src="${comment.user_avatar}" class="w-full h-full object-cover" alt="${comment.user_name}">` :
                `<div class="w-full h-full bg-blue-500 flex items-center justify-center">
                  <span class="text-xs font-medium text-white">${comment.user_name.charAt(0).toUpperCase()}</span>
                </div>`
              }
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-2 mb-1">
                <h4 class="text-sm font-semibold text-gray-900">${comment.user_name}</h4>
                <span class="text-xs text-gray-500">•</span>
                <span class="text-xs text-gray-500">just now</span>
              </div>
              <p class="text-sm text-gray-800 whitespace-pre-wrap">${comment.content}</p>
            </div>
          `
          return commentDiv
        },

        updateCommentCount(postId, totalComments) {
          const countElement = document.querySelector(`[data-post-id="${postId}"] .comments-count`)
          if (countElement) {
            countElement.textContent = `Comments (${totalComments})`
          }
        },

        clearCommentForm(postId) {
          const form = document.querySelector(`[data-post-id="${postId}"] .comment-form textarea`)
          if (form) {
            form.value = ''
          }
        }
      }
    )
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}

// Export for use in other files
window.CommentsChannel = CommentsChannel
