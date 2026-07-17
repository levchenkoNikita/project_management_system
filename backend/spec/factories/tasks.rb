# frozen_string_literal: true

FactoryBot.define do
  factory :task do
    association :project
    sequence(:title) { |n| "Task #{n}" }
    description { "Task description" }
    status { Task::STATUS_TO_DO }
  end
end
