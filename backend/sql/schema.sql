-- Schema for budget tracker application
CREATE DATABASE IF NOT EXISTS budget_db;
USE budget_db;

-- Users table for future multi-user support
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budget categories reference table
CREATE TABLE IF NOT EXISTS budget_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category_id INT,
  amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  current_spending DECIMAL(15,2) NOT NULL DEFAULT 0,
  period VARCHAR(50) DEFAULT 'monthly',
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  user_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES budget_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category_id (category_id),
  INDEX idx_is_active (is_active),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Income table
CREATE TABLE IF NOT EXISTS income (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  user_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_date (date),
  INDEX idx_created_at (created_at),
  INDEX idx_source (source)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  payment_method VARCHAR(100),
  notes TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  budget_id INT,
  user_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_category (category),
  INDEX idx_date (date),
  INDEX idx_budget_id (budget_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Transaction history table for auditing
CREATE TABLE IF NOT EXISTS transaction_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transaction_type VARCHAR(50) NOT NULL,
  transaction_id INT NOT NULL,
  action VARCHAR(50) NOT NULL,
  old_value JSON,
  new_value JSON,
  user_id INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_transaction_type (transaction_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default user
INSERT IGNORE INTO users (id, username, email) VALUES (1, 'default', 'default@budgettracker.local');

-- Insert default budget categories
INSERT IGNORE INTO budget_categories (name, description) VALUES
  ('Food & Dining', 'Groceries, restaurants, and food delivery'),
  ('Transportation', 'Gas, public transit, and vehicle maintenance'),
  ('Entertainment', 'Movies, games, and leisure activities'),
  ('Shopping', 'Clothing, household items, and personal care'),
  ('Healthcare', 'Medical, dental, and pharmacy expenses'),
  ('Utilities', 'Electricity, water, and internet bills'),
  ('Housing', 'Rent, mortgage, and home maintenance'),
  ('Education', 'Tuition, books, and courses'),
  ('Other', 'Miscellaneous expenses');



