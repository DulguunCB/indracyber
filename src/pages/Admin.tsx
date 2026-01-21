import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  DollarSign,
  Plus,
  Pencil,
  Trash2,
  LayoutDashboard,
  GraduationCap,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  price: number;
  category: string;
  is_published: boolean;
  lessons_count: number | null;
  created_at: string;
}

interface Stats {
  totalCourses: number;
  totalPurchases: number;
  totalRevenue: number;
}

const categoryLabels: Record<string, string> = {
  web: "Веб хөгжүүлэлт",
  programming: "Програмчлал",
  ai: "AI сургалт",
};

const Admin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCourses: 0,
    totalPurchases: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session?.user) {
          navigate("/auth");
        } else {
          setUser(session.user);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (user) {
      checkAdminAndFetch();
    }
  }, [user]);

  const checkAdminAndFetch = async () => {
    // Check admin role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user?.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      toast.error("Админ эрхгүй байна");
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    await fetchData();
    setLoading(false);
  };

  const fetchData = async () => {
    // Fetch courses
    const { data: coursesData } = await supabase
      .from("courses")
      .select("id, title, price, category, is_published, lessons_count, created_at")
      .order("created_at", { ascending: false });

    setCourses(coursesData || []);

    // Fetch stats
    const { count: totalCourses } = await supabase
      .from("courses")
      .select("*", { count: "exact", head: true });

    const { data: purchasesData } = await supabase
      .from("purchases")
      .select("amount");

    const totalRevenue = purchasesData?.reduce(
      (acc, p) => acc + Number(p.amount),
      0
    ) || 0;

    setStats({
      totalCourses: totalCourses || 0,
      totalPurchases: purchasesData?.length || 0,
      totalRevenue,
    });
  };

  const togglePublish = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("courses")
      .update({ is_published: !currentStatus })
      .eq("id", courseId);

    if (error) {
      toast.error("Алдаа гарлаа");
    } else {
      toast.success(currentStatus ? "Нийтлэлийг болиулсан" : "Амжилттай нийтлэлээ");
      fetchData();
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground hidden lg:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-xl font-bold">EduMongol</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground"
          >
            <LayoutDashboard className="h-5 w-5" />
            Хяналтын самбар
          </Link>
          <Link
            to="/admin/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <GraduationCap className="h-5 w-5" />
            Сургалтууд
          </Link>
          <Link
            to="/admin/instructors"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Users className="h-5 w-5" />
            Багш нар
          </Link>
          <Link
            to="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-colors"
          >
            <Settings className="h-5 w-5" />
            Тохиргоо
          </Link>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-sidebar-accent transition-colors text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Гарах
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Хяналтын самбар</h1>
              <p className="text-muted-foreground">Сургалтуудаа удирдаарай</p>
            </div>
            <Button asChild>
              <Link to="/admin/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Шинэ сургалт
              </Link>
            </Button>
          </div>
        </header>

        <main className="p-6">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.totalCourses}</div>
                  <div className="text-muted-foreground">Нийт сургалт</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <div className="text-3xl font-bold">{stats.totalPurchases}</div>
                  <div className="text-muted-foreground">Нийт борлуулалт</div>
                </div>
              </div>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-card">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {stats.totalRevenue.toLocaleString()}₮
                  </div>
                  <div className="text-muted-foreground">Нийт орлого</div>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Table */}
          <div className="bg-card rounded-xl shadow-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-xl font-semibold">Сургалтууд</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Нэр</TableHead>
                  <TableHead>Ангилал</TableHead>
                  <TableHead>Үнэ</TableHead>
                  <TableHead>Хичээл</TableHead>
                  <TableHead>Төлөв</TableHead>
                  <TableHead className="text-right">Үйлдэл</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.title}</TableCell>
                      <TableCell>
                        {categoryLabels[course.category] || course.category}
                      </TableCell>
                      <TableCell>{Number(course.price).toLocaleString()}₮</TableCell>
                      <TableCell>{course.lessons_count || 0}</TableCell>
                      <TableCell>
                        <Badge
                          variant={course.is_published ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => togglePublish(course.id, course.is_published)}
                        >
                          {course.is_published ? "Нийтлэгдсэн" : "Ноорог"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link to={`/admin/courses/${course.id}/edit`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Сургалт байхгүй байна
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
