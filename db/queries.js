const connection = require('./connection');
const inquirer = require('inquirer');
require('console.table');

//Function that starts the app and prompt the questions

function runSearch() {
        inquirer
          .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
              "View All Employees",
              "View All Employees By Department",
              "View departments",
              "View roles",
              "Add department",
              "Add role",
              "Add Employee",
              "Remove Employee",
              "Update Employee Role",
              "Update Employee Manager",
              "Log Off"
            ]
          }) 
      .then(function(answer) {
          switch (answer.action) {
          case "View All Employees":
            viewEmployees();
            break;
      
          case "View All Employees By Department":
          viewEmployeesByDepartment();
          break;
      
          case "View departments":
            viewDepartment();
            break;
          
          case "View roles":
            viewRoles();
            break;
      
          case "Add Employee":
            addAnEmployee();
            break;
        
          case "Add department":
            addDepartment();
            break;
          
          case "Add role":
            addARole();
            break;
      
          case "Remove Employee":
            removeAnEmployee();
            break;
          
          case "Update Employee Role":
            updateAnEmployeesRole();
            break;
          
          case "Update Employee Manager":
            updateAnEmployeesManager();
            break;
          
          case "Log Off":
            console.log("Thank you, have an awesome day ahead! :) ")
            process.exit();
          }
        });
      }


//Method view all employees
function viewEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role on employee.role_id = role.id 
    LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`;
    connection.query(query, function(err, query){
        console.table(query);
        runSearch();
    });
};

//Method view all employees by department
function viewEmployeesByDepartment() {
    const query =`SELECT department.name AS department, employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on 
    employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;`;
      connection.query(query, function(err, query){
      console.table(query);
      runSearch();
  });
};

//Method to view all departments
function viewDepartment() {
  const query = `select id AS Department_Id, name AS department from department;`;
  connection.query(query, function(err, query){
    console.table(query);
    runSearch();
  });
};

//Method to view all roles
function viewRoles() {
  const query = `select id AS Role_ID, title, salary AS Salary from role;`;
  connection.query(query, function(err, query){
    console.table(query);
    runSearch();
  });
};

//Method to add a new employee
function addAnEmployee() {
  //arrays to display prompt choices from database items 
  const choicesRole = [];
  connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      const listRoles = resRole[i].title;
      choicesRole.push(listRoles);
    };

    const departmentChoices = [];
      connection.query("SELECT * FROM department", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        const deptList = resDept[i].name;
        departmentChoices.push(deptList);
    }
    
  inquirer
    .prompt([
    {
      name: "firstName",
      type: "input",
      message: "Enter employee's first name:"
    },
    {
      name: "lastName",
      type: "input",
      message: "Enter employee's last name:"
    },
    {
      name: "role_id",
      type: "rawlist",
      message: "Select employee role:",
      choices: choicesRole
    },
    {
      name: "department_id",
      type: "rawlist",
      message: "Select employee's department:",
      choices: departmentChoices
    },

  ])
    .then(function(answer) {
      //for loop to retun 
      var chosenRole;
        for (var i = 0; i < resRole.length; i++) {
          if (resRole[i].title === answer.role_id) {
            chosenRole = resRole[i];
          }
        };

        var departmentChosen;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            departmentChosen = resDept[i];
          }
        };
      //connection to insert response into database  
        connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: chosenRole.id,
          department_id: departmentChosen.id
        },
        function(err) {
          if (err) throw err;
          console.log("Employee " + answer.firstName + " " + answer.lastName + " successfully added!");
          runSearch();
        }
      );
    })
   });
  })
};

//Method to add department
function addDepartment() {
  inquirer
    .prompt([
    {
      name: "dept",
      type: "input",
      message: "Enter new department's name:"
    }
  ])
  .then(function(answer) {
    connection.query(
      "INSERT INTO department SET ?",
      {
        name: answer.dept
      },
      function(err) {
        if (err) throw err;
        console.log("Department " + answer.dept + " successfully added!");
        runSearch();
      }
    );
  });
};

//Method to new add role
function addARole() {
  const departmentChoices = [];
    connection.query("SELECT * FROM department", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        const deptList = resDept[i].name;
        departmentChoices.push(deptList);
    }

  inquirer
  .prompt([
  {
    name: "title",
    type: "input",
    message: "Enter new role's name:"
  },
  {
    name: "salary",
    type: "number",
    message: "Enter new role's salary:"
  },
  {
    name: "department_id",
    type: "rawlist",
    message: "Select employee's department:",
    choices: departmentChoices
  }
])
.then(function(answer) {

  var departmentChosen;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            departmentChosen = resDept[i];
          }
        };

   connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: departmentChosen.id
    },
    function(err) {
      if (err) throw err;
      console.log("New role " + answer.title + " successfully added!");
      runSearch();
    }
  );
});
})
};

//Method to remove employee
function removeAnEmployee() {
  const chosenEmployee = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function(err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        const empList = response[i].name;
        chosenEmployee.push(empList);
    };

  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "rawlist",
        message: "Select the employee you would like to remove:",
        choices: chosenEmployee
      },
  ])
  .then(function(answer) {

    var employeeChosen;
        for (var i = 0; i < response.length; i++) {
          if (response[i].name === answer.employee_id) {
            employeeChosen = response[i];
        }
      };

    connection.query(
      "DELETE FROM employee WHERE id=?",
      [employeeChosen.id],

      function(err) {
        if (err) throw err;
        console.log("Employee successfully removed!");
        runSearch();
      }
    );
   });
  })
};

//Method to update employee role
function updateAnEmployeesRole() {
  var chosenEmployee = [];
    connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function(err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        const empList = response[i].name;
        chosenEmployee.push(empList);
    };
    
    var choicesRole = [];
    connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      const listRoles = resRole[i].title;
      choicesRole.push(listRoles);
    };

    inquirer
    .prompt([
    {
      name: "employee_id",
      type: "rawlist",
      message: "Select the employee you would like to update:",
      choices: chosenEmployee
    },
    {
      name: "role_id",
      type: "rawlist",
      message: "Select employee's new role:",
      choices: choicesRole
    }
  ])
  .then(function(answer) {

    var employeeChosen;
        for (var i = 0; i < response.length; i++) {
          if (response[i].name === answer.employee_id) {
            employeeChosen = response[i];
        }
      };

    var chosenRole;
      for (var i = 0; i < resRole.length; i++) {
        if (resRole[i].title === answer.role_id) {
          chosenRole = resRole[i];
        }
      };
      connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",
        [chosenRole.id, employeeChosen.id],
        function(err) {
          if (err) throw err;
          console.log("Employee new role successfully updated!");
          runSearch();
        }
      );
    })
   })
  })
};

//Method to update employee manager
function updateAnEmployeesManager() {
  var chosenEmployee = [];
     connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee", function(err, response) {
      if (err) throw err;
      for (var i = 0; i < response.length; i++) {
        const empList = response[i].name;
        chosenEmployee.push(empList);
    };

    inquirer
    .prompt([
    {
      name:"employees",
      type: "rawlist",
      message: "Select employee you would like to update manager:",
      choices: chosenEmployee
    },
    {
      name: "Managerid",
      type: "rawlist",
      message: "Select Manager among employees:",
      choices: chosenEmployee
    }
  ])
  .then(function(answer) {

    var employeeChosen;
        for (var i = 0; i < response.length; i++) {
          if (response[i].name === answer.employees) {
            employeeChosen = response[i];
        }
      };
      var chosenManager;
        for (var i = 0; i < response.length; i++) {
          if (response[i].name === answer.Managerid) {
            chosenManager = response[i];
        }
      };
        connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?",

        [chosenManager.id, employeeChosen.id],
        function(err) {
          if (err) throw err;
          console.log("Employee Manager successfully updated!");
          runSearch();
        }
      );
    })
   })
};


module.exports = {runSearch};