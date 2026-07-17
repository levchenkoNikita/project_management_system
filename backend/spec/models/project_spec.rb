# frozen_string_literal: true

require "rails_helper"

RSpec.describe Project, type: :model do
  subject(:project) { build(:project) }

  describe "associations" do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to have_many(:tasks).dependent(:destroy) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(Project::TITLE_MAX_LENGTH) }
  end
end
