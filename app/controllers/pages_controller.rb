class PagesController < ApplicationController
  def home
    @communities = Community.all
    
    if user_signed_in?
      # Get community IDs where user is a member or creator
      user_community_ids = current_user.memberships.pluck(:community_id)
      user_community_ids << current_user.created_communities.pluck(:id)
      user_community_ids = user_community_ids.flatten.uniq
      
      # Load global posts (posts without community) and posts from user's communities
      @posts = Post.where(community_id: nil)
                   .or(Post.where(community_id: current_user.communities.pluck(:id)))
                   .includes(:user, :community, images_attachments: :blob)
                   .order(created_at: :desc)
    else
      # For non-signed in users, only show global posts
      @posts = Post.where(community_id: nil)
                   .includes(:user, :community, images_attachments: :blob)
                   .order(created_at: :desc)
    end
  end
end
