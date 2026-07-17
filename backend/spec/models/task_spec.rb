# frozen_string_literal: true

require "rails_helper"

RSpec.describe Task, type: :model do
  subject(:task) { build(:task) }

  describe "associations" do
    it { is_expected.to belong_to(:project) }
  end

  describe "validations" do
    it { is_expected.to validate_presence_of(:title) }
    it { is_expected.to validate_length_of(:title).is_at_most(Task::TITLE_MAX_LENGTH) }
    it { is_expected.to validate_presence_of(:status) }
    it { is_expected.to define_enum_for(:status).with_values(Task::STATUSES).backed_by_column_of_type(:string) }
  end

  describe "constants and helpers" do
    it "defines string status constants" do
      expect(Task::STATUS_TO_DO).to eq("to_do")
      expect(Task::STATUSES.values).to contain_exactly(
        "to_do", "in_progress", "in_testing", "rejected", "done"
      )
    end

    it "validates status values" do
      expect(described_class.valid_status?("to_do")).to be(true)
      expect(described_class.valid_status?("unknown")).to be(false)
    end
  end

  describe ".check_status" do
    it "allows valid transitions" do
      expect(described_class.check_status("to_do", "in_progress")).to be(true)
      expect(described_class.check_status("in_progress", "to_do")).to be(true)
      expect(described_class.check_status("in_progress", "in_testing")).to be(true)
      expect(described_class.check_status("in_testing", "done")).to be(true)
      expect(described_class.check_status("rejected", "in_progress")).to be(true)
      expect(described_class.check_status("done", "to_do")).to be(true)
    end

    it "rejects invalid transitions" do
      expect(described_class.check_status("to_do", "done")).to be(false)
      expect(described_class.check_status("done", "in_progress")).to be(false)
      expect(described_class.check_status("to_do", "unknown")).to be(false)
    end
  end
end
