import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Facebook, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    FB?: {
      XFBML: {
        parse: (element?: HTMLElement) => void;
      };
    };
  }
}

interface FacebookEmbedProps {
  postUrl: string;
  width?: number;
}

export const FacebookEmbed = ({ postUrl, width = 500 }: FacebookEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Load Facebook SDK if not already loaded
    const loadFacebookSDK = () => {
      if (document.getElementById("facebook-jssdk")) {
        // SDK already loaded, just parse
        if (window.FB) {
          window.FB.XFBML.parse(containerRef.current || undefined);
          setIsLoading(false);
        }
        return;
      }

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      
      script.onload = () => {
        if (window.FB && containerRef.current) {
          window.FB.XFBML.parse(containerRef.current);
          setIsLoading(false);
        }
      };

      script.onerror = () => {
        setHasError(true);
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    loadFacebookSDK();

    // Set timeout for loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [postUrl]);

  // Re-parse when postUrl changes
  useEffect(() => {
    if (window.FB && containerRef.current) {
      window.FB.XFBML.parse(containerRef.current);
    }
  }, [postUrl]);

  if (hasError) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Facebook className="h-5 w-5" />
              <span>Unable to load Facebook post</span>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={postUrl} target="_blank" rel="noopener noreferrer">
                View on Facebook
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={containerRef} className="facebook-embed-container">
      {isLoading && (
        <Card className="bg-card border-border animate-pulse">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-muted" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-3/4 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      )}
      <div
        className="fb-post"
        data-href={postUrl}
        data-width={width}
        data-show-text="true"
        style={{ display: isLoading ? "none" : "block" }}
      />
    </div>
  );
};
