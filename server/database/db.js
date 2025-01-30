// import mongoose from "mongoose";

// export const connectDb=async()=>{
//     try{
//          await mongoose.connect(process.env.DB);
//          console.log("Database connected");
//     }catch(error){
//         console.log(error)
//     }
// }


import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false,
        });
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error.message);
    }
};
