INSERT INTO schema_employee_tracker.department (name)
VALUES ("Engineering"), ("Legal"), ("IT"), ("Marketing"), ("Accounting"), ("Finance"), ("Operations"), ("Sales");

INSERT INTO schema_employee_tracker.role (title, salary, department_id )
VALUES ("Lead Engineer", 140000, 1), ("Software Engineer", 100000, 1), ("Lawyer", 200000, 2), ("Senior Marketing Lead", 90000, 4), ("Associate Accountant", 50000, 5), ("Senior Accountant", 85000, 5), ("Financial Analyst", 65000, 6), ("Sale Associate", 50000, 8), ("Senior Sales Associate", 70000, 8), ("Lead Financial Analyst", 80000, 6);

INSERT INTO schema_employee_tracker.employee (first_name, last_name, role_id)
VALUES ("Kim", "K", 8), ("Jon", "Snow", 2), ("Paul", "J", 7), ("Dwayne", "The Rock", 10);
