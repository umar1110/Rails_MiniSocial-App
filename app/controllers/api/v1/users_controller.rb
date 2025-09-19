class Api::V1::UsersController < ApplicationController

    include Authenticable
    include ErrorRenderable

    def index
        @users = Users::AllUsers.call
        render json: @users, status: :ok

    rescue Users::AllUsers::Error => e
        render json: { error: e.message }, status: :internal_server_error
    end
end
