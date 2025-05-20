
import React, { useState } from "react";
import { useFriendExpense, Friend } from "@/contexts/FriendExpenseContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, X, Check, Trash, Edit } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

interface FriendListProps {
  selectedFriendId: string | null;
  onSelectFriend: (id: string) => void;
}

const FriendList: React.FC<FriendListProps> = ({ selectedFriendId, onSelectFriend }) => {
  const { friends, addFriend, calculateBalance, deleteFriend, updateFriendName } = useFriendExpense();
  const [newFriendName, setNewFriendName] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [friendToDelete, setFriendToDelete] = useState<Friend | null>(null);
  const [editingFriendId, setEditingFriendId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  const handleAddFriend = () => {
    if (newFriendName.trim()) {
      addFriend(newFriendName.trim());
      setNewFriendName("");
      setIsAddingFriend(false);
      toast({
        title: "Friend added",
        description: `${newFriendName} has been added to your friends list.`
      });
    }
  };

  const handleDeleteFriend = () => {
    if (friendToDelete) {
      deleteFriend(friendToDelete.id);
      if (selectedFriendId === friendToDelete.id) {
        onSelectFriend("");
      }
      toast({
        title: "Friend deleted",
        description: `${friendToDelete.name} has been removed from your friends list.`,
        variant: "destructive"
      });
      setFriendToDelete(null);
    }
  };

  const startEditingFriend = (friend: Friend) => {
    setEditingFriendId(friend.id);
    setEditedName(friend.name);
  };

  const saveEditedFriend = () => {
    if (editingFriendId && editedName.trim()) {
      updateFriendName(editingFriendId, editedName.trim());
      toast({
        title: "Friend updated",
        description: `Friend name has been updated successfully.`
      });
      setEditingFriendId(null);
      setEditedName("");
    }
  };

  const cancelEditingFriend = () => {
    setEditingFriendId(null);
    setEditedName("");
  };

  const formatBalance = (balance: number) => {
    if (balance === 0) return "No debts";
    if (balance > 0) return `Owes you ₹${balance.toFixed(2)}`;
    return `You owe ₹${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Friends</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsAddingFriend(true)}
            disabled={isAddingFriend}
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAddingFriend && (
          <div className="flex items-center space-x-2 mb-4">
            <Input
              placeholder="Friend name"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={() => setIsAddingFriend(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button 
              size="icon"
              onClick={handleAddFriend}
              disabled={!newFriendName.trim()}
            >
              <Check className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        <div className="space-y-2">
          {friends.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No friends added yet
            </p>
          ) : (
            friends.map((friend) => {
              const balance = calculateBalance(friend.id);
              const isEditing = editingFriendId === friend.id;

              return (
                <div 
                  key={friend.id} 
                  className={`flex items-center justify-between p-3 rounded-md transition-colors cursor-pointer ${
                    selectedFriendId === friend.id 
                      ? 'bg-budget-primary text-white' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => !isEditing && onSelectFriend(friend.id)}
                >
                  <div className="flex-grow">
                    {isEditing ? (
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="h-8 py-1"
                          autoFocus
                        />
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-7 w-7" 
                          onClick={cancelEditingFriend}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          size="icon" 
                          className="h-7 w-7" 
                          onClick={saveEditedFriend}
                          disabled={!editedName.trim()}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="font-medium">{friend.name}</div>
                        <div className={`text-xs ${
                          selectedFriendId === friend.id 
                            ? 'text-white/80' 
                            : balance > 0 
                              ? 'text-budget-success' 
                              : balance < 0 
                                ? 'text-budget-warning' 
                                : 'text-muted-foreground'
                        }`}>
                          {formatBalance(balance)}
                        </div>
                      </>
                    )}
                  </div>
                  {!isEditing && (
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className={`opacity-0 hover:opacity-100 ${
                          selectedFriendId === friend.id ? 'text-white hover:bg-white/20' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingFriend(friend);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className={`opacity-0 hover:opacity-100 ${
                          selectedFriendId === friend.id ? 'text-white hover:bg-white/20' : ''
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFriendToDelete(friend);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </CardContent>

      <AlertDialog open={!!friendToDelete} onOpenChange={(open) => !open && setFriendToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Friend</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {friendToDelete?.name}? This will remove all transaction history with this friend.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteFriend} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default FriendList;
