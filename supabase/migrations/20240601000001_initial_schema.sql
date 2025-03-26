-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create balances table
CREATE TABLE IF NOT EXISTS balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  locked_balance BIGINT NOT NULL DEFAULT 0,
  automatic_balance BIGINT NOT NULL DEFAULT 0,
  growth_rate DECIMAL(10, 4) NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create network_members table
CREATE TABLE IF NOT EXISTS network_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES network_members(id),
  name TEXT NOT NULL,
  avatar TEXT,
  level INTEGER NOT NULL DEFAULT 1,
  position TEXT NOT NULL CHECK (position IN ('left', 'right')),
  join_date TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create training_progress table
CREATE TABLE IF NOT EXISTS training_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, day_number)
);

-- Create ppob_services table
CREATE TABLE IF NOT EXISTS ppob_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  transaction_type TEXT NOT NULL,
  amount BIGINT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  reference_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create security_settings table
CREATE TABLE IF NOT EXISTS security_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  pin_hash TEXT,
  two_factor_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  dark_mode BOOLEAN NOT NULL DEFAULT false,
  email_notifications BOOLEAN NOT NULL DEFAULT true,
  push_notifications BOOLEAN NOT NULL DEFAULT true,
  transaction_alerts BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  notification_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE ppob_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users policies
DROP POLICY IF EXISTS "Users can view their own data" ON users;
CREATE POLICY "Users can view their own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON users;
CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Balances policies
DROP POLICY IF EXISTS "Users can view their own balances" ON balances;
CREATE POLICY "Users can view their own balances"
  ON balances FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own balances" ON balances;
CREATE POLICY "Users can update their own balances"
  ON balances FOR UPDATE
  USING (auth.uid() = user_id);

-- Network members policies
DROP POLICY IF EXISTS "Users can view their network" ON network_members;
CREATE POLICY "Users can view their network"
  ON network_members FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM network_members nm
    WHERE nm.user_id = auth.uid() AND nm.id = network_members.parent_id
  ));

-- Training progress policies
DROP POLICY IF EXISTS "Users can view their training progress" ON training_progress;
CREATE POLICY "Users can view their training progress"
  ON training_progress FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their training progress" ON training_progress;
CREATE POLICY "Users can update their training progress"
  ON training_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- PPOB services policies
DROP POLICY IF EXISTS "Anyone can view PPOB services" ON ppob_services;
CREATE POLICY "Anyone can view PPOB services"
  ON ppob_services FOR SELECT
  USING (true);

-- Transactions policies
DROP POLICY IF EXISTS "Users can view their transactions" ON transactions;
CREATE POLICY "Users can view their transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their transactions" ON transactions;
CREATE POLICY "Users can insert their transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Security settings policies
DROP POLICY IF EXISTS "Users can view their security settings" ON security_settings;
CREATE POLICY "Users can view their security settings"
  ON security_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their security settings" ON security_settings;
CREATE POLICY "Users can update their security settings"
  ON security_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- User settings policies
DROP POLICY IF EXISTS "Users can view their settings" ON user_settings;
CREATE POLICY "Users can view their settings"
  ON user_settings FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their settings" ON user_settings;
CREATE POLICY "Users can update their settings"
  ON user_settings FOR UPDATE
  USING (auth.uid() = user_id);

-- Notifications policies
DROP POLICY IF EXISTS "Users can view their notifications" ON notifications;
CREATE POLICY "Users can view their notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their notifications" ON notifications;
CREATE POLICY "Users can update their notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Enable realtime for all tables
alter publication supabase_realtime add table users;
alter publication supabase_realtime add table balances;
alter publication supabase_realtime add table network_members;
alter publication supabase_realtime add table training_progress;
alter publication supabase_realtime add table ppob_services;
alter publication supabase_realtime add table transactions;
alter publication supabase_realtime add table security_settings;
alter publication supabase_realtime add table user_settings;
alter publication supabase_realtime add table notifications;

-- Insert initial PPOB services
INSERT INTO ppob_services (service_type, name, description, icon)
VALUES 
  ('electricity', 'Electricity Bill', 'Pay your electricity bills', 'Bolt'),
  ('water', 'Water Bill', 'Pay your water bills', 'Droplets'),
  ('internet', 'Internet Bill', 'Pay your internet bills', 'Wifi'),
  ('mobile', 'Mobile Credits', 'Top up your mobile credits', 'Smartphone')
ON CONFLICT DO NOTHING;
