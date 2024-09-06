import mongoose, { Schema, Document } from 'mongoose'
import { parseDDMMYY } from '../common/commonfunc' // Adjust the path as needed

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

// Pre-save hook to parse `homeCareDate` from ddmmyy format
PatientSchema.pre('save', function (next) {
  if (typeof this.homeCareDate === 'string') {
    this.homeCareDate = parseDDMMYY(this.homeCareDate as string)
  }
  next()
})

export default mongoose.model<IPatient>('Patient', PatientSchema)
