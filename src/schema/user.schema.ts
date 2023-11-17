/* eslint-disable prettier/prettier */
// user.schema.ts
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  phone: { type: String, required: false },
  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    zipCode: { type: String, required: false }
  },
  favoriteDishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dish' }],
  createdAt: { type: Date, default: Date.now }
});