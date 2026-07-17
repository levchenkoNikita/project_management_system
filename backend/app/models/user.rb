class User < ApplicationRecord
  NAME_MIN_LENGTH = 6
  NAME_MAX_LENGTH = 20
  PASSWORD_MAX_LENGTH = 72
  PASSWORD_FORMAT = /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\/\-]).{8,}\z/

  has_many :projects, dependent: :destroy

  has_secure_password
  validates :name, presence: true, length: { minimum: NAME_MIN_LENGTH, maximum: NAME_MAX_LENGTH }
  validates :password, presence: true, length: { maximum: PASSWORD_MAX_LENGTH }, format: {
    with: PASSWORD_FORMAT
  }, if: -> { new_record? || !password.nil? }
  validates :email, presence: true, uniqueness: true, format: {
    with: URI::MailTo::EMAIL_REGEXP
  }

  SECRET_KEY = "Hello, World!"

  def self.generate_token(user_id)
    payload = { user_id: user_id, exp: 1.hours.from_now.to_i }
    JWT.encode(payload, SECRET_KEY, "HS256")
  end

  def self.decode_token(token)
    JWT.decode(token, SECRET_KEY, true, algorithm: "HS256")[0]
  rescue JWT::DecodeError
    nil
  end

  def self.user_exist(token)
    return nil if token.blank?

    decoded = decode_token(token)
    return nil if decoded.blank?

    user_id = decoded["user_id"]
    user = find_by(id: user_id)
    return nil if user.blank?

    user_id
  end
end
