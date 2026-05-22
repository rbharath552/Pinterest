import { Readable } from 'stream'
import Post from '../models/Post.js'
import User from '../models/User.js'
import cloudinary from '../config/cloudinary.js'

const createPost = async (req, res) => {
  const { title, about, destination, category } = req.body
  const file = req.file

  if (!title || !about || !category || !file) {
    return res.status(400).json({ message: 'Please provide all required fields' })
  }

  const streamUpload = (reqFile) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pinterest-clone' },
        (error, result) => {
          if (result) resolve(result)
          else reject(error)
        }
      )

      if (reqFile.buffer) {
        Readable.from(reqFile.buffer).pipe(stream)
      } else if (reqFile.stream) {
        reqFile.stream.pipe(stream)
      } else {
        reject(new Error('No upload buffer available'))
      }
    })
  }

  const result = await streamUpload(file)

  const post = await Post.create({
    title,
    about,
    destination,
    category,
    image: {
      url: result.secure_url,
      public_id: result.public_id,
    },
    postedBy: req.user._id,
  })

  res.status(201).json(post)
}

const getPosts = async (req, res) => {
  const { search, category, user: userFilter, page = 1, limit = 12 } = req.query
  const query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { about: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ]
  }

  if (category) {
    query.category = category
  }

  if (userFilter) {
    query.postedBy = userFilter
  }

  const skip = (Number(page) - 1) * Number(limit)

  const posts = await Post.find(query)
    .populate('postedBy', 'name image')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))

  const total = await Post.countDocuments(query)

  res.json({ posts, total })
}

const getPostById = async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('postedBy', 'name image')
    .populate('comments.postedBy', 'name image')

  if (!post) {
    return res.status(404).json({ message: 'Post not found' })
  }

  res.json(post)
}

const toggleLike = async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const hasLiked = post.likes.some((id) => id.toString() === req.user._id.toString())
  if (hasLiked) {
    post.likes = post.likes.filter((id) => id.toString() !== req.user._id.toString())
  } else {
    post.likes.push(req.user._id)
  }

  await post.save()
  res.json(post)
}

const toggleSave = async (req, res) => {
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  const saved = post.savedBy.some((id) => id.toString() === req.user._id.toString())
  if (saved) {
    post.savedBy = post.savedBy.filter((id) => id.toString() !== req.user._id.toString())
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== post._id.toString())
  } else {
    post.savedBy.push(req.user._id)
    if (!user.savedPosts.some((id) => id.toString() === post._id.toString())) {
      user.savedPosts.push(post._id)
    }
  }

  await post.save()
  await user.save()
  res.json(post)
}

const addComment = async (req, res) => {
  const { text } = req.body
  const post = await Post.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Post not found' })

  const comment = {
    text,
    postedBy: req.user._id,
  }

  post.comments.push(comment)
  await post.save()

  const populatedPost = await Post.findById(req.params.id).populate('comments.postedBy', 'name image')
  res.status(201).json(populatedPost)
}

export { createPost, getPosts, getPostById, toggleLike, toggleSave, addComment }
