
import React, { useState } from "react";
import { useFriendExpense } from "@/contexts/FriendExpenseContext";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const FriendTransactionReport: React.FC = () => {
  const { friends, getFriendById, getFriendTransactions, calculateBalance } = useFriendExpense();
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), 'yyyy-MM'));
  const [selectedFriendId, setSelectedFriendId] = useState<string>('all');

  // Get all months from transactions
  const months = Array.from(
    new Set(
      friends.flatMap(friend => 
        getFriendTransactions(friend.id).map(transaction => 
          format(new Date(transaction.date), 'yyyy-MM')
        )
      )
    )
  ).sort((a, b) => b.localeCompare(a)); // Sort by newest first

  // Add current month if not in the list
  const currentMonth = format(new Date(), 'yyyy-MM');
  if (!months.includes(currentMonth)) {
    months.unshift(currentMonth);
  }

  // Filter transactions by month and friend
  const getFilteredTransactions = () => {
    let allTransactions = [];
    
    if (selectedFriendId === 'all') {
      // Get transactions from all friends
      allTransactions = friends.flatMap(friend => 
        getFriendTransactions(friend.id).map(t => ({
          ...t,
          friendName: getFriendById(t.friendId)?.name || 'Unknown'
        }))
      );
    } else {
      // Get transactions from selected friend
      allTransactions = getFriendTransactions(selectedFriendId).map(t => ({
        ...t,
        friendName: getFriendById(t.friendId)?.name || 'Unknown'
      }));
    }

    // Filter by selected month
    return allTransactions.filter(t => 
      format(new Date(t.date), 'yyyy-MM') === selectedMonth
    );
  };

  const filteredTransactions = getFilteredTransactions();

  // Download receipt as PDF (simulated with text)
  const downloadReceipt = () => {
    // Create receipt text
    let receiptText = `TRANSACTION RECEIPT\n`;
    receiptText += `===================\n\n`;
    receiptText += `Date Generated: ${format(new Date(), 'PPpp')}\n`;
    receiptText += `Period: ${format(new Date(selectedMonth), 'MMMM yyyy')}\n\n`;
    
    if (selectedFriendId !== 'all') {
      const friend = getFriendById(selectedFriendId);
      const balance = calculateBalance(selectedFriendId);
      
      receiptText += `Friend: ${friend?.name || 'Unknown'}\n`;
      receiptText += `Current Balance: ${balance >= 0 
        ? `They owe you ₹${balance.toFixed(2)}` 
        : `You owe them ₹${Math.abs(balance).toFixed(2)}`}\n\n`;
    }
    
    receiptText += `TRANSACTIONS\n`;
    receiptText += `-----------\n\n`;
    
    if (filteredTransactions.length === 0) {
      receiptText += `No transactions found for this period.\n`;
    } else {
      filteredTransactions.forEach((t, i) => {
        receiptText += `${i + 1}. ${format(new Date(t.date), 'PP')} - ${t.friendName}\n`;
        receiptText += `   ${t.type === 'GAVE' ? 'You gave' : 'You received'}: ₹${t.amount.toFixed(2)}\n`;
        receiptText += `   Description: ${t.description || 'No description'}\n`;
        receiptText += `   ${t.isSettlement ? '(Settlement Transaction)' : ''}\n\n`;
      });
      
      // Summary
      const gave = filteredTransactions
        .filter(t => t.type === 'GAVE')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const received = filteredTransactions
        .filter(t => t.type === 'RECEIVED')
        .reduce((sum, t) => sum + t.amount, 0);
      
      receiptText += `SUMMARY\n`;
      receiptText += `-------\n\n`;
      receiptText += `Total Given: ₹${gave.toFixed(2)}\n`;
      receiptText += `Total Received: ₹${received.toFixed(2)}\n`;
      receiptText += `Net: ${gave > received 
        ? `₹${(gave - received).toFixed(2)} given` 
        : `₹${(received - gave).toFixed(2)} received`}\n`;
    }
    
    // Create and download the text file
    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `friend-transactions-${selectedMonth}${selectedFriendId !== 'all' ? '-' + getFriendById(selectedFriendId)?.name.replace(/\s+/g, '-').toLowerCase() : ''}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Receipt downloaded",
      description: "Transaction receipt has been downloaded as a text file."
    });
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Friend Transaction Report</span>
          <Button variant="outline" size="sm" onClick={downloadReceipt} disabled={filteredTransactions.length === 0}>
            <Download className="h-4 w-4 mr-1" />
            Download Receipt
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Month</label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(month => (
                  <SelectItem key={month} value={month}>
                    {format(new Date(month + '-01'), 'MMMM yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">Friend</label>
            <Select value={selectedFriendId} onValueChange={setSelectedFriendId}>
              <SelectTrigger>
                <SelectValue placeholder="Select friend" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Friends</SelectItem>
                {friends.map(friend => (
                  <SelectItem key={friend.id} value={friend.id}>
                    {friend.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Friend</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map(transaction => (
                  <TableRow key={transaction.id}>
                    <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                    <TableCell>{transaction.friendName}</TableCell>
                    <TableCell>
                      <span className={
                        transaction.type === 'GAVE' 
                          ? 'text-budget-warning' 
                          : 'text-budget-success'
                      }>
                        {transaction.type === 'GAVE' ? 'You gave' : 'You received'}
                      </span>
                    </TableCell>
                    <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {transaction.description}
                      {transaction.isSettlement && <span className="text-xs text-muted-foreground ml-2">(Settlement)</span>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-4 p-4 bg-muted/20 rounded-md">
              <h4 className="font-medium mb-2">Summary</h4>
              <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Given</p>
                  <p className="font-bold">₹
                    {filteredTransactions
                      .filter(t => t.type === 'GAVE')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Received</p>
                  <p className="font-bold">₹
                    {filteredTransactions
                      .filter(t => t.type === 'RECEIVED')
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net</p>
                  {(() => {
                    const gave = filteredTransactions
                      .filter(t => t.type === 'GAVE')
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const received = filteredTransactions
                      .filter(t => t.type === 'RECEIVED')
                      .reduce((sum, t) => sum + t.amount, 0);
                    
                    const net = received - gave;
                    
                    return (
                      <p className={`font-bold ${net >= 0 ? 'text-budget-success' : 'text-budget-warning'}`}>
                        ₹{Math.abs(net).toFixed(2)} {net >= 0 ? 'received' : 'given'}
                      </p>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No transactions found for this period.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FriendTransactionReport;
