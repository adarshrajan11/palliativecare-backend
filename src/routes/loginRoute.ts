import express, { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

const router = express.Router()

// Login Route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    try {
      // Find user by email
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      // Check if the password matches
      const isMatch = await user.matchPassword(password)

      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' })
      }

      // Generate JWT token
      const payload = {
        user: {
          id: user.id,
          isAdmin: user.isAdmin,
        },
      }

      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
        expiresIn: '1h',
      })

      res.status(200).json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

export default router
