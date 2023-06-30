import { useState } from 'react'


const Header = (props) => {
  return (
    <h1>{props.text}</h1>
  )
}

const Statistics = (props) => {
  if (props.total !== 0) {
    return (
      <div>
        <table>
          <tbody>
            <StatisticLine text="good" value={props.good}/>
            <StatisticLine text="neutral" value={props.neutral}/>
            <StatisticLine text="bad" value={props.bad}/>
            <StatisticLine text="total" value={props.total}/>
            <StatisticLine text="average" value={props.average}/>
            <StatisticLine text="positive" value={props.positive} symbol="%"/>
          </tbody>
        </table>
      </div>
  )
}
return (<p>no feedback given</p>)
}

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}> {text} </button>
)
}

const StatisticLine = (props) => {
  return ( 
    <tr>
      <td>{props.text}</td> 
      <td>{props.value} {props.symbol}</td>
    </tr>
)
}

const App = () => {
  // tallenna napit omaan tilaansa
  const headerFeedback = 'give feedback'
  const headerStatistics = 'statistics'

  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [avgGood, setAvgPositive] = useState(0)
  
  const HandleGood = () => {
    const newGood = good+1
    setGood(newGood)

    const newTotal = newGood + neutral + bad
    setTotal(newTotal)

    const newAverage = (newGood-bad)/newTotal
    setAverage(newAverage)

    const newAvgGood = newGood/newTotal*100
    setAvgPositive(newAvgGood)
  }

  const HandleBad = () => {
    const newBad = bad+1
    setBad(newBad)

    const newTotal = good + neutral + newBad
    setTotal(newTotal)

    const newAverage = (good-newBad)/newTotal
    setAverage(newAverage)

    const newAvgGood = good/newTotal*100
    setAvgPositive(newAvgGood)
  }

  const HandleNeutral = () => {
    const newNeutral = neutral+1
    setNeutral(newNeutral)

    const newTotal = good + newNeutral + bad
    setTotal(newTotal)

    const newAverage = (good-bad)/newTotal
    setAverage(newAverage)

    const newAvgGood = good/newTotal*100
    setAvgPositive(newAvgGood)
  }

  return (
    <div>
      <Header text={headerFeedback}/>
      <Button handleClick={HandleGood} text="good"> </Button>
      <Button handleClick={HandleNeutral} text="neutral"> </Button>
      <Button handleClick={HandleBad} text="bad" > </Button>
      <Header text={headerStatistics} />
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={avgGood}/>
    </div>
  )
}

export default App
