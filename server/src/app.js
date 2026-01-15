import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http" // 1. Import HTTP Server
import { Server } from "socket.io"  // 2. Import Socket.io

const app = express()

// 3. Create HTTP server from Express app
const server = createServer(app)

// 4. Initialize Socket.io
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN, // Must match your Frontend URL
        methods: ["GET", "POST"],
        credentials: true
    }
})

// --- Middlewares ---
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.get(/test,(req,res)=>{
       res.send('hieyujdydf') 
)

// --- Routes Imports ---
import userRouter from './routes/user.routes.js'
import doctorRouter from './routes/doctor.routes.js'
import patientRouter from './routes/patient.routes.js'
import educationRouter from './routes/education.routes.js'
import ComplaintAdmin from "./routes/complaintAdmin.routes.js"
import ComplaintUser from './routes/complaintuser.routes.js'
import travelleradmin from './routes/travelleradmin.routes.js'
import travelleruser from './routes/travelleruser.routes.js'
import cyberadmin from './routes/cyber.routes.js'
import cyberuser from './routes/cyberUser.routes.js'
import educationStudentRouter from "./routes/student.routes.js";
// --- Route Declarations ---
app.use("/api/v1/users", userRouter) 
app.use("/api/v1/doctor", doctorRouter)
app.use("/api/v1/patient", patientRouter)
app.use("/api/v1/education", educationRouter)
app.use("/api/v1/education/student", educationStudentRouter);
app.use("/api/v1/ComplaintAdmin", ComplaintAdmin)
app.use("/api/v1/complaintuser", ComplaintUser)
app.use("/api/v1/traveller", travelleradmin)
app.use("/api/v1/traveller", travelleruser) 
app.use("/api/v1/cyberadmin", cyberadmin)
app.use("/api/v1/cyberuser", cyberuser) 


// --- SOCKET.IO & WEBRTC LOGIC ---



io.on("connection", (socket) => {
    console.log(`Socket Connected: ${socket.id}`);

    // 1. Join a specific Room (e.g., "DOCID-PATIENTID")
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // 2. Text Chat Logic
    socket.on("send-message", (data) => {
        // data = { roomId, message, sender, time, etc. }
        // Broadcast to everyone in the room EXCEPT the sender
        socket.to(data.roomId).emit("receive-message", data);
    });

    // 3. WebRTC Signaling (The Handshake)
    
    // A. Caller sends Offer (Video/Audio capabilities)
    socket.on("call-user", (data) => {
        const { roomId, offer } = data;
        // Forward offer to the other person in the room
        socket.to(roomId).emit("incoming-call", { offer });
    });

    // B. Receiver sends Answer (Acceptance)
    socket.on("call-accepted", (data) => {
        const { roomId, answer } = data;
        // Forward answer back to the caller
        socket.to(roomId).emit("call-answered", { answer });
    });

    // C. Exchange ICE Candidates (Network Paths)
    socket.on("ice-candidate", (data) => {
        const { roomId, candidate } = data;
        // Send candidate to the peer
        socket.to(roomId).emit("incoming-ice-candidate", { candidate });
    });

    socket.on("disconnect", () => {
        console.log("User Disconnected", socket.id);
    });
});


// 5. Export 'server' instead of just 'app'
export { app, server, io };
