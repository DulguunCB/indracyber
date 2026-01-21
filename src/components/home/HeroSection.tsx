import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import heroLearning from "@/assets/hero-learning.png";

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
              Мэргэжлийн ур чадвараа <span className="text-accent">онлайнаар</span> хөгжүүл
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto lg:mx-0">
              Монголын шилдэг багш нартай хамтран бэлтгэсэн чанартай сургалтуудаас суралц. Веб хөгжүүлэлт, програмчлал,
              AI гэх мэт олон төрлийн сургалтууд.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl" asChild>
                <Link to="/courses">
                  <Play className="h-5 w-5" />
                  Сургалтууд
                </Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <Link to="/auth?mode=register">Бүртгүүлэх</Link>
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

          {/* Hero Image */}
          <div className="hidden lg:block relative animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <img src={heroLearning} alt="Онлайн сургалт" className="w-full max-w-lg mx-auto drop-shadow-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
