import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //Genererar unika id:n
const app = express(); //Sätter igång express
const local_host = 3000
import { readDataBaseFile, writeDataBaseFile } from './utils/databaseHelpers.js';

const JSON_DATA_PATH = "./src/data/authors.json"

//Dessa 2 är skitviktiga för att kunna skicka och ta emot data yäni att allt funderar som det ska
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
//


//Todo get requests
app.get("/authors", async (req, res) => {
    const data = await readDataBaseFile(JSON_DATA_PATH);
    if(!data){
        return res.status(404).json({message: "No data found"})
    }
    console.log("Data: ", data);
    res.status(200).json(data);
}); //Skickar en get request till servern
app.get("/" /*posts*/ + "/:id", async (req, res) => {}); //Skickar en get request till servern

//Todo post request
app.post("/authors", async (req, res) => {
    if(!req.body){
        return res.status(400).json({message: "Bad request: No body submitted to post request!"});
    }

    try{
        const authors = await readDataBaseFile(JSON_DATA_PATH); 
        if(!authors || authors.length < 0){
            return res.status(404).json({message: "No data found"})
        }
    
        let newAuthor = { id: uuidv4(), ...req.body };
        authors.push(newAuthor);
        await writeDataBaseFile(JSON_DATA_PATH, authors)
        res.json(authors)

    }
    catch(error){
        console.error("Expected error", error);
        return res.status(500).json({message: "Server error"});
    }
}); //Skickar en post request till servern

//TOdo put request
app.put("/", async (res, req) => {}); //Skickar en put request till servern

//Todo delete request
app.delete("/" + "/:id", async (req, res) => {}); //Skickar en delete request till servern

app.listen(3000, () => {
    console.log("Connected to post: " + local_host);
})