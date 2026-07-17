# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Sessions", type: :request do
  describe "POST /login" do
    let(:user) { create(:user, password: "Password1!", password_confirmation: "Password1!") }

    it "returns token on valid credentials" do
      post "/login", params: { user: { email: user.email, password: "Password1!" } }, as: :json

      expect(response).to have_http_status(:ok)
      expect(json_response["message"]).to eq(I18n.t("api.messages.login_successful"))
      expect(json_response["token"]).to be_present
    end

    it "returns unauthorized on invalid credentials" do
      post "/login", params: { user: { email: user.email, password: "Wrong1!" } }, as: :json

      expect(response).to have_http_status(:unauthorized)
      expect(json_response["message"]).to eq(I18n.t("api.errors.login_failed"))
    end
  end
end
