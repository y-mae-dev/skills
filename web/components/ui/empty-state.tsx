import * as React from "react";
import { AlertCircle, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tone = "info" | "warning" | "error";

const TONE_STYLES: Record<Tone, { card: string; icon: string }> = {
  info: {
    card: "border-muted bg-muted/30",
    icon: "text-muted-foreground",
  },
  warning: {
    card: "border-amber-500/40 bg-amber-500/5",
    icon: "text-amber-600",
  },
  error: {
    card: "border-destructive/40 bg-destructive/5",
    icon: "text-destructive",
  },
};

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  tone?: Tone;
  className?: string;
};

export function EmptyState({
  icon: Icon = AlertCircle,
  title,
  description,
  tone = "info",
  className,
}: EmptyStateProps) {
  const styles = TONE_STYLES[tone];
  return (
    <Card className={cn(styles.card, className)}>
      <CardContent className="py-4 flex gap-3 items-start">
        <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", styles.icon)} />
        <div className="text-sm space-y-1 min-w-0">
          <p className="font-medium">{title}</p>
          {description ? (
            <div className="text-muted-foreground">{description}</div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

type InlineEmptyProps = {
  icon?: LucideIcon;
  message: string;
  className?: string;
};

export function InlineEmpty({
  icon: Icon = AlertCircle,
  message,
  className,
}: InlineEmptyProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground",
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{message}</span>
    </div>
  );
}
