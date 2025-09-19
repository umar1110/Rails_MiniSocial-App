class CommentsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_post
  before_action :set_comment, only: [:edit, :update, :destroy]

  def create
    @comment = @post.comments.build(comment_params)
    @comment.user = current_user

    if @comment.save
      # Broadcast the new comment to all subscribers
      ActionCable.server.broadcast("comments_post_#{@post.id}", {
        comment: {
          id: @comment.id,
          content: @comment.content,
          user_name: @comment.user.name,
          user_avatar: @comment.user.avatar.attached? ? url_for(@comment.user.avatar) : nil,
          created_at: @comment.created_at
        },
        post_id: @post.id,
        total_comments: @post.comments.count
      })
      
      redirect_back(fallback_location: root_path, notice: "Comment added successfully!")
    else
      redirect_back(fallback_location: root_path, alert: "Could not add comment. #{@comment.errors.full_messages.join(', ')}")
    end
  end

  def edit
    # Only allow comment author to edit
    unless @comment.user == current_user
      redirect_back(fallback_location: root_path, alert: "You can only edit your own comments")
      return
    end
  end

  def update
    # Only allow comment author to update
    unless @comment.user == current_user
      redirect_back(fallback_location: root_path, alert: "You can only edit your own comments")
      return
    end

    if @comment.update(comment_params)
      redirect_back(fallback_location: root_path, notice: "Comment updated successfully!")
    else
      redirect_back(fallback_location: root_path, alert: "Could not update comment. #{@comment.errors.full_messages.join(', ')}")
    end
  end

  def destroy
    # Only allow comment author or post author to delete
    unless @comment.user == current_user || @post.user == current_user
      redirect_back(fallback_location: root_path, alert: "You can only delete your own comments")
      return
    end

    if @comment.destroy
      redirect_back(fallback_location: root_path, notice: "Comment deleted successfully!")
    else
      redirect_back(fallback_location: root_path, alert: "Could not delete comment")
    end
  end

  private

  def set_post
    @post = Post.find(params[:post_id])
  end

  def set_comment
    @comment = @post.comments.find(params[:id])
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
