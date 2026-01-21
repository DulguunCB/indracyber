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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Дансаар шилжүүлэх
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Course Info - Compact */}
          <div className="bg-muted rounded-lg p-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Сургалт</p>
              <p className="font-medium text-sm line-clamp-1">{courseTitle}</p>
            </div>
            <p className="text-xl font-bold text-primary">
              {price.toLocaleString()}₮
            </p>
          </div>

          {/* Bank Details - Compact Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-card border rounded-lg">
              <p className="text-xs text-muted-foreground">Банк</p>
              <p className="font-medium text-sm">{BANK_DETAILS.bankName}</p>
            </div>
            <div className="p-2 bg-card border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Дансны дугаар</p>
                <p className="font-medium text-sm font-mono">{BANK_DETAILS.accountNumber}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, "account")}>
                {copiedField === "account" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          <div className="p-2 bg-card border rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Дансны нэр</p>
              <p className="font-medium text-sm">{BANK_DETAILS.accountName}</p>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(BANK_DETAILS.accountName, "name")}>
              {copiedField === "name" ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>

          {/* Transfer Code - Highlighted */}
          <div className="p-3 bg-primary/10 border-2 border-primary rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Гүйлгээний утга (заавал бичнэ!)</p>
              <p className="font-bold text-2xl text-primary font-mono">{transferCode}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(transferCode, "code")}>
              {copiedField === "code" ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          {/* Transaction ID Input */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="transactionId" className="text-sm">Гүйлгээний дугаар</Label>
              <Input
                id="transactionId"
                placeholder="Жишээ: 123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Шилжүүлэг хийсний дараа гүйлгээний дугаараа оруулна уу.
              </p>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting || !transactionId.trim()}>
              {isSubmitting ? "Илгээж байна..." : "Баталгаажуулах хүсэлт илгээх"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BankTransferDialog;
