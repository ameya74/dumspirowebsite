/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';

export const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish', required: false },
  rating: { type: Number, required: true },
  comment: { type: String, required: false },
  createdAt: { type: Date, default: Date.now }
});