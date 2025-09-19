import { Users, Plus, Minus, Calculator } from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  servings: number;
  cookTime: string;
  ingredients: { name: string; amount: string; unit: string }[];
}

interface ScalingCalculatorProps {
  originalServings: number;
  currentServings: number;
  onServingsChange: (servings: number) => void;
  recipe: Recipe;
}

const ScalingCalculator = ({ 
  originalServings, 
  currentServings, 
  onServingsChange, 
  recipe 
}: ScalingCalculatorProps) => {
  const scaleAmount = (originalAmount: string, ratio: number) => {
    const amount = parseFloat(originalAmount);
    if (isNaN(amount)) return originalAmount;
    return (amount * ratio).toFixed(amount % 1 === 0 ? 0 : 1);
  };

  const ratio = currentServings / originalServings;
  const scaledCookTime = Math.round(parseInt(recipe.cookTime) * (ratio > 2 ? 1.2 : 1));

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, currentServings + delta);
    onServingsChange(newServings);
  };

  const presetServings = [2, 4, 6, 8, 12];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Calculator className="w-6 h-6" />
          Recipe Scaling Calculator
        </h3>
        <p className="text-muted-foreground">Adjust ingredients for your desired serving size</p>
      </div>

      {/* Serving Size Controls */}
      <div className="bg-accent/30 p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => adjustServings(-1)}
            disabled={currentServings <= 1}
            className="p-2 rounded-full bg-white shadow-cozy hover:shadow-warm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{currentServings}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-1 justify-center">
              <Users className="w-4 h-4" />
              serving{currentServings !== 1 ? 's' : ''}
            </div>
          </div>
          
          <button
            onClick={() => adjustServings(1)}
            className="p-2 rounded-full bg-white shadow-cozy hover:shadow-warm transition-all"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Buttons */}
        <div className="flex justify-center gap-2 flex-wrap">
          {presetServings.map((servings) => (
            <button
              key={servings}
              onClick={() => onServingsChange(servings)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                currentServings === servings
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'bg-white text-muted-foreground hover:bg-primary/10'
              }`}
            >
              {servings}
            </button>
          ))}
        </div>

        {/* Scaling Info */}
        {ratio !== 1 && (
          <div className="text-center p-3 bg-white/80 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Scaling by <span className="font-bold text-primary">{ratio.toFixed(1)}x</span>
              {ratio > 2 && (
                <span className="block text-xs mt-1 text-amber-600">
                  ⚠️ Cook time may increase by ~20% for large batches
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Scaled Ingredients */}
      <div className="space-y-4">
        <h4 className="text-lg font-bold">Scaled Ingredients</h4>
        <div className="grid gap-3">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
              <span className="font-medium">{ingredient.name}</span>
              <div className="text-right">
                <div className="font-semibold">
                  {scaleAmount(ingredient.amount, ratio)} {ingredient.unit}
                </div>
                {ratio !== 1 && (
                  <div className="text-xs text-muted-foreground">
                    was {ingredient.amount} {ingredient.unit}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estimated Cook Time */}
      <div className="bg-muted/50 p-4 rounded-xl">
        <h4 className="font-semibold mb-2">Estimated Cook Time</h4>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">{scaledCookTime}</span>
          <span className="text-muted-foreground">minutes</span>
          {scaledCookTime !== parseInt(recipe.cookTime) && (
            <span className="text-xs text-muted-foreground ml-2">
              (original: {recipe.cookTime})
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScalingCalculator;