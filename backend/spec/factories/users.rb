# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    sequence(:name) { |n| "UserName#{n}" }
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "Password1!" }
    password_confirmation { "Password1!" }
  end
end
