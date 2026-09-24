import { useRegisterSW } from "virtual:pwa-register/react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export function PWABadge() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-3 bg-card border border-border shadow-2xl rounded-xl">
      <span className="text-xs text-foreground font-medium">
        New update available!
      </span>
      <Button
        size="sm"
        onClick={() => updateServiceWorker(true)}
        className="h-7 text-xs bg-primary text-primary-foreground gap-1"
      >
        <RefreshCw className="w-3 h-3" /> Reload
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setNeedRefresh(false)}
        className="h-7 text-xs"
      >
        Dismiss
      </Button>
    </div>
  );
}
