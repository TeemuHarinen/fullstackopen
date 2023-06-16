

const Header = (props) => {
  return (
    <>
      <h1>{props.text}</h1>
    </>
  )
}

const Part1 = (props) => {
  return (
    <p> {props.part1} {props.exercises1} </p>
)
}

const Part2 = (props) => {
  return (
    <p> {props.part2} {props.exercises2} </p>
)
}

const Part3 = (props) => {
  return (
    <p> {props.part3} {props.exercises3} </p>
)
}


const Content = (props) => {
  console.log(props.parts[0].name)
  return (
    <>
      <Part1 part1={props.parts[0].name} exercises1={props.parts[0].exercises}/>
      <Part2 part2={props.parts[1].name} exercises2={props.parts[1].exercises}/>
      <Part3 part3={props.parts[2].name} exercises3={props.parts[2].exercises}/>
    </>
  )
}

const Total = (props) => {
  return (
    <>
      <p> Number of exercises {props.exercises[0].exercises + 
          props.exercises[1].exercises + props.exercises[2].exercises} </p>
    </>
  )
}

  const App = () => {
    const course = {
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          name: 'State of a component',
          exercises: 14
        }
      ]
    }
    
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total exercises={course.parts} />
    </div>
  )
}

export default App

/*
const course = 'Half Stack application development'
  
    const parts = [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
*/