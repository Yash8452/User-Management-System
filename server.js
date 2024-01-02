import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db_connection.js'
import authRoutes from './routes/authRoutes.js'


//config env
dotenv.config();

//database connection
connectDB();

const app = express()

const PORT = process.env.PORT;

app.use(express.json())

//routes==================
app.use("/api/v1/auth", authRoutes);

app.get('/',(req,res)=>{
    res.send("<h1>Welcome Auth System</h1>")
})
app.listen(PORT,()=>{
    console.log(`Server running on the port ${PORT}`)
})