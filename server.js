import express from 'express';
import dotenv from 'dotenv';
import connection from './db_connection.js'
const app = express()
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json())


//routes=====


app.get('/',(req,res)=>{
    res.send("<h1>Welcome Auth System</h1>")
})
app.listen(PORT,()=>{
    console.log(`Server running on the port ${PORT}`)
})