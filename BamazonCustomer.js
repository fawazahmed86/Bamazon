

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

    connection.query('SELECT * FROM Products', function(err, res) {
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
        console.log("List of Available Products");
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");

            var table = new Table({
                head: ['ItemID', 'Product Name', 'Price ($)', 'Quantity'],
                colWidths: [12, 30, 12, 12]
            });

        for (var i=0; i < res.length; i++) {
            var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
            table.push(productArray);
        }
        console.log(table.toString());
        buyItem();
        });
    };

var buyItem = function() {
    inquirer.prompt([{
        name: "Item",
        type: "input",
        message: "Choose the ID of the Item you would like to buy",
        validate: function(value) {

            if (!isNaN(value)) {
                return true;
            } else {
                console.log("\n Please enter only the Item number of the item you'd like to buy \n");
                return false;
            }
        }
    }, {
        name: "Qty",
        type: "input",
        message: "How many would you like to buy?",
        validate: function(value) {
            
            if (!isNaN(value)) {
                return true;
            } else {
                console.log("ERROR! Please enter a valid Quantity\n");
                return false;
            }
        }
        }]).then(function(response) {
            var ItemInt = parseInt(response.Qty);
                
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: response.Item}], function(err, data) { 
                    if (err) throw err;
                
                    if (data[0].StockQuantity < ItemInt) {
                       console.log("We're sorry, that Item is currently out of stock\n");
                       console.log("Please choose another Product\n");
                       start(); 
                    } else {
                        
                        var updateQty = data[0].StockQuantity - ItemInt;
                        var totalPrice = data[0].Price * ItemInt;
                        connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [updateQty, response.Item], function(err, results) {
                        if(err) {
                            throw err;
                        } else {
                        console.log("Purchase successfull!\n");
                        console.log("Your total cost is: $ " + totalPrice);
                        
                        inquirer.prompt({
                            name: "buyMore",
                            type: "confirm",
                            message: "Would you like to buy another item?",
                        }).then(function(response) {
                            if (response.buyMore) {
                                start();
                            } else {
                                console.log("Thanks for shopping with us!");
                                connection.end();
                            }
                        });
                        }
                    });
                }               
            });
        });
    };

