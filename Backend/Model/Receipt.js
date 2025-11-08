import mongoose from "mongoose";

const receiptSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  name: String,
  email: String,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("Receipt", receiptSchema);
