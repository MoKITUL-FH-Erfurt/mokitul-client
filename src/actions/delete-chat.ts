import { getMoodleUrl } from "@/utils/moodle";

const deleteChat = async (chatId: string) => {
  // if (!import.meta.env.PROD) return;

  const url = getMoodleUrl() + `?conversationId=${chatId}`;

  const response = await fetch(url, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete chat");
  }
};

export default deleteChat;
