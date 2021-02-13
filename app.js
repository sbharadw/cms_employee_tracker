const inquirer = require("inquirer");
const db = require('./db/queries')
const figlet = require('figlet');

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
      db.viewEmployees();
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





