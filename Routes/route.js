module.exports = app => {
  const students = require("../controllers/");

  var router = require("express").Router();

  router.get("/", (req,res) => {
    res.send("This is a Home Page")

  })
  // Create a new Student
  router.post("/createstudents", students.createStudents);

  // // Retrieve all Students
  // router.get("/", students.findAll);



  // // Retrieve a single Student with id
  // router.get("/:id", students.findOne);

  // // Update a Student with id
  // router.put("/:id", students.update);

  // // Delete a Student with id
  // router.delete("/:id", students.delete);

  // // Create a new Student
  // router.delete("/", students.deleteAll);

  // app.use("/api/students", router);
};