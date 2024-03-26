import express from 'express';
import { v4 as uuidv4 } from 'uuid'; //Genererar unika id:n
import { readDataBaseFile, writeDataBaseFile } from './utils/databaseHelpers.js';
import authorRoute from './src/router/authorRoute.js';
import booksRoute from './src/router/booksRoute.js';
const app = express(); //Sätter igång express
const local_host = 3000




//Dessa 2 är skitviktiga för att kunna skicka och ta emot data yäni att allt funderar som det ska
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
//
app.use("/authors", authorRoute);
app.use("/books", booksRoute);


app.listen(3000, () => {
    console.log("Connected to post: " + local_host);
})  