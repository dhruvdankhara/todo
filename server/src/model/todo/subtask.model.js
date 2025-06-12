import { Schema, model } from "mongoose";

const subtaskSchema = new Schema(
  {
    parentTodo: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true,
        },
        originalName: {
          type: String,
          required: true,
        },
        path: {
          type: String,
          required: true,
        },
        size: {
          type: Number,
          required: true,
        },
        mimetype: {
          type: String,
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    links: [
      {
        title: {
          type: String,
          trim: true,
        },
        url: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          trim: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const SubTask = model("SubTask", subtaskSchema);

export default SubTask;
