class SessionsController < ActionController::API
    def login
        user_data = params.require(:user).permit(:email, :password)
        user = User.find_by(email: user_data[:email])

        if user&.authenticate(user_data[:password])
            token = User.generate_token(user.id)
            return render json: { message: 'Login successful', token: token }, status: :ok
        end
        
        render json: { message: 'Login error' }, status: :unauthorized
    end

    def logout
        puts "Controller logout(sessions) is work!"
    end
end
