# frozen_string_literal: true

module AuthHelpers
  def auth_headers_for(user)
    token = User.generate_token(user.id)
    { "Authorization" => "Bearer #{token}", "Accept" => "application/json" }
  end

  def json_response
    JSON.parse(response.body)
  end
end

RSpec.configure do |config|
  config.include AuthHelpers, type: :request
end
