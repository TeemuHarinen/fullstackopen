import { useState, useEffect } from 'react'
import axios from 'axios'

interface Entry {
  date: string
  weather: string
  wind: string
  temperature: string
  duration: string
  description: string
  location: string
}

function App() {

  const [entries, setEntries] = useState<Entry[]>([])

  const getEntries = async () => {
    axios.get<Entry[]>('http://localhost:3001/api/diaries').then((response) => {
      console.log(response.data)
      setEntries(response.data)
    })

  }

  useEffect(() => {
    getEntries()
  }, [])


  return (
    <div>
      <h3>Flight diaries</h3>
      <ul>
        {entries.map((entry) => (
          <li key={entry.date}>{entry.date}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
