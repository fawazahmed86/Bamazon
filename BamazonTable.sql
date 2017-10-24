DROP DATABASE IF EXISTS Bamazon;

CREATE DATABASE Bamazon;

USE Bamazon;

CREATE table Products(
ItemID INTEGER(30) AUTO_INCREMENT NOT NULL,
ProductName VARCHAR(30) NOT NULL,
DepartmentName VARCHAR(30) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
StockQuantity INTEGER(10) NOT NULL,
PRIMARY KEY(ItemID)
);

INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("bread", "bakery", 2.50, 5);
INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("banana", "fruits & veggies", 1.5, 20);
INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("apple", "fruits & veggies", .99, 30);
INSERT INTO products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("grapes", "fruits & veggies", 3.5, 15);
