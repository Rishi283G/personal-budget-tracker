
import React, { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BudgetSetup: React.FC = () => {
  const { budget, setBudget, startDate, setStartDate, endDate, setEndDate, resetBudget } = useBudget();
  const [newBudget, setNewBudget] = useState(budget.toString());

  const handleSave = () => {
    const budgetValue = parseFloat(newBudget);
    
    if (isNaN(budgetValue) || budgetValue <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    
    if (startDate >= endDate) {
      toast.error("End date must be after start date");
      return;
    }
    
    setBudget(budgetValue);
    toast.success("Budget settings updated successfully");
  };

  return (
    <Card className="budget-card space-y-4">
      <h3 className="text-lg font-medium mb-2">Budget Settings</h3>
      
      <div className="space-y-2">
        <Label htmlFor="budget">Monthly Budget (₹)</Label>
        <Input
          id="budget"
          type="number"
          value={newBudget}
          onChange={(e) => setNewBudget(e.target.value)}
          placeholder="3200"
          min="0"
          className="budget-input"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="space-y-2">
          <Label>End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={resetBudget}
          className="text-destructive hover:bg-destructive/10"
        >
          Reset Data
        </Button>
        <Button onClick={handleSave} className="bg-budget-secondary text-white hover:bg-budget-secondary/90">
          Save Settings
        </Button>
      </div>
    </Card>
  );
};

export default BudgetSetup;
