import express from 'express';
import { addNewChat, fetchChatHistory } from '../controlers/chat.controller.js';

const router = express.Router();

router.get('/messages', fetchChatHistory);
router.get('/chats/history', fetchChatHistory);
router.post('/messages', addNewChat);

export default router;
