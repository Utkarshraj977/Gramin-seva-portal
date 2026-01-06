import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Users, MapPin, BookOpen, CheckCircle, Search, User, Layers } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const EducationDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/v1/education/allstudent",
          {}, 
          { withCredentials: true }
        );
        const studentList = response.data?.data || [];
        setStudents(studentList);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSelectStudent = async (username) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/v1/education/allstudent/sumbit/${username}`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(`Student selected successfully!`);
        setStudents((prev) =>
          prev.map((stu) =>
            stu.userInfo?.username === username
              ? { ...stu, message: "selected" }
              : stu
          )
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    }
  };

  // 👇 SAFE FILTER LOGIC
  const filteredStudents = students.filter((stu) => {
    // Agar userInfo null hai (backend issue), toh empty string maano taaki crash na ho
    const name = stu.userInfo?.fullname || "";
    const subject = stu.subject || "";
    
    return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <Toaster position="top-right" />
      
      <div className="bg-blue-900 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold flex items-center gap-3">
              <Users className="text-amber-400" /> Educator Dashboard
            </h1>
            <p className="text-blue-200 text-sm mt-1">Manage your enrolled students and applications.</p>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or subject..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-blue-800/50 border border-blue-700 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-blue-300 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                      <p className="text-gray-500 text-sm font-semibold">Total Students</p>
                      <h3 className="text-3xl font-bold text-blue-900">{students.length}</h3>
                   </div>
                   <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users size={24}/></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div>
                      <p className="text-gray-500 text-sm font-semibold">Pending Review</p>
                      <h3 className="text-3xl font-bold text-amber-600">
                        {students.filter(s => s.message !== 'selected').length}
                      </h3>
                   </div>
                   <div className="bg-amber-100 p-3 rounded-full text-amber-600"><CheckCircle size={24}/></div>
                </div>
             </div>

             <h2 className="text-xl font-bold text-gray-800 mb-4">Student List</h2>
             
             {filteredStudents.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                  <User className="w-16 h-16 text-gray-300 mx-auto mb-4"/>
                  <p className="text-gray-500">No students found.</p>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStudents.map((student) => (
                    <motion.div 
                      key={student._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -5 }}
                      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all ${student.message === 'selected' ? 'border-green-500/50 ring-1 ring-green-500/20' : 'border-gray-200 hover:shadow-md'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center text-xl font-bold text-gray-400">
                             {student.userInfo?.avatar ? (
                               <img src={student.userInfo.avatar} alt="User" className="w-full h-full object-cover" />
                             ) : (
                               student.userInfo?.fullname?.[0] || "S"
                             )}
                          </div>
                          <div>
                            {/* Safer Name Rendering */}
                            <h3 className="font-bold text-gray-800">{student.userInfo?.fullname || "Student Name Missing"}</h3>
                            <p className="text-xs text-gray-500">@{student.userInfo?.username || "username"}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.message === 'selected' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                          {student.message === 'selected' ? 'Enrolled' : 'Pending'}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <Layers size={16} className="text-blue-500"/>
                           <span>Class: <strong>{student.clas}</strong> ({student.board})</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <BookOpen size={16} className="text-blue-500"/>
                           <span>Subject: {student.subject}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                           <MapPin size={16} className="text-blue-500"/>
                           <span>{student.location}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectStudent(student.userInfo?.username)}
                        disabled={student.message === 'selected'}
                        className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                          student.message === 'selected'
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                        }`}
                      >
                        {student.message === 'selected' ? (
                          <>Selected <CheckCircle size={16}/></>
                        ) : (
                          "Approve / Select Student"
                        )}
                      </button>
                    </motion.div>
                  ))}
                </div>
             )}
          </>
        )}
      </div>
    </div>
  );
};

export default EducationDashboard;