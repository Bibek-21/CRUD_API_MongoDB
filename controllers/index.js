const db = require("../models");
const StudentsModel = db.students;

//create and save a new students
exports.createStudents = (req, res) => {
  //create a students object  these values are get by postman
  const students = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    CRN: req.body.CRN,
    Contact: req.body.Contact ? req.body.Contact : "9810000000",
    DOB: req.body.DOB,
    Guardian: req.body.Guardian,
    Address: req.body.Address,
    IsDeleted: req.body.IsDeleted ? req.body.IsDeleted : 0,
  };
  if (
    !students.FirstName ||
    !students.LastName ||
    !students.CRN ||
    !students.DOB ||
    !students.Guardian
  ) {
    res.status(400).send("Please submit the valid Details");
    return;
  }
  //save Students in the Database
  StudentsModel.create(students)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

//Finding all students with name i.e. first name Example:localhost:3000/api/students?ram
exports.findAllStudents = (req, res) => {
  const StudentName = req.query.FirstName;

  var condition = StudentName
    ? { StudentName: { $regex: new RegExp(StudentName), $options: "i" } }
    : {}; //i refers to xse insensitive

  StudentsModel.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Tutorial.",
      });
    });
};

//find students by id in req params Example:localhost:3000/api/students/id

exports.findById = (req, res) => {
  const id = req.params.id;
  StudentsModel.findOne(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Students with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Students with id=" + id });
    });
};

exports.updateStudents = (req, res) => {
  if (!req.body) {
    res.send({
      message: "Data to update must be atleast one",
    });
  }

  const stId= req.params.id;

  StudentsModel.findByIdAndUpdate(stId, req.body, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update STUDENTS with id=${stId}. Maybe Student was not found!`,
        });
      }


      res.status(200).send({
        message: "Data successfully updated",
      });
    })  
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + stId });
    });
};
