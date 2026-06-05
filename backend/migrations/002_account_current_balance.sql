ALTER TABLE accounts
  ADD COLUMN current_balance_cents BIGINT NOT NULL DEFAULT 0 AFTER starting_balance_cents;

UPDATE accounts a
SET current_balance_cents = a.starting_balance_cents + COALESCE((
  SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount_cents
                  WHEN t.type = 'expense' THEN -t.amount_cents
                  ELSE 0 END)
  FROM transactions t WHERE t.account_id = a.id
), 0);
