import { Chat } from '../schemas/chat.schema.js';


export async function getChatHistory() {
  const messages = await Chat.find({}).sort({ time: 1, createdAt: 1 }).lean();

  return messages.map((message) => ({
    id: message._id.toString(),
    sender: message.sender,
    text: message.text,
    time: message.time ? message.time.toISOString() : new Date().toISOString(),
  }));
}






export async function createChatMessage(payload) {
  const message = await Chat.create({
    sender: payload.sender,
    text: payload.text,
    time: payload.time ? new Date(payload.time) : new Date(),
  });

  return {
    id: message._id.toString(),
    sender: message.sender,
    text: message.text,
    time: message.time.toISOString(),
  };
}
