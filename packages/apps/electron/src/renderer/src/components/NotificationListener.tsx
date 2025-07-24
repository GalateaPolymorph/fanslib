import { useEffect } from "react";
import { NotificationPayload } from "src/features/notifications/api-type";
import { useToast } from "./ui/Toast/use-toast";

export const NotificationListener = () => {
  const { toast } = useToast();

  useEffect(() => {
    const handler = (_: unknown, notification: NotificationPayload) => {
      toast({
        title: notification.title,
        description: notification.body,
        duration: 5000,
      });
    };

    window.api["notification:onNotify"](handler);
    return () => {};
  }, [toast]);

  return null;
};
