import mongoose, { Schema, Document } from 'mongoose'

export interface IInventory extends Document {
  itemName: string
  quantity: number
  lastUpdated: Date
}

const InventorySchema: Schema = new Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: Number, required: true },
    lastUpdated: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Enable timestamps for createdAt and updatedAt fields
  }
)

export default mongoose.model<IInventory>('Inventory', InventorySchema)
