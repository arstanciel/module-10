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
const addRole = async () => {
  try {
      // Fetch departments from the database
      const res = await client.query('SELECT id, name FROM department;');
      const departments = res.rows;

      // Create department choices for the prompt
      const departmentChoices = departments.map(department => ({
          name: department.name,
          value: department.id,
      }));

      // Prompt for role details
      const { roleTitle, roleSalary, departmentId } = await inquirer.prompt([
          {
              type: 'input',
              name: 'roleTitle',
              message: 'Enter the title of the role:',
          },
          {
              type: 'number',
              name: 'roleSalary',
              message: 'Enter the salary for the role:',
          },
          {
              type: 'list',
              name: 'departmentId',
              message: 'Select the department this role belongs to:',
              choices: departmentChoices,
          },
      ]);

      // Insert the new role without specifying the id
      await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3);', [roleTitle, roleSalary, departmentId]);
      console.log(`Role "${roleTitle}" added successfully.`);

      // Append the selected department to the list
      const selectedDepartment = departments.find(dept => dept.id === departmentId);
      departments.push(selectedDepartment);

      // Display the updated list of departments
      console.log('Updated list of roles:');
      departments.forEach(department => {
          console.log(`- ${department.name}`);
      });
  } catch (error) {
      if (error.code === '23505') { // Duplicate key error code
          console.error('Error adding role: duplicate key value violates unique constraint "role_pkey". This role already exists. Please try a different title.');
      } else {
          console.error('Error adding role:', error);
      }
  }
};
// const deleteRole = async () => {
//   try {
//       // Fetch roles from the database
//       const resRoles = await client.query('SELECT id, title FROM role;');
//       const roles = resRoles.rows;

//       // Create role choices for the prompt
//       const roleChoices = roles.map(role => ({
//           name: role.title,
//           value: role.id,
//       }));

//       // Prompt the user to select the role to delete
//       const { roleId } = await inquirer.prompt([
//           {
//               type: 'list',
//               name: 'roleId',
//               message: 'Select the role you want to delete:',
//               choices: roleChoices,
//           },
//       ]);

//       // Execute an SQL DELETE statement to remove the role from the database
//       await client.query('DELETE FROM role WHERE id = $1;', [roleId]);

//       console.log(`Role deleted successfully.`);
//   } catch (error) {
//       console.error('Error deleting role:', error.message);
//   }
// };
// const updateRole = async () => {
//   try {
//       // Fetch roles from the database
//       const resRoles = await client.query('SELECT id, title FROM role;');
//       const roles = resRoles.rows;

//       // Create role choices for the prompt
//       const roleChoices = roles.map(role => ({
//           name: role.title,
//           value: role.id,
//       }));

//       // Prompt the user to select the role to update
//       const { roleId } = await inquirer.prompt([
//           {
//               type: 'list',
//               name: 'roleId',
//               message: 'Select the role you want to update:',
//               choices: roleChoices,
//           },
//       ]);

//       // Prompt the user for the new details of the role
//       const { newTitle, newSalary, newDepartmentId } = await inquirer.prompt([
//           {
//               type: 'input',
//               name: 'newTitle',
//               message: 'Enter the new title of the role:',
//           },
//           {
//               type: 'number',
//               name: 'newSalary',
//               message: 'Enter the new salary for the role:',
//           },
//           {
//               type: 'list',
//               name: 'newDepartmentId',
//               message: 'Select the new department for the role:',
//               choices: departmentChoices,
//           },
//       ]);

//       // Execute an SQL UPDATE statement to update the role in the database
//       await client.query(
//           'UPDATE role SET title = $1, salary = $2, department_id = $3 WHERE id = $4;',
//           [newTitle, newSalary, newDepartmentId, roleId]
//       );

//       console.log(`Role updated successfully.`);
//   } catch (error) {
//       console.error('Error updating role:', error);
//   }
// };

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
