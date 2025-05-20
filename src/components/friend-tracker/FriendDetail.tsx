
import React, { useState } from "react";
import { format } from "date-fns";
import { useFriendExpense, TransactionType } from "@/contexts/FriendExpenseContext";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RefreshCcw } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface FriendDetailProps {
  friendId: string;
  onBack: () => void;
}

const FriendDetail: React.FC<FriendDetailProps> = ({ friendId, onBack }) => {
  const { getFriendById, calculateBalance, getFriendTransactions, settleBalance } = useFriendExpense();
  const [showForm, setShowForm] = useState(false);

  const friend = getFriendById(friendId);
  const balance = calculateBalance(friendId);
  const transactions = getFriendTransactions(friendId);

  if (!friend) return null;

  const handleSettleBalance = () => {
    settleBalance(friendId);
    toast({
      title: "Balance settled",
      description: `Your balance with ${friend.name} has been marked as settled.`
    });
  };

  const getBalanceMessage = () => {
    if (balance === 0) return `You and ${friend.name} are settled up`;
    if (balance > 0) return `You will receive ₹${balance.toFixed(2)} from ${friend.name}`;
    return `You owe ₹${Math.abs(balance).toFixed(2)} to ${friend.name}`;
  };

  const getBalanceClass = () => {
    if (balance === 0) return "text-muted-foreground";
    if (balance > 0) return "text-budget-success";
    return "text-budget-warning";
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(prev => !prev)}
          >
            {showForm ? "Cancel" : "Add Transaction"}
          </Button>
        </div>
        <CardTitle className="mt-4">{friend.name}</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow">
        {showForm ? (
          <TransactionForm
            friendId={friendId}
            onComplete={() => setShowForm(false)}
          />
        ) : (
          <div className="space-y-6">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm text-muted-foreground">Current Balance</div>
              <div className={`text-xl font-semibold ${getBalanceClass()}`}>
                {getBalanceMessage()}
              </div>
              {balance !== 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="mt-2"
                      variant="outline"
                      size="sm"
                    >
                      <RefreshCcw className="h-3 w-3 mr-1" /> 
                      Settle Up
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Settle Balance</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the current balance of {Math.abs(balance).toFixed(2)} as settled. A settlement transaction will be added to the history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSettleBalance}>
                        Settle Balance
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <TransactionList friendId={friendId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendDetail;
