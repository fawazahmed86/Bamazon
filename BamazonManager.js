
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
    appStart();
});

console.log('------------------------------------------------');
console.log('Welcome to the Bamazon management interface');
console.log("________________________________________________\n");

var appStart = function() {
    inquirer.prompt([{
        name: "Menu",
        type: "rawlist",
        message: "What would you would like to do?",
        choices:['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function(response) {


            switch(response.Menu) {
                case 'View Products for Sale': 
                    productsForSale();
                    break;
                case 'View Low Inventory':
                    lowInventory();
                    break;
                case 'Add to Inventory':
                    addInventory();
                    break;
                case 'Add New Product':
                    newProduct();
                    break;
            }

        }); 
}  

    function appContinue() {
    inquirer.prompt({
                name: "continue",
                type: "confirm",
                message: "Would you like to go back to the main menu?",
            }).then(function(response) {
                if (response.continue == true) {
                    appStart();
                } else {
                    console.log("Ending session with Bamazon Manager!");
                    connection.end();
                }
            }); 
    };


    function productsForSale() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Bamazon Current Inventory');
        console.log("_________________________________\n");
            var table = new Table({
                head: ['ItemID', 'Product Name', 'Price ($)', 'Quantity'],
                colWidths: [12, 30, 12, 12]
            });
        for (var i=0; i < res.length; i++) {
        var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
        table.push(productArray);    
        }
        console.log(table.toString());
        appStart();
        });
    }
    
    function lowInventory() {
    connection.query('SELECT * FROM Products', function(err, res) {
        console.log('---------------------------------');
        console.log('Bamazon Low Inventory');
        console.log("_________________________________\n");
    
            var table = new Table({
                head: ['ItemID', 'Product Name', 'Price ($)', 'Quantity'],
                colWidths: [12, 30, 12, 12]
            });
        for (var i=0; i < res.length; i++) {
            if (res[i].StockQuantity < 5) {
            var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
            table.push(productArray);
            }
        }
        console.log(table.toString());
        appStart();
        });
    }
    
    function addInventory() {
        connection.query('SELECT * FROM Products', function(err, res) {
    
            var table = new Table({
                head: ['ItemID', 'Product Name', 'Price ($)', 'Quantity'],
                colWidths: [12, 30, 12, 12]
            });
        for (var i=0; i < res.length; i++) {
        var productArray = [res[i].ItemID, res[i].ProductName, res[i].Price, res[i].StockQuantity];
        table.push(productArray);    
        }
        console.log('\n\n\n');
        console.log(table.toString());
        console.log('\n');
        });
            inquirer.prompt([{
                name:'ItemID',
                type:'input',
                message: '\n\nEnter the ID of the Product you want to increase the inventory of'
            }, {
                name: 'qty',
                type:'input',
                message: 'Enter the quantity you want to add to inventory'
            }]).then(function(response) {
                var addAmount = (parseInt(response.qty));
    
                connection.query("SELECT * FROM Products WHERE ?", [{ItemID: response.ItemID}], function(err, res) {
                            if(err) {
                                throw err;
                            } else {
                            var updateQty = (parseInt(res[0].StockQuantity) + addAmount);                      
                            }
    
                    connection.query('UPDATE products SET StockQuantity = ? WHERE ItemID = ?', [updateQty, response.ItemID], function(err, results) {
                            if(err) {
                                throw err;
                            } else {
                            console.log('New Inventory Added!\n');
                            appContinue();                      
                            }
                    });

                });
               
        });
    }
    
    function newProduct() {
        inquirer.prompt([{
            name: "product",
            type: "input",
            message: "Type the name of the Product you want to add to Bamazon"
        }, {
            name: "department",
            type: "input",
            message: "Type the Department name of the Product you want to add to Bamazon"
        }, {
            name: "price",
            type: "input",
            message: "Enter the price of the product without currency symbols"
        }, {
            name: "Qty",
            type: "input",
            message: "Enter the amount you want to add to the inventory"
        }]).then(function(response) {
            var ProductName = response.product;
            var DepartmentName = response.department;
            var Price = response.price;
            var StockQuantity = response.Qty;
            connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES (?, ?, ?, ?)', [ProductName, DepartmentName, Price, StockQuantity], function(err, data) {
                if (err) {
                    throw err;
                } else {
                console.log('\n\nProduct: ' + ProductName + ' added successfully!\n\n');
                appContinue();
                }
            });
        });
    }   

