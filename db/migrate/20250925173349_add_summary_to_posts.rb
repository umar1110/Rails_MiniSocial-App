class AddSummaryToPosts < ActiveRecord::Migration[8.0]
  def change
    add_column :posts, :summary, :string 
  end
end
