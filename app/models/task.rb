class Task < ApplicationRecord
  belongs_to :project

  enum :status, {
    to_do: 0,
    in_progress: 1,
    in_testing: 2,
    rejected: 3,
    done: 4
  }

  validates :status, presence: true
  validates :title, presence: true,  length: { maximum: 100 }
end
