/*
# Create app_config table for storing integration URLs

1. New Tables
- `app_config`
  - `id` (uuid, primary key)
  - `key` (text, unique, not null) — config key name
  - `value` (text, not null) — config value

2. Security
- Enable RLS on `app_config`.
- No anon access — only the edge function (service role) reads this.

3. Initial Data
- Inserts the Google Sheets webhook URL for sync-to-sheets function.
*/

CREATE TABLE IF NOT EXISTS app_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL
);

ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

INSERT INTO app_config (key, value) VALUES
  ('google_sheets_webhook_url', 'https://script.google.com/macros/s/AKfycby5PRrHR1qBCq1SbTdC5B5_GAUdKhZ8CtEh0J0Z2skYv4R_223VYeiFl_2fec49OHoj/exec')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
