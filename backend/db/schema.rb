# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_07_17_010000) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["user_id"], name: "index_projects_on_user_id"
    t.check_constraint "char_length(title::text) > 0 AND char_length(title::text) <= 100", name: "projects_title_length_check"
  end

  create_table "tasks", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "description"
    t.bigint "project_id", null: false
    t.string "status", null: false
    t.string "title", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id"], name: "index_tasks_on_project_id"
    t.check_constraint "char_length(title::text) > 0 AND char_length(title::text) <= 100", name: "tasks_title_length_check"
    t.check_constraint "status::text = ANY (ARRAY['to_do'::character varying, 'in_progress'::character varying, 'in_testing'::character varying, 'rejected'::character varying, 'done'::character varying]::text[])", name: "tasks_status_check"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "password_digest", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.check_constraint "char_length(name::text) >= 6 AND char_length(name::text) <= 20", name: "users_name_length_check"
    t.check_constraint "email::text ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'::text", name: "users_email_format_check"
  end

  add_foreign_key "projects", "users"
  add_foreign_key "tasks", "projects"
end
