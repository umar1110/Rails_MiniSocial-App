class Api::V1::Auth::SessionsController < ApplicationController

    include ErrorRenderable

    def index
        @user = User.find_by(email: params[:email])
        if @user&.valid_password?(params[:password])
            # Pending to add the token to the user ( Just for testing )
            # TO DO: Add the token to the user 
            render json: { token: @user.authentication_token }, status: :ok
        else
            render json: { error: "Invalid email or password" }, status: :unauthorized
        end
    end
end