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
    category VARCHAR(255),
    manufacturer VARCHAR(255),
    product_name VARCHAR(255),
    color VARCHAR(255),
    quantity VARCHAR(255),
    notes VARCHAR(255),
    PRIMARY KEY (gear_id)
);

CREATE TABLE tickets (
    ticket_id INT NOT NULL,
    gear_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    date_out VARCHAR(255) NOT NULL,
    date_in VARCHAR(255),
    destination VARCHAR(255) NOT NULL,
    FOREIGN KEY (gear_id) REFERENCES gear(gear_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    PRIMARY KEY (ticket_id)
);
