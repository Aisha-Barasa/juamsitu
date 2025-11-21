import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Bell, Send } from "lucide-react";
import { toast } from "sonner";

interface SMSAlertsProps {
  forestName: string;
  score: number;
  grade: string;
}

export const SMSAlerts = ({ forestName, score, grade }: SMSAlertsProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendAlert = async () => {
    if (!phoneNumber) {
      toast.error("Please enter a phone number");
      return;
    }

    setSending(true);
    
    // Mock SMS sending - in production, this would call an SMS service
    setTimeout(() => {
      const isAtRisk = score < 60;
      const message = isAtRisk
        ? `🚨 ALERT: ${forestName} is at risk! Health Score: ${score}/100 (Grade ${grade}). Immediate attention needed.`
        : `✓ ${forestName} health update: Score ${score}/100 (Grade ${grade}). Forest is in good condition.`;
      
      toast.success("SMS Alert Sent", {
        description: `Sent to ${phoneNumber}: ${message}`
      });
      
      setSending(false);
    }, 1500);
  };

  const isAtRisk = score < 60;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className={`h-5 w-5 ${isAtRisk ? 'text-destructive' : 'text-primary'}`} />
          SMS Alert System
        </CardTitle>
        <CardDescription>
          {isAtRisk 
            ? "⚠️ This forest requires immediate attention" 
            : "Set up alerts for forest health changes"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAtRisk && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm">
            <p className="font-semibold text-destructive mb-1">Risk Alert</p>
            <p className="text-muted-foreground">
              {forestName} has a health score of {score}/100 (Grade {grade}). 
              Conservation action is recommended.
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+254 700 000 000"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSendAlert} 
          disabled={sending}
          className="w-full"
          variant={isAtRisk ? "destructive" : "default"}
        >
          {sending ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send {isAtRisk ? "Risk" : "Status"} Alert
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground">
          Note: This is a mock integration. In production, this would connect to an SMS service like Twilio or Africa's Talking.
        </p>
      </CardContent>
    </Card>
  );
};
