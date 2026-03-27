const mongoose=require('mongoose')

async function connectDB() {
    const uri=process.env.MONGO_URI
    try{
        await mongoose.connect(uri,{dbName:'yapyap'})
    }catch(err){
        console.error('mongo db error',err)
        process.exit(1)
    }
}
module.exports={connectDB}