class PagesController < ApplicationController
  def home
    @communities = Community.all
    # Load global posts (posts without community)
    @posts = Post.where(community_id: nil)
                 .includes(:user, images_attachments: :blob)
                 .order(created_at: :desc)
  end
end
