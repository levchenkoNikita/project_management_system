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
        puts "Controller show(user) is work!"
    end

    def update
        puts "Controller update(user) is work!"
    end

    def destroy
        puts "Controller destroy(user) is work!"
    end
end
