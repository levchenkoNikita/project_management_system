class Task < ApplicationRecord
  TITLE_MAX_LENGTH = 100

  STATUS_TO_DO = "to_do"
  STATUS_IN_PROGRESS = "in_progress"
  STATUS_IN_TESTING = "in_testing"
  STATUS_REJECTED = "rejected"
  STATUS_DONE = "done"

  STATUSES = {
    to_do: STATUS_TO_DO,
    in_progress: STATUS_IN_PROGRESS,
    in_testing: STATUS_IN_TESTING,
    rejected: STATUS_REJECTED,
    done: STATUS_DONE
  }.freeze

  ALLOWED_TRANSITIONS = {
    STATUS_TO_DO => [ STATUS_IN_PROGRESS ].freeze,
    STATUS_IN_PROGRESS => [ STATUS_TO_DO, STATUS_IN_TESTING ].freeze,
    STATUS_IN_TESTING => [ STATUS_REJECTED, STATUS_DONE ].freeze,
    STATUS_REJECTED => [ STATUS_IN_PROGRESS ].freeze,
    STATUS_DONE => [].freeze
  }.freeze

  belongs_to :project

  enum :status, STATUSES

  validates :status, presence: true
  validates :title, presence: true, length: { maximum: TITLE_MAX_LENGTH }

  def self.valid_status?(status)
    STATUSES.value?(status.to_s)
  end

  def self.check_status(current_status, requested_status)
    current = current_status.to_s
    requested = requested_status.to_s
    return false unless valid_status?(current) && valid_status?(requested)
    return false if current == requested

    ALLOWED_TRANSITIONS.fetch(current, []).include?(requested)
  end
end
