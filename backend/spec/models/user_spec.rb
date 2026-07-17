# frozen_string_literal: true

require "rails_helper"

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  describe "associations" do
    it { is_expected.to have_many(:projects).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_least(User::NAME_MIN_LENGTH).is_at_most(User::NAME_MAX_LENGTH) }

    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_uniqueness_of(:email) }
    it { is_expected.to allow_value("user@example.com").for(:email) }
    it { is_expected.not_to allow_value("invalid").for(:email) }

    it { is_expected.to have_secure_password }
    it { is_expected.to validate_length_of(:password).is_at_most(User::PASSWORD_MAX_LENGTH) }
    it { is_expected.to allow_value("Password1!").for(:password) }
    it { is_expected.not_to allow_value("password").for(:password) }
  end

  describe ".generate_token / .decode_token / .user_exist" do
    let!(:persisted_user) { create(:user) }

    it "generates and decodes a token with user_id" do
      token = described_class.generate_token(persisted_user.id)
      payload = described_class.decode_token(token)

      expect(payload["user_id"]).to eq(persisted_user.id)
    end

    it "returns user id when token is valid" do
      token = described_class.generate_token(persisted_user.id)
      expect(described_class.user_exist(token)).to eq(persisted_user.id)
    end

    it "returns nil for blank or invalid token" do
      expect(described_class.user_exist(nil)).to be_nil
      expect(described_class.user_exist("bad.token")).to be_nil
    end
  end
end
