import express, { Request, Response } from 'express'
import connectDB from './database'
import cors from 'cors'
import dotenv from 'dotenv'
import patientRoutes from './routes/PatientRoutes'
import inventoryRoutes from './routes/InventoryRoutes'
import authRoutes from './routes/authRoutes'
import loginRoute from './routes/loginRoute' 
dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Enable CORS
app.use(cors)
// Middleware to parse JSON requests
app.use(express.json())

// Patient routes
app.use('/api/patients', patientRoutes)

// Inventory routes
app.use('/api/inventory', inventoryRoutes)

// Basic route to check if the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Palliative Care Homecare API')
})

app.use('/api/auth', authRoutes)
app.use('/api/auth', loginRoute)

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
