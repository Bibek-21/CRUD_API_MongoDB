const db = require('../models');
const Students = db.students;


//create and save a new students
exports.createStudents = (req, res) => {

    if (!FirstName || !LastName || CRN || DOB || Guardian) {
        res.status(400).send("Please submit the valid Details")
        return;
    }


    //create a students object  these values are get by postman
    const students = new students({
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        CRN: req.body.CRN,
        Contact:req.body.Contact ? req.body.Contact : "98XXXXX",
        DOB: req.body.DOB,
        Guardian: req.body.Guardian,
        Address:req.body.Address ,
        IsDeleted: req.body.IsDeleted ? req.body.IsDeleted : 0
    })

    //save Students in the Database 
    Students
    .save(students)
    then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });

}