import diagnoseData from '../../data/diagnoseData';
import { Diagnose } from '../types/types';

const diagnoses: Diagnose[] = diagnoseData;

const getEntries = (): Diagnose[] => {
  return diagnoses;
};

export default {
  getEntries
};
