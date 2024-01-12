import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
    const bmi = calculateBmi(Number(height), Number(weight));
    res.send({
      weight,
      height,
      bmi
    });
  } else {
    res.send({
      error: 'parameters undefined or not numbers'
    });
  }
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.send({
      error: 'parameters missing'
    });
  } else if (!Array.isArray(daily_exercises) || isNaN(Number(target))) {
    res.send({
      error: 'malformatted parameters'
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const result = calculateExercises(daily_exercises, target);
    res.send(result);
  }
});


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});