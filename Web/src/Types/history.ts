import { Message } from "@/store/recommendationStore";

export type History = {
  id: string;
  user_id: string;
  updated_at: string | null;
  chat_history: Message[];
  created_at: string;
};
