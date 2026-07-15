class ProjectsController < ActionController::API
    def index
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        projects = Project.where(user_id: user_id)
        render json: { message: "Request success", projects: projects }, status: :ok
    end

    def create
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project = Project.new(title: params[:title], user_id: user_id)

        if project.save
            return render json: { message: "Project is created!", project: project }, status: :created
        end

        render json: { message: "Created error!" }, status: :bad_request
    end

    def update
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:id]
        new_title = params[:new_title]
        project = Project.find_by(id: project_id, user_id: user_id)

        if !project
            return render json: { message: "Update is error" }, status: :not_found
        end

        project.update(title: new_title)
        render json: { message: "Update is successful" }, status: :ok
    end

    def destroy
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:id]
        project = Project.find_by(id: project_id, user_id: user_id)

        if !project
            return render json: { message: "Project not exist" }, status: :not_found
        end

        project.destroy
        render json: { message: "Project is destroyed", project: project }, status: :ok
    end
end
