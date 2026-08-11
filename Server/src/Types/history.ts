export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type Messages = Message[];
