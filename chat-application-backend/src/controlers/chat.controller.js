import { createChatMessage, getChatHistory } from '../services/chat.service.js';

export async function fetchChatHistory(req, res) {
  try {
    const messages = await getChatHistory();
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Failed to fetch chat history:', error.message);
    return res.status(500).json({ error: 'Failed to fetch chat history' });
  }
}




export async function addNewChat(req, res) {
  try {
    const { sender, text, time } = req.body;

    if (!sender || !text) {
      return res.status(400).json({ error: 'sender and text are required' });
    }

    const message = await createChatMessage({ sender, text, time });
    return res.status(201).json({ message });
  } catch (error) {
    console.error('Failed to create chat:', error.message);
    return res.status(500).json({ error: 'Failed to create chat' });
  }
}
