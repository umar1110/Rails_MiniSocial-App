class TempController < ApplicationController

    def index
        client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
        response = client.chat(
            parameters: {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: "Hello, how are you?" }]
            }
        )
        
        @message = response.dig("choices", 0, "message", "content")
         # dig is used to access the message from the response
        # paramas of dig is [choices, 0, message, content] means we are accessing the message from the response
        # choices is the array of choices, 0 is the first choice, message is the message object, content is the content of the message
        # we are accessing the message from the response
        render json: { message: @message }
    end


    def create
        question = params[:question]
        client = OpenAI::Client.new(access_token: ENV['OPENAI_API_KEY'])
        response = client.chat(
            parameters: {
                model: "gpt-4o-mini",
                messages: [{ role: "user", content: question }]
            }
        )
        render json: { message: response.dig("choices", 0, "message", "content") }
    end
end