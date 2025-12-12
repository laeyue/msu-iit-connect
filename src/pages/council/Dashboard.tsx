import { ArrowLeft, Users, ExternalLink, Link2, ShieldAlert, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const CouncilDashboard = () => {
  const { user, isVerified } = useAuth();
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

  // College-specific council resources
  const councilResourcesByCollege: Record<string, Array<{ label: string; url: string; description: string }>> = {
    college_of_computer_studies: [
      { 
        label: "CCS Council Tracking System", 
        url: "https://ccs-cts.netlify.app/login", 
        description: "Access the CCS council tracking and management system" 
      },
    ],
    college_of_engineering_and_technology: [
      { 
        label: "CET Council Portal", 
        url: "#", 
        description: "College of Engineering and Technology council resources" 
      },
    ],
    college_of_science_and_mathematics: [
      { 
        label: "CSM Council Portal", 
        url: "#", 
        description: "College of Science and Mathematics council resources" 
      },
    ],
    college_of_education: [
      { 
        label: "CED Council Portal", 
        url: "#", 
        description: "College of Education council resources" 
      },
    ],
    college_of_arts_and_science: [
      { 
        label: "CAS Council Portal", 
        url: "#", 
        description: "College of Arts and Science council resources" 
      },
    ],
    college_of_business_administration_and_accountancy: [
      { 
        label: "CBAA Council Portal", 
        url: "#", 
        description: "College of Business Administration and Accountancy council resources" 
      },
    ],
    college_of_nursing: [
      { 
        label: "CON Council Portal", 
        url: "#", 
        description: "College of Nursing council resources" 
      },
    ],
  };

  const councilLinks = profile?.college 
    ? councilResourcesByCollege[profile.college] || []
    : [];

  const getCollegeDisplayName = (college: string | null) => {
    if (!college) return '';
    return college.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Show verification required message if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground px-4 pt-8 pb-6 rounded-b-3xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/home" className="p-2 hover:bg-secondary-foreground/10 rounded-full transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Student Council Dashboard</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-6">
          <Card className="border-destructive/30 bg-destructive/5" style={{ boxShadow: "var(--shadow-card)" }}>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                <ShieldAlert className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-2">Verification Required</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Your account must be verified by an administrator before you can access student council resources. Please wait for verification or contact the administration.
              </p>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground px-4 pt-8 pb-6 rounded-b-3xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-2">
            <Link to="/home" className="p-2 hover:bg-secondary-foreground/10 rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                <h1 className="text-2xl font-bold">Student Council</h1>
              </div>
              {profile?.college && (
                <p className="text-secondary-foreground/80 text-sm mt-1 ml-8">{getCollegeDisplayName(profile.college)}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Council Links */}
        <Card className="border-border/50 overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="flex items-center gap-3 text-lg">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Link2 className="h-5 w-5 text-secondary" />
              </div>
              Council Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {councilLinks.length > 0 ? (
              councilLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-secondary/30 transition-all group"
                >
                  <div className="p-3 rounded-xl bg-secondary/10 group-hover:bg-secondary/20 transition-colors">
                    <ExternalLink className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground group-hover:text-secondary transition-colors">{link.label}</h3>
                    <p className="text-sm text-muted-foreground truncate">{link.description}</p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-secondary/10 transition-colors">
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-secondary transition-colors" />
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
                  <Link2 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No resources available for your college yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coming Soon Notice */}
        <Card className="border-dashed border-2 border-border/50" style={{ boxShadow: "var(--shadow-card)" }}>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-2">More Features Coming Soon</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Additional student council features including polls, surveys, and college-specific announcements are in development.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CouncilDashboard;