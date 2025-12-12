import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface AvatarUploadProps {
  avatarUrl: string | null;
  displayName: string | null;
  onAvatarChange: (url: string) => void;
  size?: "sm" | "md" | "lg";
}

export const AvatarUpload = ({ avatarUrl, displayName, onAvatarChange, size = "lg" }: AvatarUploadProps) => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-20 w-20"
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Add cache buster to force refresh
      const urlWithCacheBuster = `${publicUrl}?t=${Date.now()}`;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlWithCacheBuster })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      onAvatarChange(urlWithCacheBuster);
      toast.success("Profile picture updated!");
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <Avatar className={`${sizeClasses[size]} border-2 border-primary-foreground cursor-pointer`} onClick={() => fileInputRef.current?.click()}>
        <AvatarImage src={avatarUrl || undefined} alt={displayName || "User"} />
        <AvatarFallback className="bg-primary-foreground text-primary text-xl font-semibold">
          {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : getInitials(displayName)}
        </AvatarFallback>
      </Avatar>
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors"
        disabled={isUploading}
      >
        <Camera className="h-3 w-3" />
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
};
