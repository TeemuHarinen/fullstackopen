export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export type Diagnose = {
  code: string;
  name: string;
  latin?: string;
};

export type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: Gender;
  occupation: string;
  ssn: string;
};

export type PatientWithoutSSN = Omit<Patient, 'ssn'>;
export type NewPatientEntry = Omit<Patient, 'id'>;

