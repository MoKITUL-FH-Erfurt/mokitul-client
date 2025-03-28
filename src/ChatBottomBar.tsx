import { FunctionComponent, useState } from "react";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { CornerDownLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useChatStore from "@/stores/chat-store";
import { getMoodleUrl } from "./utils/moodle";
import { useSpecificChatLockStore } from "@/stores/chat-lock-store";
import { toast } from "sonner";
import { useChatInputStore } from "./stores/input-store";
import track, { useTracking } from "react-tracking";
import { hashValue } from "@/utils/hash";

interface Props {
  // Define your component's props here
}

const ChatBottomBar: FunctionComponent<Props> = () => {
  const { input, setInput } = useChatInputStore();
  const { addMessage, activeChat } = useChatStore();
  const chat = activeChat()!;

  const { id, messages } = chat;

  const { locked, lock, unlock } = useSpecificChatLockStore(id);

  const { trackEvent } = useTracking();

  const submitToApi = async (message: string, conversationId: string) => {
    // actual logic
    if (!(import.meta.env.MODE === "development")) {
      console.log("Mocking disabled - sending request to api");
      // send message to api
      let url = getMoodleUrl();
      url = `${url}?conversationId=${conversationId}`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to send message to api");
      }

      const data = await response.json();

      console.log(data);

      addMessage({
        content: data.answer,
        createdAt: new Date().toLocaleTimeString(),
        role: "assistant",
      });
    } else {
      console.log("Mocking enabled - not sending request to api");

      // wait
      await new Promise((resolve) => setTimeout(resolve, 3000));

      addMessage({
        content: "This is a mock response",
        createdAt: new Date().toLocaleTimeString(),
        role: "assistant",
      });
    }
  };

  const handleSubmit = async () => {
    // Handle form submission
    lock();

    addMessage({
      content: input,
      createdAt: new Date().toLocaleTimeString(),
      role: "user",
    });

    setInput("");

    // actual logic
    try {
      await submitToApi(input, id);
      setInput("");
    } catch (e) {
      toast.error("Failed to send message to api");

      console.log(e); //todo dev only
    }

    // unlock chat
    unlock();

    trackEvent({
      eventType: "message_sent",
      eventProperties: {
        messageLength: input.length,
        chatId: hashValue(id),
      },
    });
  };

  return (
    <div className="flex items-end gap-2 z-10 pb-5">
      <ChatInput
        placeholder="..."
        onChange={(e) => {
          setInput(e.target.value);
        }}
        value={input}
      />
      <Button
        variant={locked ? "outline" : "default"}
        size="sm"
        className="ml-auto gap-1.5 p-3 h-full"
        disabled={locked}
        onClick={handleSubmit}
      >
        <CornerDownLeft className="size-3.5" />
      </Button>
    </div>
  );
};

export default ChatBottomBar;
