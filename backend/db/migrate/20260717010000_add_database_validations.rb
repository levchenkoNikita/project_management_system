class AddDatabaseValidations < ActiveRecord::Migration[8.1]
  def up
    # Users
    change_column_null :users, :name, false
    change_column_null :users, :email, false
    change_column_null :users, :password_digest, false

    execute <<~SQL
      ALTER TABLE users
        ADD CONSTRAINT users_name_length_check
        CHECK (char_length(name) BETWEEN 6 AND 20)
    SQL

    execute <<~SQL
      ALTER TABLE users
        ADD CONSTRAINT users_email_format_check
        CHECK (email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$')
    SQL

    # Projects
    change_column_null :projects, :title, false

    execute <<~SQL
      ALTER TABLE projects
        ADD CONSTRAINT projects_title_length_check
        CHECK (char_length(title) > 0 AND char_length(title) <= 100)
    SQL

    # Tasks: convert status integer -> string with allowed values
    add_column :tasks, :status_tmp, :string

    execute <<~SQL
      UPDATE tasks
      SET status_tmp = CASE status
        WHEN 0 THEN 'to_do'
        WHEN 1 THEN 'in_progress'
        WHEN 2 THEN 'in_testing'
        WHEN 3 THEN 'rejected'
        WHEN 4 THEN 'done'
        ELSE 'to_do'
      END
    SQL

    remove_column :tasks, :status
    rename_column :tasks, :status_tmp, :status
    change_column_null :tasks, :status, false
    change_column_null :tasks, :title, false

    execute <<~SQL
      ALTER TABLE tasks
        ADD CONSTRAINT tasks_title_length_check
        CHECK (char_length(title) > 0 AND char_length(title) <= 100)
    SQL

    execute <<~SQL
      ALTER TABLE tasks
        ADD CONSTRAINT tasks_status_check
        CHECK (status IN ('to_do', 'in_progress', 'in_testing', 'rejected', 'done'))
    SQL
  end

  def down
    execute "ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_status_check"
    execute "ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_title_length_check"
    execute "ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_title_length_check"
    execute "ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_format_check"
    execute "ALTER TABLE users DROP CONSTRAINT IF EXISTS users_name_length_check"

    add_column :tasks, :status_tmp, :integer

    execute <<~SQL
      UPDATE tasks
      SET status_tmp = CASE status
        WHEN 'to_do' THEN 0
        WHEN 'in_progress' THEN 1
        WHEN 'in_testing' THEN 2
        WHEN 'rejected' THEN 3
        WHEN 'done' THEN 4
        ELSE 0
      END
    SQL

    remove_column :tasks, :status
    rename_column :tasks, :status_tmp, :status

    change_column_null :tasks, :title, true
    change_column_null :projects, :title, true
    change_column_null :users, :password_digest, true
    change_column_null :users, :email, true
    change_column_null :users, :name, true
  end
end
