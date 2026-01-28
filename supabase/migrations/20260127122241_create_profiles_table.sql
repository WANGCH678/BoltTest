/*
  # Create Profiles Table

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key)
      - `name_ko` (text) - Korean name
      - `name_en` (text) - English name
      - `job_title` (text) - Job title/description
      - `intro_title` (text) - Hero section title (supports HTML)
      - `intro_desc` (text) - Hero section description
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `profiles` table
    - Add public read policy (SELECT for all users)
    - Add restricted update/insert/delete policy (authenticated only)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko text NOT NULL,
  name_en text NOT NULL,
  job_title text NOT NULL,
  intro_title text,
  intro_desc text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_public_read"
  ON profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "profiles_authenticated_update"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "profiles_authenticated_delete"
  ON profiles
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "profiles_authenticated_insert"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);