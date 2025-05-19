
import React, { useState } from "react";
import { useBudget } from "@/contexts/BudgetContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "sonner";

const ExpenseForm: React.FC = () => {
  const { addExpense, dailyAllowance } = useBudget();
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Food");
  const today = format(new Date(), "yyyy-MM-dd");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!description) {
      toast.error("Please enter a description");
      return;
    }

    const newExpense = {
      amount: parseFloat(amount),
      description,
      category,
      date: today,
    };

    addExpense(newExpense);
    
    // Show appropriate toast message
    if (parseFloat(amount) > dailyAllowance) {
      toast.warning("Oops! You crossed today's budget", {
        description: `You spent ₹${parseFloat(amount).toLocaleString()} which is above your daily limit.`,
      });
    } else {
      toast.success("Expense added successfully", {
        description: `You're on track, keep it up!`,
      });
    }

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("Food");
  };

  return (
    <Card className="budget-card">
      <h3 className="text-lg font-medium mb-4">Add New Expense</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              required
              className="budget-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Tea">Tea</SelectItem>
                <SelectItem value="Snacks">Snacks</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Lunch at mess"
            required
            className="budget-input"
          />
        </div>

        <Button type="submit" className="w-full bg-budget-primary text-white hover:bg-budget-primary/90">
          Add Expense
        </Button>
      </form>
    </Card>
  );
};

export default ExpenseForm;
