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

  def self.check_status(task_status, request_status)
    if task_status == 0 && request_status != 1
        return false
    elsif task_status == 1 && (request_status != 2 && request_status != 0)
        return false
    elsif task_status == 2 && (request_status != 3 && request_status != 4)
        return false
    elsif task_status == 3 && request_status != 1
        return false
    elsif task_status == 4 && !request_status.blank?
        return false
    else
        true
    end
  end
end
