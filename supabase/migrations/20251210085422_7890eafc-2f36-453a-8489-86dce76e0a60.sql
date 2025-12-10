-- Create enum for user types
CREATE TYPE public.user_type AS ENUM ('student', 'faculty', 'student_council');

-- Create enum for colleges
CREATE TYPE public.college AS ENUM (
  'college_of_engineering_and_technology',
  'college_of_science_and_mathematics',
  'college_of_computer_studies',
  'college_of_education',
  'college_of_arts_and_science',
  'college_of_business_administration_and_accountancy',
  'college_of_nursing'
);

-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN user_type public.user_type DEFAULT 'student',
ADD COLUMN college public.college,
ADD COLUMN is_verified BOOLEAN DEFAULT false,
ADD COLUMN employee_id TEXT,
ADD COLUMN student_id TEXT;

-- Update handle_new_user function to include new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, user_type, college, is_verified, student_id, employee_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'user_type')::user_type, 'student'),
    (new.raw_user_meta_data->>'college')::college,
    false,
    new.raw_user_meta_data->>'student_id',
    new.raw_user_meta_data->>'employee_id'
  );
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

-- Allow admins to view all profiles for verification
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Allow admins to update profiles for verification
CREATE POLICY "Admins can update all profiles"
ON public.profiles
FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));