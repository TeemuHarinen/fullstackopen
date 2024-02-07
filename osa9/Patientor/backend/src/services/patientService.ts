import fullPatients from '../../data/patientData';
import { patientsFull } from '../../data/patientData';
import { PatientWithoutSSN, Patient, NewPatientEntry, Entry, NewEntry } from '../types/types';
import { v1 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const patients: PatientWithoutSSN[] = fullPatients.map(({ ssn, ...patientWithoutSSN }) => patientWithoutSSN);

const getEntries = (): PatientWithoutSSN[] => {
  return patients;
};

const getPatient = ( id: string ): Patient | undefined => {
  const patient = patientsFull.find( p => p.id === id );
  return patient;
};

const addEntry = ( entry: NewPatientEntry ): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  
  patients.push(newPatientEntry);
  patientsFull.push(newPatientEntry);
  return newPatientEntry;
};

const addEntryToPatient = (id: string, entry: NewEntry): Entry => {
  const patient = patientsFull.find(p => p.id === id);
  
  if (!patient) {
    throw new Error(`Patient with id ${id} not found`);
  }

  const newEntry = {
    id: uuid(),
    ...entry
  };

  patient.entries.push(newEntry);

  return newEntry;
};

export default {
  getEntries,
  getPatient,
  addEntry,
  addEntryToPatient
};
