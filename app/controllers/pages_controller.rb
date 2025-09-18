class PagesController < ApplicationController
  def home
    @communities = Community.all
  end
end
