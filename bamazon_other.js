require('dotenv').config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
});    

conn.connect(function(err){
    if(err) throw err;
    console.log("Connected as ID " + conn.threadId);
   
});
//We need to validate if the user is entering a valid value, if not we will send a error message.


var buyAndDisplay = function(){
    conn.query("SELECT * FROM products", function (err, res){
        var table = new Table ({
            head: ["item_id","product_name","department_name","price","stock_quantity"]
        });
        console.log("HERE ARE ITEMS FOR SALE");
        console.log("=======================");

        for(var i=0; i < res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }
        console.log(table.toString());
        //inquirer.prompt so that we can ask questions to client and get an answer for each question.
        inquirer.prompt([
            {
                name:"itemId",
                type:"input",
                message:"What is item ID you would like to purchase today?",
                validate: function(value){
                    if(isNaN(value) == false){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            },
            {
                name:"quantity",
                type:"input",
                message:"How many of this item would you like to buy?",
                validate: function(value){
                    if(isNaN(value) == false){
                        return true;
                    }
                    else{
                        return false;
                    }
                }
            }
            
        ]).then(function(answer){
            var chosenQuantity = answer.quantity;
            var chosenId = answer.itemId -1;
            
            if(chosenQuantity < res[chosenId].stock_quantity){
                console.log("Your total for: " + "(" + chosenQuantity + ")" + res[chosenId].product_name + " is: "+ res[chosenId].price * chosenQuantity);
                conn.query("UPDATE products SET ? WHERE ?",[{
                    stock_quantity:res[chosenId].stock_quantity - chosenQuantity
                },
                {
                    item_id:res[chosenId].item_id  
                }],function(err,res){
                    buyAndDisplay();
                });
            }
            else{
                console.log("Sorry, insufficient quanity at this time. We have only " + res[chosenId].StockQuantity + " in our Inventory.");
                buyAndDisplay();
            }
        })
    });//first query so that we can display our inventory.
}; //buyAndDisplay function.A constracted function that runs the whole application.

buyAndDisplay();