
import dotenv from 'dotenv'
import connectDB from  "./db/index.js"
import express from 'express'


dotenv.config({
    path:  './env'
})
 connectDB()
.then(() => {
    try {
        app.listen(process.env.PORT || 8000)
        console.log(`Server is running on port ${process.env.PORT || process.env.PORT}`)
    } catch (error) {
        console.log("Server is not running", error)
        
    }
    
})
.catch((err) => {
    console.log ("MONGO DB CONNECTION ERROR", err)
}
)