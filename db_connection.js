import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.set("strictQuery", false);

mongoose.connect(process.env.DB_CONNECTION);

const connection = mongoose.connection;
connection.on('connected', () => {
  console.log('MongoDB database connection established successfully');
});

connection.on('error',()=>{
    console.log("Error connecting to the database")
})

export default connection