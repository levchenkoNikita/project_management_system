class User < ApplicationRecord
    has_many :projects, dependent :destroy

    has_secure_password
    validates :name, presence: true, length: { minimum: 6, maximum: 20 }
    validates :password, presence: true, length: { maximum: 72 }, format: { 
        with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/\-]).{8,}\z/, 
        message: "должен содержать минимум одну заглавную, одну строчную букву, цифру и 
        спецсимвол (!@#$%^&*()_+{}[]:;<>,.?~/-)"
    }
    validates :email, presence: true, uniqueness: true, format: { 
        with: URI::MailTo::EMAIL_REGEXP, 
        message: "некорректный email"
    }
end
