-- Add avatar_url to profiles table
ALTER TABLE public.profiles ADD COLUMN avatar_url text;

-- Add attachment_url to issues table
ALTER TABLE public.issues ADD COLUMN attachment_url text;

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Create storage bucket for issue attachments
INSERT INTO storage.buckets (id, name, public) VALUES ('issue-attachments', 'issue-attachments', true);

-- RLS policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- RLS policies for issue-attachments bucket
CREATE POLICY "Anyone can view issue attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'issue-attachments');

CREATE POLICY "Authenticated users can upload issue attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'issue-attachments' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can delete their own issue attachments"
ON storage.objects FOR DELETE
USING (bucket_id = 'issue-attachments' AND auth.uid()::text = (storage.foldername(name))[1]);