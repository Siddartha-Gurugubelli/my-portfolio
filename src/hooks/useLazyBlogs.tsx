
import { useState, useEffect, useRef, useCallback } from 'react';
import { BlogCategory } from '@/models/blog';

interface UseLazyBlogsProps {
  categories: BlogCategory[];
  itemsPerPage?: number;
}

export const useLazyBlogs = ({ categories, itemsPerPage = 6 }: UseLazyBlogsProps) => {
  const [visibleItems, setVisibleItems] = useState<BlogCategory[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);
  const initialLoadRef = useRef(false);

  const loadMoreItems = useCallback(() => {
    if (isLoading || !hasMore || categories.length === 0) return;

    setIsLoading(true);
    
    // Simulate network delay for smooth loading
    setTimeout(() => {
      const nextItems = categories.slice(currentIndex, currentIndex + itemsPerPage);
      
      if (nextItems.length === 0) {
        setHasMore(false);
      } else {
        setVisibleItems(prev => [...prev, ...nextItems]);
        setCurrentIndex(prev => prev + itemsPerPage);
        
        if (currentIndex + itemsPerPage >= categories.length) {
          setHasMore(false);
        }
      }
      
      setIsLoading(false);
    }, 200);
  }, [categories, currentIndex, itemsPerPage, isLoading, hasMore]);

  // Initialize with first batch only once
  useEffect(() => {
    if (categories.length > 0 && !initialLoadRef.current) {
      const initialItems = categories.slice(0, itemsPerPage);
      setVisibleItems(initialItems);
      setCurrentIndex(itemsPerPage);
      setHasMore(categories.length > itemsPerPage);
      initialLoadRef.current = true;
    }
  }, [categories, itemsPerPage]);

  // Reset when categories change
  useEffect(() => {
    if (categories.length > 0) {
      setVisibleItems([]);
      setCurrentIndex(0);
      setHasMore(true);
      initialLoadRef.current = false;
    }
  }, [categories]);

  // Set up intersection observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && initialLoadRef.current) {
          loadMoreItems();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMoreItems]);

  return {
    visibleItems,
    isLoading,
    hasMore,
    loadingRef
  };
};
