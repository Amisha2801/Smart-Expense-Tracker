-- Users
CREATE TABLE IF NOT EXISTS users (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    name            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Accounts (checking, savings, credit card, cash, etc.)
CREATE TABLE IF NOT EXISTS accounts (
    id                      BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id                 BIGINT NOT NULL,
    name                    VARCHAR(100) NOT NULL,
    type                    VARCHAR(20) NOT NULL,
    starting_balance_cents  BIGINT NOT NULL DEFAULT 0,
    currency                CHAR(3) NOT NULL DEFAULT 'USD',
    is_archived             BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_accounts_type CHECK (type IN ('checking', 'savings', 'credit_card', 'cash', 'investment'))
);

CREATE INDEX idx_accounts_user ON accounts(user_id, is_archived);

-- Categories (envelopes) — optional parent_id allows grouping like "Food > Groceries"
CREATE TABLE IF NOT EXISTS categories (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    parent_id   BIGINT NULL,
    name        VARCHAR(100) NOT NULL,
    kind        VARCHAR(20) NOT NULL DEFAULT 'expense',
    icon        VARCHAR(50),
    color       VARCHAR(7),
    sort_order  INT NOT NULL DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_categories_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT chk_categories_kind CHECK (kind IN ('expense', 'income')),
    UNIQUE KEY uq_categories_user_name_parent (user_id, name, parent_id)
);

CREATE INDEX idx_categories_user ON categories(user_id);

-- Monthly budget allocations per envelope
CREATE TABLE IF NOT EXISTS budgets (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT NOT NULL,
    category_id     BIGINT NOT NULL,
    period_month    DATE NOT NULL,
    allocated_cents BIGINT NOT NULL DEFAULT 0,
    rolls_over      BOOLEAN NOT NULL DEFAULT FALSE,
    notes           TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_budgets_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    CONSTRAINT chk_budgets_period_month CHECK (DAY(period_month) = 1),
    UNIQUE KEY uq_budgets_category_period (category_id, period_month)
);

CREATE INDEX idx_budgets_user_month ON budgets(user_id, period_month);

-- Transactions
CREATE TABLE IF NOT EXISTS transactions (
    id                BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id           BIGINT NOT NULL,
    account_id        BIGINT NOT NULL,
    category_id       BIGINT NULL,
    type              VARCHAR(20) NOT NULL,
    amount_cents      BIGINT NOT NULL,
    occurred_on       DATE NOT NULL,
    payee             VARCHAR(200),
    notes             TEXT,
    transfer_group_id CHAR(36) NULL,
    is_cleared        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_transactions_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    CONSTRAINT fk_transactions_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    CONSTRAINT chk_transactions_type CHECK (type IN ('expense', 'income', 'transfer'))
   
   -- aakriti: constraint was too strict to run, so i wrote a validation function instead and validated the transactions in the route instead.
    -- CONSTRAINT chk_transactions_category_rules CHECK (
    --     (type = 'transfer' AND category_id IS NULL AND transfer_group_id IS NOT NULL)
    --     OR (type IN ('expense', 'income') AND category_id IS NOT NULL AND transfer_group_id IS NULL)
    -- )
);

CREATE INDEX idx_tx_user_date ON transactions(user_id, occurred_on DESC);
CREATE INDEX idx_tx_account ON transactions(account_id, occurred_on DESC);
CREATE INDEX idx_tx_category_month ON transactions(category_id, occurred_on);
CREATE INDEX idx_tx_transfer_group ON transactions(transfer_group_id);
