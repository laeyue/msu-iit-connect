import { ArrowLeft, Users, FileText, Bell, Calendar, MessageSquare, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CouncilDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<{ college: string | null } | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data } = await supabase
        .from('profiles')
        .select('college')
        .eq('user_id', user.id)
        .maybeSingle();
      setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const stats = [
    { label: "Pending Requests", value: "12", icon: FileText, change: "+3 this week" },
    { label: "Active Announcements", value: "5", icon: Bell, change: "2 expiring soon" },
    { label: "Upcoming Events", value: "3", icon: Calendar, change: "Next: Dec 15" },
    { label: "Engagement Rate", value: "78%", icon: TrendingUp, change: "+5% this month" },
  ];

  const quickActions = [
    { label: "Post Announcement", href: "/council/announcements", icon: Bell, description: "Create announcements for your college" },
    { label: "View Requests", href: "/council/requests", icon: MessageSquare, description: "Manage student requests and concerns" },
    { label: "Manage Events", href: "/council/events", icon: Calendar, description: "Create and manage college events" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-4 pt-8 pb-6 rounded-b-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <Link to="/home" className="p-2 hover:bg-primary-foreground/10 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Student Council Dashboard</h1>
              {profile?.college && (
                <p className="text-primary-foreground/80 text-sm">{profile.college}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-primary mt-1">{stat.change}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Link
                key={action.label}
                to={action.href}
                className="flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-primary/10">
                  <action.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">{action.label}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="border-dashed">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-2">More Features Coming Soon</h3>
            <p className="text-sm text-muted-foreground">
              Additional student council features including polls, surveys, and college-specific announcements are in development.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CouncilDashboard;
