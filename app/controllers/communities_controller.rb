class CommunitiesController < ApplicationController
    before_action :authenticate_user!
    
    def community_params
        params.require(:community).permit(:name, :description, :profile_picture)
    end

    def index
        @communities = Community.all
    end

    def show
        @community = Community.find(params[:id])
    end

    def new
        @community = Community.new
    end

    def create
        @community = Community.new(community_params)
        @community.creator = current_user
        if @community.save
            redirect_to root_path, notice: "Community created successfully"
        else
            puts "===========> Community creation failed: #{@community.errors.full_messages.join(', ')}"
            render :new
        end
    end
end