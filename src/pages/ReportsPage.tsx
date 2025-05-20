
import React from "react";
import Reports from "@/components/Reports";
import FriendTransactionReport from "@/components/reports/FriendTransactionReport";
import { format } from "date-fns";

const ReportsPage: React.FC = () => {
  return (
    <div className="container max-w-5xl py-4 md:py-8 space-y-6 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
        <h1 className="text-2xl font-bold">Budget Reports</h1>
        <div className="text-sm text-muted-foreground mt-2 md:mt-0">
          Today: {format(new Date(), 'PPPP')}
        </div>
      </div>
      
      <Reports />
      <FriendTransactionReport />
    </div>
  );
};

export default ReportsPage;
