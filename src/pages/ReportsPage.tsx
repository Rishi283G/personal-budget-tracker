
import React from "react";
import Reports from "@/components/Reports";
import FriendTransactionReport from "@/components/reports/FriendTransactionReport";
import { format } from "date-fns";
import { 
  HoverCard, 
  HoverCardTrigger, 
  HoverCardContent 
} from "@/components/ui/hover-card";
import { CalendarIcon } from "lucide-react";

const ReportsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl py-4 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h1 className="text-2xl font-bold">Budget Reports</h1>
        <HoverCard>
          <HoverCardTrigger asChild>
            <div className="text-sm text-muted-foreground mt-2 md:mt-0 flex items-center cursor-pointer">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(), 'PPPP')}
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">Report Date</h4>
              <p className="text-sm">
                These reports show your financial status as of {format(new Date(), 'PPPP')}. 
                You can download transaction receipts or view detailed spending analytics.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <Reports />
      <FriendTransactionReport />
    </div>
  );
};

export default ReportsPage;
