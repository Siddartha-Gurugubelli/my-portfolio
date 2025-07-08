
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchHeader from "@/components/search/SearchHeader";
import SearchResults from "@/components/search/SearchResults";
import { useWebWorkerSearch } from "@/hooks/useWebWorkerSearch";
import { BlogService } from "@/services/blogService";

const BlogSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  
  const {
    search,
    results,
    allResults,
    isLoading,
    isSearching,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    handlePageChange,
    handleItemsPerPageChange,
  } = useWebWorkerSearch();

  // Update URL when search changes
  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Perform search when query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      search(searchQuery);
    }
  }, [searchQuery, search]);

  const handleResultClick = (result: any) => {
    const categoryItems = allResults.filter(r => r.categoryId === result.categoryId);
    const fullPath = BlogService.findItemPath(categoryItems.map(r => r.item), result.item);
    
    if (fullPath && fullPath.length > 0) {
      const urlPath = fullPath.join('/');
      const url = `/blogs/${result.categoryId}/${urlPath}`;
      console.log('Opening URL:', url);
      navigate(url);
    } else {
      navigate(`/blogs/${result.categoryId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <main className="pt-[120px] pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span className="text-muted-foreground">Initializing search index...</span>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background text-foreground no-x-overflow"
      >
        <Navbar />
        <main className="pt-[120px] pb-20">
          <div className="max-w-4xl mx-auto px-4">
            <SearchHeader 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isSearching={isSearching}
            />
            
            <SearchResults
              searchQuery={searchQuery}
              results={results}
              onResultClick={handleResultClick}
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </main>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
};

export default BlogSearch;
