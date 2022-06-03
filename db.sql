DROP DATABASE IF EXISTS gearTracker;
CREATE DATABASE gearTracker;
USE gearTracker;

CREATE TABLE users (
	user_id VARCHAR(255) NOT NULL,
	first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE gear (
	gear_id INT NOT NULL AUTO_INCREMENT,
    category VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
	product_name VARCHAR(255) NOT NULL,
    color VARCHAR(255),
    available INT NOT NULL,
    quantity INT NOT NULL,
    notes VARCHAR(255),
    PRIMARY KEY (gear_id)
);

CREATE TABLE tickets (
	ticket_id INT NOT NULL AUTO_INCREMENT,
    gear_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    date_out DATE NOT NULL,
    date_in DATE,
    destination VARCHAR(255) NOT NULL,
    FOREIGN KEY (gear_id) REFERENCES gear(gear_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (ticket_id)
);