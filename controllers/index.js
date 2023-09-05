const db = require("../models");
const StudentsModel = db.students;
const redisClient = require("../models/redis")

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
//it checks if the data is in cache or not

const findFunction = async (id) => {

  // const cachedData = await redisClient.getValues(`student:${id}`);
  const cachedData = await redisClient.getValues(`student:${id}`);
  if (cachedData) {
    console.log("The data found in Cache")
    return JSON.parse(cachedData)

  }
  else {
    const mongoData = await StudentsModel.findById(id)


    if (mongoData) {
      console.log("The data found in MongoDB")
      // await redisClient.setValues(`student:${id}`, JSON.stringify(mongoData));
      await redisClient.setValues(`student:${id}`, JSON.stringify(mongoData));

      return mongoData;

    }
    else { return null }

  }
};

exports.findById = (req, res) => {
  const id = req.params.id;
  findFunction(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Students with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Students with id=" + id + err });
    });
};

const updateCache= async(id)=>{
   const data = await StudentsModel.findById(id)
  // await redisClient.setValues(`student:${id}`, JSON.stringify(data));
  await redisClient.setValues(`student:${id}`, JSON.stringify(data));

return
}


exports.updateStudents = async (req, res) => {

  const updatevalues = req.body
  if (Object.values(updatevalues).length == 0) {
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
    .then( (data) => {
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
   
    updateCache(stId)
};






// ///temp tala koo
// exports.updateStudents = async (req, res) => {

//   const updatevalues = req.body
//   if (Object.values(updatevalues).length == 0) {
//     console.log("No body is  provided");
//     res.send({
//       message: "Data to update must not be empty",
//     });
//     return;
//   }

//   let stId = req.params.id;
// let doc = await StudentsModel.findById(stId)
// if(doc){
// await doc.update(updatevalues)
// .then( (data) => {
//   if (!data) {
//     res.status(404).send({
//       message: `Cannot update STUDENTS with id=${stId}. Maybe Student was not found!`,
//     });
//   }


// res.status(200).send({
//     message: `Data successfully updatedf for id =${stId}`,
//   });

//   updateCache(stId,data)
// })

// .catch((err) => {
//   res
//     .status(500)
//     .send({ message: "Error retrieving Students with id=" + stId + err });
// });}

// else{
//   console.log("No data Available");
//   res
//     .status(500)
//     .send({ message: "Error retrieving Students with id=" + stId + err });

// }
// }













//softdelete the students document
exports.softDeleteStudents = (req, res) => {
  const deleteid = req.params.id;

  if (!deleteid) {
    res.send({
      message: "Data to be deleted is required"
    })
  }
  const update = { IsDeleted: true }
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

//DeleteBothDatabase it deletes data from both cache and mongoDB
const DeleteFromCache = async (stId) => {
  let delCache;
  const cachedData = await redisClient.getValues(`student:${stId}`);
  
  if (cachedData) {
    delCache = await redisClient.delValues(`student:${stId}`);
    if (delCache) {
return true   
 }
    else {
return false    }
  }
  
}

exports.hardDeleteStudents = async (req, res) => {
  stId = req.params.id;
  const del= await DeleteFromCache(stId);
  if(del){
    console.log("Deleted from cache");

  }
  else{
    console.log("Could not Delete from cache");

  }

  await StudentsModel.findByIdAndRemove(stId, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.send({
          message: `Could not delete the data`
        })
        return
      }
      res.send({ message: `The student data is deleted with id: ${stId}` })

    })

    .catch(err => {
      res.send({
        message: `There is an error ${err}`
      })

    })
}




