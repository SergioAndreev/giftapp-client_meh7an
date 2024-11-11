import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useParams,
} from "react-router-dom";
import { ReactNode, useContext, createContext, useEffect, useRef } from "react";
import type { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useData } from "../DataProvider";
import TabBar from "@/components/ui/TabBar";
const pagesContext = require.context("../../../pages", true, /page\.tsx$/);
const pages = Object.fromEntries(
  pagesContext.keys().map((path) => [path, pagesContext(path).default])
);

const RouteParamsContext = createContext<{
  paramNames: string[];
  params: Record<string, string>;
}>({ paramNames: [], params: {} });

export const useRouteParams = () => {
  return useContext(RouteParamsContext);
};

/**
 * Hook to access current route parameters and their names
 * @returns {Object} Object containing parameter names and values
 *
 * @example
 * function GiftPage() {
 *   const { params } = useRouteParams();
 *   const giftId = params.id;
 *   return <GiftDetails id={giftId} />;
 * }
 */

/**
 * Hook to access current or previous route path
 * @param offset -1 for previous path, 0 for current path
 * @returns {string} Route path without leading slash
 *
 * @example
 * const currentPath = useRoutePath();
 * const previousPath = useRoutePath(-1);
 */
export const useRoutePath = (offset = 0) => {
  const location = useLocation();
  const previousPath = useRef<string>("store");

  useEffect(() => {
    previousPath.current = location.pathname.slice(1) || "store";
  }, [location]);

  // If offset is -1, return the previous path
  if (offset === -1) {
    return previousPath.current;
  }

  return location.pathname.slice(1) || "store";
};

const AnimatedRoutes: FC = () => {
  const location = useLocation();
  const { config } = useData();

  const routes = Object.entries(pages).map(([path, Component]) => {
    // Convert file paths to route paths:
    // ./gift/[id]/page.tsx -> /gift/:id
    // ./store/index/page.tsx -> /store
    let routePath = path
      .replace("./", "")
      .replace("/page.tsx", "")
      .replace(/\/index$/, "/")
      .replace(/\/$/, "");

    const paramNames = (routePath.match(/\[([^\]]+)\]/g) || []).map((param) =>
      param.slice(1, -1)
    );

    const isDynamicRoute = routePath.includes("[") && routePath.includes("]");

    if (isDynamicRoute) {
      routePath = routePath.replace(/\[([^\]]+)\]/g, ":$1");
    }

    const PageWrapper: FC<{ children: ReactNode }> = ({ children }) => {
      return <motion.div>{children}</motion.div>;
    };

    const RouteWrapper = () => {
      const params = useParams() as Record<string, string>;
      return (
        <RouteParamsContext.Provider value={{ paramNames, params }}>
          <PageWrapper>
            <Component />
          </PageWrapper>
        </RouteParamsContext.Provider>
      );
    };

    return (
      <Route
        key={routePath}
        path={routePath === config.defaultTab ? "/" : `/${routePath}`}
        element={<RouteWrapper />}
      />
    );
  });

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routes}
        <Route path="/*" element={<div>404 - Not Found</div>} />
      </Routes>
    </AnimatePresence>
  );
};

interface RoutesProviderProps {
  children: ReactNode;
}

/**
 * Advanced routing system that automatically generates routes from the pages directory
 * and handles dynamic route parameters with animations between page transitions.
 *
 * Features:
 * - Auto-route generation from file system
 * - Dynamic route parameters (e.g. [id], [slug])
 * - Page transition animations
 * - Previous route tracking
 * - Default tab handling
 *
 * @example
 * // File structure:
 * // pages/
 * //   store/page.tsx
 * //   gift/[id]/page.tsx
 *
 * <RoutesProvider>
 *   <App />
 * </RoutesProvider>
 */
const RoutesProvider: FC<RoutesProviderProps> = ({ children }) => {
  return (
    <Router>
      <AnimatedRoutes />
      <TabBar />
      {children}
    </Router>
  );
};
export default RoutesProvider;
