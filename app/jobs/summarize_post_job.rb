class SummarizePostJob < ApplicationJob
  # Queue name (Sidekiq “queue”)
  queue_as :default

  # Optional: automatically retry on certain errors
  retry_on StandardError, wait: 5.seconds, attempts: 5

  # Optional: discard instead of retrying
  # discard_on SomeCustomError

  # ✅ This is the main entry point
  def perform(post_id)
    post = Post.find(post_id)
    Rails.logger.debug "========================> JoSummarizing post #{post_id}"
    # …your long-running logic
    client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
        response = client.chat(
            parameters: {
                model: "gpt-4o-mini",
                messages: [ { role: "system", content: "Summarize this text." },
                  { role: "user",   content: post.content }]
            }
        )
        
    summary = response.dig("choices", 0, "message", "content")
    Rails.logger.debug "========================> Summary: #{summary}"
    post.update(summary: summary)
    
    # Broadcast the updated post to all connected clients
    Rails.logger.debug "========================> Broadcasting post update for post #{post.id}"
    ActionCable.server.broadcast("posts_updates", {
      type: "post_updated",
      post_id: post.id,
      summary: post.summary,
      updated_at: post.updated_at
    })
    Rails.logger.debug "========================> Broadcast sent successfully"
    
  end
end
