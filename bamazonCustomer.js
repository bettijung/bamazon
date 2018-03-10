// Dependencies
var mysql = require('mysql');
var inquirer = require('inquirer');
var cliTable = require('cli-table');

let item; 
let quantity;
let price;
let chosenItem;

// Connect to bamazon_db
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

connection.connect(function(error) {
    if(error)  throw error;
    console.log("Connected as ID " + connection.threadId);
    displayItems();
});


// Running this application will display items available for sale. 
function displayItems() {   

        var table = new cliTable({
        head: ["ID", "Product", "Department", "Price ($)"], 
        colWidths: [5, 45, 30, 15] // ?**
        });
    
        connection.query("Select * from products", function(error, results) {
            if(error) throw error;

            console.log("\n -------------------------------- \n \n WELCOME TO BAMAZON! \n *-*-*-*-*-*-*-*-*-* \n \n Find our current products below: \n \n -------------------------------- \n");
            for(i = 0; i < results.length; i++) {
                table.push([results[i].item_id, results[i].product_name, results[i].department_name, results[i].price]);
            }
            console.log(table.toString() + "\n");
           
        // Ask user what product they want to purchase
        inquirer.prompt([{
            type: 'input',
            name: 'itemId',
            message:"Which product you would like to purchase? Enter product ID:"
        },
        {
            type: 'input',
            name: 'quantity',
            message: "How many would you like to purchase? Enter number:"
        
        }]).then(function(answer) {

            // Gather user info for purchase
            itemId = answer.itemId;
            quantity = answer.quantity;

            for (i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(itemId)) {
                chosenItem = results[i];
                }
            }

            // Determine if the quanity is high enough for purchase
            if (chosenItem.stock_quantity < parseInt(quantity)) {
                console.log("\n ------------------------------------------------------------------------------------------- \n \n There are not enough inventory of that item. Sorry, you cannot purchase the desired amount. \n \n ------------------------------------------------------------------------------------------- \n");
                keepShopping();
            } else  if (chosenItem.stock_quantity >= parseInt(quantity)) {
                console.log("\n ------------------------------------------------------ \n \n Your total for " + quantity + " items of " + chosenItem.product_name + " is $" + (chosenItem.price * quantity) + ". \n \n ------------------------------------------------------ \n");
                saleExecution();
            } else {
                console.log("\n ------------------------------- \n \n Invalid input. Keep shopping. \n \n ------------------------------- \n");
                keepShopping();
            }
        });
        }); 
    }

// Run customer transaction
function saleExecution() {
    // Ask customer if they would like to purchase product(s)
    inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: "Would you like to make the purchase?",
        choices: ["Yes", "No"]
    }).then(function(answer) {
        // Update item quantity in database
        if (answer.confirm === "Yes") {
            const updateQuery = "UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id = ?";
            connection.query(updateQuery, [quantity, item], function(error, response) {
                if(error) throw error;
                console.log("\n ------------------------------- \n \n Your transaction has been processed. \n \n ------------------------------- \n");
                keepShopping();
            });
        } else if (answer.confirm === "No") {
            // Cancel transaction
            console.log("\n ------------------------------- \n \n Your transaction has been cancelled. \n \n ------------------------------- \n");
            keepShopping();
        }
    });
}

// Allow user to keep shopping
function keepShopping() {
    inquirer.prompt([{
        type: 'list',
        name: 'keep_shopping',
        message: "Continue shopping?",
        choices: ["Yes", "No"]

    }]).then(function(answer) {
        if (answer.keep_shopping === "Yes") {
            console.log("\n --------------- \n \n Keep shopping! \n \n --------------- \n");
            displayItems();
        } else {
           console.log("\n --------------- \n \n Good bye. \n \n --------------- \n");
           connection.end(() => {process.exit(); });
        }
    }); 
}