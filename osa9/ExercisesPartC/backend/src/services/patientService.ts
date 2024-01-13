import patientData from '../../data/patientData';
import { PatientWithoutSSN, Patient, NewPatientEntry } from '../types/types';
import { v1 as uuid } from 'uuid';

const fullPatients = patientData;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const patients: PatientWithoutSSN[] = fullPatients.map(({ ssn, ...patientWithoutSSN }) => patientWithoutSSN);

const getEntries = (): PatientWithoutSSN[] => {
  return patients;
};

const addEntry = ( entry: NewPatientEntry ): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  fullPatients.push(newPatientEntry);
  console.log(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  addEntry
};
