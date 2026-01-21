import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, Users, Award } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-primary py-20 lg:py-28">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
              Мэргэжлийн ур чадвараа{" "}
              <span className="text-accent">онлайнаар</span> хөгжүүл
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Монголын шилдэг багш нартай хамтран бэлтгэсэн чанартай сургалтуудаас суралц. Веб хөгжүүлэлт, програмчлал, AI гэх мэт олон төрлийн сургалтууд.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/courses">
                  <Play className="h-5 w-5" />
                  Сургалтуудыг үзэх
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/auth?mode=register">
                  Үнэгүй бүртгүүлэх
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-primary-foreground/20">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">50+</div>
                <div className="text-sm text-primary-foreground/70">Сургалтууд</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">1000+</div>
                <div className="text-sm text-primary-foreground/70">Суралцагчид</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-accent">20+</div>
                <div className="text-sm text-primary-foreground/70">Багш нар</div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:block relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Main card */}
              <div className="bg-background/10 backdrop-blur-lg rounded-2xl p-8 border border-primary-foreground/20">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-primary-foreground font-semibold">Шинэ хичээл</div>
                    <div className="text-primary-foreground/70 text-sm">React & TypeScript</div>
                  </div>
                </div>

                {/* Progress bars */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-foreground/70">JavaScript</span>
                      <span className="text-accent">85%</span>
                    </div>
                    <div className="h-2 bg-primary-foreground/20 rounded-full">
                      <div className="h-full w-[85%] bg-accent rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-foreground/70">React</span>
                      <span className="text-accent">70%</span>
                    </div>
                    <div className="h-2 bg-primary-foreground/20 rounded-full">
                      <div className="h-full w-[70%] bg-accent rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-primary-foreground/70">TypeScript</span>
                      <span className="text-accent">60%</span>
                    </div>
                    <div className="h-2 bg-primary-foreground/20 rounded-full">
                      <div className="h-full w-[60%] bg-accent rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating cards */}
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground rounded-lg px-4 py-2 shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  <span className="font-semibold">Сертификат</span>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-background rounded-lg px-4 py-2 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-foreground">+24 шинэ суралцагч</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
