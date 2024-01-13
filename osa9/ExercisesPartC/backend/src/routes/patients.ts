/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry
 from '../utils/utils';
const router = express.Router();

router.get('/', (_req, res) => {
  console.log('patients fetched');
  res.send(patientService.getEntries());
});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);
    const addedEntry = patientService.addEntry(newPatientEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;