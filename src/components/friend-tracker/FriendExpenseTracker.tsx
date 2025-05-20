
import React, { useState } from "react";
import { FriendExpenseProvider } from "@/contexts/FriendExpenseContext";
import FriendList from "./FriendList";
import FriendDetail from "./FriendDetail";

const FriendExpenseTracker: React.FC = () => {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  return (
    <FriendExpenseProvider>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <FriendList 
            selectedFriendId={selectedFriendId} 
            onSelectFriend={setSelectedFriendId}
          />
        </div>
        <div className="md:col-span-2">
          {selectedFriendId ? (
            <FriendDetail 
              friendId={selectedFriendId} 
              onBack={() => setSelectedFriendId(null)} 
            />
          ) : (
            <div className="bg-card border p-6 rounded-lg text-center space-y-2">
              <h3 className="font-medium">No Friend Selected</h3>
              <p className="text-muted-foreground">
                Select a friend from the list or add a new one to track expenses.
              </p>
            </div>
          )}
        </div>
      </div>
    </FriendExpenseProvider>
  );
};

export default FriendExpenseTracker;
