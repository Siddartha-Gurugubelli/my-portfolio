
import { useState, useEffect, useRef, useMemo } from 'react';

interface SearchResult {
  item: {
    id: string;
    type: string;
    title?: string;
    description?: string;
    author?: string;
    date?: string;
    createdOn?: string;
    tags?: string[];
  };
  categoryId: string;
  categoryTitle: string;
  path: string[];
  relevanceScore: number;
}

export const useWebWorkerSearch = () => {
  const [allResults, setAllResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const workerRef = useRef<Worker | null>(null);

  // Initialize web worker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/searchWorker.ts', import.meta.url),
      { type: 'module' }
    );

    workerRef.current.onmessage = (event) => {
      const { type, data, error } = event.data;
      
      switch (type) {
        case 'INIT_COMPLETE':
          setIsInitialized(true);
          setIsLoading(false);
          break;
        case 'INIT_ERROR':
          console.error('Search worker initialization failed:', error);
          setIsLoading(false);
          break;
        case 'SEARCH_RESULTS':
          setAllResults(data);
          setIsSearching(false);
          setCurrentPage(1); // Reset to first page on new search
          break;
        case 'SEARCH_ERROR':
          console.error('Search failed:', error);
          setIsSearching(false);
          break;
      }
    };

    // Initialize the worker
    workerRef.current.postMessage({ type: 'INIT' });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const search = (query: string) => {
    if (!isInitialized || !workerRef.current) {
      console.warn('Search worker not ready');
      return;
    }
    
    setIsSearching(true);
    workerRef.current.postMessage({
      type: 'SEARCH',
      data: { query }
    });
  };

  // Paginated results
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return allResults.slice(startIndex, startIndex + itemsPerPage);
  }, [allResults, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(allResults.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    search,
    results: paginatedResults,
    allResults,
    isLoading,
    isSearching,
    isInitialized,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems: allResults.length,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
