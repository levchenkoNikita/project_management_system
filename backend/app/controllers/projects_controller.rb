class ProjectsController < ApiController
  def index
    user_id = current_user_id!
    projects = Project.where(user_id: user_id)
    render_message("api.messages.request_success", status: :ok, projects: projects)
  end

  def create
    user_id = current_user_id!
    project = Project.new(title: params[:title], user_id: user_id)

    if project.save
      return render_message("api.messages.project_created", status: :created, project: project)
    end

    render_message("api.errors.create_failed", status: :bad_request)
  end

  def update
    user_id = current_user_id!
    project = Project.find_by(id: params[:id], user_id: user_id)

    if project.blank?
      return render_message("api.errors.project_not_found", status: :not_found)
    end

    if project.update(title: params[:new_title])
      return render_message("api.messages.project_updated", status: :ok)
    end

    render_message("api.errors.update_failed", status: :unprocessable_entity)
  end

  def destroy
    user_id = current_user_id!
    project = Project.find_by(id: params[:id], user_id: user_id)

    if project.blank?
      return render_message("api.errors.project_not_found", status: :not_found)
    end

    project.destroy!
    render_message("api.messages.project_destroyed", status: :ok, project: project)
  end
end
