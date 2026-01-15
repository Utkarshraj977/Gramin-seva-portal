import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { 
  Send, Phone, Video, MoreVertical, Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff, ArrowLeft
} from 'lucide-react';

const peerConfiguration = {
  iceServers: [ 
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}; 

const ChatRoom = ({ roomId, currentUser, targetUser }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  
  // Call State
  const [isInCall, setIsInCall] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [callOffer, setCallOffer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  
  // Media Controls
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  // Refs
  const myVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // --- 1. INITIALIZE SOCKET ---
  useEffect(() => {
    // Connect to Backend
    const newSocket = io('http://localhost:8000'); 
    setSocket(newSocket);

    // DEBUG LOGS
    console.log(`🔌 Joining Room: ${roomId}`);
    console.log(`👤 My ID: ${currentUser.id}`);

    // Join the specific room
    newSocket.emit('join-room', roomId);

    // LISTEN FOR MESSAGES
    newSocket.on('receive-message', (data) => {
      console.log("📩 Message Received:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // LISTEN FOR CALLS (Signaling)
    newSocket.on('incoming-call', ({ offer }) => {
      setIsIncomingCall(true);
      setCallOffer(offer);
    });

    newSocket.on('call-answered', async ({ answer }) => {
      const pc = peerConnectionRef.current;
      if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
    });

    newSocket.on('incoming-ice-candidate', async ({ candidate }) => {
       const pc = peerConnectionRef.current;
       if (pc && candidate) await pc.addIceCandidate(new RTCIceCandidate(candidate));
    });

    // Cleanup on unmount
    return () => newSocket.disconnect();
  }, [roomId]);

  // --- 2. AUTO-SCROLL TO BOTTOM ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  // --- 3. SEND MESSAGE FUNCTION ---
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const msgData = {
      roomId,
      senderId: String(currentUser.id), // Ensure String for comparison
      text: currentMessage,
      time: timeNow,
    };
    
    // 1. Add to my own screen immediately (Optimistic UI)
    setMessages((list) => [...list, msgData]);
    
    // 2. Send to server so the other person gets it
    socket.emit('send-message', msgData);
    
    // 3. Clear input
    setCurrentMessage("");
  };

  // --- WEBRTC CALL FUNCTIONS ---
  const createPeerConnection = async () => {
    const pc = new RTCPeerConnection(peerConfiguration);
    pc.onicecandidate = (e) => {
      if (e.candidate) socket.emit('ice-candidate', { roomId, candidate: e.candidate });
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
    };
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    setMyStream(stream);
    if (myVideoRef.current) myVideoRef.current.srcObject = stream;
    stream.getTracks().forEach(track => pc.addTrack(track, stream));
    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async () => {
    setIsInCall(true);
    const pc = await createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit('call-user', { roomId, offer });
  };

  const answerCall = async () => {
    setIsIncomingCall(false);
    setIsInCall(true);
    const pc = await createPeerConnection();
    await pc.setRemoteDescription(new RTCSessionDescription(callOffer));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    socket.emit('call-accepted', { roomId, answer });
  };

  const endCall = () => {
    const pc = peerConnectionRef.current;
    if (pc) pc.close();
    if (myStream) myStream.getTracks().forEach(track => track.stop());
    setMyStream(null);
    setIsInCall(false);
    setIsIncomingCall(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#efe7dd] relative font-sans">
      
      {/* --- HEADER --- */}
      <div className="bg-[#008069] p-3 flex justify-between items-center text-white shadow-md z-10 shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src={targetUser?.avatar || "https://ui-avatars.com/api/?name=User"} 
            className="w-10 h-10 rounded-full object-cover bg-white/20" 
            alt="user"
          />
          <div>
            <h3 className="font-semibold text-base">{targetUser?.name || "Unknown User"}</h3>
            <p className="text-xs text-green-100 opacity-90">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button onClick={startCall} className="hover:bg-white/10 p-2 rounded-full transition"><Video size={22} /></button>
          <button className="hover:bg-white/10 p-2 rounded-full transition"><Phone size={20} /></button>
          <button className="hover:bg-white/10 p-2 rounded-full transition"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* --- CHAT MESSAGES AREA --- */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-30">
        {messages.map((msg, index) => {
            // FIX: Convert both IDs to String for safe comparison
            const isMe = String(msg.senderId) === String(currentUser.id);

            return (
              <div key={index} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`relative max-w-[65%] px-3 py-2 text-sm shadow-sm ${
                    isMe 
                      ? 'bg-[#d9fdd3] text-gray-900 rounded-lg rounded-tr-none' // WhatsApp Green for Me
                      : 'bg-white text-gray-900 rounded-lg rounded-tl-none'     // White for Them
                  }`}
                >
                  <p className="break-words leading-relaxed">{msg.text}</p>
                  <span className={`text-[10px] block text-right mt-1 ${isMe ? 'text-green-800' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            );
        })}
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </div>

      {/* --- INPUT AREA --- */}
      <div className="bg-[#f0f2f5] p-3 flex items-center gap-2 shrink-0">
        <input 
          type="text"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message"
          className="flex-1 py-3 px-4 rounded-lg border-none focus:outline-none focus:ring-1 focus:ring-green-500 bg-white shadow-sm text-sm"
        />
        <button 
          onClick={sendMessage}
          className={`p-3 rounded-full transition shadow-sm ${
             currentMessage.trim() ? 'bg-[#008069] text-white hover:bg-[#006a57]' : 'bg-transparent text-gray-500'
          }`}
          disabled={!currentMessage.trim()}
        >
          <Send size={20} />
        </button>
      </div>

      {/* --- CALL OVERLAY --- */}
      {isInCall && (
        <div className="absolute inset-0 z-40 bg-gray-900 flex flex-col">
            <div className="flex-1 relative">
                <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-4 right-4 w-32 h-48 bg-black rounded-lg overflow-hidden border-2 border-white shadow-xl">
                    <video ref={myVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                </div>
            </div>
            <div className="h-20 bg-gray-800 flex items-center justify-center gap-6">
                <button onClick={() => { if(myStream) { myStream.getAudioTracks()[0].enabled = !micOn; setMicOn(!micOn); } }} className={`p-3 rounded-full ${micOn ? 'bg-gray-600' : 'bg-red-500'}`}>
                    {micOn ? <Mic size={24} className="text-white"/> : <MicOff size={24} className="text-white"/>}
                </button>
                <button onClick={endCall} className="p-4 rounded-full bg-red-600 hover:bg-red-700">
                    <PhoneOff size={28} className="text-white" />
                </button>
                <button onClick={() => { if(myStream) { myStream.getVideoTracks()[0].enabled = !cameraOn; setCameraOn(!cameraOn); } }} className={`p-3 rounded-full ${cameraOn ? 'bg-gray-600' : 'bg-red-500'}`}>
                    {cameraOn ? <VideoIcon size={24} className="text-white"/> : <VideoOff size={24} className="text-white"/>}
                </button>
            </div>
        </div>
      )}
      
      {isIncomingCall && (
        <div className="absolute inset-0 z-50 bg-black/80 flex flex-col items-center justify-center text-white animate-in fade-in">
          <img src={targetUser?.avatar} className="w-24 h-24 rounded-full mb-4 border-4 border-white animate-pulse" alt="" />
          <h2 className="text-2xl font-bold mb-2">{targetUser?.name} is calling...</h2>
          <div className="flex gap-8 mt-8">
            <button onClick={answerCall} className="bg-green-500 hover:bg-green-600 p-4 rounded-full shadow-lg hover:scale-110"><Phone size={32} /></button>
            <button onClick={() => setIsIncomingCall(false)} className="bg-red-500 hover:bg-red-600 p-4 rounded-full shadow-lg hover:scale-110"><PhoneOff size={32} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatRoom;