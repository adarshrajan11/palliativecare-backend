import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI ||
        'mongodb+srv://Palliative:JCzQZDMOKdMxKFOs@cluster0.1utt8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`)
    } else {
      console.error('An unexpected error occurred')
    }
    process.exit(1)
  }
}

export default connectDB
