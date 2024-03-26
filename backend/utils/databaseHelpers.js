import fs, { promises } from "fs";



export const readDataBaseFile = async (filePath) => {
    if(!filePath || typeof filePath !== "string"){
        throw new Error ("No path provided, file cannot be found");
    }
    try{
     const response = await promises.readFile(filePath, "utf-8");
     console.log("Response: ", response);
        if(!response){
            throw new Error ("Error with await promises.readFile");
        }
        const data = await JSON.parse(response);
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
export const validateItem = (item) => {
    let errors = {};
    if(!item){
        return {
            item: "No author body submitted"
        }
    }
    Object.keys(item).forEach((key) => {
        if(!item[key] || item[key].length < 0){
            errors[key] = `No ${key} submitted`
        }
    })
    // if(!item.name){
    //     errors.name = "No name submitted"
    // }
    // if(!item.yearOfBirth){
    //     errors.yearOfBirth = "No year of birth submitted"
    // }

    
    const hasErrors = Object.keys(errors).length > 0;
    return [errors, hasErrors];
};
export const generateListId = (items) => {};
export const generateUUID = () => {};