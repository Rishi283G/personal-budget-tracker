
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Friend = {
  id: string;
  name: string;
};

export type TransactionType = 'GAVE' | 'RECEIVED';

export type Transaction = {
  id: string;
  friendId: string;
  type: TransactionType;
  amount: number;
  date: Date;
  description: string;
  isSettlement?: boolean;
};

interface FriendExpenseContextType {
  friends: Friend[];
  transactions: Transaction[];
  addFriend: (name: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  getFriendById: (id: string) => Friend | undefined;
  getFriendTransactions: (friendId: string) => Transaction[];
  calculateBalance: (friendId: string) => number;
  settleBalance: (friendId: string) => void;
  deleteFriend: (id: string) => void;
  deleteTransaction: (id: string) => void;
}

const FriendExpenseContext = createContext<FriendExpenseContextType | undefined>(undefined);

export const useFriendExpense = () => {
  const context = useContext(FriendExpenseContext);
  if (!context) {
    throw new Error('useFriendExpense must be used within a FriendExpenseProvider');
  }
  return context;
};

export const FriendExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [friends, setFriends] = useState<Friend[]>(() => {
    const savedFriends = localStorage.getItem('friends');
    return savedFriends ? JSON.parse(savedFriends) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions 
      ? JSON.parse(savedTransactions).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }))
      : [];
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('friends', JSON.stringify(friends));
  }, [friends]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Add a new friend
  const addFriend = (name: string) => {
    const newFriend: Friend = {
      id: crypto.randomUUID(),
      name,
    };
    setFriends([...friends, newFriend]);
  };

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions([...transactions, newTransaction]);
  };

  // Get friend by ID
  const getFriendById = (id: string) => {
    return friends.find(friend => friend.id === id);
  };

  // Get transactions for a specific friend
  const getFriendTransactions = (friendId: string) => {
    return transactions
      .filter(transaction => transaction.friendId === friendId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  // Calculate balance with a friend
  const calculateBalance = (friendId: string) => {
    return transactions
      .filter(transaction => transaction.friendId === friendId)
      .reduce((balance, transaction) => {
        if (transaction.type === 'GAVE') {
          return balance + transaction.amount;
        } else {
          return balance - transaction.amount;
        }
      }, 0);
  };

  // Settle balance with a friend
  const settleBalance = (friendId: string) => {
    const balance = calculateBalance(friendId);
    if (balance === 0) return;
    
    const settlementTransaction: Transaction = {
      id: crypto.randomUUID(),
      friendId,
      type: balance > 0 ? 'RECEIVED' : 'GAVE',
      amount: Math.abs(balance),
      date: new Date(),
      description: 'Settlement',
      isSettlement: true,
    };
    
    setTransactions([...transactions, settlementTransaction]);
  };

  // Delete a friend and their transactions
  const deleteFriend = (id: string) => {
    setFriends(friends.filter(friend => friend.id !== id));
    setTransactions(transactions.filter(transaction => transaction.friendId !== id));
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  const value = {
    friends,
    transactions,
    addFriend,
    addTransaction,
    getFriendById,
    getFriendTransactions,
    calculateBalance,
    settleBalance,
    deleteFriend,
    deleteTransaction,
  };

  return (
    <FriendExpenseContext.Provider value={value}>
      {children}
    </FriendExpenseContext.Provider>
  );
};
