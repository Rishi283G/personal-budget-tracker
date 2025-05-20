
import React from "react";
import FriendExpenseTracker from "@/components/friend-tracker/FriendExpenseTracker";
import { format } from "date-fns";

const FriendsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl pt-2 pb-6 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h1 className="text-2xl font-bold">Friend Expense Tracker</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Today: {format(new Date(), 'PPPP')}
        </div>
      </div>
      <FriendExpenseTracker />
    </div>
  );
};

export default FriendsPage;
