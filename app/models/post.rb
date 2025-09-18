class Post < ApplicationRecord
  belongs_to :user
  belongs_to :community , optional: true

  has_many_attached :images , dependent: :destroy
  has_many :likes, dependent: :destroy
  has_many :comments, dependent: :destroy

  validates :content, presence: true
  validates :images, length: { maximum: 4 }
  validate :content_or_image

  def liked_by?(user)
    return false unless user
    likes.exists?(user: user)
  end

  private
  def content_or_image
    if content.blank? && images.blank?
      errors.add(:base, "Post must have text or at least one image")
    end
  end
  
end

