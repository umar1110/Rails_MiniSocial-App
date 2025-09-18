class Post < ApplicationRecord
  belongs_to :user
  belongs_to :community , optional: true

  has_many_attached :images , dependent: :destroy

  # validates :images, length: { maximum: 4 }
  # validates :images, content_type: ['image/png', 'image/jpeg', 'image/jpg']
  # validates :images, size: { less_than: 5.megabytes }
  # validate :content_or_image
  

  # private
  # def content_or_image
  #   if content.blank? && images.blank?
  #     errors.add(:base, "Post must have text or at least one image")
  #   end
  # end
end
