import express from 'express'
import { getUserProfile, updateUserProfile } from '../controllers/userController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.route('/:id').get(getUserProfile).patch(protect, updateUserProfile)

export default router
