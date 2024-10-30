CREATE DATABASE employee_tracker_db;

-- Create two new databases --
DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;

\c employee_tracker_db

-- Create a table for departments --
DROP TABLE IF EXISTS department;
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
-- Create a table for roles --
DROP TABLE IF EXISTS role;
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30),
    salary DECIMAL(10, 2),
    department_id INT
);
-- INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 100000.00, 1);
-- INSERT INTO role (title, salary, department_id) VALUES ('Sales Lead', 80000.00, 2);
-- INSERT INTO role (title, salary, department_id) VALUES ('Lawyer', 120000.00, 3);
-- INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 85000.00, 4);


-- Create a table for employees --  
DROP TABLE IF EXISTS employee;
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT
);

-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Mike', 'Chan', 2, 1);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Ashley', 'Rodriguez', 3, 1);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kevin', 'Tupik', 4, 1);
-- INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Kunal', 'Singh', 1, 2);