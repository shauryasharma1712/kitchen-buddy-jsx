import { Bot, Lightbulb, RefreshCw, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface SuggestedRecipe {
  id: string;
  title: string;
  image: string;
  cookTime: string;
  matchPercentage: number;
  missingIngredients: string[];
}

interface ChefAssistantProps {
  availableIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
  onRecipeSelect: (recipeId: string) => void;
}

const ChefAssistant = ({ availableIngredients, onIngredientsChange, onRecipeSelect }: ChefAssistantProps) => {
  const [suggestions, setSuggestions] = useState<SuggestedRecipe[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newIngredient, setNewIngredient] = useState("");

  // Mock AI suggestions based on available ingredients
  const generateSuggestions = () => {
    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const mockSuggestions: SuggestedRecipe[] = [
        {
          id: "1",
          title: "Mediterranean Pasta Salad",
          image: "/api/placeholder/300/200",
          cookTime: "20 mins",
          matchPercentage: 85,
          missingIngredients: ["olives", "feta cheese"],
        },
        {
          id: "2", 
          title: "Quick Stir-Fry Vegetables",
          image: "/api/placeholder/300/200",
          cookTime: "15 mins",
          matchPercentage: 92,
          missingIngredients: ["soy sauce"],
        },
        {
          id: "3",
          title: "Herb-Crusted Chicken",
          image: "/api/placeholder/300/200", 
          cookTime: "35 mins",
          matchPercentage: 78,
          missingIngredients: ["rosemary", "chicken breast"],
        },
      ].filter(recipe => {
        // Simple mock logic - show recipes if we have at least 2 ingredients
        return availableIngredients.length >= 2;
      });
      
      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 1500);
  };

  useEffect(() => {
    if (availableIngredients.length > 0) {
      generateSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [availableIngredients]);

  const addIngredient = () => {
    if (newIngredient.trim() && !availableIngredients.includes(newIngredient.trim())) {
      onIngredientsChange([...availableIngredients, newIngredient.trim()]);
      setNewIngredient("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    onIngredientsChange(availableIngredients.filter(i => i !== ingredient));
  };

  const commonIngredients = [
    "tomatoes", "onions", "garlic", "olive oil", "pasta", "rice", "chicken", 
    "beef", "carrots", "potatoes", "herbs", "cheese", "eggs", "bread"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-3 bg-gradient-warm p-4 rounded-full text-white mb-4">
          <Bot className="w-8 h-8" />
          <span className="text-xl font-bold">Chef's Assistant</span>
          <Sparkles className="w-6 h-6" />
        </div>
        <p className="text-muted-foreground">
          Tell me what ingredients you have, and I'll suggest delicious recipes you can make!
        </p>
      </div>

      {/* Ingredients Input */}
      <div className="bg-card p-6 rounded-2xl space-y-4">
        <h3 className="font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          What's in your kitchen?
        </h3>
        
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add an ingredient..."
            value={newIngredient}
            onChange={(e) => setNewIngredient(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
            className="search-input flex-grow"
          />
          <button
            onClick={addIngredient}
            disabled={!newIngredient.trim()}
            className="btn-cooking disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add
          </button>
        </div>

        {/* Quick Add Common Ingredients */}
        {availableIngredients.length === 0 && (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Quick add common ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {commonIngredients.slice(0, 8).map((ingredient) => (
                <button
                  key={ingredient}
                  onClick={() => onIngredientsChange([...availableIngredients, ingredient])}
                  className="ingredient-tag hover:bg-primary hover:text-primary-foreground"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Current Ingredients */}
        {availableIngredients.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Your ingredients:</p>
            <div className="flex flex-wrap gap-2">
              {availableIngredients.map((ingredient) => (
                <span
                  key={ingredient}
                  className="ingredient-tag bg-healthy/20 text-healthy cursor-pointer"
                  onClick={() => removeIngredient(ingredient)}
                >
                  {ingredient} ✕
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Suggestions */}
      {availableIngredients.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">AI Recipe Suggestions</h3>
            <button
              onClick={generateSuggestions}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {isGenerating ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-card p-4 rounded-xl animate-pulse">
                  <div className="h-32 bg-muted rounded-lg mb-3" />
                  <div className="h-4 bg-muted rounded mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => onRecipeSelect(recipe.id)}
                  className="bg-card rounded-xl overflow-hidden shadow-cozy hover:shadow-warm transition-all cursor-pointer hover:-translate-y-1"
                >
                  <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-32 object-cover"
                  />
                  <div className="p-4 space-y-3">
                    <h4 className="font-semibold">{recipe.title}</h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{recipe.cookTime}</span>
                      <span className="font-semibold text-healthy">
                        {recipe.matchPercentage}% match
                      </span>
                    </div>
                    {recipe.missingIngredients.length > 0 && (
                      <div className="text-xs text-muted-foreground">
                        Missing: {recipe.missingIngredients.join(", ")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Add a few more ingredients to get personalized recipe suggestions!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChefAssistant;