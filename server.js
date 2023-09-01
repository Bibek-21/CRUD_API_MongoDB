const dotenv= require('dotenv')
const  express = require("express");
const route= require("./Routes/route");
const bodyParser = require('body-parser');
const db = require("./models/index");

dotenv.config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));


app.use('/',route)


const port = process.env.PORT;

app.listen(port, async () => {
  
db.mongoose
.connect(db.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("Connected to the database!");
})
.catch(err => {
  console.log("Cannot connect to the database!", err);
  process.exit();
});
  console.log(`server up on port ${port}`);
});
