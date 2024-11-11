import { useEffect, ReactNode, useState } from "react";
import { pxToRem } from "@/lib/pxToRem";

interface InfiniteScrollProps {
  loading: boolean;
  setLoading: (value: boolean) => void;
  checkLoading: boolean;
  setCheckLoading: (value: boolean) => void;
  hasNext: boolean;
  itemHeight: number;
  children: ReactNode;
  className?: string;
  id?: string;
  currentItems: number;
  defaultItems?: number;
}

export const InfiniteScrollContainer = ({
  loading,
  setLoading,
  checkLoading,
  setCheckLoading,
  hasNext,
  itemHeight,
  children,
  className = "",
  id = "infinite-scroll-container",
  currentItems,
  defaultItems = 10,
}: InfiniteScrollProps) => {
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  // Initial load calculation
  useEffect(() => {
    const container = document.getElementById(id);
    if (!container || initialLoadDone || loading) return;

    const containerHeight = container.clientHeight;
    const visibleItems = Math.ceil(pxToRem(containerHeight) / itemHeight);

    if (
      visibleItems > defaultItems &&
      hasNext &&
      currentItems === defaultItems
    ) {
      const additionalBatches = Math.ceil(
        (visibleItems - defaultItems) / defaultItems
      );

      for (let i = 0; i < additionalBatches; i++) {
        setCheckLoading(true);
        setLoading(true);
      }
      setInitialLoadDone(true);
    }
  }, [currentItems, hasNext, loading, itemHeight, initialLoadDone]);

  // Scroll handler
  useEffect(() => {
    const container = document.getElementById(id);
    if (!container) return;

    const scrollerFunc = (event: Event) => {
      const { scrollTop, scrollHeight } = event.target as HTMLElement;
      const scrollBottom = scrollHeight - scrollTop - container.clientHeight;
      const scrollBottomRem = pxToRem(scrollBottom);

      if (
        scrollBottomRem < 30 &&
        scrollBottomRem > 5 &&
        !loading &&
        !checkLoading &&
        hasNext
      ) {
        setCheckLoading(true);
        setLoading(true);
      } else if (scrollBottomRem > 30 && checkLoading && !loading) {
        setCheckLoading(false);
      } else if (scrollBottomRem < 10 && hasNext) {
        container.scrollTop = scrollTop - pxToRem(30);
      }
    };

    container.addEventListener("scroll", scrollerFunc);

    return () => {
      container.removeEventListener("scroll", scrollerFunc);
    };
  }, [checkLoading, loading, hasNext]);

  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
};
