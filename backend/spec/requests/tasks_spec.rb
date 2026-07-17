# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Tasks", type: :request do
  let(:user) { create(:user) }
  let(:project) { create(:project, user: user) }
  let(:headers) { auth_headers_for(user) }

  describe "GET /projects/:project_id/tasks" do
    it "returns tasks for project" do
      create_list(:task, 2, project: project)

      get "/projects/#{project.id}/tasks", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json_response["tasks"].size).to eq(2)
    end

    it "returns bad request when tasks are empty" do
      get "/projects/#{project.id}/tasks", headers: headers
      expect(response).to have_http_status(:bad_request)
      expect(json_response["message"]).to eq(I18n.t("api.errors.tasks_empty"))
    end
  end

  describe "POST /projects/:project_id/tasks" do
    it "creates a task with string status" do
      post "/projects/#{project.id}/tasks",
           params: {
             task: {
               title: "New task",
               description: "Desc",
               status: Task::STATUS_TO_DO
             }
           },
           headers: headers,
           as: :json

      expect(response).to have_http_status(:created)
      expect(json_response["task"]["status"]).to eq("to_do")
    end

    it "rejects invalid status" do
      post "/projects/#{project.id}/tasks",
           params: { task: { title: "X", status: "invalid" } },
           headers: headers,
           as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "GET /projects/:project_id/tasks/:id" do
    let!(:task) { create(:task, project: project) }

    it "returns the task" do
      get "/projects/#{project.id}/tasks/#{task.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json_response["task"]["id"]).to eq(task.id)
    end
  end

  describe "PATCH /projects/:project_id/tasks/:id" do
    let!(:task) { create(:task, project: project, status: Task::STATUS_TO_DO) }

    it "updates task with valid status transition" do
      patch "/projects/#{project.id}/tasks/#{task.id}",
            params: {
              task: {
                title: "Updated",
                description: "New desc",
                status: Task::STATUS_IN_PROGRESS
              }
            },
            headers: headers,
            as: :json

      expect(response).to have_http_status(:ok)
      expect(task.reload.status).to eq("in_progress")
      expect(task.title).to eq("Updated")
    end

    it "rejects invalid status transition" do
      patch "/projects/#{project.id}/tasks/#{task.id}",
            params: {
              task: {
                title: "Updated",
                description: "New desc",
                status: Task::STATUS_DONE
              }
            },
            headers: headers,
            as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json_response["message"]).to eq(I18n.t("api.errors.invalid_status"))
    end
  end

  describe "DELETE /projects/:project_id/tasks/:id" do
    let!(:task) { create(:task, project: project) }

    it "destroys the task" do
      expect {
        delete "/projects/#{project.id}/tasks/#{task.id}", headers: headers
      }.to change(Task, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end
  end
end
