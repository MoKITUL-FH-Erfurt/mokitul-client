import { Message } from "./message";

type Chat = {
  id: string;
  messages: Message[];
  timestamp: number;
  summary: string;
};

export type { Chat }; // Add this line to export the Chat type
