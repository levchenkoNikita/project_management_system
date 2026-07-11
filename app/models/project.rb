class Project < ApplicationRecord
  has_many :tasks, dependent :destroy
  belongs_to :user

  validates :title, presence: true, length: { maximum: 100 }
end
