-- Drop existing restrictive SELECT policies on service_requests and recreate as permissive
DROP POLICY IF EXISTS "Users can view their own requests" ON public.service_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.service_requests;

-- Recreate as PERMISSIVE (default) so either condition works
CREATE POLICY "Users can view their own requests" 
ON public.service_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" 
ON public.service_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Fix issues table policies too
DROP POLICY IF EXISTS "Users can view their own issues" ON public.issues;
DROP POLICY IF EXISTS "Admins can view all issues" ON public.issues;

CREATE POLICY "Users can view their own issues" 
ON public.issues 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all issues" 
ON public.issues 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));