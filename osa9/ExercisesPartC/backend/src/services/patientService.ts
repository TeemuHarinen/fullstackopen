import patientData from '../../data/patientData';
import { PatientWithoutSSN } from '../types/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const patients: PatientWithoutSSN[] = patientData.map(({ ssn, ...patientWithoutSSN }) => patientWithoutSSN);

const getEntries = (): PatientWithoutSSN[] => {
  return patients;
};

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  addEntry
};
