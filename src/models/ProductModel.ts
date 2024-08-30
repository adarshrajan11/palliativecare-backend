import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  inventoryId:string
  name: string
  age: number
  address: string
  phone: string
  condition: string
  homeCareDate: Date
}
