CREATE DATABASE patent_system;
USE patent_system;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    address VARCHAR(42) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role ENUM('user', 'patent_officer') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    blockchain_id INT UNIQUE NOT NULL,
    owner_address VARCHAR(42) NOT NULL,
    ipfs_hash VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_address) REFERENCES users(address)
); 