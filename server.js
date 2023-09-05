const dotenv= require('dotenv')
const  express = require("express");
const route= require("./Routes/route");
const bodyParser = require('body-parser');
const db = require("./models/index");
const {promisify} = require("util");
const redisClient = require("./models/redis")
const {cache} = require("./controllers/index");


dotenv.config()

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json())
// app.use(cache)

// app.use('/',route)
route(app)
const port = process.env.PORT;
redisClient.redisInit()
// redisClient.setValues("jpt","test")

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
