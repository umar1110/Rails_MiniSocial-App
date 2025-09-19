class Api::V1::UsersController < ApplicationController

    # include Authenticable
    include ErrorRenderable

    def index
        @users = Users::AllUsers.call
        render json: @users, status: :ok , each_serializer: User::IndexSerializer , current_user: current_user

    rescue Users::AllUsers::Error => e
        render json: { error: e.message }, status: :internal_server_error
    end
end
