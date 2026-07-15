class TasksController < ActionController::API
    def index
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:project_id]
        tasks = Task.where(project_id: project_id)

        if tasks.blank?
            return render json: { message: "Task empty" }, status: :bad_request
        end

        render json: { message: "Request success", tasks: tasks }, status: :ok
    end

    def create
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:project_id]
        data_task = params.require(:task).permit(:status, :title, :description)

        if data_task[:status] < 0 || data_task[:status] > 4
            return render json: { message: "Created error" }, status: 422
        end    

        task = Task.create(data_task.merge(project_id: project_id))

        if !task.persisted?
            return render json: { message: "Created error" }, status: 422
        end

        render json: { message: "Created successful", task: task }, status: :created
    end

    def show
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:project_id]
        task_id = params[:id]
        task = Task.find_by(id: task_id, project_id: project_id)
        
        if task.blank?
            return render json: { message: "task not exist" }, status: :not_found
        end

        render json: { message: "Request is done", task: task }, status: :ok
    end

    def update
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:project_id]
        task_id = params[:id]
        data_task = params.require(:task).permit(:status, :title, :description)

        if data_task[:status] < 0 || data_task[:status] > 4
            return render json: { message: "Created error" }, status: 422
        end   

        task = Task.find_by(id: task_id, project_id: project_id)

        if task.blank?
            return render json: { message: "Task not exist" }, status: :not_found
        end

        task_status = Task.statuses[task.status]  
        request_status = data_task[:status].to_i
        isValidStatus = Task.check_status(task_status, request_status)

        if !isValidStatus
            return render json: { message: "Status is not valid" }, status: 422
        end

        task.update(data_task)
        render json: { message: "Update success" }, status: :ok
    end

    def destroy
        token = request.headers['Authorization']&.split(' ')&.last
        user_id = User.user_exist(token)

        if user_id.blank?
            return render json: { message: "Authorized error" }, status: :unauthorized
        end

        project_id = params[:project_id]
        task_id = params[:id]
        task = Task.find_by(id: task_id, project_id: project_id)

        if task.blank?
            return render json: { message: "Task not exist" }, status: :not_found
        end

        task.destroy
        render json: { message: "Task is destroyed", task: task }, status: :ok
    end
end
