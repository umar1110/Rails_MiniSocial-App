class CommentsChannel < ApplicationCable::Channel
  def subscribed
    # Subscribe to comments for a specific post
    post_id = params[:post_id]
    stream_from "comments_post_#{post_id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
