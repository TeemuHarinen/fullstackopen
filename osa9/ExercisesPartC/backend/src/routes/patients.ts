import express from 'express';
import patientService from '../services/patientService';

const router = express.Router();

router.get('/', (_req, res) => {
  console.log('patients fetched');
  res.send(patientService.getEntries());
});

router.post('/', (_req, res) => {
  console.log('saving a patient');
  res.send('saving a patient');
});

export default router;