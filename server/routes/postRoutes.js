import express from 'express'
import {
  createPost,
  getPosts,
  getPostById,
  toggleLike,
  toggleSave,
  addComment,
} from '../controllers/postController.js'
import protect from '../middleware/auth.js'
import upload from '../utils/multerConfig.js'

const router = express.Router()

router.route('/').get(getPosts).post(protect, upload.single('image'), createPost)
router.route('/:id').get(getPostById)
router.patch('/:id/like', protect, toggleLike)
router.patch('/:id/save', protect, toggleSave)
router.post('/:id/comment', protect, addComment)

export default router
