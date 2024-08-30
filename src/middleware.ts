import jwt from 'jsonwebtoken'
import { AuthenticatedRequest } from './types'
import { Response, NextFunction } from 'express'
import User from './models/user'

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret')

      const user = await User.findById(decoded.user.id).select('-password')

      if (!user) {
        return res
          .status(401)
          .json({ message: 'Not authorized, user not found' })
      }

      req.user = user
      next()
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' })
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' })
  }
}
