import { Search, Globe, AlertCircle, GraduationCap, FileText, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ServiceCard } from "@/components/ServiceCard";
import { BottomNav } from "@/components/BottomNav";
import { FeedPost } from "@/components/FeedPost";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import campusLogo from "@/assets/campus-logo.png";

const Home = () => {
  const services = [
    { icon: Globe, label: "e-Services", href: "/e-services" },
    { icon: AlertCircle, label: "Emergency", href: "/emergency" },
    { icon: GraduationCap, label: "Core Values", href: "/core-values" },
    { icon: FileText, label: "Campus Updates", href: "/news" },
  ];

  const feedPosts = [
    {
      id: 1,
      author: "SILAHIS",
      authorType: "publication" as const,
      timestamp: "2 hours ago",
      content: "MSU-IIT celebrates its 50th founding anniversary with a week-long celebration featuring cultural performances, academic symposiums, and alumni gatherings. Join us in commemorating five decades of excellence in education! 🎉",
      likes: 234,
      comments: 45,
    },
    {
      id: 2,
      author: "Dean Maria Santos",
      authorType: "admin" as const,
      timestamp: "4 hours ago",
      content: "Reminder: All students are required to attend the General Assembly tomorrow at 2:00 PM in the Main Auditorium. Please bring your student IDs.",
      likes: 189,
      comments: 23,
    },
    {
      id: 3,
      author: "THE MOTHERBOARD",
      authorType: "publication" as const,
      timestamp: "6 hours ago",
      content: "College of Computer Studies announces new AI and Machine Learning laboratory opening next semester. State-of-the-art facilities with high-performance computing resources will be available to all CCS students.",
      likes: 312,
      comments: 67,
    },
    {
      id: 4,
      author: "Student Affairs Office",
      authorType: "admin" as const,
      timestamp: "8 hours ago",
      content: "Scholarship applications for the next academic year are now open! Visit the Student Affairs Office or check our e-Services portal for requirements and deadlines. Don't miss this opportunity!",
      likes: 156,
      comments: 34,
    },
    {
      id: 5,
      author: "CASSAYURAN",
      authorType: "publication" as const,
      timestamp: "1 day ago",
      content: "The College of Arts and Social Sciences invites everyone to the Cultural Night this Friday at 6:00 PM. Experience diverse performances from different cultural groups across campus. Free admission for all!",
      likes: 278,
      comments: 52,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-to-br from-primary to-primary/90 text-primary-foreground px-4 pt-8 pb-6 rounded-b-3xl" style={{ boxShadow: "var(--shadow-elevated)" }}>
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">MSU-IIT CampusLink</h1>
              <p className="text-primary-foreground/80 text-sm">Mobile Application for Student Service & Engagement</p>
            </div>
            <div className="relative">
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-lg font-semibold">1</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search services, updates..."
              className="pl-10 bg-card border-0 h-12 rounded-xl"
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Logo Section */}
        <div className="flex justify-center mb-8">
          <img src={campusLogo} alt="Campus Logo" className="h-40 w-auto" />
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">What would you like to do?</h2>
          <div className="grid grid-cols-2 gap-4">
            {services.map((service) => (
              <ServiceCard key={service.href} {...service} />
            ))}
          </div>
        </section>

        {/* SDG Focus Banner */}
        <section className="mb-6">
          <Accordion type="single" collapsible className="bg-secondary/10 border border-secondary/20 rounded-2xl overflow-hidden">
            <AccordionItem value="sdg" className="border-0">
              <AccordionTrigger className="px-4 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <GraduationCap className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground">This app promotes advocacy for SDG 4 and SDG 16</h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-0">
                <div className="pl-11 space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">SDG 4: Quality Education</h4>
                    <p className="text-sm text-muted-foreground">Ensuring inclusive and equitable quality education through accessible campus services and resources.</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">SDG 16: Peace, Justice and Strong Institutions</h4>
                    <p className="text-sm text-muted-foreground">Promoting transparent governance, accountability, and effective platforms for student voices to be heard.</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Report Issue CTA */}
        <section className="bg-gradient-to-br from-primary to-primary/90 rounded-2xl p-6 text-primary-foreground" style={{ boxShadow: "var(--shadow-elevated)" }}>
          <h3 className="text-xl font-bold mb-2">Help us improve our campus</h3>
          <p className="text-primary-foreground/90 mb-4 text-sm">
            Spotted an issue or have a concern? Report it so we can address it together.
          </p>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1 bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0"
              onClick={() => window.location.href = "/report-issue"}
            >
              View Reports
            </Button>
            <Button
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground border-0"
              onClick={() => window.location.href = "/report-issue"}
            >
              <Plus className="h-4 w-4 mr-2" />
              Report Issue
            </Button>
          </div>
        </section>

        {/* Campus Feed */}
        <section className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Campus Feed</h3>
            <Button variant="ghost" size="sm" className="text-primary">View All</Button>
          </div>
          <div className="space-y-4">
            {feedPosts.map((post) => (
              <FeedPost key={post.id} {...post} />
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Home;
