
interface bmiValues {
  height: number,
  weight: number
}

const parseArgs = (args: string[]): bmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = Math.round(weight/heightInMeters**2*10)/10;
  
  if (bmi < 18.5) return `Underweight with: ${bmi} BMI`;
  if (bmi < 24.9 && bmi > 18.5) return `Normal with: ${bmi} BMI`;
  if (bmi < 29.9 && bmi > 25) return `Overweight with: ${bmi} BMI`;
  if (bmi > 30) return `Obese with: ${bmi} BMI`;
  return `Bmi doesn't match any predefined ranges. (${bmi})`;
};

try {
  const { height, weight } = parseArgs(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage;
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  console.log(errorMessage);
}

