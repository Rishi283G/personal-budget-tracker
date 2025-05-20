
import React from "react";
import FriendExpenseTracker from "@/components/friend-tracker/FriendExpenseTracker";
import { format } from "date-fns";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";

const FriendsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl pt-2 pb-6 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h1 className="text-2xl font-bold">Friend Expense Tracker</h1>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="text-sm text-muted-foreground mt-2 md:mt-0 flex items-center cursor-pointer">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(), 'PPPP')}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Today's Date</h4>
              <p className="text-sm">
                Track your friend expenses on {format(new Date(), 'PPPP')}. All transactions
                will be timestamped with the date they were added unless specified otherwise.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <FriendExpenseTracker />
    </div>
  );
};

export default FriendsPage;
