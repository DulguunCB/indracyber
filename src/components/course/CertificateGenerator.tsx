import { useState } from "react";
import { Download, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import certificateTemplate from "@/assets/certificate-template.jpg";

interface CertificateGeneratorProps {
  recipientName: string;
  courseName: string;
  issuedAt: string;
  score: number;
  totalQuestions: number;
}

const CertificateGenerator = ({
  recipientName,
  courseName,
  issuedAt,
  score,
  totalQuestions,
}: CertificateGeneratorProps) => {
  const [generating, setGenerating] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const generatePDF = async () => {
    setGenerating(true);

    try {
      // Create PDF in landscape A4
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      // Load certificate template image
      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = certificateTemplate;
      });

      // Add background image
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(img, "JPEG", 0, 0, pageWidth, pageHeight);

      // Add recipient name (centered, positioned based on template)
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(36);
      pdf.setTextColor(40, 40, 40);
      pdf.text(recipientName, pageWidth / 2, pageHeight / 2 + 5, {
        align: "center",
      });

      // Add course name below recipient name
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(14);
      pdf.setTextColor(80, 80, 80);
      pdf.text(`"${courseName}" сургалтыг амжилттай дуусгасан`, pageWidth / 2, pageHeight / 2 + 20, {
        align: "center",
      });

      // Add date (bottom left area)
      pdf.setFontSize(12);
      pdf.text(formatDate(issuedAt), pageWidth * 0.25, pageHeight - 25, {
        align: "center",
      });

      // Add score (bottom right area - as signature area substitute)
      pdf.text(`Оноо: ${score}/${totalQuestions}`, pageWidth * 0.75, pageHeight - 25, {
        align: "center",
      });

      // Download PDF
      pdf.save(`certificate-${recipientName.replace(/\s+/g, "_")}.pdf`);
      toast.success("Сертификат татагдлаа!");
    } catch (error) {
      console.error("Certificate generation error:", error);
      toast.error("Сертификат үүсгэхэд алдаа гарлаа");
    } finally {
      setGenerating(false);
    }
  };

  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="p-6 text-center">
      <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4">
        <Award className="h-10 w-10 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold mb-2">Баяр хүргэе!</h3>
      <p className="text-muted-foreground mb-2">
        Та сертификатийн шалгалтыг амжилттай өглөө
      </p>
      <div className="text-4xl font-bold text-green-600 mb-4">{percentage}%</div>

      {/* Preview card */}
      <div className="relative max-w-lg mx-auto mb-6 rounded-lg overflow-hidden shadow-lg border">
        <img
          src={certificateTemplate}
          alt="Certificate Preview"
          className="w-full"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-2xl font-bold text-gray-800 mt-4">{recipientName}</p>
          <p className="text-sm text-gray-600 mt-2 px-4 text-center">
            "{courseName}" сургалтыг амжилттай дуусгасан
          </p>
        </div>
        <div className="absolute bottom-6 left-0 right-0 flex justify-between px-12 text-xs text-gray-600">
          <span>{formatDate(issuedAt)}</span>
          <span>Оноо: {score}/{totalQuestions}</span>
        </div>
      </div>

      <Button onClick={generatePDF} size="lg" className="gap-2" disabled={generating}>
        <Download className="h-5 w-5" />
        {generating ? "Үүсгэж байна..." : "Сертификат татах (PDF)"}
      </Button>
    </div>
  );
};

export default CertificateGenerator;
