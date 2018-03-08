-- Create database 
DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

-- Create table
CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(200) NOT NULL,
  department_name VARCHAR(200) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (item_id)
);

-- Populate Table
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Queen Bed Matress", "Furniture", 300, 4);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Dining Room table", "Furniture", 200, 10);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("UNC Basketball Jersey", "Apparel", 89, 43);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Nissan Juke 2013 Rearview Mirror", "Automotive", 20, 8);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Nissan Juke 2013 Rims", "Automotive", 100, 12);


UPDATE products
SET product_name = "iPhone 7 Case", department_name = "Technology", price = 15, stock_quantity = 1
WHERE item_id = 2;

UPDATE products
SET product_name = "Dining Room Table"
WHERE item_id = 3;


INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("iPhone Charger", "Technology", 12, 45);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("UNC Basketball T-Shirt", "Apparel", 25, 18);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("Dining Chair Set of 4", "Furniture", 110, 1);
	
INSERT INTO products (product_name, department_name, price, stock_quantity)
	VALUES ("MacBook Pro Case", "Technology Accessories", 25, 19);


UPDATE products
SET department_name = "Technology Accessories"
WHERE department_name = "Technology";



-- View table
select * from products;