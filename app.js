const inquirer = require("inquirer");
const connection = require('./db/connection');
const Db = require('./db/queries')
const figlet = require('figlet');
require('console.table');

let myDb = new Db(connection);

//code from figlet module to display drawing
figlet(`EMPLOYEE Tracker!!  :)`, function(err, data) {
  if (err) {
    console.log(`There was an error loading this application. :( \n
                 Please try again!`);
    console.dir(err);
    return;
}
console.log(data)
runSearch();
});

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
      myDb.viewEmployees();
      break;

    case "View All Employees By Department":
      myDb.viewEmployeesByDepartment();
      break;

    case "View departments":
      myDb.viewDepartment();
      break;
    
    case "View roles":
      myDb.viewRoles();
      break;

    case "Add Employee":
      myDb.addAnEmployee();
      break;
  
    case "Add department":
      myDb.addDepartment();
      break;
    
    case "Add role":
      myDb.addARole();
      break;

    case "Remove Employee":
      myDb.removeAnEmployee();
      break;
    
    case "Update Employee Role":
      myDb.updateAnEmployeesRole();
      break;
    
    case "Update Employee Manager":
      myDb.updateAnEmployeesManager();
      break;
    
    case "Log Off":
      console.log("Thank you, have an awesome day ahead! :) ")
      process.exit();
    }
  });
}



