/*
  # Create Portfolio Table

  1. New Tables
    - `portfolio`
      - `id` (uuid, primary key)
      - `title` (text) - Project title
      - `description` (text) - Project description
      - `tags` (text array) - Keywords/tags
      - `year` (text) - Project year
      - `image_url` (text) - Thumbnail image URL
      - `link` (text) - Project link
      - `order_index` (integer) - Display order
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `portfolio` table
    - Add public read policy (SELECT for all users)
    - Add restricted update/insert/delete policy (authenticated only)
*/

CREATE TABLE IF NOT EXISTS portfolio (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  year text NOT NULL,
  image_url text,
  link text DEFAULT '#',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

CREATE POLICY "portfolio_public_read"
  ON portfolio
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "portfolio_authenticated_update"
  ON portfolio
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "portfolio_authenticated_delete"
  ON portfolio
  FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "portfolio_authenticated_insert"
  ON portfolio
  FOR INSERT
  TO authenticated
  WITH CHECK (true);