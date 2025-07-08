
import { SearchIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isSearching?: boolean;
}

const SearchHeader = ({ searchQuery, onSearchChange, isSearching = false }: SearchHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Search Articles</h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Find the perfect article from our collection of tech blogs and insights
      </p>
      
      <div className="flex justify-center">
        <div className="relative max-w-lg w-full">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for articles, topics, or keywords..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 h-12 text-lg"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
