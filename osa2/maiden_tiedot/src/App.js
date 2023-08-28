import { useState, useEffect } from 'react'
import dataService from './services/dataHandler'


const Filter = ({filterName, handleFilterChange}) => {
  return (
    <p>Find countries <input value={filterName} onChange={handleFilterChange}></input></p>
  )
}

const Countries = ({countriesToShow, countries, setCountriesToShow}) => {
  
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
        </>
      )
}
}

const App = () => {

  const [countries, setCountries] = useState([])
  const [filterName, setFilterName] = useState('')
  const [countriesToShow, setCountriesToShow] = useState([])

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
      <Countries countriesToShow={countriesToShow} countries={countries} setCountriesToShow={setCountriesToShow}> </Countries>
      
    </div>
  )
}

export default App
