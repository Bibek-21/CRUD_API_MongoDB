const { error } = require("console");
const redis = require("redis");
const { promisify } = require("util");
require("dotenv").config()

let redisClient = null

module.exports = {
    redisInit : async ()=> {
        redisClient = redis.createClient({
            url: "redis://127.0.0.1:6379"
        })

        await redisClient.connect();

        redisClient.on("connected",()=>{
            console.log("Redis is connected");
        })
        redisClient.on("error",(error)=>{
            console.log("Redis error   "+error);
        })
    },
    setValues: async (key, value)=> {
        let result = await redisClient.set(key, value)
        console.log(result)
        return true
    },

    getValues: async(key)=>{
        let result = await redisClient.get(key)
        return result
    }
}




// try {
//     redisClient.getAsync= promisify(redisClient.get).bind(redisClient)
//     redisClient.setAsync= promisify(redisClient.set).bind(redisClient)



// } catch (error) {
//     console.log(`Redis error: ${error}`);
// }

global.Cache= redisClient;
// module.exports = redisClient;