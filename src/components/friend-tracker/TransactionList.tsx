
import React, { useState } from "react";
import { format } from "date-fns";
import { useFriendExpense, Transaction } from "@/contexts/FriendExpenseContext";
import { Button } from "@/components/ui/button";
import { ArrowUpToLine, ArrowDownToLine, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

interface TransactionListProps {
  friendId: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ friendId }) => {
  const { getFriendTransactions, deleteTransaction } = useFriendExpense();
  const transactions = getFriendTransactions(friendId);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const handleDeleteTransaction = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete.id);
      toast({
        title: "Transaction deleted",
        description: "The transaction has been removed.",
        variant: "destructive"
      });
      setTransactionToDelete(null);
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No transactions recorded yet
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium mb-3">Transaction History</h3>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[30px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id} className={transaction.isSettlement ? "bg-muted/40" : ""}>
                <TableCell className="text-xs text-muted-foreground">
                  {format(transaction.date, "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    {transaction.type === "GAVE" ? (
                      <ArrowUpToLine className="h-3 w-3 mr-2 text-budget-warning" />
                    ) : (
                      <ArrowDownToLine className="h-3 w-3 mr-2 text-budget-success" />
                    )}
                    <span className={transaction.isSettlement ? "italic text-muted-foreground" : ""}>
                      {transaction.description}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className={transaction.type === "GAVE" ? "text-budget-warning" : "text-budget-success"}>
                    {transaction.type === "GAVE" ? "-" : "+"} ₹{transaction.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-50 hover:opacity-100"
                    onClick={() => setTransactionToDelete(transaction)}
                  >
                    <Trash className="h-3 w-3" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={!!transactionToDelete}
        onOpenChange={(open) => !open && setTransactionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTransaction}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionList;
