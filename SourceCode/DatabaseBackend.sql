CREATE TABLE Account (
    Account_Type VARCHAR(100) NOT NULL, 
    Email_Address VARCHAR(100) NOT NULL, 
    Password VARCHAR(100) NOT NULL, 
    Name VARCHAR(100) NOT NULL, 
    Account_Num INT NOT NULL PRIMARY KEY AUTO_INCREMENT
);

CREATE TABLE Ticket (
    Description VARCHAR(1000) NOT NULL,
    Status VARCHAR(100) NOT NULL,
    Department VARCHAR(100) NOT NULL,
    Changelog VARCHAR(10000),
    Account_Num INT NOT NULL,
    Ticket_ID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    FOREIGN KEY (Account_Num) REFERENCES Account (Account_Num)
);
