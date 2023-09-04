var router = require("express").Router();
const students = require("../controllers/");
const redisClient= require("../models/redis")
module.exports = (app) => {


  router.get("/home", (req,res) => {
    res.send("This is a Home Page")

  })
  // Create a new Student
  router.post("/createstudents", students.createStudents);

  // Retrieve all Students
  router.get("/findstudents", students.findAllStudents);



  // Retrieve a single Student with CRN
  router.get("/findstudentbyid/:id", students.findById);

  // Update a Student with id
  router.put("/updatestudent/:id", students.updateStudents);

  // Delete a Student with id [soft Delete students that is set the isDelete to 0]
  router.delete("/deletestudents/:id", students.softDeleteStudents);

  // Create a new Student
  router.delete("/harddeletestudent/:id", students.hardDeleteStudents);

  app.use("/api/students", router);
};