-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add role_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES roles(id);

-- Insert default roles
INSERT INTO roles (name, description)
VALUES 
  ('super_admin', 'Super Administrator with full access'),
  ('admin', 'Administrator with limited administrative access'),
  ('visitor', 'Regular user with basic access')
ON CONFLICT (name) DO NOTHING;

-- Enable RLS on roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

-- Create policies for roles table
DROP POLICY IF EXISTS "Anyone can view roles" ON roles;
CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only super admins can modify roles" ON roles;
CREATE POLICY "Only super admins can modify roles"
  ON roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      JOIN roles ON users.role_id = roles.id
      WHERE users.id = auth.uid() AND roles.name = 'super_admin'
    )
  );

-- Update users policies to include role-based access
DROP POLICY IF EXISTS "Super admins can view all users" ON users;
CREATE POLICY "Super admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'super_admin'
    )
  );

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users u
      JOIN roles r ON u.role_id = r.id
      WHERE u.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Enable realtime for roles table
alter publication supabase_realtime add table roles;
