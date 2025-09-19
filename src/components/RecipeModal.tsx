import { X, Clock, Users, ChefHat, Scale, ShoppingCart } from "lucide-react";
import { useState } from "react";
import NutritionPanel from "./NutritionPanel";
import ScalingCalculator from "./ScalingCalculator";

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

interface RecipeModalProps {
  recipe: Recipe;
  isOpen: boolean;
  onClose: () => void;
  onAddToGroceryList: (recipe: Recipe) => void;
}

const RecipeModal = ({ recipe, isOpen, onClose, onAddToGroceryList }: RecipeModalProps) => {
  const [activeTab, setActiveTab] = useState<'recipe' | 'nutrition' | 'scale'>('recipe');
  const [scaledServings, setScaledServings] = useState(recipe.servings);

  if (!isOpen) return null;

  const scaleAmount = (originalAmount: string, originalServings: number, newServings: number) => {
    const ratio = newServings / originalServings;
    const amount = parseFloat(originalAmount);
    if (isNaN(amount)) return originalAmount;
    return (amount * ratio).toFixed(amount % 1 === 0 ? 0 : 1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-warm">
        {/* Header */}
        <div className="relative h-64 overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-6 left-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{recipe.title}</h2>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.cookTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span>{recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex">
            {[
              { id: 'recipe', label: 'Recipe', icon: ChefHat },
              { id: 'nutrition', label: 'Nutrition', icon: Users },
              { id: 'scale', label: 'Scale Recipe', icon: Scale },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          {activeTab === 'recipe' && (
            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
              
              {/* Ingredients */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Ingredients</h3>
                  <button
                    onClick={() => onAddToGroceryList(recipe)}
                    className="btn-healthy flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Grocery List
                  </button>
                </div>
                <div className="grid gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {scaleAmount(ingredient.amount, recipe.servings, scaledServings)} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Instructions</h3>
                <div className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="text-muted-foreground leading-relaxed pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <NutritionPanel nutrition={recipe.nutrition} servings={scaledServings} />
          )}

          {activeTab === 'scale' && (
            <ScalingCalculator
              originalServings={recipe.servings}
              currentServings={scaledServings}
              onServingsChange={setScaledServings}
              recipe={recipe}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeModal;