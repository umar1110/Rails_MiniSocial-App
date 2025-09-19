module ErrorRenderable

    extend ActiveSupport::Concern

    included do
        rescue_from StandardError, with: :render_error
    end
    
    def render_error(error)
        render json: { error: error.message }, status: :internal_server_error
    end
end