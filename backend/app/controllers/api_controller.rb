class ApiController < ActionController::API
  before_action :set_locale

  rescue_from StandardError, with: :render_internal_error
  rescue_from ActionController::ParameterMissing, with: :render_parameter_missing
  rescue_from ActiveRecord::RecordInvalid, with: :render_record_invalid
  rescue_from ActiveRecord::StatementInvalid, with: :render_bad_request
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  rescue_from JWT::DecodeError, with: :render_unauthorized
  rescue_from UnauthorizedError, with: :render_unauthorized

  private

  def set_locale
    locale = extract_locale
    I18n.locale = I18n.available_locales.include?(locale) ? locale : I18n.default_locale
  end

  def extract_locale
    header = request.headers["Accept-Language"].to_s
    header.scan(/[a-z]{2}/i).map(&:downcase).map(&:to_sym).find do |code|
      I18n.available_locales.include?(code)
    end
  end

  def current_user_id!
    token = request.headers["Authorization"]&.split(" ")&.last
    user_id = User.user_exist(token)
    raise UnauthorizedError, I18n.t("api.errors.unauthorized") if user_id.blank?

    user_id
  end

  def render_message(key, status:, **extra)
    render json: { message: I18n.t(key) }.merge(extra), status: status
  end

  def render_parameter_missing(_exception)
    render json: { message: I18n.t("api.errors.parameter_missing") }, status: :bad_request
  end

  def render_not_found(_exception)
    render json: { message: I18n.t("api.errors.not_found") }, status: :not_found
  end

  def render_record_invalid(exception)
    render json: {
      message: exception.record.errors.full_messages
    }, status: :unprocessable_entity
  end

  def render_bad_request(_exception)
    render json: { message: I18n.t("api.errors.bad_request") }, status: :bad_request
  end

  def render_unauthorized(_exception)
    render json: { message: I18n.t("api.errors.unauthorized") }, status: :unauthorized
  end

  def render_internal_error(exception)
    raise exception if Rails.env.development? || Rails.env.test?

    Rails.logger.error(exception.full_message)
    render json: { message: I18n.t("api.errors.internal") }, status: :internal_server_error
  end
end
