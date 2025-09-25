class SummarizePostJob < ApplicationJob
  # Queue name (Sidekiq “queue”)
  queue_as :default

  # Optional: automatically retry on certain errors
  retry_on StandardError, wait: :exponentially_longer, attempts: 5

  # Optional: discard instead of retrying
  # discard_on SomeCustomError

  # ✅ This is the main entry point
  def perform(post_id)
    post = Post.find(post_id)

    # …your long-running logic
    summary = OpenAI::Client.new.chat(
      parameters: {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Summarize this text." },
          { role: "user",   content: post.body }
        ]
      }
    ).dig("choices", 0, "message", "content")

    post.update(summary: summary)
  end
end
