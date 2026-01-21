import { Link } from "react-router-dom";
import { Code, Globe, Brain, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "web",
    icon: Globe,
    title: "Веб хөгжүүлэлт",
    description: "HTML, CSS, JavaScript, React, Node.js гэх мэт орчин үеийн веб технологиуд",
    coursesCount: 15,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "programming",
    icon: Code,
    title: "Програмчлал",
    description: "Python, Java, C++ зэрэг програмчлалын хэлнүүд болон алгоритм",
    coursesCount: 20,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "ai",
    icon: Brain,
    title: "AI сургалт",
    description: "Machine Learning, Deep Learning, хиймэл оюун ухааны үндэс",
    coursesCount: 10,
    color: "from-amber-500 to-orange-500",
  },
];

const CategoriesSection = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Сургалтын ангилал
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Өөрийн сонирхолд тохирсон ангиллаас сургалтаа сонгоно уу
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/courses?category=${category.id}`}
              className="group relative overflow-hidden rounded-2xl p-8 bg-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="relative">
                <div
                  className={`h-16 w-16 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <category.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-xl font-bold text-card-foreground mb-3">
                  {category.title}
                </h3>

                <p className="text-muted-foreground mb-4">
                  {category.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {category.coursesCount} сургалт
                  </span>
                  <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                    Үзэх
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/courses">
              Бүх сургалтуудыг үзэх
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
