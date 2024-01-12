interface Data {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const parseExerciseArgs = (args: string[]): number[] => {
  if (args.length < 3) throw new Error('Not enough arguments');
  const trainedHours = args.slice(2).map(hours => Number(hours));
  if (trainedHours.some(hours => isNaN(hours))) {
    throw new Error('Provided values were not numbers!');
  }
  return trainedHours;
};

export const calculateExercises = (trainedHours: number[], target: number = 2): Data => {
  
  const periodLength = trainedHours.length;
  const trainingDays = trainedHours.filter(hours => hours > 0).length;
  const average = trainedHours.reduce((a, b) => a + b) / periodLength;
  const success = average >= target;
  const rating = success ? 3 : average > 1 ? 2 : 1;
  const ratingDescription = rating === 3 ? 'good' : rating === 2 ? 'okay' : 'bad';

  const trainData = {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
  return trainData;
};

try {
  const trainedHours = parseExerciseArgs(process.argv);
  console.log(calculateExercises(trainedHours));
} catch (error: unknown) {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.log(errorMessage);
}
