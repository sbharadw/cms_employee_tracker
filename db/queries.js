const connection = require('./connection');
require('console.table');

//Create a class for all queries that can be used in app.js file

class DB {

constructor(connection) {

this.connection = connection;

}  

//Method view all employees
viewEmployees() {
    const query = `SELECT employees.id, employees.first_name, employees.last_name, role.title, departments.name AS department, role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employees LEFT JOIN role on employees.role_id = role.id 
    LEFT JOIN departments on role.department_id = departments.id LEFT JOIN employees manager on manager.id = employees.manager_id;`;
    this.connection.query(query, function(err, query){
        console.table(query);
        runSearch();
    });
};

//Method view all employees by department
viewEmployeesByDepartment() {
    const query =`SELECT departments.name AS department, employees.id, employees.first_name, employees.last_name, role.title FROM employees LEFT JOIN role on 
    employees.role_id = role.id LEFT JOIN departments departments on role.department_id = departments.id WHERE departments.id;`;
    this.connection.query(query, function(err, query){
      console.table(query);
      runSearch();
  });
};

//Method to view all departments
viewDepartment() {
  const query = `select id AS Dept_ID, name AS departments from departments;`;
  this.connection.query(query, function(err, query){
    console.table(query);
    runSearch();
  });
};

//Method to view all roles
viewRoles() {
  const query = `select id AS Role_ID, title, salary AS Salaries from role;`;
  this.connection.query(query, function(err, query){
    console.table(query);
    runSearch();
  });
};

//Method to add a new employee
addAnEmployee() {
  //arrays to display prompt choices from database items 
  const roleChoice = [];
  this.connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      const roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    const deptChoice = [];
    this.connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        const deptList = resDept[i].name;
        deptChoice.push(deptList);
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
      choices: roleChoice
    },
    {
      name: "department_id",
      type: "rawlist",
      message: "Select employee's department:",
      choices: deptChoice
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

        var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };
      //connection to insert response into database  
      this.connection.query(
        "INSERT INTO employees SET ?",
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_id: chosenRole.id,
          department_id: chosenDept.id
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
addDepartment() {
  inquirer
    .prompt([
    {
      name: "dept",
      type: "input",
      message: "Enter new department's name:"
    }
  ])
  .then(function(answer) {
    this.connection.query(
      "INSERT INTO departments SET ?",
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
addARole() {
  const deptChoice = [];
    this.connection.query("SELECT * FROM departments", function(err, resDept) {
      if (err) throw err;
      for (var i = 0; i < resDept.length; i++) {
        const deptList = resDept[i].name;
        deptChoice.push(deptList);
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
    choices: deptChoice
  }
])
.then(function(answer) {

  var chosenDept;
        for (var i = 0; i < resDept.length; i++) {
          if (resDept[i].name === answer.department_id) {
            chosenDept = resDept[i];
          }
        };

  this.connection.query(
    "INSERT INTO role SET ?",
    {
      title: answer.title,
      salary:answer.salary,
      department_id: chosenDept.id
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
removeAnEmployee() {
  const empChoice = [];
    this.connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        const empList = resEmp[i].name;
        empChoice.push(empList);
    };

  inquirer
    .prompt([
      {
        name: "employee_id",
        type: "rawlist",
        message: "Select the employee you would like to remove:",
        choices: empChoice
      },
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

    this.connection.query(
      "DELETE FROM employees WHERE id=?",
      [chosenEmp.id],

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
updateAnEmployeesRole() {
  var empChoice = [];
    this.connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        const empList = resEmp[i].name;
        empChoice.push(empList);
    };
    
    var roleChoice = [];
  this.connection.query("SELECT * FROM role", function(err, resRole) {
    if (err) throw err;
    for (var i = 0; i < resRole.length; i++) {
      const roleList = resRole[i].title;
      roleChoice.push(roleList);
    };

    inquirer
    .prompt([
    {
      name: "employee_id",
      type: "rawlist",
      message: "Select the employee you would like to update:",
      choices: empChoice
    },
    {
      name: "role_id",
      type: "rawlist",
      message: "Select employee's new role:",
      choices: roleChoice
    }
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employee_id) {
            chosenEmp = resEmp[i];
        }
      };

    var chosenRole;
      for (var i = 0; i < resRole.length; i++) {
        if (resRole[i].title === answer.role_id) {
          chosenRole = resRole[i];
        }
      };
      this.connection.query(
        "UPDATE employees SET role_id = ? WHERE id = ?",
        [chosenRole.id, chosenEmp.id],
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
updateAnEmployeesManager() {
  var empChoice = [];
    this.connection.query("SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employees", function(err, resEmp) {
      if (err) throw err;
      for (var i = 0; i < resEmp.length; i++) {
        const empList = resEmp[i].name;
        empChoice.push(empList);
    };

    inquirer
    .prompt([
    {
      name:"employees",
      type: "rawlist",
      message: "Select employee you would like to update manager:",
      choices: empChoice
    },
    {
      name: "Managerid",
      type: "rawlist",
      message: "Select Manager among employees:",
      choices: empChoice
    }
  ])
  .then(function(answer) {

    var chosenEmp;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.employees) {
            chosenEmp = resEmp[i];
        }
      };
      var chosenManager;
        for (var i = 0; i < resEmp.length; i++) {
          if (resEmp[i].name === answer.Managerid) {
            chosenManager = resEmp[i];
        }
      };
      this.connection.query(
        "UPDATE employees SET manager_id = ? WHERE id = ?",

        [chosenManager.id, chosenEmp.id],
        function(err) {
          if (err) throw err;
          console.log("Employee Manager successfully updated!");
          runSearch();
        }
      );
    })
   })
};

}

module.exports = DB;