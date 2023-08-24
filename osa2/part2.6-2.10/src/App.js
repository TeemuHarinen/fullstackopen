import { useState } from 'react'

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

const Persons = ({person, personsToShow}) => {
  return (
  <ul>
      {personsToShow.map(person => <li key={person.name}> {person.name} {person.number}</li>)}
  </ul>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setFilterName] = useState('')
  const [showFilter, setShowFilter] = useState(true)


  
  const addPerson = (event) => {
    event.preventDefault()
    if (newName === '') {
      alert('Please enter a name')
    } else {
      
    const personObject = {
      name: newName,
      number: newNumber
    }
  
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} already added to phonebook`)
    } else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
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

      <Filter filterName={filterName} handleFilterChange={handleFilterChange}></Filter>

      <h2> Add new person </h2>
      
      <PersonFrom addPerson={addPerson} newName={newName} handleTextChange={handleTextChange}
       newNumber={newNumber} handleNumberChange={handleNumberChange} ></PersonFrom>

      <h2>Numbers</h2>
      <Persons person={persons} personsToShow={personsToShow}></Persons>
    </div>
  )

}

export default App

