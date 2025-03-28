import { create } from "zustand";

type ApplicationStore = {
  locked: boolean;
  lock: () => void;
  unlock: () => void;
  toggleLock: () => void;
};

const createChatLockStore = () =>
  create<ApplicationStore>((set) => ({
    locked: false, // Initial state: unlocked (false)

    // Lock the store (set locked to true)
    lock: () => set({ locked: true }),

    // Unlock the store (set locked to false)
    unlock: () => set({ locked: false }),

    // Toggle the lock state
    toggleLock: () => set((state) => ({ locked: !state.locked })),
  }));

const chatLocks: {
  [key: string]: ReturnType<typeof createChatLockStore>;
} = {};

const useSpecificChatLockStore = (chatId: string) => {
  if (!chatLocks[chatId]) {
    chatLocks[chatId] = createChatLockStore();
  }

  return chatLocks[chatId]();
};

export { useSpecificChatLockStore };
