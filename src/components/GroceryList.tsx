import { ShoppingCart, Check, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface GroceryItem {
  id: string;
  name: string;
  amount: string;
  unit: string;
  recipeTitle: string;
  completed: boolean;
}

interface GroceryListProps {
  items: GroceryItem[];
  onToggleItem: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onClearCompleted: () => void;
}

const GroceryList = ({ items, onToggleItem, onRemoveItem, onClearCompleted }: GroceryListProps) => {
  const [showCompleted, setShowCompleted] = useState(true);
  
  const completedItems = items.filter(item => item.completed);
  const activeItems = items.filter(item => !item.completed);
  
  // Group items by recipe
  const groupedItems = items.reduce((acc, item) => {
    if (!showCompleted && item.completed) return acc;
    
    if (!acc[item.recipeTitle]) {
      acc[item.recipeTitle] = [];
    }
    acc[item.recipeTitle].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your Grocery List is Empty</h3>
        <p className="text-muted-foreground">
          Add ingredients from recipes to start building your shopping list!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-warm rounded-full text-white">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Grocery List</h2>
            <p className="text-muted-foreground">
              {activeItems.length} items to shop • {completedItems.length} completed
            </p>
          </div>
        </div>
        
        {completedItems.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
            >
              {showCompleted ? 'Hide' : 'Show'} Completed
            </button>
            <button
              onClick={onClearCompleted}
              className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              Clear Completed
            </button>
          </div>
        )}
      </div>

      {/* Shopping Progress */}
      {items.length > 0 && (
        <div className="bg-card p-4 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Shopping Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedItems.length} of {items.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-fresh h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems.length / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Grouped Items */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([recipeTitle, recipeItems]) => (
          <div key={recipeTitle} className="space-y-3">
            <h3 className="font-semibold text-lg text-primary">{recipeTitle}</h3>
            <div className="space-y-2">
              {recipeItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 bg-card rounded-xl border transition-all ${
                    item.completed 
                      ? 'bg-muted/50 border-border opacity-75' 
                      : 'border-border hover:shadow-cozy'
                  }`}
                >
                  <button
                    onClick={() => onToggleItem(item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-healthy border-healthy text-white'
                        : 'border-muted-foreground hover:border-healthy'
                    }`}
                  >
                    {item.completed && <Check className="w-4 h-4" />}
                  </button>
                  
                  <div className="flex-grow">
                    <div className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {item.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount} {item.unit}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Add (Future Enhancement) */}
      <div className="bg-muted/30 p-4 rounded-xl border-2 border-dashed border-muted-foreground/30">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Plus className="w-5 h-5" />
          <span className="text-sm">Quick add custom items (coming soon)</span>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;