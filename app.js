const db = require('./db/queries')
const figlet = require('figlet');


//code from figlet module to display drawing
figlet(`EMPLOYEE Tracker!!  :)`, function(err, data) {
  if (err) {
    console.error(`Error Occurred while loading this application. :( \n
                 Please try again!`);
}
console.log(data)
db.runSearch();
});


