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
        let result = await redisClient.set(key, value, "EX", 60)
        console.log(result)
        return true
    },

    getValues: async(key)=>{
        let result = await redisClient.get(key)
        return result
    },
    delValues: async(key)=>{
        let result= await redisClient.del(key);
        return result;
    }
}





global.Cache= redisClient;
