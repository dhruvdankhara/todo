import { Schema, model } from "mongoose";

const todoSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Todo = model("Todo", todoSchema);

export default Todo;
