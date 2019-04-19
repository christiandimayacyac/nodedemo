const fs = require('fs');
const path = require('path');
const Cart = require('../models/Cart');



//Helper function to be used in getting product entries from a JSON file; returns [] or JSON Data
const getProductsFromFile = (callback) => { //Callback is needed to get the expected data for fs.readFile is an async function
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
                console.log("filecontent empty");
                callback([], filepath);
            }
            else {
                console.log("filecontent is not empty");
                // console.log(JSON.parse(fileContent));
                callback(JSON.parse(fileContent), filepath);  //Pass the JSON-parsed data to callback function if file contains JSON data
            }
        }
    });
};

const  findProductIndex = (productId) => { //callback => console log product
    let prodIndex;
    prodIndex = getProductsFromFile((products) => {
        const foundProductIndex = products.findIndex((pid)=>pid.id === productId)
        // console.log("foundProductIndex: ", foundProductIndex);
        return (foundProductIndex);
    });
    return prodIndex;
};



//Declare Product Class
module.exports = class Product {
    constructor(itemName, imageURL, price, description, id) {
        this.id = id;
        this.itemName = itemName;
        this.imageURL = imageURL;
        this.price = price;
        this.description = description;
    }

    save(callback) {
        getProductsFromFile((products, filepath)=>{
            //check if product ID is null i.e Add Product is being done
            if (this.id===null) {
                //Create an id for the new product entry
                this.id = Math.floor((Math.random() * 1000) + 1).toString();
                products.push(this);

                //Write changes to the actual file
                fs.writeFile(filepath, JSON.stringify(products), err =>{
                    console.log("Error", err);
                });
            }
            //if product ID is set i.e Edit Product is being done
            else {
                //Get the product index of the product being edited
                const foundProductIndex = products.findIndex((pid)=>pid.id === this.id)

            
                if (foundProductIndex >= 0) {
                    //Make a copy of all the products from the database
                    const existingProducts = [...products];
                    //Apply changes to the target product
                    existingProducts[foundProductIndex] = this;

                    //Write changes to the actual file
                    fs.writeFile(filepath, JSON.stringify(existingProducts), err =>{
                        console.log("Error", err);
                    });
                } 
                else {
                    console.log(`Error: Unable to find the product in the database.`);
                }
                
                

                                                                           
            }
        }); 
        callback();   
    }
    
    editProduct(productDetails) { 
        let prodIndex;
        //Retrieve the product index with the given productId
        findProductIndex(productDetails.productId, (productIndex)=> {
                                                        prodIndex = productIndex;
                                                    });

        //Get all products record
        getProductsFromFile((products, filepath)=>{
            //Make a copy of the current product records
            const existingProducts = [...products];
            //Apply the changes to the target product
            existingProducts[prodIndex].itemName = productDetails.itemName;
            existingProducts[prodIndex].price = productDetails.price;
            existingProducts[prodIndex].imageURL = productDetails.imageURL;
            existingProducts[prodIndex].description = productDetails.description;

            // Save the product update to the model (product.json)
            fs.writeFile(filepath, JSON.stringify(existingProducts), (err)=>{
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Product has been updated");
                }
            });                                                                                  
        });       
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static findProductById(id, callback) { 
        getProductsFromFile((products)=>{
            const product = products.find((prod)=>{ //Find the product with the specified product id
                return prod.id === id;
            });
            callback(product);
        });
    }

    static deleteProductById(productId, callback) {
        getProductsFromFile((products, filepath)=>{
            const productIndex = products.findIndex(prod=>prod.id === productId);
            const productPrice = products[productIndex].price;
            //Retrieve all the products from the database filtering out the product to be deleted
            const updatedProducts = products.filter(prod=> prod.id !== productId);

            //Update the database
            fs.writeFile(filepath, JSON.stringify(updatedProducts), err => {
                if (!err) {
                    //Update the cart: check if the product to be deleted exists and delete it
                    Cart.deleteProductById(productId, productPrice);
                }
                else {
                    console.log(err);  
                }   
            });

        });
        callback();
    }
}