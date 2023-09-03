const db = require("../models");
const StudentsModel = db.students;

//create and save a new students
exports.createStudents = (req, res) => {




  //create a students object  these values are get by postman
  const students = {
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    CRN: req.body.CRN,
    Contact: req.body.Contact ? req.body.Contact : "98XXXXX",
    DOB: req.body.DOB,
    Guardian: req.body.Guardian,
    Address: req.body.Address,
    IsDeleted: req.body.IsDeleted ? req.body.IsDeleted : 0
  }
  if (!students.FirstName || !students.LastName || !students.CRN || !students.DOB || !students.Guardian) {
    res.status(400).send("Please submit the valid Details")
    return;
  }

  StudentsModel.create(students)
    .then(data => {
      res.status(200)
        .send({
          message: "The students document is created",
          info: data
        })
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student.",
      });
    });
};

//Finding all students with name i.e. first name Example:localhost:3000/api/students?ram
exports.findAllStudents = (req, res) => {
  const StudentName = req.query.FirstName;

  let condition = StudentName
    ? { FirstName: { $regex: `${StudentName}`, $options: "i" } }  //check this in mongoDb to ensure the output is true
    : {}; //i refers to case insensitive

  // console.log(condition);
  StudentsModel.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Student.",
      });
    });
};

//find students by id in req params Example:localhost:3000/api/students/id

exports.findById = (req, res) => {
  const id = req.params.id;
  StudentsModel.findById(id)
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



exports.updateStudents = async (req, res) => {

  const updatevalues= req.body
  if (Object.values(updatevalues).length==0) {
    console.log("No body is  provided");
    res.send({
      message: "Data to update must not be empty",
    });
    return;
  }

    console.log(updatevalues);
    let stId = req.params.id;

   await StudentsModel
      .findByIdAndUpdate(stId, updatevalues, { useFindAndModify: false })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update STUDENTS with id=${stId}. Maybe Student was not found!`,
          });
        }
        res.status(200).send({
          message: `Data successfully updatedf for id =${stId}`,
        });
      })

      .catch((err) => {
        res
          .status(500)
          .send({ message: "Error retrieving Students with id=" + stId + err });
      });
  
};


//softdelete the students document
exports.softDeleteStudents= (req,res)=>{
  const deleteid= req.params.id;

if(!deleteid){
  res.send({
    message:"Data to be deleted is required"
  })
}
const update={IsDeleted:true}
StudentsModel
.findByIdAndUpdate(deleteid, update, { useFindAndModify: false })
.then((data) => {
  if (!data) {
    res.status(404).send({
      message: `Cannot update(delete) STUDENTS with id=${deleteid}. Maybe Student was not found!`,
    });
  }
  res.status(200).send({
    message: `Data successfully updated(delete) for id =${deleteid}`,
  });
})

.catch((err) => {
  res
    .status(500)
    .send({ message: "Error retrieving Students with id=" + stId + err });
});
}


exports.hardDeleteStudents= async(req,res)=>{
console.log("errrrrrrrrrrrrrrrrrrrrrrrrrrrr");
   stId= req.params.id;

   await StudentsModel.findByIdAndRemove(stId,{useFindAndModify:false}) 
   .then(data=>{
    if(!data){
      res.send({
        message:`Could not delete the data`
      })
      return
    }
res.send({message:`The student data is deleted with id: ${stId}`})

   })

   .catch(err=>{
    res.send({
      message:`There is an error ${err}`
    })

   })
}