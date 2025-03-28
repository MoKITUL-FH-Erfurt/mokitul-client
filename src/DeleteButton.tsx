import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import deleteChat from "@/actions/delete-chat";
import useHistoryStore from "@/stores/history-store";

interface DeleteButtonProps {
  id: string | undefined;
  children: ReactNode;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ id, children }) => {
  const { removeChat } = useHistoryStore();

  const deleteCallback = async () => {
    if (!id) return;

    removeChat(id);

    deleteChat(id);
  };

  return (
    <Button
      variant="ghost"
      className="hover:bg-red-500 hover:text-destructive-foreground"
      size="icon"
      onClick={deleteCallback}
      disabled={!id}
    >
      {children}
    </Button>
  );
};

export default DeleteButton;
