class Project < ApplicationRecord
  TITLE_MAX_LENGTH = 100

  has_many :tasks, dependent: :destroy
  belongs_to :user

  validates :title, presence: true, length: { maximum: TITLE_MAX_LENGTH }
end
