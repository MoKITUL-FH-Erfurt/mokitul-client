import { Chat } from "@/models/chat";

import { create } from "zustand";
import useChatStore from "./chat-store";
import { getMoodleUrl } from "@/utils/moodle";

import { v4 as uuidv4 } from "uuid";
import { Layout } from "./settings-store";

type HistoryState = {
  chats: { [key: string]: Chat };
  addChat: (chat: Chat) => void;
  upsertChat: (chat: Chat) => void;
  removeChat: (uuid: string) => void;
  clearChats: () => void;
  loadChatsFromRemote: (
    course: string | undefined,
    file: string | undefined,
    scope: string,
  ) => Promise<void>;
};

const useHistoryStore = create<HistoryState>((set) => ({
  chats: {},
  addChat: (chat) =>
    set((state) => {
      const copy = { chats: { ...state.chats, [chat.id]: chat } };

      return copy;
    }),
  upsertChat: (chat) => {
    set((state) => {
      const newChats = { ...state.chats, [chat.id]: chat };
      state.chats = newChats;
      localStorage.setItem("chats", JSON.stringify(newChats));

      return { ...state };
    });
  },
  removeChat: (uuid) =>
    set((state) => {
      // if the chat is active, mark it as inactive
      if (useChatStore.getState().activeChatId == uuid)
        useChatStore.getState().markChatAsActive(undefined);

      // TODO(Benny): remove chat from remote

      const chats = { ...state.chats };
      delete chats[uuid];

      return { ...state, chats };
    }),
  clearChats: () =>
    set(() => {
      // TODO(Benny): clear chats from remote

      return { chats: {} };
    }),
  loadChatsFromRemote: async (
    course: string | undefined,
    file: string | undefined,
    scope: string,
  ) => {
    if (import.meta.env.MODE === "development") {
      return;
    }

    const searchParams = new URLSearchParams();

    if (course !== null && course !== undefined) {
      searchParams.append("courseId", course);
    }

    if (file !== null && file !== undefined) {
      searchParams.append("fileId", file);
    }

    searchParams.append("scope", scope);

    let url = getMoodleUrl();
    url = `${url}?${searchParams.toString()}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        data.forEach((chat: any) => {
          const mappedChat: Chat = {
            ...chat,
            id: chat._id,
          };

          useHistoryStore.getState().addChat(mappedChat);
        });

        // if there are chats, mark the first one as active
        if (data.length > 0) {
          useChatStore.getState().markChatAsActive(data[0]._id);
        }
      });
  },
}));

export default useHistoryStore;
