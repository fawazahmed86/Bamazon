DROP DATABASE IF EXISTS Bamazon;

CREATE DATABASE Bamazon;

USE Bamazon;

CREATE table Products(
ItemID INTEGER(30) AUTO_INCREMENT NOT NULL,
Item VARCHAR(30) NOT NULL,
DeptName VARCHAR(30) NOT NULL,
Price DECIMAL(10,2) NOT NULL,
Quantity INTEGER(10) NOT NULL,
PRIMARY KEY(ItemID)
);

INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("4G Router", "Mobile Devices", 349.0, 15);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("Smasumg Note 8", "Mobile Devices", 849, 20);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("A4 Paper Sets", "stationary", 3.49, 40);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("Lined loose sheets", "stationary", 2.35, 25);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("Ear Plugs", "Accessories", 4.35, 50);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("Huawei Honor 5X", "Mobile Devices", 459, 15);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("LG 5X", "Mobile Devices", 339, 10);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("HTC Desire 10 Pro", "Mobile Devices", 869, 6);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("HTC Desire 10 Compact", "Mobile Devices", 729, 8);
INSERT INTO products (Item, DeptName, Price, Quantity) VALUES ("HTC Desire 650", "Mobile Devices", 229, 15);
