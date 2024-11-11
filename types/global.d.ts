// / <reference types="react" />
type React = typeof import("react");

declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}

declare const module: {
  hot?: {
    accept(
      dependencies: string | string[],
      callback?: (updatedDependencies: any[]) => void
    ): void;
    accept(callback?: (updatedDependencies: any[]) => void): void;
    decline(dependencies?: string | string[]): void;
    dispose(callback: (data: any) => void): void;
    addDisposeHandler(callback: (data: any) => void): void;
    removeDisposeHandler(callback: (data: any) => void): void;
    status(): string;
    addStatusHandler(callback: (status: string) => void): void;
    removeStatusHandler(callback: (status: string) => void): void;
  };
};

declare interface PaginatedResponse<T> {
  items: T;
  total: number;
  hasNext: boolean;
}
