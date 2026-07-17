# frozen_string_literal: true

require "rails_helper"

RSpec.describe "Projects", type: :request do
  let(:user) { create(:user) }
  let(:headers) { auth_headers_for(user) }

  describe "GET /projects" do
    it "returns user projects" do
      create_list(:project, 2, user: user)

      get "/projects", headers: headers

      expect(response).to have_http_status(:ok)
      expect(json_response["projects"].size).to eq(2)
    end

    it "returns unauthorized without token" do
      get "/projects"
      expect(response).to have_http_status(:unauthorized)
    end
  end

  describe "POST /projects" do
    it "creates a project" do
      expect {
        post "/projects", params: { title: "New Project" }, headers: headers, as: :json
      }.to change(Project, :count).by(1)

      expect(response).to have_http_status(:created)
      expect(json_response["project"]["title"]).to eq("New Project")
    end
  end

  describe "PATCH /projects/:id" do
    let!(:project) { create(:project, user: user, title: "Old") }

    it "updates project title" do
      patch "/projects/#{project.id}", params: { new_title: "Updated" }, headers: headers, as: :json

      expect(response).to have_http_status(:ok)
      expect(project.reload.title).to eq("Updated")
    end

    it "returns not found for another user project" do
      other = create(:project)
      patch "/projects/#{other.id}", params: { new_title: "X" }, headers: headers, as: :json
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "DELETE /projects/:id" do
    let!(:project) { create(:project, user: user) }

    it "destroys the project" do
      expect {
        delete "/projects/#{project.id}", headers: headers
      }.to change(Project, :count).by(-1)

      expect(response).to have_http_status(:ok)
    end
  end
end
