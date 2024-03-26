import express from "express";
import {
  readDataBaseFile,
  writeDataBaseFile,
  validateItem,
} from "../../utils/databaseHelpers.js";
import { v4 as uuidv4 } from "uuid";
const JSON_DATA_PATH = "./src/data/books.json";
const router = express.Router();

//TODO GET QUERY PARAMS
router.get("/", async (req, res) => {
  const books = await readDataBaseFile(JSON_DATA_PATH);
  if (!books) {
    return res.status(404).json({ message: "No data found" });
  }
  if (Object.keys(req.query).length > 0) {
    res.json(req.query);
  }

  console.log("Data: ", books);
  return res.status(200).json(books);
});

//TODO GET ONE REQUEST
router.get("/" + ":id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Error: No ID present" });
  }
  const { id } = req.params;
  try {
    const books = await readDataBaseFile(JSON_DATA_PATH);
    const index = books.findIndex((bk, i) => {
      return bk.id == id;
    });
    if (index !== -1) {
      return res.status(200).json(books[index]);
    } else {
      return res.status(404).json({ message: `Book with id: ${id} not found` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Bad request: No body submitted to post request!" });
  }
  let newBook = { id: uuidv4(), ...req.body };
  const [errors, hasErrors] = validateItem(newBook);
  if (hasErrors) {
    return res.status(400).json({ errors });
  }

  console.log(errors);
  if (hasErrors) {
    return res.status(400).json(errors);
  }

  try {
    const books = await readDataBaseFile(JSON_DATA_PATH);
    if (!books || books.length < 0) {
      return res.status(404).json({
        message: "No data found: await readDataBaseFile(JSON_DATA_PATH)",
      });
    }

    books.push(newBook);
    await writeDataBaseFile(JSON_DATA_PATH, books);
    return res.json(books);
  } catch (error) {
    console.error("Expected error", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.put("/" + ":id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Error: No ID present" });
  }

  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Bad request: No body submitted to post request!" });
  }

  const { id } = req.params;

  try {
    const books = await readDataBaseFile(JSON_DATA_PATH);
    const index = books.findIndex((au, i) => {
      return au.id == id;
    });
    if (index !== -1) {
      const updatedBooks = { ...books[index], ...req.body };
      books[index] = updatedBooks;
      // console.log("Updated book: ", books);
      // console.log("Book to change: ", books[index]);
      // console.log("All books: ", authors);
      await writeDataBaseFile(JSON_DATA_PATH, books);
      return res.status(200).json(books);
    } else {
      return res.status(404).json({ message: `Book with id: ${id} not found` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/" + ":id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Error: No ID present" }); //check för att se om det finns ett ID överhuvudtaget
  }

  const { id } = req.params; //Hämtar id från requesten

  try {
    const books = await readDataBaseFile(JSON_DATA_PATH);
    const index = books.findIndex((au, i) => {
      return au.id == id;
    });
    if (index !== -1) {
        books.splice(index, 1);
      await writeDataBaseFile(JSON_DATA_PATH, books);
      return res.status(204).send("Book deleted");
    } else {
      return res.status(404).json({ message: `Book with id: ${id} not found` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
