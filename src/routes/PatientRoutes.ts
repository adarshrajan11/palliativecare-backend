import { Router, Request, Response } from 'express'
import Patient from '../models/Patient'
import { check, validationResult } from 'express-validator'

const router = Router()

// @route   POST /api/patients
// @desc    Add a new patient
router.post(
  '/',
  [
    check('name', 'Name is Required').not().isEmpty(),
    check('age', 'Age is Required').isInt({ min: 0 }),
    check('address', 'Address is required').not().isEmpty(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const newPatient = new Patient(req.body)
      const patient = await newPatient.save()
      res.status(201).json(patient)
    } catch (error) {
      res.status(500).json({ message: 'Server error', error })
    }
  }
)

// @route   GET /api/patients
// @desc    Get all patients
router.get('/', async (req: Request, res: Response) => {
  try {
    const patients = await Patient.find()
    res.status(200).json(patients)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// @route   GET /api/patients/:id
// @desc    Get a patient by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(200).json(patient)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// @route   PUT /api/patients/:id
// @desc    Update a patient by ID
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(200).json(patient)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

// @route   DELETE /api/patients/:id
// @desc    Delete a patient by ID
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id)
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' })
    }
    res.status(200).json({ message: 'Patient removed' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error })
  }
})

export default router
