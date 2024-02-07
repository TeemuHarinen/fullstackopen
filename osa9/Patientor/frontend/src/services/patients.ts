import axios from "axios";
import { Patient, PatientFormValues, Diagnose, Entry, NewEntry } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(
    `${apiBaseUrl}/patients`
  );

  return data;
};

const getOne = async (id: string) => {
  const { data } = await axios.get<Patient>(
    `${apiBaseUrl}/patients/${id}`
  );
  if (data) {
    return data;
  }
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(
    `${apiBaseUrl}/patients`,
    object
  );

  return data;
};

const addEntry = async (id: string, object: NewEntry) => {
  const { data } = await axios.post<NewEntry>(
    `${apiBaseUrl}/patients/${id}/entries`,
    object
  );

  return data;
};

const getDiagnoses = async () => {
  const { data } = await axios.get<Diagnose[]>(
    `${apiBaseUrl}/diagnoses`
  );
  return data;
};

export default {
  getAll, create, getOne, getDiagnoses, addEntry
};

