import { create } from "zustand";
import { persist } from "zustand/middleware";
import useChatStore from "@/stores/chat-store";

type ChatInputStore = {
  input: string;
  setInput: (input: string) => void;
};

// Create a Zustand store for each chat's input with the correct type
const createChatInputStore = (chatId: string) =>
  create<ChatInputStore>()(
    persist(
      (set) => ({
        input: "",
        setInput: (input: string) => set({ input }),
      }),
      {
        name: `chat-input-${chatId}`, // Persist each chat input with a unique key
      }
    )
  );

const chatInputStores: {
  [key: string]: ReturnType<typeof createChatInputStore>;
} = {};

/* Create a hook to get the chat input store for the selected chat
 *
 * This hook is only safe to use, if a chat is selected
 *
 * If the store does not exist, create it
 */
export const useChatInputStore = () => {
  const selectedChatId = useChatStore.getState().activeChatId!;

  if (!chatInputStores[selectedChatId]) {
    chatInputStores[selectedChatId] = createChatInputStore(selectedChatId);
  }

  return chatInputStores[selectedChatId]();
};
