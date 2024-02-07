import patientService from "../../services/patients";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Diagnosis, Entry, EntryWithoutId } from "../../types";
import '/src/patientPage.css';
import { Icon } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WorkIcon from '@mui/icons-material/Work';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import React from "react";


const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const EntryForm = () => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const patientId = useParams<{ id: string }>().id;
  
  let codes: string[] = [];
  if (diagnosisCodes) {
    // separate the codes by comma and remove any whitespace
    codes = diagnosisCodes.split(",").map((code) => code.trim());
  }

  const handleSubmission = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const entry: EntryWithoutId = {
      type: "HealthCheck",
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes: codes,
    };

    console.log("Submitting", patientId, entry);
    try {
      if (patientId === undefined) {
        throw new Error("patient id is undefined");
      }
    
      const newEntry = await patientService.addEntry(patientId, entry);
      console.log(newEntry);
    } catch (e) {
      console.error(e.response.data);
    }
  };

  return (
    <div>
      <h2>add new healthcheck entry</h2>
      <form onSubmit={handleSubmission}>
        <div>
          <label>description</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label>specialist</label>
          <input type="text" value={specialist} onChange={(e) => setSpecialist(e.target.value)} />
        </div>
        <div>
          <label>health check rating</label>
          <input type="number" value={healthCheckRating} onChange={(e) => setHealthCheckRating(Number(e.target.value))} />
        </div>
        <div>
          <label>diagnosis codes</label>
          <input type="text" value={diagnosisCodes} onChange={(e) => setDiagnosisCodes(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
  console.log(entry);
  switch (entry.type) {
    case "HealthCheck":
      const color = entry.healthCheckRating === 0 ? "green" : entry.healthCheckRating === 1 ? "yellow" : entry.healthCheckRating === 2 ? "orange" : "red";
      return (
        <div className="entry-container">
          <p>{entry.date}<Icon><MonitorHeartIcon/></Icon></p>
          <p>{entry.description}</p>
          <Icon><FavoriteIcon style={{ color: color }} /></Icon>
          <p>diagnose by: {entry.specialist} </p>
        </div>
      );
    case "Hospital":
      return (
        <div>
          <p>{entry.date} <Icon><MedicalServicesIcon/></Icon></p>
          <p>{entry.description}</p>
          <p>discharge: {entry.discharge.date} {entry.discharge.criteria}</p>
          <p>diagnose by: {entry.specialist}</p>
        </div>
      );
    case "OccupationalHealthcare":
      return (
        <div>
          <p>{entry.date} <Icon><WorkIcon /></Icon></p> 
          <p>{entry.description}</p>
          <p>employer name: {entry.employerName}</p>
          <p>{entry.sickLeave && "sick leave: " + entry.sickLeave.startDate + " - " + entry.sickLeave.endDate}</p>
          <p>diagnose by: {entry.specialist}</p>
        </div>
      );
    default:
      return assertNever(entry);
  }
};

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string | undefined }>();
  //const [diagnoses, setDiagnoses] = useState<Diagnose[]>([]);
  const [patient, setPatient] = useState<Patient>();
  
  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        const fetchedPatient = await patientService.getOne(id);
        setPatient(fetchedPatient);
      }
    };
    fetchPatient();
    /*const fetchDiagnoses = async () => {
      const diagnoses = await patientService.getDiagnoses();
      setDiagnoses(diagnoses);
    };
    fetchDiagnoses();*/
  }, [id]);


  if (!patient) {
    return null;
  }

  
  return (
    <>
    <div className="patient-info">
      <h1>{patient.name}</h1>
      <p>gender: {patient.gender}</p>
      <p>ssn: {patient.ssn}</p>
      <p>occupation: {patient.occupation}</p>
    </div>
    <div className="add-entry-form">
      <EntryForm />
    </div>
    <div className="patient-entries">
      <h2>entries</h2>
      {patient.entries.map((entry) => (
        <React.Fragment key={entry.id}>
        <div className="entry-container">
          <EntryDetails entry={entry} />
        </div>
        <br/>
        </React.Fragment>
      ))}
    </div>
    </>
  );
};

export default PatientInfoPage;

/*
<ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>{code} {diagnoses.map(diagnose => diagnose.code === code ? diagnose.name: null )}</li>
            ))}
          </ul>
*/