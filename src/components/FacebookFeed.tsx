import { FacebookEmbed } from "./FacebookEmbed";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

// Publication Facebook page URLs with their recent posts
const publicationFacebookPosts: Record<string, { name: string; pageUrl: string; recentPosts: string[] }> = {
  silahis: {
    name: "SILAHIS",
    pageUrl: "https://www.facebook.com/TheSilahisPublication",
    recentPosts: [
      "https://www.facebook.com/TheSilahisPublication/posts/1392083299119895",
    ],
  },
  sidlak: {
    name: "SIDLAK",
    pageUrl: "https://www.facebook.com/OfficialMSUIITCEDstudentpublication",
    recentPosts: [],
  },
  cassayuran: {
    name: "CASSAYURAN",
    pageUrl: "https://www.facebook.com/cassayuran",
    recentPosts: [
      "https://www.facebook.com/cassayuran/posts/1221710556646732",
    ],
  },
  motherboard: {
    name: "THE MOTHERBOARD",
    pageUrl: "https://www.facebook.com/ccsmotherboard",
    recentPosts: [
      "https://www.facebook.com/ccsmotherboard/posts/122147545082410293",
    ],
  },
  sindaw: {
    name: "SINDAW",
    pageUrl: "https://www.facebook.com/sindaw.ceba",
    recentPosts: [],
  },
  adinfinitum: {
    name: "AD INFINITUM",
    pageUrl: "https://www.facebook.com/CSMAdInfinitum",
    recentPosts: [
      "https://www.facebook.com/CSMAdInfinitum/posts/122163498368052313",
    ],
  },
  caduceus: {
    name: "THE CADUCEUS",
    pageUrl: "https://www.facebook.com/profile.php?id=61564064011460",
    recentPosts: [],
  },
  thuum: {
    name: "THE THU'UM",
    pageUrl: "https://www.facebook.com/thethuumpublication",
    recentPosts: [
      "https://www.facebook.com/thethuumpublication/posts/122256963200036639",
    ],
  },
};

interface FacebookFeedProps {
  publicationId?: string;
  limit?: number;
  showHeader?: boolean;
}

export const FacebookFeed = ({ publicationId, limit = 5, showHeader = true }: FacebookFeedProps) => {
  // Get posts for a specific publication or all publications
  const getPostsToShow = () => {
    if (publicationId) {
      const publication = publicationFacebookPosts[publicationId];
      if (publication) {
        return publication.recentPosts.slice(0, limit).map((url) => ({
          url,
          publication: publication.name,
          pageUrl: publication.pageUrl,
        }));
      }
      return [];
    }

    // Get posts from all publications for campus feed
    const allPosts: { url: string; publication: string; pageUrl: string }[] = [];
    Object.entries(publicationFacebookPosts).forEach(([, pub]) => {
      pub.recentPosts.forEach((url) => {
        allPosts.push({
          url,
          publication: pub.name,
          pageUrl: pub.pageUrl,
        });
      });
    });
    return allPosts.slice(0, limit);
  };

  const posts = getPostsToShow();

  if (posts.length === 0) {
    return (
      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="p-6 text-center">
          <Facebook className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">
            {publicationId 
              ? "No recent Facebook posts available. Visit the Facebook page for the latest updates."
              : "No recent posts from publications. Check back later!"}
          </p>
          {publicationId && publicationFacebookPosts[publicationId] && (
            <Button variant="outline" className="mt-4" asChild>
              <a 
                href={publicationFacebookPosts[publicationId].pageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Facebook className="h-4 w-4 mr-2" />
                Visit Facebook Page
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Facebook className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            {publicationId ? "Latest from Facebook" : "Recent Facebook Posts"}
          </h3>
        </div>
      )}
      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="overflow-hidden">
            <FacebookEmbed postUrl={post.url} width={500} />
          </div>
        ))}
      </div>
    </div>
  );
};

export { publicationFacebookPosts };
