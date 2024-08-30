import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  isAdmin: boolean
  matchPassword: (enteredPassword: string) => Promise<boolean>
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Method to match the entered password with the hashed password
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Pre-save middleware to hash the password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  // Explicitly cast this.password to string
  this.password = await bcrypt.hash(this.password as string, salt)
  next() // Don't forget to call next() to proceed with the save operation
})

const User = mongoose.model<IUser>('User', UserSchema)
export default User
