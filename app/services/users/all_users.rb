module Users
   class AllUsers
    class Error < StandardError; end
    def self.call
        User.all
    rescue StandardError => e
        Rails.logger.error "Error fetching all users: #{e.message}"
        raise Error, "Failed to fetch all users"
    end
   end
end