class Community < ApplicationRecord
 belongs_to :creator, class_name: "User"
 has_one_attached :profile_picture

# Associations
 has_many :memberships , dependent: :destroy
 has_many :users, through: :memberships
 has_many :posts, dependent: :destroy

 validates :name, presence: true
 validates :description, presence: true
 validates :profile_picture, presence: true
end
