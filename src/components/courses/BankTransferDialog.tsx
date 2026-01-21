import { useState } from "react";
import { Copy, Check, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface BankTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  price: number;
  transferCode: string;
  onSubmit: (transactionId: string) => Promise<void>;
  isSubmitting: boolean;
}

const BANK_DETAILS = {
  bankName: "Хаан Банк",
  accountNumber: "5012345678",
  accountName: "Нэгдсэн Сургалтын Төв ХХК",
};

const BankTransferDialog = ({
  open,
  onOpenChange,
  courseTitle,
  price,
  transferCode,
  onSubmit,
  isSubmitting,
}: BankTransferDialogProps) => {
  const [transactionId, setTransactionId] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success("Хуулагдлаа");
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error("Хуулахад алдаа гарлаа");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId.trim()) {
      toast.error("Гүйлгээний дугаар оруулна уу");
      return;
    }
    await onSubmit(transactionId.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Дансаар шилжүүлэх
          </DialogTitle>
          <DialogDescription>
            Доорх дансруу төлбөрөө шилжүүлээд, гүйлгээний дугаараа оруулна уу.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Course Info */}
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Сургалт</p>
            <p className="font-medium">{courseTitle}</p>
            <p className="text-2xl font-bold text-primary mt-2">
              {price.toLocaleString()}₮
            </p>
          </div>

          {/* Bank Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Банк</p>
                <p className="font-medium">{BANK_DETAILS.bankName}</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Дансны дугаар</p>
                <p className="font-medium font-mono">{BANK_DETAILS.accountNumber}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, "account")}
              >
                {copiedField === "account" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Дансны нэр</p>
                <p className="font-medium">{BANK_DETAILS.accountName}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(BANK_DETAILS.accountName, "name")}
              >
                {copiedField === "name" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-card border rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Шилжүүлэх дүн</p>
                <p className="font-medium text-primary">{price.toLocaleString()}₮</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(price.toString(), "amount")}
              >
                {copiedField === "amount" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 bg-primary/10 border-2 border-primary rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Гүйлгээний утга (заавал бичнэ)</p>
                <p className="font-bold text-xl text-primary font-mono">{transferCode}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(transferCode, "code")}
              >
                {copiedField === "code" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              ⚠️ Гүйлгээний утга дээр дээрх кодыг заавал бичнэ үү!
            </p>
          </div>

          {/* Transaction ID Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transactionId">Гүйлгээний дугаар / Лавлах дугаар</Label>
              <Input
                id="transactionId"
                placeholder="Жишээ: 123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Шилжүүлэг хийсний дараа гүйлгээний дугаараа оруулна уу. Бид баталгаажуулсны дараа таны хандах эрх нээгдэнэ.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !transactionId.trim()}
            >
              {isSubmitting ? "Илгээж байна..." : "Баталгаажуулах хүсэлт илгээх"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransferDialog;
