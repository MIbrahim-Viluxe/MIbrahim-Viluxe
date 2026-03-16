-- Initialize SQL script for Supabase
-- Copy and Paste this into SQL Editor in Supabase Dashboard and click "Run"

-- 1. Create table for Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    cover_image TEXT,
    video_url TEXT,
    video_type TEXT CHECK(video_type IN ('youtube', 'vimeo', 'direct')),
    meta_title TEXT,
    meta_description TEXT,
    order_index INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create table for Categories
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create table for Settings (Hero text, About text, etc)
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- 5. Create Public Read Policies
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON settings FOR SELECT USING (true);

-- 6. Create Admin Policies (Insert, Update, Delete)
-- Assume any authenticated user is an admin for now (since this is a closed system)
CREATE POLICY "Allow admin to insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin to update projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin to delete projects" ON projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow admin to insert categories" ON categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin to update categories" ON categories FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin to delete categories" ON categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow admin to insert settings" ON settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin to update settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin to delete settings" ON settings FOR DELETE TO authenticated USING (true);

-- 7. Insert initial Categories
INSERT INTO categories (name, slug, order_index) VALUES 
('Ads / Commercials', 'ads', 1),
('Music Videos', 'videos', 2),
('Reels / Shorts', 'reels', 3),
('Documentaries', 'docs', 4)
ON CONFLICT (slug) DO NOTHING;

-- 8. Setup Storage for Media (Images and Direct Videos)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Public Reading
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'media' );

-- Storage Policies for Admin (Authenticated) Insert/Update/Delete
CREATE POLICY "Admin Insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id = 'media' );
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE TO authenticated USING ( bucket_id = 'media' ) WITH CHECK ( bucket_id = 'media' );
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id = 'media' );

-- 9. Create table for Showreel
CREATE TABLE IF NOT EXISTS showreel (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    video_url TEXT NOT NULL,
    duration NUMERIC DEFAULT 5,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Showreel
ALTER TABLE showreel ENABLE ROW LEVEL SECURITY;

-- Create Public Read Policies for Showreel
CREATE POLICY "Allow public read access on showreel" ON showreel FOR SELECT USING (true);

-- Create Admin Policies for Showreel
CREATE POLICY "Allow admin to insert showreel" ON showreel FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow admin to update showreel" ON showreel FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin to delete showreel" ON showreel FOR DELETE TO authenticated USING (true);
