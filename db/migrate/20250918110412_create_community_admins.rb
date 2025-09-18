class CreateCommunityAdmins < ActiveRecord::Migration[8.0]
  def change
    create_table :community_admins do |t|
      t.references :user, null: false, foreign_key: true
      t.references :community, null: false, foreign_key: true

      t.timestamps
    end
  end
end
