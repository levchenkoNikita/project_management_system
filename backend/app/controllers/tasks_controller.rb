class TasksController < ApiController
  def index
    return unless ensure_project_access!

    tasks = Task.where(project_id: params[:project_id])
    if tasks.blank?
      return render_message("api.errors.tasks_empty", status: :bad_request)
    end

    render_message("api.messages.request_success", status: :ok, tasks: tasks)
  end

  def create
    return unless ensure_project_access!

    data_task = params.require(:task).permit(:status, :title, :description)
    status = data_task[:status].to_s

    unless Task.valid_status?(status)
      return render_message("api.errors.create_failed", status: :unprocessable_entity)
    end

    task = Task.create(data_task.merge(project_id: params[:project_id], status: status))

    if task.persisted?
      return render_message("api.messages.task_created", status: :created, task: task)
    end

    render_message("api.errors.create_failed", status: :unprocessable_entity)
  end

  def show
    return unless ensure_project_access!

    task = Task.find_by(id: params[:id], project_id: params[:project_id])
    if task.blank?
      return render_message("api.errors.task_not_found", status: :not_found)
    end

    render_message("api.messages.task_shown", status: :ok, task: task)
  end

  def update
    return unless ensure_project_access!

    data_task = params.require(:task).permit(:status, :title, :description)
    status = data_task[:status].to_s

    unless Task.valid_status?(status)
      return render_message("api.errors.create_failed", status: :unprocessable_entity)
    end

    task = Task.find_by(id: params[:id], project_id: params[:project_id])
    if task.blank?
      return render_message("api.errors.task_not_found", status: :not_found)
    end

    if status != task.status.to_s && !Task.check_status(task.status, status)
      return render_message("api.errors.invalid_status", status: :unprocessable_entity)
    end

    attrs = data_task.to_h
    attrs.delete("status") if status == task.status.to_s

    if task.update(attrs)
      return render_message("api.messages.task_updated", status: :ok)
    end

    render_message("api.errors.update_failed", status: :unprocessable_entity)
  end

  def destroy
    return unless ensure_project_access!

    task = Task.find_by(id: params[:id], project_id: params[:project_id])
    if task.blank?
      return render_message("api.errors.task_not_found", status: :not_found)
    end

    task.destroy!
    render_message("api.messages.task_destroyed", status: :ok, task: task)
  end

  private

  def ensure_project_access!
    user_id = current_user_id!
    project = Project.find_by(id: params[:project_id], user_id: user_id)
    return true if project.present?

    render_message("api.errors.project_not_found", status: :not_found)
    false
  end
end
