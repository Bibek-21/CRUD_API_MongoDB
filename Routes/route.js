const router= require('express').Router();

router.get('/',(req,res)=>{
res.send("We are building CRUD API usiing MongoDB")
})




module.exports= router;