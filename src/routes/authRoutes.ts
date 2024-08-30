import express, { Request, Response, NextFunction } from 'express'
import User from '../models/user'
import { check, validationResult } from 'express-validator'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password } = req.body

    try {
      // Check if user already exists
      let user = await User.findOne({ email })

      if (user) {
        return res.status(400).json({ message: 'User already exists' })
      }

      // Create new user
      user = new User({
        name,
        email,
        password,
      })

      await user.save()

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

      res.status(201).json({ token })
    } catch (error) {
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

export default router
