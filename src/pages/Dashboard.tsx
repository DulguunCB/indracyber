import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, PlayCircle, Clock, GraduationCap, Loader2, CheckCircle2, User as UserIcon } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface PurchasedCourse {
  id: string;
  purchased_at: string;
  status: string | null;
  courses: {
    id: string;
    title: string;
    thumbnail_url: string | null;
    duration_hours: number | null;
    lessons_count: number | null;
    category: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [purchasedCourses, setPurchasedCourses] = useState<PurchasedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ full_name: string | null } | null>(null);

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
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("user_id", user?.id)
      .single();

    setProfile(profileData);

    // Fetch purchased courses
    const { data: purchasesData, error } = await supabase
      .from("purchases")
      .select(`
        id,
        purchased_at,
        status,
        courses (
          id,
          title,
          thumbnail_url,
          duration_hours,
          lessons_count,
          category
        )
      `)
      .eq("user_id", user?.id)
      .order("purchased_at", { ascending: false });

    if (error) {
      console.error("Error fetching purchases:", error);
    } else {
      setPurchasedCourses(purchasesData || []);
    }

    setLoading(false);
  };

  const categoryLabels: Record<string, string> = {
    web: "Веб хөгжүүлэлт",
    programming: "Програмчлал",
    ai: "AI сургалт",
  };

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground mb-2">
                Сайн байна уу, {profile?.full_name || "Суралцагч"}!
              </h1>
              <p className="text-primary-foreground/80">
                Таны сургалтууд энд байна
              </p>
            </div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground rounded-lg transition-colors"
            >
              <UserIcon className="h-4 w-4" />
              Профайл засах
            </Link>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{purchasedCourses.length}</div>
                <div className="text-sm text-muted-foreground">Сургалтууд</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {purchasedCourses.reduce(
                    (acc, p) => acc + (p.courses.duration_hours || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Нийт цаг</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <PlayCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {purchasedCourses.reduce(
                    (acc, p) => acc + (p.courses.lessons_count || 0),
                    0
                  )}
                </div>
                <div className="text-sm text-muted-foreground">Нийт хичээл</div>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-card">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">0</div>
                <div className="text-sm text-muted-foreground">Сертификат</div>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Миний сургалтууд</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : purchasedCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedCourses.map((purchase) => {
                const isPending = purchase.status === "pending";
                const isCompleted = purchase.status === "completed";
                
                const CardWrapper = isPending ? "div" : Link;
                const cardProps = isPending 
                  ? { className: "group bg-card rounded-xl overflow-hidden shadow-card opacity-80" }
                  : { 
                      to: `/dashboard/courses/${purchase.courses.id}`,
                      className: "group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
                    };

                return (
                  <CardWrapper key={purchase.id} {...cardProps as any}>
                    <div className="aspect-video relative overflow-hidden bg-muted">
                      {purchase.courses.thumbnail_url ? (
                        <img
                          src={purchase.courses.thumbnail_url}
                          alt={purchase.courses.title}
                          className={`w-full h-full object-cover ${!isPending ? "group-hover:scale-105" : ""} transition-transform duration-300`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
                          <BookOpen className="h-12 w-12 text-primary/40" />
                        </div>
                      )}
                      {isPending ? (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <div className="text-center text-white">
                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-2" />
                            <p className="text-sm font-medium">Баталгаажуулж байна</p>
                          </div>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlayCircle className="h-16 w-16 text-white" />
                        </div>
                      )}
                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        {isPending ? (
                          <Badge variant="secondary" className="bg-yellow-500/90 text-white border-0">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Хүлээгдэж байна
                          </Badge>
                        ) : isCompleted ? (
                          <Badge variant="secondary" className="bg-green-500/90 text-white border-0">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Баталгаажсан
                          </Badge>
                        ) : null}
                      </div>
                    </div>
                    <div className="p-5">
                      <span className="text-xs text-muted-foreground">
                        {categoryLabels[purchase.courses.category] || purchase.courses.category}
                      </span>
                      <h3 className={`font-semibold text-lg mt-1 ${!isPending ? "group-hover:text-primary" : ""} transition-colors`}>
                        {purchase.courses.title}
                      </h3>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{purchase.courses.duration_hours || 0} цаг</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{purchase.courses.lessons_count || 0} хичээл</span>
                        </div>
                      </div>
                      {isPending && (
                        <p className="text-xs text-yellow-600 mt-3">
                          Админ таны төлбөрийг шалгаж баталгаажуулах хүртэл хүлээнэ үү
                        </p>
                      )}
                    </div>
                  </CardWrapper>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-xl">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-muted mb-4">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Сургалт байхгүй байна</h3>
              <p className="text-muted-foreground mb-4">
                Та одоогоор ямар ч сургалт худалдаж аваагүй байна
              </p>
              <Button asChild>
                <Link to="/courses">Сургалтууд үзэх</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
