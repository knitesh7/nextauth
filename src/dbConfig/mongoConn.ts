import mongoose from "mongoose";
const dbUrl = process.env.MONGO_URI
const mongodbConnector = async()=>{
    try {
        await mongoose.connect(dbUrl!) 
        console.log('Connected to MongoDB!')
    } catch (error) {
        console.log(error)
    }
}

export default mongodbConnector