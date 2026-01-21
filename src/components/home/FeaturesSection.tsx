import { Video, Award, Users, Clock, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "HD чанартай видео",
    description: "Бүх хичээлүүд өндөр чанартай видео бичлэгээр бэлтгэгдсэн",
  },
  {
    icon: Award,
    title: "Сертификат",
    description: "Сургалт дуусмагц албан ёсны сертификат авах боломжтой",
  },
  {
    icon: Users,
    title: "Мэргэжлийн багш",
    description: "Салбартаа туршлагатай, мэргэжлийн багш нар хичээлийг заана",
  },
  {
    icon: Clock,
    title: "Насан туршид хандах",
    description: "Нэг удаа худалдаж авснаар насан туршид хандах эрхтэй",
  },
  {
    icon: Shield,
    title: "Баталгаат чанар",
    description: "Сэтгэл ханамжгүй бол 30 хоногийн дотор мөнгө буцаана",
  },
  {
    icon: Headphones,
    title: "24/7 Дэмжлэг",
    description: "Асуулт байвал бидэнтэй хүссэн үедээ холбогдоорой",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Яагаад биднийг сонгох вэ?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Бид танд хамгийн чанартай онлайн сургалтын туршлагыг санал болгож байна
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-card p-6 rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 group animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="font-semibold text-lg text-card-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
