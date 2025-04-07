import { Chat } from "@/models/chat";
import { Message } from "@/models/message";
import { create } from "zustand";
import useHistoryStore from "@/stores/history-store";

type ChatStore = {
  activeChatId: string | undefined;
  markChatAsActive: (chatId: string | undefined) => void;
  activeChat: () => Chat | undefined;

  hasActiveChat: () => boolean;

  changeSummary: (summary: string) => void;
  addMessage: (message: Message) => void;
};

const useChatStore = create<ChatStore>((set, get) => ({
  activeChatId: undefined,
  markChatAsActive: (chatId) => {
    return set({ activeChatId: chatId });
  },
  activeChat: () => {
    const chats = useHistoryStore.getState().chats;

    const selected = get().activeChatId!;

    return chats[selected];
  },

  hasActiveChat: () => {
    return get().activeChatId !== undefined;
  },

  changeSummary: (summary: string) => {
    const chat = get().activeChat()!;

    const clone = { ...chat, summary };

    useHistoryStore.getState().upsertChat(clone);
  },

  addMessage: (message) => {
    const activeChat = get().activeChat()!;

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, message],
    };

    useHistoryStore.getState().upsertChat(updatedChat);
  },
}));

export default useChatStore;
