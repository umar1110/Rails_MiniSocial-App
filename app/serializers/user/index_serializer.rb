class User::IndexSerializer < ActiveModel::Serializer
  # Show all the attributes of the user
  attributes :id, :name, :email
  

  # Conditional attributes
  attribute :encrypted_password  , if: -> { 
     current = instance_options[:current_user]
    current&.id == 3} # For testing , suppose he is the admin

  # Add new attribute for the user
  # Add avatar url for the user
  attribute :avatar_url do
    object.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_path(object.avatar, only_path: true) : nil
  end

  # Dates in the format of YYYY-MM-DD
  attribute :created_at do
    object.created_at.strftime("%Y-%m-%d")
  end

  attribute :updated_at do
    object.updated_at.strftime("%Y-%m-%d")
  end

end
