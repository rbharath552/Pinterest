import mongoose from 'mongoose'

const commentSchema = mongoose.Schema(
  {
    text: { type: String, required: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const postSchema = mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    about: { type: String, required: true, trim: true },
    destination: { type: String, default: '' },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    category: { type: String, required: true, trim: true },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
)

const Post = mongoose.model('Post', postSchema)
export default Post
