import fs, { promises } from "fs";



export const readDataBaseFile = async (filePath) => {
    if(!filePath || typeof filePath !== "string"){
        throw new Error ("No path provided, file cannot be found");
    }
    try{
     const response = await promises.readFile(filePath, "utf-8");
        if(!response){
            throw new Error ("Error with response");
        }
        const data = await JSON.parse(response);
        console.log("Data Recieved: ", data);
        return data;
    }
    catch(error){
        console.error("Expected error", error);
        throw new Error ("Check readDataBaseFile function");
    }
};
export const writeDataBaseFile = async (filePath, newData)  => {
    if(!filePath || typeof filePath !== "string"){
        throw new Error ("No path provided, file cannot be found");
    }
    if(!newData){
        throw new Error ("No data provided");
    
    }
    try{
        const data = JSON.stringify(newData, null, 2);
        await promises.writeFile(filePath, data, "utf-8");
        console.log("File updated succesfully: ", data);
    }
    catch(error){
        console.error("Expected error", error);
        throw new Error ("Check writeDataBaseFile function");
    }
};
export const validateItem = (item) => {};
export const generateListId = (items) => {};
export const generateUUID = () => {};