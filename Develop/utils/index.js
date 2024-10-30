const inquirer = require('inquirer');
const { Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'employee_tracker_db',
  password: 'Raylex2020!', 
  port: 5432,
});

client.connect()
  .then(() => console.log('Connected to the database'))
  .catch(err => console.error('Connection error', err.stack));

const viewDepartments = () => {
  client.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};
const viewRoles = () => {
  client.query(`
    SELECT role.id, role.title, role.salary, department.id AS department_id, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};

const viewEmployees = () => {
  client.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
  `, (err, res) => {
    if (err) throw err;
    console.table(res.rows);
    mainMenu();
  });
};
// Function to add a department
const addDepartment = async () => {
    try {
        const { departmentName } = await inquirer.prompt({
            type: 'input',
            name: 'departmentName',
            message: 'Enter the name of the department:',
        });

        await client.query('INSERT INTO department (name) VALUES ($1);', [departmentName]);
        console.log(`Department "${departmentName}" added successfully.`);

        // After adding, display the updated list of departments
        viewDepartments();
    } catch (error) {
        console.error('Error adding department:', error);
    }
};
  


// I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ])
  .then((response) => {
    switch(response.menu) {
      case 'View all departments':
        viewDepartments();
        break;
      case 'View all roles':
        viewRoles();
        break;
      case 'View all employees':
        viewEmployees();
        break;
      case 'Add a department':
        addDepartment();
        break;
      case 'Add a role':
        addRole();
        break;
      case 'Add an employee':
        addEmployee();
        break;
      case 'Update an employee role':
        updateEmployeeRole();
        break;
      case 'Exit':
        client.end();
        break;
    }
  });
};
mainMenu();
