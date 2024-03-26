import express from "express";
import {
  readDataBaseFile,
  writeDataBaseFile,
  validateItem,
} from "../../utils/databaseHelpers.js";
import { v4 as uuidv4 } from "uuid";
const JSON_DATA_PATH = "./src/data/authors.json";
const router = express.Router();

//Todo get requests
router.get("/", async (req, res) => {
  const authors = await readDataBaseFile(JSON_DATA_PATH);
  if (!authors) {
    return res.status(404).json({ message: "No data found" });
  }
  if (Object.keys(req.query).length > 0) {
    const { yearOfBirth, sort } = req.query;
    if (yearOfBirth && sort) {
      if(sort === "over"){
        {
            let filteredAuthors = authors.filter((au, i) => {
              return au.yearOfBirth >= Number(yearOfBirth);
            });
            return res.json(filteredAuthors);
          }
      }else if(sort === "under"){
        {
            let filteredAuthors = authors.filter((au, i) => {
              return au.yearOfBirth >= Number(yearOfBirth);
            });
            return res.json(filteredAuthors);
          }
      } else {
        return res.status(400).json({ message: "Bad request: No sort query" });
      }
    } 
  }

  console.log("Data: ", authors);
  return res.status(200).json(authors);
}); //Skickar en get request till servern
// app.get("/" /*posts*/ + ":id", async (req, res) => {}); //Skickar en get request till servern

router.get("/books", async (req, res) => {
  const data = await readDataBaseFile(JSON_DATA_PATH);
  if (!data) {
    return res.status(404).json({ message: "No data found" });
  }
  console.log("Data: ", data);
  return res.status(200).json(data);
}); //Skickar en get request till servern

//Todo post request
router.post("/", async (req, res) => {
  if (!req.body) {
    return res
      .status(400)
      .json({ message: "Bad request: No body submitted to post request!" });
  }
  let newAuthor = { id: uuidv4(), ...req.body };
  const [errors, hasErrors] = validateItem(newAuthor);
  if (hasErrors) {
    return res.status(400).json({ errors });
  }

  console.log(errors);
  if (hasErrors) {
    return res.status(400).json(errors);
  }

  try {
    const authors = await readDataBaseFile(JSON_DATA_PATH);
    if (!authors || authors.length < 0) {
      return res.status(404).json({
        message: "No data found: await readDataBaseFile(JSON_DATA_PATH)",
      });
    }

    authors.push(newAuthor);
    await writeDataBaseFile(JSON_DATA_PATH, authors);
    return res.json(authors);
  } catch (error) {
    console.error("Expected error", error);
    return res.status(500).json({ message: "Server error" });
  }
}); //Skickar en post request till servern

router.get("/" + ":id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Error: No ID present" });
  }
  const { id } = req.params;
  try {
    const authors = await readDataBaseFile(JSON_DATA_PATH);
    const index = authors.findIndex((au, i) => {
      return au.id == id;
    });
    if (index !== -1) {
      return res.status(200).json(authors[index]);
    } else {
      return res.status(404).json({ message: `User with id: ${id} not found` });
    }
  } catch (error) {
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
    const authors = await readDataBaseFile(JSON_DATA_PATH);
    const index = authors.findIndex((au, i) => {
      return au.id == id;
    });
    if (index !== -1) {
      const updatedAuthor = { ...authors[index], ...req.body };
      authors[index] = updatedAuthor;
      // console.log("Updated author: ", authors);
      // console.log("Author to change: ", authors[index]);
      // console.log("All authors: ", authors);
      await writeDataBaseFile(JSON_DATA_PATH, authors);
      return res.status(200).json(authors[index]);
    } else {
      return res.status(404).json({ message: `User with id: ${id} not found` });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}); //Skickar en put request till servern

//Todo delete request
router.delete("/" + ":id", async (req, res) => {
  if (!req.params.id) {
    return res.status(404).json({ message: "Error: No ID present" }); //check för att se om det finns ett ID överhuvudtaget
  }

  const { id } = req.params; //Hämtar id från requesten

  try {
    const authors = await readDataBaseFile(JSON_DATA_PATH);
    const index = authors.findIndex((au, i) => {
      return au.id == id;
    });
    if (index !== -1) {
      authors.splice(index, 1);
      await writeDataBaseFile(JSON_DATA_PATH, authors);
      return res.status(204).send("Author deleted");
    } else {
      return res.status(404).json({ message: `User with id: ${id} not found` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
}); //Skickar en delete request till servern

export default router;
