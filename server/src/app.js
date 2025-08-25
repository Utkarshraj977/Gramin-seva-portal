import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


import userRouter from './routes/user.routes.js'
import doctorRouter from './routes/doctor.routes.js'
import patientRouter from './routes/patient.routes.js'
import educationRouter from './routes/education.routes.js'
import studentRouter from './routes/student.routes.js'
import  ComplaintAdmin  from "./routes/complaintAdmin.routes.js"
import  ComplaintUser  from './routes/complaintuser.routes.js'
import  travelleradmin  from './routes/travelleradmin.routes.js'
import  travelleruser  from './routes/travelleruser.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/doctor",doctorRouter)
app.use("/api/v1/patient",patientRouter)
app.use("/api/v1/education",educationRouter)
app.use("/api/v1/student",studentRouter)
app.use("/api/v1/ComplaintAdmin", ComplaintAdmin)
app.use("/api/v1/complaintuser",ComplaintUser)
app.use("/api/v1/traveller",travelleradmin)
app.use("/api/v1/traveller",travelleruser)

export {app} ;

