import { getMoodleUrl } from "@/utils/moodle";

const deleteChat = async (chatId: string) => {
    // if (!import.meta.env.PROD) return;

    console.log(`Deleting chat with id: ${chatId}`);

    const url = getMoodleUrl() + `?conversationId=${chatId}`;

    console.log(`Sending delete request to ${url}`);

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete chat");
    }

    console.log("Chat deleted successfully");
}

export default deleteChat;