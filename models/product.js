const fs = require('fs');
const path = require('path');



//Helper function to be used in getting product entries from a JSON file; returns [] or JSON Data
const getProductsFromFile = (callback) => {
    //Construct the full filepath
    const filepath = path.join(
        path.dirname(process.mainModule.filename), 
        'data', 
        'products.json' 
    );

    fs.readFile(filepath, "UTF-8", (err, fileContent) => {
        if (err) { //If error, return blank array to the callback function
            console.log("error reading file: ", err);
            callback([], filepath);
        }
        else {
            if (fileContent === "") { //Check if file is empty; Return blank array if yes to avoid error in views
                callback([], filepath);
            }
            else {
                callback(JSON.parse(fileContent), filepath);  //Pass the JSON-parsed data to callback function if file contains JSON data
            }
        }
    });
};



//Declare Product Class
module.exports = class Product {
    constructor(itemName) {
        this.itemName = itemName;
    }

    save() {
        getProductsFromFile((products, filepath)=>{
            //Append the new product to the products array
            console.log("products", products);
            if (!products.length > 0) {
                products.push(this);
            }
            else {
                products.push({itemName: this.itemName});
            }

            //Write changes to the actual file
            fs.writeFile(filepath, JSON.stringify(products), err =>{
                console.log("Error", err);
            });
        });    
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

}