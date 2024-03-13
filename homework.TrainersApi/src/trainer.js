import { DataService } from "./data.service.js";
import { createPath } from "../utils.js";
import { Trainer } from "./trainers.model.js";

const TRAINERS_PATH = createPath(["data", "trainers.json"]);

const saveTrainers = async (trainers) => {
  await DataService.saveJSONFile(TRAINERS_PATH, trainers);
};

export const getAllTrainers = async () => {
  const trainers = await DataService.readJSONFile(TRAINERS_PATH);

  return trainers;
};

export const createTrainer = async (
  firstName,
  lastName,
  email,
  isCurrentlyTeaching,
  timeEmployed,
  coursesFinished
) => {
  const trainers = await getAllTrainers();

  const newTrainer = new Trainer(
    firstName,
    lastName,
    email,
    isCurrentlyTeaching,
    timeEmployed,
    coursesFinished
  );

  const updatedTrainers = [...trainers, newTrainer];

  await saveTrainers(updatedTrainers);

  return newTrainer;
};

export const getTrainerById = async (trainerId) => {
  const trainers = await getAllTrainers();

  const foundTrainer = trainers.find((trainer) => trainer.id === trainerId);

  if (!foundTrainer) throw new Error("Trainer not found!");

  return foundTrainer;
};

export const updateTrainer = async (trainerId, updateData) => {
  const trainers = await getAllTrainers();

  if (!trainers.some((trainer) => trainer.id === trainerId))
    throw new Error("Can't update trainer! Trainer not found!");

  const updatedTrainers = trainers.map((trainer) => {
    if (trainer.id === trainerId) {
      return { ...trainer, ...updateData };
    } else {
      return trainer;
    }
  });

  await saveTrainers(updatedTrainers);
};

export const deleteTrainer = async (trainerId) => {
  const trainers = await getAllTrainers();

  const updatedTrainers = trainers.filter(
    (trainer) => trainer.id !== trainerId
  );

  if (updatedTrainers.length === trainers.length)
    throw new Error("Can't delete task! Task not found!");

  await saveTrainers(updatedTrainers);
};

export const deleteAllTrainers = async () => {
  await saveTrainers([]);
};
