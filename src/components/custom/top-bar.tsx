import { ChatSelect } from "@/ChatSelect";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import React from "react";

import { Button } from "@/components/ui/button";
import CreateChatDialog from "@/CreateChatDialog";
import DeleteButton from "@/DeleteButton";
import useChatStore from "@/stores/chat-store";

const TopBar: React.FC = () => {
  const { activeChatId, activeChat } = useChatStore();

  const title = activeChat()?.summary ?? "Undefined";

  return (
    <div className="flex flex-row gap-2 justify-between">
      <ChatSelect />
      <div className="flex flex-row gap-2">
        <Popover>
          <PopoverContent className="z-20">
            <Card className="w-96">
              <CardHeader className="flex flex-row items-center">
                <Textarea
                  className="text-xl font-bold"
                  // value={summary}
                  onChange={(e) => {
                    // setSummary(e.target.value);
                  }}
                  aria-description="change the title of this chat"
                />
              </CardHeader>
              <CardContent className="flex flex-row gap-2 items-center justify-between">
                <p className="text-muted-foreground">
                  change the title of: {title}
                </p>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => {
                    // changeSummary(summary);
                  }}
                >
                  Save
                </Button>
              </CardContent>
            </Card>
          </PopoverContent>
          <div className="flex justify-between gap-2">
            <div>
              {/*
                <h1 className="text-xl font-bold">{activeChat.summary}</h1>
                <h2 className="text-sm text">{activeChat.createdAt}</h2>
                */}
            </div>
            <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-primary-foreground w-10 h-10">
              <Button size={"icon"}>
                <FontAwesomeIcon icon={faEdit} />
              </Button>
            </PopoverTrigger>
          </div>
        </Popover>
        <CreateChatDialog>
          <FontAwesomeIcon icon={faAdd} />
        </CreateChatDialog>
        <DeleteButton id={activeChatId}>
          <FontAwesomeIcon icon={faTrash} />
        </DeleteButton>
      </div>
    </div>
  );
};

export default TopBar;
