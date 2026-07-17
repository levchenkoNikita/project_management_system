# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Users", type: :request do
  describe "POST /registration" do
    it "creates a user" do
      post "/registration",
           params: {
             user: {
               name: "ValidName",
               email: "newuser@example.com",
               password: "Password1!",
               password_confirmation: "Password1!"
             }
           },
           as: :json

      expect(response).to have_http_status(:created)
      expect(json_response["message"]).to eq(I18n.t("api.messages.user_created"))
      expect(json_response["user"]["email"]).to eq("newuser@example.com")
    end

    it "returns validation errors for invalid data" do
      post "/registration",
           params: {
             user: {
               name: "bad",
               email: "bad",
               password: "short",
               password_confirmation: "short"
             }
           },
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response["message"]).to be_an(Array)
    end
  end

  describe "GET /user" do
    let(:user) { create(:user) }

    it "returns current user for authorized request" do
      get "/user", headers: auth_headers_for(user)

      expect(response).to have_http_status(:ok)
      expect(json_response["user"]["id"]).to eq(user.id)
      expect(json_response["user"]["email"]).to eq(user.email)
    end

    it "returns unauthorized without token" do
      get "/user"

      expect(response).to have_http_status(:unauthorized)
      expect(json_response["message"]).to eq(I18n.t("api.errors.unauthorized"))
    end
  end
end
