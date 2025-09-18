class PostsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post, only: [:show, :edit, :update, :destroy]
  before_action :authorize_user, only: [:edit, :update, :destroy]

  def index
    @posts = Post.where(community_id: nil).includes(:user, images_attachments: :blob).order(created_at: :desc)
  end

  def show
  end

  def new
    @post = Post.new
  end

  def create
    @post = current_user.posts.build(post_params)
    
    if @post.save
      redirect_to root_path, notice: "Post created successfully!"
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    Rails.logger.debug "Update params: #{params.inspect}"
    Rails.logger.debug "Removed image IDs: #{params[:removed_image_ids]}"
    Rails.logger.debug "Current images count before update: #{@post.images.count}"
    
    # Handle removal of existing images first
    if params[:removed_image_ids].present?
      removed_ids = params[:removed_image_ids].reject(&:blank?)
      Rails.logger.debug "Removing images with signed IDs: #{removed_ids}"
      removed_ids.each do |signed_id|
        # Find the attachment by its signed ID
        attachment = @post.images.find { |img| img.signed_id == signed_id }
        if attachment
          Rails.logger.debug "Purging attachment with signed ID: #{signed_id}"
          attachment.purge
        else
          Rails.logger.debug "Could not find attachment with signed ID: #{signed_id}"
        end
      end
    end
    
    # Update post content only (don't update images through post_params to avoid replacing all images)
    if @post.update(content: params[:post][:content])
      Rails.logger.debug "Content updated successfully"
      
      # Handle new image uploads separately
      if params[:post][:images].present?
        Rails.logger.debug "Adding new images: #{params[:post][:images].count}"
        params[:post][:images].each do |image|
          @post.images.attach(image) unless image.blank?
        end
      end
      
      Rails.logger.debug "Final images count: #{@post.images.count}"
      redirect_to root_path, notice: "Post updated successfully!"
    else
      Rails.logger.debug "Update failed: #{@post.errors.full_messages}"
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    # Allow post creator or community creator to delete posts
    if @post.user == current_user || (@post.community && @post.community.creator == current_user)
      @post.destroy
      # Redirect back to community if it's a community post, otherwise to home
      if @post.community
        redirect_to @post.community, notice: "Post deleted successfully!"
      else
        redirect_to root_path, notice: "Post deleted successfully!"
      end
    else
      redirect_to root_path, alert: "You can only delete your own posts or posts in communities you created."
    end
  end

  private

  def set_post
    @post = Post.find(params[:id])
  end

  def post_params
    params.require(:post).permit(:content, :community_id, images: [])
  end

  def authorize_user
    # Allow post creator or community creator to edit/delete posts
    unless @post.user == current_user || (@post.community && @post.community.creator == current_user)
      redirect_to root_path, alert: "You can only edit your own posts or posts in communities you created."
    end
  end
end
