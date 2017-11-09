

var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Bamazon'
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as id' + connection.threadId);
    start();
});

var start = function() {

    connection.query('SELECT * FROM Products', function(err, response) {
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
        console.log("List of Available Products");
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");

            var table = new Table({
                head: ['ID #', 'Product Name', 'Price ($)', 'Quantity'],
                colWidths: [6, 30, 12, 10]
            });

        for (var i=0; i < response.length; i++) {
            var productArray = [response[i].ItemID, response[i].Item, response[i].Price, response[i].Quantity];
            table.push(productArray);
        }
        console.log(table.toString());
        // console.log(table)
        buyItem();
        });
    };

var buyItem = function() {
    inquirer.prompt([{
        name: "Item",
        type: "input",
        message: "Choose the ID of the Item you would like to buy",
        validate: function(valid) {

            if (!isNaN(valid)) {
                return true;
            } else {
                console.log("\n Incorrect Entry!!! \n Kindly enter the correct Item number of the item you would like to buy \n (NUMBERS ONLY)");
                return false;
            }
        }
    }, {
        name: "Qty",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(valid) {
            
            if (!isNaN(valid)) {
                return true;
            } else {
                console.log("\n Incorrect Vale Entered! \n Kindly enter valid Quantity (only numbers!) \n");
                return false;
            }
        }
        }]).then(function(response) {
            var ItemNo = parseInt(response.Qty);
                
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: response.Item}], function(err, data) { 
                    if (err) throw err;
                
                    if (data[0].Quantity < ItemNo) {
                       console.log("We're sorry, that Item is currently out of stock\n");
                       console.log("Please choose another Product\n");
                       start(); 
                    } else {
                        
                        var newQty = data[0].Quantity - ItemNo;
                        var totalPrice = data[0].Price * ItemNo;
                        connection.query('UPDATE products SET Quantity = ? WHERE ItemID = ?', [newQty, response.Item], function(err, results) {
                        if(err) {
                            throw err;
                        } else {
                        console.log("You have Purchased " + ItemNo + " Item");
                        console.log("Your total cost is: $ " + totalPrice);
                        
                        inquirer.prompt({
                            name: "buyMore",
                            type: "confirm",
                            message: "Would you like to buy another item?",
                        }).then(function(response) {
                            if (response.buyMore) {
                                start();
                            } else {
                                console.log("Thanks for shopping! \n Come again for shopping with us!");
                                connection.end();
                            }
                        });
                        }
                    });
                }               
            });
        });
    };

