# frozen_string_literal: true

# Simple CORS middleware so the Next.js frontend on another origin can call the API.
class CorsMiddleware
  ALLOWED_HEADERS = "Origin, Content-Type, Accept, Authorization, X-Requested-With"
  ALLOWED_METHODS = "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"

  def initialize(app)
    @app = app
  end

  def call(env)
    if env["REQUEST_METHOD"] == "OPTIONS"
      return [204, cors_headers, []]
    end

    status, headers, body = @app.call(env)
    [status, headers.merge(cors_headers), body]
  end

  private

  def cors_headers
    {
      "Access-Control-Allow-Origin" => "*",
      "Access-Control-Allow-Methods" => ALLOWED_METHODS,
      "Access-Control-Allow-Headers" => ALLOWED_HEADERS,
      "Access-Control-Max-Age" => "86400"
    }
  end
end

Rails.application.config.middleware.insert_before 0, CorsMiddleware
