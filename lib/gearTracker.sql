DROP DATABASE IF EXISTS gearTracker;
CREATE DATABASE gearTracker;
USE gearTracker;

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
    PRIMARY KEY (ticket_id)
);

INSERT INTO gear
VALUES
	(1, 'Quickdraws', 'Petzl', 'Djinn', 'Purple', 6, 12, NULL),
	(NULL, 'Quickdraws', 'Metolius', 'Bravo', 'Multi', 1, 10, NULL),
	(NULL, 'Quickdraws', 'DMM', 'Alpha Sport', 'Red', 6, 6, NULL);

SELECT * FROM gear;

INSERT INTO tickets 
VALUES (1, 1, 'William', 6, '1994-01-20', NULL, 'Red Rock' );



INSERT INTO gear
VALUES
	(NULL, 'Rope', 'Mammut', 'Crag Workhorse 9.8mm', 'Multi', 1, 1, NULL),
    (NULL, 'Rope', 'Sterling', 'IonR XEROS 9.4mm Dry', 'Bicolor', 1, 1, NULL);
    
