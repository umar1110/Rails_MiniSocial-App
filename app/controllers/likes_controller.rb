class LikesController < ApplicationController
    before_action :authenticate_user! , only: [:create, :destroy]
    before_action :set_post , only: [:create, :destroy]

    def create
        @like = @post.likes.build(user: current_user)
        if @like.save
            redirect_back(fallback_location: root_path)
        else
            redirect_back(fallback_location: root_path, alert: "Could not like post")
        end
    end
    
    def destroy
        @like = @post.likes.find_by(user: current_user)
        if @like&.destroy
            redirect_back(fallback_location: root_path)
        else
            redirect_back(fallback_location: root_path, alert: "Could not unlike post")
        end
    end

    private
    
    def set_post
        @post = Post.find(params[:post_id])
    end
    
end
