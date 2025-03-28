import React, { FunctionComponent, useEffect } from "react";
import { ChatMessageList } from "./components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "./components/ui/chat/chat-bubble";
import useChatStore from "./stores/chat-store";
import MessageLoading from "./components/ui/chat/message-loading";
import ChatBottomBar from "@/ChatBottomBar";
import { useTracking } from "react-tracking";
import useSettingsStore, { Layout } from "./stores/settings-store";
import useMediaQuery from "./hooks/use-media-query";
import { useSpecificChatLockStore } from "./stores/chat-lock-store";
import PreviousError from "./components/custom/PreviousError";
import { getMoodleUrl } from "@/utils/moodle";
import { hashValue } from "./utils/hash";
import IsolatedMarkdownRenderer from "./components/custom/MarkdownRenderer";

const ActiveChat: FunctionComponent = () => {
  const { activeChat, hasActiveChat, activeChatId, addMessage } =
    useChatStore();
  const { locked, lock, unlock } = useSpecificChatLockStore(activeChatId!);
  const isDesktop = useMediaQuery("(min-width: 1200px)");
  const { layout } = useSettingsStore();

  const isBlock = layout == "block";
  const useEnlargedMessageBubble = !isDesktop || isBlock;

  const { trackEvent } = useTracking();

  if (!hasActiveChat()) return <>No Chat</>;

  // only query the active chat if it exists
  const chat = activeChat()!;

  const { messages } = chat;
  const lastMessage =
    messages.length > 0 ? messages[messages.length - 1] : null;

  const handleResubmit = async () => {
    if (!lastMessage) return;

    const id = chat.id;
    const length = lastMessage.content.length;

    console.log("resubmitting");

    lock();

    let url = getMoodleUrl();
    url = `${url}?conversationId=${chat.id}`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: lastMessage!.content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message to api");
      }

      const data = await response.json();

      addMessage({
        content: data.content,
        createdAt: new Date().toLocaleTimeString(),
        role: "assistant",
      });
    } catch (e) {
      console.error(e);
    }

    unlock();

    trackEvent({
      eventType: "message_resubmitted",
      eventProperties: {
        messageLength: length,
        chatId: hashValue(id),
      },
    });
  };

  return (
    <>
      <div
        className={
          isBlock
            ? "flex flex-col h-full w-full max-h-192"
            : "flex flex-col h-full w-full max-h-192"
        }
      >
        <div className="flex-1 overflow-auto mokitul-chat">
          <ChatMessageList>
            {chat.messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.role == "user" ? "sent" : "received"}
                layout={useEnlargedMessageBubble ? "ai" : "default"}
              >
                <ChatBubbleMessage
                  variant={message.role == "user" ? "sent" : "received"}
                >
                  <IsolatedMarkdownRenderer>
                    {message.content}
                  </IsolatedMarkdownRenderer>
                  <p className="text-gray-500 text-xs">{message.createdAt}</p>
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            {locked && <LoadingIndicator />}
            {lastMessage && lastMessage.role === "user" && !locked && (
              <PreviousError onClick={handleResubmit} />
            )}
          </ChatMessageList>
        </div>
        <ChatBottomBar />
      </div>
    </>
  );

  function LoadingIndicator(): JSX.Element {
    return (
      <ChatBubble variant="received">
        <MessageLoading />
      </ChatBubble>
    );
  }
};

export default ActiveChat;
