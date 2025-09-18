class CreateCommunities < ActiveRecord::Migration[8.0]
  def change
    create_table :communities do |t|
      t.string :name
      t.text :description
      t.references :creator, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
