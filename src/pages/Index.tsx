import { useState } from "react";
import { ChefHat, Search, Bot, ShoppingCart } from "lucide-react";
import SearchBar from "../components/SearchBar";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import ChefAssistant from "../components/ChefAssistant";
import GroceryList from "../components/GroceryList";
import heroImage from "../assets/cooking-hero.jpg";
import { useToast } from "../hooks/use-toast";

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  servings: number;
  difficulty: string;
  cuisine: string;
  dietary: string[];
  description: string;
  rating: number;
  calories: number;
  ingredients: { name: string; amount: string; unit: string }[];
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  recipeTitle: string;
  completed: boolean;
}

const Index = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'assistant' | 'grocery'>('search');
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [availableIngredients, setAvailableIngredients] = useState<string[]>([]);
  const [groceryItems, setGroceryItems] = useState<GroceryItem[]>([]);
  const { toast } = useToast();

  // Mock recipe data
  const mockRecipes: Recipe[] = [
    {
      id: "1",
      title: "Mediterranean Quinoa Bowl",
      image: "/api/placeholder/400/300",
      cookTime: "25 mins",
      servings: 4,
      difficulty: "Easy",
      cuisine: "Mediterranean",
      dietary: ["Vegetarian", "Gluten-Free"],
      description: "A nutritious and colorful bowl packed with fresh vegetables, quinoa, and a tangy lemon dressing.",
      rating: 4.8,
      calories: 385,
      ingredients: [
        { name: "Quinoa", amount: "1", unit: "cup" },
        { name: "Cherry tomatoes", amount: "1", unit: "cup" },
        { name: "Cucumber", amount: "1", unit: "medium" },
        { name: "Red onion", amount: "1/4", unit: "cup" },
        { name: "Olive oil", amount: "3", unit: "tbsp" },
        { name: "Lemon juice", amount: "2", unit: "tbsp" },
        { name: "Feta cheese", amount: "1/2", unit: "cup" },
      ],
      instructions: [
        "Rinse quinoa and cook according to package directions.",
        "Dice cucumber and halve cherry tomatoes.",
        "Thinly slice red onion.",
        "Whisk olive oil and lemon juice together.",
        "Combine quinoa, vegetables, and dressing.",
        "Top with crumbled feta cheese and serve."
      ],
      nutrition: { calories: 385, protein: 12, carbs: 45, fat: 16, fiber: 6, sugar: 8 }
    },
    {
      id: "2", 
      title: "Spicy Thai Basil Stir-Fry",
      image: "/api/placeholder/400/300",
      cookTime: "15 mins",
      servings: 2,
      difficulty: "Medium",
      cuisine: "Asian",
      dietary: ["Gluten-Free"],
      description: "A quick and flavorful stir-fry with fresh basil, chilies, and your choice of protein.",
      rating: 4.6,
      calories: 320,
      ingredients: [
        { name: "Ground chicken", amount: "1", unit: "lb" },
        { name: "Thai basil", amount: "1", unit: "cup" },
        { name: "Garlic", amount: "4", unit: "cloves" },
        { name: "Thai chilies", amount: "2", unit: "pieces" },
        { name: "Fish sauce", amount: "2", unit: "tbsp" },
        { name: "Soy sauce", amount: "1", unit: "tbsp" },
        { name: "Jasmine rice", amount: "2", unit: "cups" },
      ],
      instructions: [
        "Heat oil in a wok over high heat.",
        "Add minced garlic and chilies, stir-fry for 30 seconds.",
        "Add ground chicken and cook until browned.",
        "Add fish sauce and soy sauce.",
        "Toss in Thai basil leaves until wilted.",
        "Serve over steamed jasmine rice."
      ],
      nutrition: { calories: 320, protein: 28, carbs: 35, fat: 8, fiber: 2, sugar: 4 }
    },
    {
      id: "3",
      title: "Classic Italian Margherita Pizza",
      image: "/api/placeholder/400/300", 
      cookTime: "45 mins",
      servings: 6,
      difficulty: "Medium",
      cuisine: "Italian",
      dietary: ["Vegetarian"],
      description: "Authentic Neapolitan-style pizza with fresh mozzarella, basil, and san marzano tomatoes.",
      rating: 4.9,
      calories: 280,
      ingredients: [
        { name: "Pizza dough", amount: "1", unit: "ball" },
        { name: "San Marzano tomatoes", amount: "1", unit: "can" },
        { name: "Fresh mozzarella", amount: "8", unit: "oz" },
        { name: "Fresh basil", amount: "1/4", unit: "cup" },
        { name: "Olive oil", amount: "2", unit: "tbsp" },
        { name: "Salt", amount: "1", unit: "tsp" },
      ],
      instructions: [
        "Preheat oven to 500°F (260°C).",
        "Roll out pizza dough on floured surface.",
        "Spread crushed tomatoes evenly.",
        "Add torn pieces of fresh mozzarella.",
        "Drizzle with olive oil and season with salt.",
        "Bake for 10-12 minutes until crust is golden.",
        "Top with fresh basil leaves before serving."
      ],
      nutrition: { calories: 280, protein: 15, carbs: 32, fat: 12, fiber: 2, sugar: 3 }
    }
  ];

  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = searchQuery === "" || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters = searchFilters.length === 0 || 
      searchFilters.some(filter => 
        recipe.dietary.includes(filter) || 
        recipe.cuisine === filter ||
        (filter === "Under 30 mins" && parseInt(recipe.cookTime) < 30) ||
        (filter === "30-60 mins" && parseInt(recipe.cookTime) >= 30 && parseInt(recipe.cookTime) <= 60) ||
        (filter === "1+ hours" && parseInt(recipe.cookTime) > 60)
      );

    return matchesSearch && matchesFilters;
  });

  const handleRecipeClick = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
  };

  const handleAddToGroceryList = (recipe: Recipe) => {
    const newItems: GroceryItem[] = recipe.ingredients.map(ingredient => ({
      id: `${recipe.id}-${ingredient.name}-${Date.now()}-${Math.random()}`,
      name: ingredient.name,
      amount: ingredient.amount,
      unit: ingredient.unit,
      recipeTitle: recipe.title,
      completed: false,
    }));

    setGroceryItems(prev => [...prev, ...newItems]);
    toast({
      title: "Added to Grocery List! 🛒",
      description: `${recipe.title} ingredients added to your shopping list.`,
    });
  };

  const handleToggleGroceryItem = (id: string) => {
    setGroceryItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRemoveGroceryItem = (id: string) => {
    setGroceryItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCompleted = () => {
    setGroceryItems(prev => prev.filter(item => !item.completed));
    toast({
      title: "Cleared completed items",
      description: "All completed items have been removed from your list.",
    });
  };

  const handleRecipeSelect = (recipeId: string) => {
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (recipe) {
      setSelectedRecipe(recipe);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-cozy">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Cooking ingredients and kitchen"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30" />
        <div className="absolute inset-0 flex items-center justify-center text-center text-white">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <ChefHat className="w-12 h-12" />
              <h1 className="text-5xl font-bold">CookJoy</h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl">
              Your friendly digital cooking companion. Discover recipes, plan meals, and cook with confidence.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            {[
              { id: 'search', label: 'Recipe Search', icon: Search },
              { id: 'assistant', label: "Chef's Assistant", icon: Bot },
              { id: 'grocery', label: 'Grocery List', icon: ShoppingCart },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
                {id === 'grocery' && groceryItems.length > 0 && (
                  <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                    {groceryItems.filter(item => !item.completed).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'search' && (
          <div className="space-y-8">
            <SearchBar 
              onSearch={setSearchQuery}
              onFilterChange={setSearchFilters}
            />
            
            {searchQuery || searchFilters.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    Search Results {filteredRecipes.length > 0 && `(${filteredRecipes.length})`}
                  </h2>
                  {(searchQuery || searchFilters.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchFilters([]);
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
                
                {filteredRecipes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map((recipe) => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onRecipeClick={handleRecipeClick}
                        onAddToGroceryList={handleAddToGroceryList}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your search terms or filters to find more recipes.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Featured Recipes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onRecipeClick={handleRecipeClick}
                      onAddToGroceryList={handleAddToGroceryList}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'assistant' && (
          <ChefAssistant
            availableIngredients={availableIngredients}
            onIngredientsChange={setAvailableIngredients}
            onRecipeSelect={handleRecipeSelect}
          />
        )}

        {activeTab === 'grocery' && (
          <GroceryList
            items={groceryItems}
            onToggleItem={handleToggleGroceryItem}
            onRemoveItem={handleRemoveGroceryItem}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* Recipe Modal */}
      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          isOpen={!!selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onAddToGroceryList={handleAddToGroceryList}
        />
      )}
    </div>
  );
};

export default Index;
