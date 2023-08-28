import { useState, useEffect } from 'react'
import dataService from './services/dataHandler'
import axios from 'axios'


const Filter = ({filterName, handleFilterChange}) => {
  return (
    <p>Find countries <input value={filterName} onChange={handleFilterChange}></input></p>
  )
}

const Countries = ({countriesToShow, countries, setCountriesToShow, setTemp, temp, setWind, wind, setIcon, icon}) => {
  
  if (countriesToShow.length > 10) {
    return 'Too many matches, specify another filter'

  } else if (countriesToShow.length <= 10 && countriesToShow.length > 1) {
    return (<>{countriesToShow.map(country => <li key={country}> {country} <button onClick={() => setCountriesToShow([country])}>show</button></li>)}</>)

  } else if (countriesToShow.length === 1) {

      const nameToFind = countriesToShow[0]
      const country = countries.filter(country => country.name.common === nameToFind)
      const c = country[0]
      const languages = Object.values(c.languages)
      const flag = c.flags.png
      const api_key = process.env.REACT_APP_API_KEY
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${c.capital}&appid=${api_key}`

      axios
        .get(url)
        .then(response => {
          const temp = response.data.main.temp-273.15
          setTemp(Math.round(temp*100)/100)
          const wind = response.data.wind.speed
          setWind(wind)
          const iconUrl = response.data.weather[0].icon
          setIcon(`https://openweathermap.org/img/wn/${iconUrl}@2x.png`)
        })
      
      return (
        <>
          <h1> {c.name.common} </h1>
          <p>capital {c.capital} </p>
          <p>area {c.area}</p>
          <h2> languages </h2>
          <ul>
            {languages.map(language => <li key={language}> {language} </li>)}
          </ul>
          <img src={flag} alt="country-flag"></img>
          <h2> Weather in {c.capital}</h2>
          <p>temperature {temp} Celcius</p>
          <img src={icon} alt="weather-icon"></img>
          <p>wind {wind} m/s</p>
        </>
      )
}
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [filterName, setFilterName] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])
  const [temp, setTemp] = useState(null)
  const [wind, setWind] = useState(null)
  const [icon, setIcon] = useState(null)

  const hook = () => {
    dataService
      .getAll()
      .then(data => {
        setCountries(data)
      })
  }
  useEffect(hook, [])

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
    const countryNames = countries.map(country => country.name.common)
    const tempCountries = countryNames.filter(country => country.toLowerCase().includes(event.target.value.toLowerCase()))
    setCountriesToShow(tempCountries)
  }

  return (
    <div>
      <h2>Find countries</h2>
      <Filter filterName={filterName} handleFilterChange={handleFilterChange}></Filter>
      <Countries countriesToShow={countriesToShow} countries={countries} setCountriesToShow={setCountriesToShow}
       setTemp={setTemp} temp={temp} wind={wind} setWind={setWind} setIcon={setIcon} icon={icon} ></Countries>
      
    </div>
  )
}

export default App
