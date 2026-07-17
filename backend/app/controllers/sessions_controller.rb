class SessionsController < ApiController
  def login
    user_data = params.require(:user).permit(:email, :password)
    user = User.find_by(email: user_data[:email])

    if user&.authenticate(user_data[:password])
      token = User.generate_token(user.id)
      return render_message("api.messages.login_successful", status: :ok, token: token)
    end

    render_message("api.errors.login_failed", status: :unauthorized)
  end

  def logout
    render_message("api.messages.request_success", status: :ok)
  end
end
