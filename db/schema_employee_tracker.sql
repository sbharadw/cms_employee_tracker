/* App. database Schema */
DROP DATABASE IF EXISTS schema_employee_tracker;
CREATE DATABASE schema_employee_tracker;

USE schema_employee_tracker;

CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) UNIQUE NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(20,5) NOT NULL,
  department_id INT,
  PRIMARY KEY (id), 
  FOREIGN KEY (department_id) REFERENCES department (id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT,
  manager_id INT NULL,
  PRIMARY KEY(id),
  FOREIGN KEY(role_id) REFERENCES role (id) ON DELETE CASCADE, 
  FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);


/*

SELECT * FROM schema_employee_tracker.department;

SELECT * FROM schema_employee_tracker.role;

SELECT d.name, r.title from role r inner join department d ON d.id = r.department_id;

SELECT * FROM schema_employee_tracker.employee;

DELETE FROM schema_employee_tracker.employee WHERE id = 3;


*/