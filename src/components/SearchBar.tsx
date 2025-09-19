import { Search, Filter } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filters: string[]) => void;
}

const SearchBar = ({ onSearch, onFilterChange }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const dietaryFilters = ["Vegetarian", "Vegan", "Gluten-Free", "Keto", "Paleo"];
  const cuisineFilters = ["Italian", "Mexican", "Indian", "Asian", "Mediterranean"];
  const timeFilters = ["Under 30 mins", "30-60 mins", "1+ hours"];

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            placeholder="Search for delicious recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input w-full pl-12 pr-16"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-cooking"
          >
            Find Recipes
          </button>
        </div>
      </form>

      {/* Filter Chips */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
        </div>
        
        {/* Dietary Preferences */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Dietary Preferences</h4>
          <div className="flex flex-wrap gap-2">
            {dietaryFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`filter-chip ${activeFilters.includes(filter) ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Cuisine Types */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Cuisine</h4>
          <div className="flex flex-wrap gap-2">
            {cuisineFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`filter-chip ${activeFilters.includes(filter) ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Cooking Time */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Cooking Time</h4>
          <div className="flex flex-wrap gap-2">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => toggleFilter(filter)}
                className={`filter-chip ${activeFilters.includes(filter) ? 'active' : ''}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;