import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json(user)
}

const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const { name, bio, image, email, password } = req.body
  user.name = name || user.name
  user.bio = bio || user.bio
  user.image = image || user.image
  user.email = email || user.email

  if (password) {
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
  }

  const updatedUser = await user.save()
  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    image: updatedUser.image,
    bio: updatedUser.bio,
  })
}

export { getUserProfile, updateUserProfile }
