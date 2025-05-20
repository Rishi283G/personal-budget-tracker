
import React from "react";
import FriendExpenseTracker from "@/components/friend-tracker/FriendExpenseTracker";

const FriendsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl pt-2 pb-6 md:py-8 space-y-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6">Friend Expense Tracker</h1>
      <FriendExpenseTracker />
    </div>
  );
};

export default FriendsPage;
