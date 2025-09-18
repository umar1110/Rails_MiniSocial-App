class Community < ApplicationRecord
 belongs_to :creator, class_name: "User"
 has_one_attached :profile_picture

 validates :name, presence: true
 validates :description, presence: true
 validates :profile_picture, presence: true
end
