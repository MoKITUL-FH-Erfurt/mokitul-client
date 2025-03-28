import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import useChatStore from "@/stores/chat-store";

const TopBar: React.FC = () => {
  const [summary, setSummary] = useState("");
  const { activeChat, changeSummary, hasActiveChat } = useChatStore();

  if (!hasActiveChat()) return <></>;

  const title = activeChat()?.summary ?? "Undefined";

  // TODO: This is horrible.
  const chat = activeChat()!;

  useEffect(() => {
    setSummary(chat.summary);
  }, [chat]);

  return (
    <Popover>
      <PopoverContent align="end" className="z-20  flex flex-col gap-2">
        <Textarea
          className="text-xl font-bold"
          value={summary}
          onChange={(e) => {
            setSummary(e.target.value);
          }}
          aria-description="change the title of this chat"
        />
        <p className="text-muted-foreground">change the title of: {title}</p>
        <Button
          variant="default"
          size="sm"
          onClick={async () => {
            // TODO: save the summary using the API

            changeSummary(summary);
          }}
        >
          Save
        </Button>
      </PopoverContent>
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-bold">{chat.summary}</h1>
          <h2 className="text-sm text">{chat.createdAt}</h2>
        </div>
        <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-primary hover:text-primary-foreground w-10 h-10">
          <FontAwesomeIcon icon={faEdit} />
        </PopoverTrigger>
      </div>
    </Popover>
  );
};

export default TopBar;
