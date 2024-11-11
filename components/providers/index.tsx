import React from "react";
import RoutesProvider from "./RoutesProvider";
import { DataProvider } from "./DataProvider";
import { NavigationProvider } from "./NavigationProvider";
import { NotificationProvider } from "./NotificationProvider";
import { ThemeProvider } from "./ThemeProvider";
import { LottieControllerProvider } from "./LottieProvider";
import { PreloaderWrapper } from "./PreloadProvider/wrapper";

const combineProviders =
  (...providers: React.ComponentType<{ children: React.ReactNode }>[]) =>
  () =>
    providers.reduceRight((acc, Provider) => <Provider>{acc}</Provider>, <></>);

/**
 * Root provider component that combines all app-level providers in the correct order.
 * Wraps the entire application to provide theme, animations, routing, data management,
 * navigation, and notifications functionality.
 *
 * Provider order (outside to inside):
 * 1. Theme
 * 2. Lottie Animations
 * 3. Preloader
 * 4. Notifications
 * 5. Data Management
 * 6. Routing
 * 7. Navigation
 *
 * @example
 * import AppProviders from './AppProviders';
 *
 * const App = () => (
 *   <AppProviders>
 *     <YourApp />
 *   </AppProviders>
 * );
 */
const AppProviders = combineProviders(
  ThemeProvider,
  LottieControllerProvider,
  PreloaderWrapper,
  NotificationProvider,
  DataProvider,
  RoutesProvider,
  NavigationProvider
);

export default AppProviders;
