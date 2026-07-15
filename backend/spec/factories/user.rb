FactoryBot.define do
    factory :user do
        name { "User" }
        email { "user#{SecureRandom.hex(4)}@example.com" }
        password { "Password123!" }
        password_confirmation { "Password123!" }
    end
end