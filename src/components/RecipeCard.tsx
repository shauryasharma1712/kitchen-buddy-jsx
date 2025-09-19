import { Clock, Users, Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

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
}

interface RecipeCardProps {
  recipe: Recipe;
  onRecipeClick: (recipe: Recipe) => void;
  onAddToGroceryList: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe, onRecipeClick, onAddToGroceryList }: RecipeCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const handleAddToGrocery = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToGroceryList(recipe);
  };

  return (
    <div 
      className="recipe-card bg-card rounded-2xl overflow-hidden shadow-cozy cursor-pointer"
      onClick={() => onRecipeClick(recipe)}
    >
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={handleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
              isFavorited 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleAddToGrocery}
            className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="nutrition-badge bg-white/90">
            <span className="font-semibold">{recipe.calories}</span>
            <span className="text-xs">cal</span>
          </div>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-bold text-lg text-card-foreground leading-tight">
            {recipe.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recipe.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{recipe.servings}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span className="font-medium">{recipe.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <span className="ingredient-tag bg-accent/50">{recipe.cuisine}</span>
          <span className="ingredient-tag bg-secondary/70">{recipe.difficulty}</span>
          {recipe.dietary.slice(0, 2).map((diet) => (
            <span key={diet} className="ingredient-tag bg-healthy/20 text-healthy">
              {diet}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;