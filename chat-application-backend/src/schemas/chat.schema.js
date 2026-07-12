import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export const Chat = mongoose.model('Chat', chatSchema);
