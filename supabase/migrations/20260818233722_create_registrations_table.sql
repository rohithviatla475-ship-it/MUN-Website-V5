/*
# Create registrations table for Ambitus MUN

1. New Tables
- `registrations`
  - `id` (uuid, primary key)
  - `full_name` (text, not null) — delegate's full name
  - `email` (text, not null) — delegate's email address
  - `phone` (text, not null) — delegate's phone number
  - `institution` (text, not null) — school/college/university name
  - `delegate_type` (text, not null) — either 'ambitus_student' or 'external_delegate'
  - `experience` (text, nullable) — optional prior MUN experience description
  - `preference_1` (text, not null) — first committee preference (committee id)
  - `preference_2` (text, not null) — second committee preference (committee id)
  - `preference_3` (text, not null) — third committee preference (committee id)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `registrations`.
- Allow anon + authenticated INSERT (public registration form, no sign-in required).
- No SELECT/UPDATE/DELETE for anon — registration data is private to organizers.

3. Important Notes
- This is a no-auth app: the registration form is public and does not require sign-in.
- Only INSERT is allowed for anon so anyone can register, but nobody can read or modify registrations through the anon key.
- The Google Sheets edge function uses the service role key (server-side) to read registrations, bypassing RLS.
*/

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  institution text NOT NULL,
  delegate_type text NOT NULL CHECK (delegate_type IN ('ambitus_student', 'external_delegate')),
  experience text,
  preference_1 text NOT NULL,
  preference_2 text NOT NULL,
  preference_3 text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_registrations" ON registrations;
CREATE POLICY "anon_insert_registrations"
ON registrations FOR INSERT
TO anon, authenticated
WITH CHECK (true);
