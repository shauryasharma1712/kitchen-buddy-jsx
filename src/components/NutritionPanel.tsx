import { Activity, Zap, Apple, Wheat } from "lucide-react";

interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
}

interface NutritionPanelProps {
  nutrition: Nutrition;
  servings: number;
}

const NutritionPanel = ({ nutrition, servings }: NutritionPanelProps) => {
  const scaledNutrition = {
    calories: Math.round(nutrition.calories * servings / 1),
    protein: Math.round(nutrition.protein * servings / 1),
    carbs: Math.round(nutrition.carbs * servings / 1),
    fat: Math.round(nutrition.fat * servings / 1),
    fiber: Math.round(nutrition.fiber * servings / 1),
    sugar: Math.round(nutrition.sugar * servings / 1),
  };

  const nutritionItems = [
    {
      label: "Calories",
      value: scaledNutrition.calories,
      unit: "kcal",
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      dailyValue: Math.round((scaledNutrition.calories / 2000) * 100),
    },
    {
      label: "Protein",
      value: scaledNutrition.protein,
      unit: "g",
      icon: Activity,
      color: "text-red-500",
      bgColor: "bg-red-50",
      dailyValue: Math.round((scaledNutrition.protein / 50) * 100),
    },
    {
      label: "Carbs",
      value: scaledNutrition.carbs,
      unit: "g",
      icon: Wheat,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      dailyValue: Math.round((scaledNutrition.carbs / 300) * 100),
    },
    {
      label: "Fat",
      value: scaledNutrition.fat,
      unit: "g",
      icon: Apple,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      dailyValue: Math.round((scaledNutrition.fat / 65) * 100),
    },
    {
      label: "Fiber",
      value: scaledNutrition.fiber,
      unit: "g",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-50",
      dailyValue: Math.round((scaledNutrition.fiber / 25) * 100),
    },
    {
      label: "Sugar",
      value: scaledNutrition.sugar,
      unit: "g",
      icon: Zap,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      dailyValue: Math.round((scaledNutrition.sugar / 50) * 100),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Nutrition Facts</h3>
        <p className="text-muted-foreground">Per {servings} serving{servings !== 1 ? 's' : ''}</p>
      </div>

      {/* Main Calories Display */}
      <div className="bg-gradient-warm p-6 rounded-2xl text-center text-white">
        <div className="text-4xl font-bold">{scaledNutrition.calories}</div>
        <div className="text-lg opacity-90">Calories</div>
        <div className="text-sm opacity-75 mt-1">
          {Math.round((scaledNutrition.calories / 2000) * 100)}% Daily Value*
        </div>
      </div>

      {/* Nutrition Grid */}
      <div className="grid grid-cols-2 gap-4">
        {nutritionItems.slice(1).map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className={`p-4 rounded-xl ${item.bgColor} border border-opacity-20`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-white ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-semibold text-sm">{item.label}</span>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">
                  {item.value}<span className="text-sm font-normal text-muted-foreground ml-1">{item.unit}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.dailyValue}% DV*
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Health Tips */}
      <div className="bg-healthy/10 p-4 rounded-xl border border-healthy/20">
        <h4 className="font-semibold text-healthy mb-2">💚 Health Benefits</h4>
        <div className="text-sm text-muted-foreground space-y-1">
          {scaledNutrition.protein > 20 && <p>• High in protein - great for muscle health</p>}
          {scaledNutrition.fiber > 5 && <p>• Good source of fiber - supports digestion</p>}
          {scaledNutrition.calories < 400 && <p>• Moderate calories - fits well in a balanced diet</p>}
          {scaledNutrition.sugar < 10 && <p>• Low in sugar - better for blood sugar control</p>}
        </div>
      </div>

      <div className="text-xs text-muted-foreground text-center">
        *Percent Daily Values are based on a 2,000 calorie diet.
      </div>
    </div>
  );
};

export default NutritionPanel;