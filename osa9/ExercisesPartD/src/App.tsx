import React from "react";

interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartBaseWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBasic extends CoursePartBaseWithDescription {
  kind: "basic"
}

interface CoursePartBackground extends CoursePartBaseWithDescription {
  backgroundMaterial: string;
  kind: "background"
}

interface CoursePartSpecial extends CoursePartBaseWithDescription {
  exerciseCount: number;
  requirements: string[];
  kind: "special"
}

type CoursePart = CoursePartBasic | CoursePartGroup |
CoursePartBackground | CoursePartSpecial;


interface HeaderProps {
  courseName: string;
}

interface ContentProps {
  courseParts: CoursePart[];
}

interface TotalProps {
  totalExercises: number;
}

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  )
}

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic"
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group"
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic"
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial: "https://type-level-typescript.com/template-literal-types",
      kind: "background"
    },
    {
      name: "TypeScript in frontend",
      exerciseCount: 10,
      description: "a hard part",
      kind: "basic",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special"
    }
  ];

  const Header = ({ courseName }: HeaderProps) => {
    return <h1>{courseName}</h1>;
  }

  const Content = ({ courseParts }: ContentProps) => {
    return (
      <div>
        {courseParts.map(part => {
          return <Part key={part.name} part={part} />
        })}
      </div>
    );
  }

  const Part = ({ part }: PartProps) => {
    switch (part.kind) {
      case "basic":
        return (
          <React.Fragment key={part.name}>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p style={{fontStyle: 'italic'}}>{part.description}</p>
          </React.Fragment>
        )
      case "group":
        return (
          <React.Fragment key={part.name}>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p>project exercises: {part.groupProjectCount}</p>
          </React.Fragment>
        )
      case "background":
        return (
          <React.Fragment key={part.name}>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p style={{fontStyle: 'italic'}}>{part.description}</p>
            <p>background material: {part.backgroundMaterial}</p>
          </React.Fragment>
        )
      case "special":
        return (
          <React.Fragment key={part.name}>
            <h3>{part.name} {part.exerciseCount}</h3>
            <p style={{fontStyle: 'italic'}}>{part.description}</p>
            <p>required skills: {part.requirements.join(', ')}</p>
          </React.Fragment>
        )
      default:
        return assertNever(part);
    }
  }

  const Total = ({ totalExercises }: TotalProps) => {
    return (
      <p> Number of exercises {totalExercises} </p>
    );
  }
  
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total totalExercises={totalExercises} />
    </div>
  );
};

export default App;

