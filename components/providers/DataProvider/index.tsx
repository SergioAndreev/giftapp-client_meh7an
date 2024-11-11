import React, { createContext, useContext, ReactNode } from "react";
import constant from "@/constants";

/** Type definition for data context values */
interface DataContextType {
  /** Application configuration values from constants */
  config: typeof constant.APP_DATA;
}

const DataContext = createContext<DataContextType | null>(null);

/**
 * Context for managing global application data and configuration
 *
 * Provides access to app-wide configuration values defined in constants.APP_DATA
 * throughout the component tree without prop drilling
 *
 * @example
 * // In your root component:
 * function App() {
 *   return (
 *     <DataProvider>
 *       <YourComponents />
 *     </DataProvider>
 *   );
 * }
 *
 * // In any child component:
 * function ChildComponent() {
 *   const { config } = useData();
 *   return <div>{config.someValue}</div>;
 * }
 */
export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const value = {
    config: constant.APP_DATA,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

/**
 * Hook to access the global data context
 * @throws {Error} If used outside of DataProvider
 * @returns {DataContextType} Context containing app configuration
 */
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
