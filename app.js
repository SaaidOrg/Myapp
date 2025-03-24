const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: '*' })); // Allow cross-origin requests

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'employees.json'); // Absolute path to employees.json

// Read employees from file
const getEmployees = () => {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile));
};

// Write employees to file
const saveEmployees = (employees) => {
  fs.writeFileSync(dataFile, JSON.stringify(employees, null, 2));
};

// Create Employee
app.post('/employees', (req, res) => {
  const employees = getEmployees();
  const newEmployee = { id: Date.now(), ...req.body };
  employees.push(newEmployee);
  saveEmployees(employees);
  res.status(201).json(newEmployee);
});

// Get Employees
app.get('/employees', (req, res) => {
  res.json(getEmployees());
});

// Delete Employee
app.delete('/employees/:id', (req, res) => {
  let employees = getEmployees();
  employees = employees.filter(emp => emp.id != req.params.id);
  saveEmployees(employees);
  res.json({ message: 'Employee deleted' });
});

// Update Employee
app.put('/employees/:id', (req, res) => {
  const employees = getEmployees();
  const employeeIndex = employees.findIndex(emp => emp.id == req.params.id);
  if (employeeIndex !== -1) {
    const updatedEmployee = { ...employees[employeeIndex], ...req.body };
    employees[employeeIndex] = updatedEmployee;
    saveEmployees(employees);
    res.json(updatedEmployee);
  } else {
    res.status(404).json({ message: 'Employee not found' });
  }
});

// Export the app to be used in bin/www
module.exports = app;

// Ensure the app is running on the correct port
const https = require('https');
const fs = require('fs');
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'privatekey.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'server.crt'))
};

https.createServer(sslOptions, app).listen(8443, () => {
  console.log('Server started on https://localhost:8443');
});
