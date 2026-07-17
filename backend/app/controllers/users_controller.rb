class UsersController < ApiController
  def registration
    user_data = params.require(:user).permit(:name, :email, :password, :password_confirmation)
    user = User.new(user_data)

    if user.save
      return render_message(
        "api.messages.user_created",
        status: :created,
        user: user.as_json(only: [ :id, :name, :email, :created_at, :updated_at ])
      )
    end

    render json: { message: user.errors.full_messages }, status: :unprocessable_entity
  end

  def show
    user_id = current_user_id!
    user = User.find_by(id: user_id)
    raise ActiveRecord::RecordNotFound if user.blank?

    render_message(
      "api.messages.request_success",
      status: :ok,
      user: user.as_json(only: [ :id, :name, :email, :created_at, :updated_at ])
    )
  end

  def update
    render_message("api.messages.request_success", status: :ok)
  end

  def destroy
    render_message("api.messages.request_success", status: :ok)
  end
end
