const fs = require('fs');
const path = require('path');

//Construct the full filepath
const filepath = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json' 
);

module.exports = class Cart {
    //Static method that will add a product to the cart or increase quantity if the product already exists in the cart
    static addProduct(id, productPrice, qty=1) { //Product ID, Product Price, Quantity of Product
        //Fetch the previous cart
        fs.readFile(filepath, "UTF-8", (err, fileContent)=>{
            //Initialize a variable to hold the content of the cart being read
            let tempCart = { products: [], totalPrice: 0 }; //Template for cart => {products: [id:0, qty:0], totalPrice:0}
            //check if no error
            if (!err) {
                //Check if file is empty
                if (fileContent !=="") {
                    //Assign the parsed data from the cart being read
                    tempCart = JSON.parse(fileContent);
                }
            }
            else {
                console.log("Unable to read cart JSON file.");
            }
            //Analze the cart => Find existing product and its corresponding index based on the given id parameter of this function
            const foundProductIndex = tempCart.products.findIndex((product)=>product.id === id);
            //Decalare a variable to hold the updated product 
            let updatedProduct=[];
            
            //Check if foundProduct contains a value
            if (foundProductIndex >= 0) { //Increase the total price and quantity
                //Get the product element from the products array
                const foundProduct = tempCart.products[foundProductIndex];
                
                //Copy the values of the foundProduct for data manipulation
                updatedProduct = {...foundProduct};

                //Product updates goes here
                updatedProduct.qty = updatedProduct.qty + 1;

                //Replace old products array
                tempCart.products = [...tempCart.products]; //<=======================check if this is necessary as it seems useless of assigning the same old values
                          
                //Apply the updated product in the cart products
                tempCart.products[foundProductIndex] = updatedProduct;
            }
            else { //Insert a product entry with its corresponding id and quantity
                //Assign a new product entry
                updatedProduct = {id: id, qty: qty};
                //Merge the old and new products array
                tempCart.products = [...tempCart.products, updatedProduct];
            }
            //Update the total price of the products
            tempCart.totalPrice = tempCart.totalPrice + +productPrice;
            
            // Save the product update to the model
            fs.writeFile(filepath, JSON.stringify(tempCart), (err)=>{
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Product is added to your cart");
                }
            });
        }); //End of fs.readFile
    }

    static deleteProductById(productId, productPrice) {
        fs.readFile(filepath, "UTF-8", (err, fileContent)=>{ 
            if (!err) {
                const data = JSON.parse(fileContent);
                const productIndex = data.products.findIndex(prod=>prod.id == productId);
                const totalPrice = data.totalPrice - (productPrice * +data.products[productIndex].qty);

                const updatedProducts = data.products.filter(prod=> prod.id !== productId);
                const tempCart = { products:[] };
                tempCart.products = [...updatedProducts];
                tempCart.totalPrice = totalPrice;
                fs.writeFile(filepath, JSON.stringify(tempCart), err=>{
                    console.log("Error in updating records");
                });
            }
        });
    }

    static getCart(callback) {
        //Retrieve Cart Products
        fs.readFile(filepath, "UTF-8", (err, fileContent)=>{
            if (!err) {
                callback(JSON.parse(fileContent));
            }
            else {
                callback({ products:[], totalPrice: 0 });
            }
        });
        
    }

}

