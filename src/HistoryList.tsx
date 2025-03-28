import React from "react";
import { ScrollArea } from "./components/ui/scroll-area";
import useHistoryStore from "./stores/history-store";
import { Separator } from "./components/ui/separator";
import { Button } from "./components/ui/button";
import { Card, CardDescription, CardHeader } from "./components/ui/card";
import useChatStore from "./stores/chat-store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import ToggleThemeButton from "./ToggleThemeButton";
import CreateChatDialog from "./CreateChatDialog";
import { Chat } from "./models/chat";
import deleteChat from "./actions/delete-chat";
import DeleteButton from "./DeleteButton";

const HistoryList: React.FC = () => {
  const { chats, clearChats } = useHistoryStore((state) => state);
  const { activeChatId } = useChatStore();

  return (
    <>
      <div className="flex flex-col gap-2 items-left p-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold flex-grow">My Chats</h1>
          {activeChatId && (
            <DeleteButton id={activeChatId}>
              <FontAwesomeIcon icon={faTrash} />
            </DeleteButton>
          )}
          <CreateChatDialog>
            <FontAwesomeIcon icon={faAdd} />
          </CreateChatDialog>
        </div>
        <Separator />
        <ScrollArea>
          {Object.values(chats).map((chat, index) => (
            <ChatHistoryCard key={index} chat={chat} />
          ))}
        </ScrollArea>
      </div>
    </>
  );
};

export default HistoryList;

interface ChatHistoryCardProps {
  chat: Chat;
}

const ChatHistoryCard: React.FC<ChatHistoryCardProps> = ({ chat }) => {
  const { markChatAsActive } = useChatStore((state) => state);
  const { activeChatId } = useChatStore((state) => state);

  var style =
    "m-3 cursor-pointer hover:translate-x-3 ease-in-out transition-transform hover:drop-shadow-lg";
  chat.id === activeChatId
    ? (style += " border-solid border-2 border-primary")
    : style;

  return (
    <Card className={style}>
      <CardHeader className="flex flex-row items-center p-0">
        <div
          className="flex-grow p-3"
          onClick={() => markChatAsActive(chat.id)}
        >
          <p className="text-lg font-semibold">{chat.summary}</p>
          <CardDescription>{chat.createdAt}</CardDescription>
        </div>
        <DeleteButton id={chat.id}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </CardHeader>
    </Card>
  );
};
