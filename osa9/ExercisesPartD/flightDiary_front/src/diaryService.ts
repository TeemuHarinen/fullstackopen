import axios from 'axios';
import { Entry, NewEntry } from './types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getEntries = async () => {
  return axios
  .get<Entry[]>(baseUrl)
  .then(response => response.data);
}

export const addEntry = async (newEntry: NewEntry) => {
  try {
    const response = await axios.post<Entry>(baseUrl, newEntry);
    return response.data;
  } catch (error) {
    console.error('Error adding entry:', error);
    throw error;
  }
};