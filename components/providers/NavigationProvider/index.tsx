import React from "react";
import { useStartParamNavigation } from "@/components/hooks/useStartParam";

interface NavigationProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component that handles Telegram Web App start parameter navigation
 *
 * Wraps the app to process and handle initial navigation based on Telegram's
 * start parameters (like direct links to specific gifts or profiles)
 *
 * @example
 * function App() {
 *   return (
 *     <NavigationProvider>
 *       <Router>
 *         <YourRoutes />
 *       </Router>
 *     </NavigationProvider>
 *   );
 * }
 */
export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  useStartParamNavigation();
  return <>{children}</>;
};
