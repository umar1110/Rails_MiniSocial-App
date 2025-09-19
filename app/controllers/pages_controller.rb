class PagesController < ApplicationController
  def home
    @communities = Community.all

    if user_signed_in?
      member_community_ids = current_user.memberships.pluck(:community_id)
      creator_community_ids = current_user.created_communities.pluck(:id)
      user_community_ids = (member_community_ids + creator_community_ids).uniq
      if user_community_ids.any?
        @posts = Post.where(community_id: nil)
                     .or(Post.where(community_id: user_community_ids))
                     .includes(:user, :community, :comments, images_attachments: :blob)
                     .order(created_at: :desc)
      else
        @posts = Post.where(community_id: nil)
                     .includes(:user, :community, :comments, images_attachments: :blob)
                     .order(created_at: :desc)
      end
    else
      @posts = Post.where(community_id: nil)
                   .includes(:user, :community, :comments, images_attachments: :blob)
                   .order(created_at: :desc)
    end
  end
end
