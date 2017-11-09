
var Table = require("cli-table");
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    appStart();
});

console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
console.log("Welcome to the management interface");
console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");

var appStart = function() {
    inquirer.prompt([{
        name: "list",
        type: "rawlist",
        message: "Kindly select your task from below options:",
        choices:["Add New Product", "View Low Inventory Level", "Add Item to Inventory", "View Products for Sale"]
    }]).then(function(response) {


            switch(response.list) {
                case "Add New Product":
                    // console.log("Selection-1");
                    addProduct();
                    break;
                case "View Low Inventory Level":
                    // console.log("Selection-2");
                    lowInventory();
                    break;
                case "Add Item to Inventory":
                    // console.log("Selection-3");
                    addInventory();
                    break;
                case "View Products for Sale": 
                    // console.log("Selection-4");
                    Sale();
                    break;
            }
        }); 
}  


    
    function addProduct() {
        inquirer.prompt([{
            name: "item",
            type: "input",
            message: "Type the name of the Product you want to add to Bamazon"
        }, {
            name: "dept",
            type: "input",
            message: "Type the name of the Department for this Item"
        }, {
            name: "price",
            type: "input",
            message: "Enter the price of the product"
        }, {
            name: "Qty",
            type: "input",
            message: "Enter the amount you want to add to the inventory"
        }]).then(function(response) {
            var Item = response.item;
            var DeptName = response.dept;
            var Price = response.price;
            var Quantity = response.Qty;
            connection.query("INSERT INTO Products (Item, DeptName, Price, Quantity) VALUES (?, ?, ?, ?)", [Item, DeptName, Price, Quantity], function(err, data) {
                if (err) {
                    throw err;
                } else {
                console.log("\nProduct: " + Item + " added successfully!\n\n");
                restart();
                }
            });
        });
    }

        function addInventory() {
        connection.query("SELECT * FROM Products", function(err, response) {
    
            var table = new Table({
                head: ["ItemID", "Product Name", "Price ($)", "Quantity"],
                colWidths: [12, 30, 12, 12]
            });
        for (var i=0; i < response.length; i++) {
        var temp = [response[i].ItemID, response[i].Item, response[i].Price, response[i].Quantity];
        table.push(temp);    
        }
        console.log(table.toString());
        console.log("Select the ID of the Product from above table");
        });
            inquirer.prompt([{
                name:"ItemID",
                type:"input",
                message: "Enter the ID of the Product you want to increase the inventory of \n"
            }, {
                name: "Qty",
                type:"input",
                message: "Enter the quantity you want to add to inventory"
            }]).then(function(response) {
                var addAmount = (parseInt(response.Qty));
    
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: response.ItemID}], function(err, response) {
                            if(err) {
                                throw err;
                            } else {
                            var newQty = (parseInt(response[0].Quantity) + addAmount);
    
                    connection.query("UPDATE Products SET Quantity= ? WHERE ItemID = ?", [newQty, response[0].ItemID], function(err, results) {
                            if(err) {
                                throw err;
                            } else {
                            console.log("New Inventory Added!\n");
                            restart();                      
                            }
                        });
                      }
                });        
        });
    }


    function Sale() {
    connection.query("SELECT * FROM Products", function(err, response) {
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
        console.log("Bamazon Current Inventory");
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
            var table = new Table({
                head: ["ItemID", "Product Name", "Price ($)", "Quantity"],
                colWidths: [5, 35, 15, 10]
            });
        for (var i=0; i < response.length; i++) {
        var temp = [response[i].ItemID, response[i].Item, response[i].Price, response[i].Quantity];
        table.push(temp);    
        }
        console.log(table.toString());
        appStart();
        });
    }
    
    function lowInventory() {
    connection.query("SELECT * FROM Products", function(err, response) {
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
        console.log("View Low Inventory");
        console.log("=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=");
    
            var table = new Table({
                head: ["ItemID", "Product Name", "Price ($)", "Quantity"],
                colWidths: [5, 35, 15, 8]
            });
        for (var i=0; i < response.length; i++) {
            if (response[i].Quantity < 5) {
            var temp = [response[i].ItemID, response[i].Item, response[i].Price, response[i].Quantity];
            table.push(temp);
            }
        }
        console.log(table.toString());
        appStart();
        });
    }
    

    function restart() {
    inquirer.prompt({
                name: "Restart",
                type: "confirm",
                message: "Would you like to restart the app?",
            }).then(function(response) {
                if (response.Restart == true) {
                    appStart();
                } else {
                    console.log("Your session with Bamazon has been terminated");
                    connection.end();
                }
            }); 
    };
       
