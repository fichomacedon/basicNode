import express from "express";
import { createPath } from "./utils.js";
import {
  createTrainer,
  deleteAllTrainers,
  deleteTrainer,
  getAllTrainers,
  getTrainerById,
  updateTrainer,
} from "./src/trainer.js";

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

const app = express();
app.use(express.json());

const STATIC_FILES_PATH = createPath(["public"]);
app.use("/", express.static(STATIC_FILES_PATH));

app.get("/home", (req, res) => {
  return res.send("<h1>This is from the trainers api</h1>");
});
app.get("/trainers", async (req, res) => {
  try {
    const trainers = await getAllTrainers();

    return res.json(trainers);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});

app.post("/trainers", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      isCurrentlyTeaching,
      timeEmployed,
      coursesFinished,
    } = req.body;

    if (!firstName || !lastName) throw new Error("Invalid Data");

    const newTrainer = await createTrainer(
      firstName,
      lastName,
      email,
      isCurrentlyTeaching,
      timeEmployed,
      coursesFinished
    );

    return res.status(201).json(newTrainer);
  } catch (error) {
    console.log(error);

    return res.status(400).json({ msg: error.message });
  }
});

app.get("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;

    const foundTrainer = await getTrainerById(trainerId);

    return res.json(foundTrainer);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});

app.patch("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;
    const updateData = req.body;

    if (updateData.id) throw new Error("Invalid Data");

    await updateTrainer(trainerId, updateData);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
});
app.delete("/trainers/all", async (req, res) => {
  try {
    await deleteAllTrainers();

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
});
app.delete("/trainers/:id", async (req, res) => {
  try {
    const trainerId = req.params.id;

    await deleteTrainer(trainerId);

    return res.sendStatus(204);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
});
app.listen(PORT, HOST, () => {
  console.log(`Server is up at port ${PORT}`);
});
