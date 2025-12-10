import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  user_type: 'student' | 'faculty' | 'student_council' | null;
  college: string | null;
  is_verified: boolean | null;
  student_id: string | null;
  employee_id: string | null;
  created_at: string;
}

const collegeLabels: Record<string, string> = {
  'college_of_engineering_and_technology': 'College of Engineering and Technology',
  'college_of_science_and_mathematics': 'College of Science and Mathematics',
  'college_of_computer_studies': 'College of Computer Studies',
  'college_of_education': 'College of Education',
  'college_of_arts_and_science': 'College of Arts and Science',
  'college_of_business_administration_and_accountancy': 'College of Business Administration & Accountancy',
  'college_of_nursing': 'College of Nursing',
};

const Users = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error fetching users',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerify = async (userId: string, verify: boolean) => {
    setActionLoading(userId);
    const { error } = await supabase
      .from('profiles')
      .update({ is_verified: verify })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: 'Error updating user',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: verify ? 'User verified' : 'User unverified',
        description: `The user has been ${verify ? 'verified' : 'unverified'} successfully.`,
      });
      fetchUsers();
    }
    setActionLoading(null);
  };

  const getUserTypeBadge = (userType: string | null) => {
    const config: Record<string, { label: string; className: string }> = {
      student: { label: 'Student', className: 'bg-green-600 hover:bg-green-700' },
      faculty: { label: 'Faculty', className: 'bg-blue-600 hover:bg-blue-700' },
      student_council: { label: 'Student Council', className: 'bg-purple-600 hover:bg-purple-700' },
    };
    const item = config[userType || 'student'] || config.student;
    return <Badge className={item.className}>{item.label}</Badge>;
  };

  const getVerificationBadge = (isVerified: boolean | null) => {
    if (isVerified) {
      return <Badge className="bg-emerald-600 hover:bg-emerald-700">Verified</Badge>;
    }
    return <Badge variant="outline" className="border-amber-500 text-amber-500">Pending</Badge>;
  };

  const pendingUsers = users.filter(u => !u.is_verified);
  const verifiedUsers = users.filter(u => u.is_verified);

  const renderUserTable = (userList: Profile[], showVerifyAction: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>College</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {userList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
              No users found
            </TableCell>
          </TableRow>
        ) : (
          userList.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.display_name || 'N/A'}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.user_type === 'faculty' ? user.employee_id : user.student_id || 'N/A'}
              </TableCell>
              <TableCell>{getUserTypeBadge(user.user_type)}</TableCell>
              <TableCell className="max-w-[200px] truncate">
                {user.college ? collegeLabels[user.college] || user.college : 'N/A'}
              </TableCell>
              <TableCell>{getVerificationBadge(user.is_verified)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {showVerifyAction ? (
                    <Button
                      size="sm"
                      onClick={() => handleVerify(user.user_id, true)}
                      disabled={actionLoading === user.user_id}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {actionLoading === user.user_id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Verify
                    </Button>
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-1" />
                          Unverify
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Unverify User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to unverify {user.display_name}? They will lose access to verified user features.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleVerify(user.user_id, false)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Unverify
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">User Management</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Manage user accounts and verify new registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs defaultValue="pending">
                <TabsList className="mb-4">
                  <TabsTrigger value="pending" className="relative">
                    Pending Verification
                    {pendingUsers.length > 0 && (
                      <span className="ml-2 bg-amber-500 text-white text-xs rounded-full px-2 py-0.5">
                        {pendingUsers.length}
                      </span>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="verified">Verified Users ({verifiedUsers.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending">
                  {renderUserTable(pendingUsers, true)}
                </TabsContent>
                
                <TabsContent value="verified">
                  {renderUserTable(verifiedUsers, false)}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Users;