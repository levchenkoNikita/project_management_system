class User < ApplicationRecord
    has_many :projects, dependent: :destroy

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

    SECRET_KEY = 'Hello, World!'

    def self.generate_token(user_id)
        payload = { user_id: user_id, exp: 1.hours.from_now.to_i }
        JWT.encode(payload, SECRET_KEY, 'HS256')
    end

    def self.decode_token(token)
        begin
            JWT.decode(token, SECRET_KEY, true, algorithm: 'HS256')[0]
        rescue JWT::DecodeError
            nil
        end
    end

    def self.user_exist(token)
        if token.blank?
            return nil
        end

        decoded = self.decode_token(token)

        if decoded.blank?
            return nil
        end

        user_id = decoded['user_id']
        user = User.find_by(id: user_id)

        if user.blank?
            return nil
        end

        user_id
    end
end
