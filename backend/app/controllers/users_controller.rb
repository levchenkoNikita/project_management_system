class UsersController < ActionController::API
    def registration
        user_data = params.require(:user).permit(:name, :email, :password, :password_confirmation)
        user = User.new(user_data)
        if user.save 
            render json: { message: "User created!", user: user}, status: :created
        else
            render json: { message: user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def show
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        user = User.find_by(id: user_id)

        if user.blank?
            return render json: { message: "User not exist" }, status: :not_found
        end

        render json: {
            message: "Request success",
            user: user.as_json(only: [:id, :name, :email, :created_at, :updated_at])
        }, status: :ok
    end

    def update
        puts "Controller update(user) is work!"
    end

    def destroy
        puts "Controller destroy(user) is work!"
    end
end
