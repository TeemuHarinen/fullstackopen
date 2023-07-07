
const Header = (props) => {
    return (
        <>
          <h1>{props.title}</h1>
        </>
      )   
}

const Content = ({content}) => {
    return (
        <ul>
            <Part parts={content.course.parts}></Part>
        </ul>
    )
}

const Part = ({parts}) => {
    return (
        parts.map(part => <li key={part.id}> {part.name} {part.exercises}</li>)
    )
}

const Total = (props) => {
    const parts = props.exercises
    const total = parts.reduce((total, part) => total + part.exercises, 0)
    return (
        <>
        <p> <strong>Total exercises</strong> {total} </p>
        </>
    )
}
const Course = (props) => {

return (
    <div>
        <Header title={props.course.name}></Header>
        <Content content={props}></Content>
        <Total exercises={props.course.parts}></Total>
    </div>
)

}
  
export default Course
