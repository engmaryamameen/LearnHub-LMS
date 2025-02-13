import express from 'express'
import cors from 'cors'
import 'dotenv/config'

// initialize express 
const app = express();

// middleware
app.use(cors());


// Route 
app.get('/', (req,res)=>{
    res.send("Edemy API is working fine!")
})

// port
const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server is running on ${PORT}`);
    
})