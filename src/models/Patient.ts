import mongoose, { Schema, Document } from 'mongoose'

export interface IPatient extends Document {
  name: string
  age: number
  address: string
  phone: string
  condition: string
  homeCareDate: Date
}

const PatientSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  condition: { type: String, required: true },
  homeCareDate: { type: Date, required: true },
})

export default mongoose.model<IPatient>('Patient', PatientSchema)
