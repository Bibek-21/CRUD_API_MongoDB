var router = require("express").Router();

module.exports = (app) => {
  const students = require("../controllers/");


  router.get("/home", (req,res) => {
    res.send("This is a Home Page")

  })
  // Create a new Student
  router.post("/createstudents", students.createStudents);

  // Retrieve all Students
  router.get("/findstudents", students.findAllStudents);



  // Retrieve a single Student with id
  router.get("/findstudents/:id", students.findById);

  // Update a Student with id
  router.put("/updatestudent/:id", students.updateStudents);

  // // Delete a Student with id
  // router.delete("/:id", students.delete);

  // // Create a new Student
  // router.delete("/", students.deleteAll);

  app.use("/api/students", router);
};