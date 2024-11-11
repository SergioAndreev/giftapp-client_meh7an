import React, { createContext, useContext, useState, useCallback } from "react";
import FloatingNotification from "@/components/ui/FlootingNotification";

interface NotificationData {
  /** Unique identifier for the notification */
  id: string;
  /** ID of the Lottie animation to display */
  lottieID: string;
  /** Main notification message */
  title: string;
  /** Additional details */
  description: string;
  /** Optional button text */
  buttonText?: string;
  /** Optional callback for button click */
  callback?: () => void;
  /** Duration in ms (0 for no auto-hide) */
  duration?: number;
}

interface NotificationContextType {
  showNotification: (data: Omit<NotificationData, "id">) => string;
  hideNotification: (id: string) => void;
  hideAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/**
 * Hook to access the notification system
 * @returns {NotificationContextType} Methods for showing and hiding notifications
 * @throws {Error} If used outside of NotificationProvider
 *
 * @example
 * const { showNotification } = useNotification();
 * showNotification({
 *   lottieID: 'success',
 *   title: 'Success!',
 *   description: 'Operation completed'
 * });
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

/**
 * Global notification system for displaying animated toast-style notifications
 *
 * Provides a context-based solution for showing/hiding notifications with Lottie
 * animations from anywhere in the app.
 *
 * @example
 * // In your root component:
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 *
 * // Using notifications anywhere in your app:
 * function MyComponent() {
 *   const { showNotification } = useNotification();
 *
 *   const handleSuccess = () => {
 *     showNotification({
 *       lottieID: 'success',
 *       title: 'Gift Sent!',
 *       description: 'Your friend will love it',
 *       duration: 3000
 *     });
 *   };
 * }
 */
export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const showNotification = useCallback((data: Omit<NotificationData, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications((prev) => [...prev, { ...data, id }]);

    if (data.duration !== 0) {
      // Only set timeout if duration isn't 0
      const duration = data.duration || 5000;
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );
      }, duration + 300);
    }

    return id; // Return the ID so it can be used to hide the notification later
  }, []);

  const hideNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const hideAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification, hideAllNotifications }}
    >
      {children}
      {notifications.map((notification) => (
        <FloatingNotification
          key={notification.id}
          lottieID={notification.lottieID}
          title={notification.title}
          description={notification.description}
          buttonText={notification.buttonText}
          callback={notification.callback}
          duration={notification.duration}
        />
      ))}
    </NotificationContext.Provider>
  );
};
