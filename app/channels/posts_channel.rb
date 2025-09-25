class PostsChannel < ApplicationCable::Channel
  def subscribed
    # Subscribe to all post updates
    stream_from "posts_updates"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
