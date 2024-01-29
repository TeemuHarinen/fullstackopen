import { useState, useEffect } from "react"
import { getEntries, addEntry } from "./diaryService"
import { Entry } from "./types"
import axios from "axios"

const Form = ({
  setEntries,
}: {
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>
}) => {
  const [date, setDate] = useState("")
  const [weather, setWeather] = useState("")
  const [visibility, setVisibility] = useState("")
  const [comment, setComment] = useState("")
  const [error, setError] = useState("")

  console.log(weather)

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    const newEntry = {
      date: date,
      weather: weather,
      visibility: visibility,
      comment: comment,
    }

    addEntry(newEntry)
      .then((data) => {
        console.log(data)
        setEntries((entries: Entry[]) => entries.concat(data))
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data)
        }
      })

    setDate("")
    setComment("")
  }

  return (
    <div>
      <h3>Flight diary</h3>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <br />
        <label>Weather</label>

        <input
          type="radio"
          id="sunny"
          name="weather"
          value="sunny"
          onChange={(e) => setWeather(e.target.value)}
        />
        <label htmlFor="sunny">sunny</label>
        <input
          type="radio"
          id="rainy"
          name="weather"
          value="rainy"
          onChange={(e) => setWeather(e.target.value)}
        />
        <label htmlFor="rainy">rainy</label>
        <input
          type="radio"
          id="cloudy"
          name="weather"
          value="cloudy"
          onChange={(e) => setWeather(e.target.value)}
        />
        <label htmlFor="cloudy">cloudy</label>
        <input
          type="radio"
          id="stormy"
          name="weather"
          value="stormy"
          onChange={(e) => setWeather(e.target.value)}
        />
        <label htmlFor="stormy">stormy</label>
        <input
          type="radio"
          id="windy"
          name="weather"
          value="windy"
          onChange={(e) => setWeather(e.target.value)}
        />
        <label htmlFor="windy">windy</label>
        <br />
    

        <label>Visibility</label>

        <input
          type="radio"
          id="great"
          name="visibility"
          value="great"
          onChange={(e) => setVisibility(e.target.value)}
        />
        <label htmlFor="great">great</label>

        <input
          type="radio"
          id="good"
          name="visibility"
          value="good"
          onChange={(e) => setVisibility(e.target.value)}
        />
        <label htmlFor="good">good</label>

        <input
          type="radio"
          id="ok"
          name="visibility"
          value="ok"
          onChange={(e) => setVisibility(e.target.value)}
        />
        <label htmlFor="ok">ok</label>

        <input
          type="radio"
          id="poor"
          name="visibility"
          value="poor"
          onChange={(e) => setVisibility(e.target.value)}
        />
        <label htmlFor="poor">poor</label>
        <br />
        <label htmlFor="comment">Comment</label>
        <input
          type="text"
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}

const Entries = ({ entries }: { entries: Entry[] }) => {
  return (
    <div>
      <h3>Flight diaries</h3>
      <ul>
        {entries.map((entry) => (
          <div key={entry.id}>
            <h3> {entry.date}</h3>
            <p>visibility: {entry.visibility}</p>
            <p>weather: {entry.weather}</p>
            <p>comment: {entry.comment}</p>
          </div>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    getEntries().then((data) => {
      console.log(data)
      setEntries(data)
    })
  }, [])

  return (
    <div className="App">
      <Form setEntries={setEntries}></Form>
      <Entries entries={entries} />
    </div>
  )
}

export default App
