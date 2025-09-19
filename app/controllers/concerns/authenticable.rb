module Authenticable
  extend ActiveSupport::Concern

  included do
    before_action :custom_authenticate_user
  end

  def custom_authenticate_user
    if current_user.nil?
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  end
end
