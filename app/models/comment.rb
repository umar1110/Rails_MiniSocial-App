class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :content, presence: true

  validates :post_id, uniqueness: { scope: :user_id }
  
end
