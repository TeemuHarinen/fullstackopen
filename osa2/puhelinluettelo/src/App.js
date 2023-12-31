import { useState, useEffect } from 'react'
import phoneService from './services/dataHandler'


const Filter = ({filterName, handleFilterChange}) => {
  return (
    <p>Filter phonebook <input value={filterName} onChange={handleFilterChange}></input></p>
  )
}

const PersonFrom = ({addPerson, newName, handleTextChange, newNumber, handleNumberChange}) => {
  return (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={newName} onChange={handleTextChange}/>
     </div>
     <div>
      number: <input value={newNumber} onChange={handleNumberChange}/>
     </div>
     <div>
       <button type="submit">add</button>
     </div>
   </form>
)
}

const Persons = ({personsToShow, deletePerson}) => {
  return (
    <>
      <ul>
        {personsToShow.map(person => <li key={person.name} className='personItem'> {person.name} {person.number} <button onClick={() => deletePerson(person.id)}> delete </button> </li>)}
      </ul>
    </>
  )
}

const Notification = ({ message, isError }) => {
  if (message === null) {return null}

  const errorType = isError ? 'errorMessage' : 'successMessage'
  return (
    <div className={errorType}>
      {message}
    </div>
  )
}


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showFilter, setShowFilter] = useState(true)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    phoneService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }
  useEffect(hook, [])
  
  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '') {
      alert('Please enter a name')
    } else {

    const personObject = {
      name: newName,
      number: newNumber
    }
    
    const newPerson = persons.find(person => person.name === newName)
    if (newPerson) {
      if (window.confirm(`${newName} already added to phonebook, want to replace it with a new one?`))
      {
        const updatedPerson = {...newPerson, number: newNumber}

        phoneService
        .update(newPerson.id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== newPerson.id ? person : updatedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`${updatedPerson.name} number changed to ${updatedPerson.number} in the phonebook`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(() => {
          setErrorMessage(`${updatedPerson.name} has been removed already!`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        }
        )
      }
    } else {
      phoneService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccessMessage(`${newName} added to phonebook`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
    })
    }
  }
}
  
  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)

    if (window.confirm(`Are you sure you want to delete ${person.name}`))
    {
    phoneService
    .remove(person.id)
    .then(returnedPerson => {
      setPersons(persons.filter(person => person.id !== id))
      setSuccessMessage(`${person.name} removed from phonebook`)
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
    })
    .catch(error => {
      alert(`the data '${person.name}' was already deleted!`)
      setPersons(persons.filter(person => person.id !== id)) // if data is wiped locally or otherwise not matching the server's data
    })
    } 
  }

  const handleTextChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilterName(event.target.value)
  }

  const personsToShow = showFilter
    ? persons.filter(person => person.name.toLowerCase().includes(filterName.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={successMessage} isError={false} />
      <Notification message={errorMessage} isError={true} />

      <Filter filterName={filterName} handleFilterChange={handleFilterChange}></Filter>

      <h2> Add new person </h2>
      
      <PersonFrom addPerson={addPerson} newName={newName} handleTextChange={handleTextChange}
       newNumber={newNumber} handleNumberChange={handleNumberChange} ></PersonFrom>

      <h2>Numbers</h2>
      <Persons person={persons} personsToShow={personsToShow} deletePerson={deletePerson}></Persons>
    </div>
  )
}

export default App
