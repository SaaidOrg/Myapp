const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();


app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));   

const dataFile = '/var/myapp/employees.json';  


const getEmployees = () => {
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
  }
  
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
};


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

module.exports = app;
