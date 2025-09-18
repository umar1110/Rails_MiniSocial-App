class CommunitiesController < ApplicationController
    before_action :authenticate_user!
    before_action :set_community, only: [:show, :join]
    
    def community_params
        params.require(:community).permit(:name, :description, :profile_picture, :user_ids => [])
    end

    def index
        @communities = Community.all
    end

    def show
        if @community.users.include?(current_user) || @community.creator == current_user
            @posts = @community.posts
            render :show
        else
            redirect_to join_community_path(@community), alert: "You need to join this community first"
        end
    end

    def new
        @community = Community.new
        @users = User.where.not(id: current_user.id)
    end

    def create
        @community = Community.new(community_params)
        @community.creator = current_user
        
        if @community.save
            # Add creator as a member
            @community.memberships.create(user: current_user)
            
            # Add invited users as members
            if params[:community][:user_ids].present?
                invited_user_ids = params[:community][:user_ids].reject(&:blank?)
                invited_user_ids.each do |user_id|
                    @community.memberships.create(user_id: user_id)
                end
            end
            
            redirect_to root_path, notice: "Community created successfully"
        else
            @users = User.where.not(id: current_user.id)
            render :new
        end
    end

    def join
        # GET request - show join page
    end

    def join_post
        @community = Community.find(params[:id])
        
        if @community.users.include?(current_user)
            redirect_to @community, notice: "You are already a member of this community"
        else
            @community.memberships.create(user: current_user)
            redirect_to @community, notice: "Successfully joined the community!"
        end
    end

    private

    def set_community
        @community = Community.find(params[:id])
    end
end