import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new Schema([{
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "post",
    required: true,
  }, 
  conversation: {
    type: String,
  },
  likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user' 
    }], 
  reply: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: "reply",
  }]
}
 
],
   {timestamps: true}
);

export default mongoose.models.comment || mongoose.model("comment", commentSchema);
