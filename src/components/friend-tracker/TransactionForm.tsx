
import React from "react";
import { useFriendExpense } from "@/contexts/FriendExpenseContext";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

// Define form schema with zod
const transactionSchema = z.object({
  type: z.enum(["GAVE", "RECEIVED"], {
    required_error: "Please select a transaction type",
  }),
  amount: z.coerce
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  description: z.string().min(1, "Description is required"),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  friendId: string;
  onComplete: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ friendId, onComplete }) => {
  const { addTransaction, getFriendById } = useFriendExpense();
  const friend = getFriendById(friendId);

  // Initialize form
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "GAVE",
      amount: undefined,
      description: "",
    },
  });

  // Submit handler
  function onSubmit(values: TransactionFormValues) {
    addTransaction({
      friendId,
      type: values.type,
      amount: values.amount,
      date: new Date(),
      description: values.description,
    });
    
    toast({
      title: "Transaction added",
      description: `Transaction with ${friend?.name} has been recorded.`
    });
    
    onComplete();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="GAVE">I gave money to {friend?.name}</SelectItem>
                  <SelectItem value="RECEIVED">{friend?.name} gave money to me</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500">₹</span>
                  </div>
                  <Input 
                    placeholder="0.00" 
                    className="pl-8" 
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : e.target.value;
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What was this for?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onComplete}>
            Cancel
          </Button>
          <Button type="submit">Save Transaction</Button>
        </div>
      </form>
    </Form>
  );
};

export default TransactionForm;
