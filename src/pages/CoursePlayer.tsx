import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  PlayCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import Player from "@vimeo/player";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  vimeo_video_id: string | null;
  duration_minutes: number | null;
  order_index: number;
}

interface Course {
  id: string;
  title: string;
}

interface CompletedLessons {
  [lessonId: string]: boolean;
}

const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<CompletedLessons>({});
  const playerRef = useRef<Player | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

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
    if (user && courseId) {
      checkAccessAndFetch();
    }
  }, [user, courseId]);

  const checkAccessAndFetch = async () => {
    // Check if user has purchased the course
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user?.id)
      .eq("course_id", courseId)
      .single();

    if (!purchase) {
      navigate(`/courses/${courseId}`);
      return;
    }

    // Fetch course details
    const { data: courseData } = await supabase
      .from("courses")
      .select("id, title")
      .eq("id", courseId)
      .single();

    setCourse(courseData);

    // Fetch lessons
    const { data: lessonsData } = await supabase
      .from("lessons")
      .select("id, title, description, vimeo_video_id, duration_minutes, order_index")
      .eq("course_id", courseId)
      .order("order_index", { ascending: true });

    if (lessonsData && lessonsData.length > 0) {
      setLessons(lessonsData);
      
      // Fetch all completed lessons for this course
      const { data: allProgressData } = await supabase
        .from("lesson_progress")
        .select("lesson_id, completed, last_watched_at")
        .eq("user_id", user?.id)
        .eq("course_id", courseId);

      if (allProgressData) {
        const completed: CompletedLessons = {};
        allProgressData.forEach(p => {
          if (p.completed) {
            completed[p.lesson_id] = true;
          }
        });
        setCompletedLessons(completed);

        // Find last watched lesson
        const sorted = [...allProgressData].sort(
          (a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime()
        );
        if (sorted.length > 0) {
          const lastLesson = lessonsData.find(l => l.id === sorted[0].lesson_id);
          setCurrentLesson(lastLesson || lessonsData[0]);
        } else {
          setCurrentLesson(lessonsData[0]);
        }
      } else {
        setCurrentLesson(lessonsData[0]);
      }
    }

    setLoading(false);
  };

  // Mark lesson as completed
  const markLessonCompleted = useCallback(async (lessonId: string) => {
    if (!user || !courseId) return;
    
    await supabase
      .from("lesson_progress")
      .upsert({
        user_id: user.id,
        course_id: courseId,
        lesson_id: lessonId,
        completed: true,
        last_watched_at: new Date().toISOString(),
      }, {
        onConflict: "user_id,lesson_id"
      });

    setCompletedLessons(prev => ({ ...prev, [lessonId]: true }));
  }, [user, courseId]);

  // Setup Vimeo player event listener
  useEffect(() => {
    if (!currentLesson?.vimeo_video_id || !iframeRef.current) return;

    // Clean up previous player
    if (playerRef.current) {
      playerRef.current.off("ended");
      playerRef.current = null;
    }

    // Create new player and listen for video end
    const player = new Player(iframeRef.current);
    playerRef.current = player;

    player.on("ended", () => {
      markLessonCompleted(currentLesson.id);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.off("ended");
      }
    };
  }, [currentLesson?.id, currentLesson?.vimeo_video_id, markLessonCompleted]);

  const handleLessonSelect = async (lesson: Lesson) => {
    setCurrentLesson(lesson);
    
    // Save progress
    if (user && courseId) {
      await supabase
        .from("lesson_progress")
        .upsert({
          user_id: user.id,
          course_id: courseId,
          lesson_id: lesson.id,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: "user_id,lesson_id"
        });
    }
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-border bg-card flex items-center px-4 gap-4">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="hidden sm:inline">Буцах</span>
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold truncate">{course?.title}</h1>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Player */}
        <div className="flex-1 flex flex-col">
          <div className="aspect-video bg-black relative">
            {currentLesson?.vimeo_video_id ? (
              <iframe
                ref={iframeRef}
                src={`https://player.vimeo.com/video/${currentLesson.vimeo_video_id}?h=0`}
                className="absolute inset-0 w-full h-full"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white/50">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Видео байхгүй байна</p>
                </div>
              </div>
            )}
          </div>

          {/* Current Lesson Info */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">{currentLesson?.title}</h2>
            {currentLesson?.description && (
              <p className="text-muted-foreground">{currentLesson.description}</p>
            )}
          </div>
        </div>

        {/* Sidebar - Lesson List */}
        <div
          className={`
            fixed lg:relative inset-y-0 right-0 w-80 bg-card border-l border-border
            transform transition-transform duration-300 z-40
            ${sidebarOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            lg:block top-16 lg:top-0
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold">Хичээлүүд</h3>
              <p className="text-sm text-muted-foreground">
                {lessons.length} хичээл
              </p>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2">
                {lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`
                      w-full text-left p-3 rounded-lg mb-1 transition-colors
                      ${
                        currentLesson?.id === lesson.id
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                          h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0
                          ${
                            completedLessons[lesson.id]
                              ? "bg-green-500 text-white"
                              : currentLesson?.id === lesson.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground"
                          }
                        `}
                      >
                        {completedLessons[lesson.id] ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={`font-medium line-clamp-2 ${completedLessons[lesson.id] ? "text-green-600" : ""}`}>
                          {lesson.title}
                        </p>
                        {lesson.duration_minutes && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {lesson.duration_minutes} минут
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
