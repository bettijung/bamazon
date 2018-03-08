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
                // keepShopping();
            } else  if (chosenItem.stock_quantity >= parseInt(quantity)) {
                console.log("\n ------------------------------------------------------ \n \n Your total for " + quantity + " items of " + chosenItem.product_name + " is $" + (chosenItem.price * quantity) + ". \n \n ------------------------------------------------------ \n");
                saleExecution();
            } else {
                console.log("\n ------------------------------- \n \n Invalid input. Keep shopping. \n \n ------------------------------- \n");
                // keepShopping();
            }
        });
        }); 
    }

function saleExecution() {
    inquirer.prompt({
        type: 'list',
        name: 'confirm',
        message: "Would you like to make the purchase?",
        choices: ["Yes", "No"]
    }).then(answers => {
        if (answers.confirm === "Yes") {
            const updateQuery = "UPDATE products SET inventory = inventory -? WHERE item_id = ?";
            connection.query(updateQuery, [quantity, item], function(err, res) {
                if(err) throw err;
                console.log("\n" + "Thank you for your purchase!" + "\n");
                shopMore();
            });
        } else if (answers.confirm === "No") {
            console.log("\n" + "Order cancelled." + "\n");
            shopMore();
        }
    });
}

// Once the customer has placed the order: 
    // Check if your store has enough of the product to meet the customer's request.


// If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.


// However, if your store does have enough of the product, you should fulfill the customer's order.
    // This means updating the SQL database to reflect the remaining quantity.

    
// Once the update goes through, show the customer the total cost of their purchase.









// function keepShopping() {
//     inquirer.prompt([{
//         type: 'list',
//         name: 'shop_more',
//         message: "Would you like to continue shopping?",
//         choices: ["Yes", "No"]

//     }]).then(answers => {
//         if (answers.shop_more === "Yes") {
//             console.log("Okay! Let's go!");
//             displayItems();
//         } else if (answers.shop_more === "No") {
//            console.log("\n" + "Thank you! Come again soon!");
//            connection.end(() => {process.exit(); });
//         }
//     }); 
// }