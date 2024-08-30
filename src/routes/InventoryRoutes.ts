import { Router, Request, Response } from 'express'
import Inventory from '../models/InventoryModel'
import { check, validationResult } from 'express-validator'
const router = Router()

// Add Item to the Inventory

router.post(
  '/',
  [
    check('itemName', 'Item name is required').not().isEmpty(),
    check('quantity', 'Quantity must be a positive number').isInt({ min: 0 }),
    // check('itemId', 'item id required').isInt({ min: 0 }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const { itemName, quantity, itemId } = req.body

      // Check if an item with the same name already exists
      const existingItem = await Inventory.findOne({ _id: itemId })

      if (existingItem) {
        // If the item exists, increment the quantity
        existingItem.quantity += quantity
        const updatedItem = await existingItem.save()
        return res.status(200).json(updatedItem)
      } else {
        // If the item doesn't exist, create a new one
        const newItem = new Inventory(req.body)
        const item = await newItem.save()
        return res.status(201).json(item)
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Error creating or updating item', error })
    }
  }
)

// Get all items from the inventory

router.get('/', async (req: Request, res: Response) => {
  try {
    const items = await Inventory.find()
    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error })
  }
})

// @route   GET /api/inventory/:id
// @desc    Get an inventory item by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// @route   PUT /api/inventory/:id
// @desc    Update an inventory item by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// @route   DELETE /api/inventory/:id
// @desc    Delete an inventory item by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Item not found' })
    }
    res.status(200).json({ message: 'Item removed' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
