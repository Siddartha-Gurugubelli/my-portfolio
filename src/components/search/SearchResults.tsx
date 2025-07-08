
import SearchResultCard from "./SearchResultCard";
import SearchPagination from "./SearchPagination";

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

interface SearchResultsProps {
  searchQuery: string;
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
}

const SearchResults = ({ 
  searchQuery, 
  results, 
  onResultClick,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: SearchResultsProps) => {
  return (
    <div className="space-y-6">
      {searchQuery.trim() && (
        <div className="text-sm text-muted-foreground">
          {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchQuery}"
          {totalPages > 1 && (
            <span> - Page {currentPage} of {totalPages}</span>
          )}
        </div>
      )}
      
      {results.map((result, index) => (
        <SearchResultCard
          key={`${result.categoryId}-${result.item.id}-${currentPage}`}
          result={result}
          searchQuery={searchQuery}
          index={index}
          onClick={onResultClick}
        />
      ))}
      
      {searchQuery.trim() && results.length === 0 && totalItems === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No articles found for "{searchQuery}"</p>
          <p className="text-muted-foreground text-sm mt-2">Try different keywords or browse categories</p>
        </div>
      )}

      {totalItems > 0 && (
        <SearchPagination
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;
