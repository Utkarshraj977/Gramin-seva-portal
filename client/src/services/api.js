import axios from 'axios';

// 1. Axios Instance (Common for everyone)
const api = axios.create({
    baseURL: '/api/v1', // Vite Proxy handles this
    withCredentials: true, // Crucial for cookies
});

// ==========================================
//  USER API REQUESTS
// ==========================================
export const user = {
    login: async (userdata) => {
        const response = await api.post('/users/login', userdata);
        return response.data;
    },
    register: async (userdata) => {
        const response = await api.post('/users/register', userdata);
        return response.data;
    },
    logout: async () => {
        const response = await api.post('/users/logout');
        return response.data;
    },
    update_avatar: async (formdata) => {
        const response = await api.patch('/users/update-avatar', formdata);
        return response.data;
    },
    update_account: async (data) => {
        const response = await api.patch('/users/update-account', data);
        return response.data;
    },
    change_password: async (data) => {
        const response = await api.post('/users/change-password', data);
        return response.data;
    },
    getdetail: async () => {
        const response = await api.get('/users/current-user');
        return response.data;
    }
};

// ==========================================
//  DOCTOR API REQUESTS 
// ==========================================

export const doctor = {
    register: async (formData) => {
        const response = await api.post('/doctor/doctorregister', formData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/doctor/doctorlogin', credentials);
        return response.data;
    },
    get_profile: async () => {
        const response = await api.get('/doctor/currentdoctor');
        return response.data;
    },
    get_all_doctors: async () => {
        const response = await api.get('/doctor/getalldoctor');
        return response.data;
    },
    update_profile: async (data) => {
        const response = await api.patch('/doctor/update-profile', data);
        return response.data;
    },
    // ✅ NEW
    accept_request: async (patientId) => {
        const response = await api.patch(`/doctor/accept-request/${patientId}`);
        return response.data;
    },
    reject_request: async (patientId) => {
        const response = await api.patch(`/doctor/reject-request/${patientId}`);
        return response.data;
    },
    remove_patient: async (patientId) => {
        const response = await api.patch(`/doctor/removepatient/${patientId}`);
        return response.data;
    }
};

// ==========================================
//  PATIENT API REQUESTS
// ==========================================
export const patient = {
    register: async (data) => {
        const response = await api.post('/patient/patientregister', data);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/patient/patientlogin', credentials);
        return response.data;
    },
    get_current_patient: async () => {
        const response = await api.get('/patient/currentpatient');
        return response.data;
    },
    // ✅ NEW
    request_doctor: async (doctorId) => {
        const response = await api.patch(`/patient/request-doctor/${doctorId}`);
        return response.data;
    },
    cancel_request: async (doctorId) => {
        const response = await api.patch(`/patient/cancel-request/${doctorId}`);
        return response.data;
    },
    remove_doctor: async (doctorId) => {
        const response = await api.patch(`/patient/remove-doctor/${doctorId}`);
        return response.data;
    },
    update_profile: async (data) => {
        const response = await api.patch('/patient/update-profile', data);
        return response.data;
    }
};
// ==========================================
//  EDUCATION / TEACHER API REQUESTS
// ==========================================
export const education = {
    login: async (credentials) => {
        const response = await api.post('/education/login', credentials);
        return response.data;
    },
    register_profile: async (formData) => {
        const response = await api.post('/education/register', formData);
        return response.data;
    },
    get_current_teacher: async () => {
        const response = await api.get('/education/current-user');
        return response.data;
    },
    update_profile: async (data) => {
        const response = await api.patch('/education/profile/update', data);
        return response.data;
    },
    get_stats: async () => {
        const response = await api.get('/education/dashboard/stats');
        return response.data;
    },
    get_all_students: async (filterData = {}) => {
        const response = await api.post('/education/allstudent', filterData);
        return response.data;
    },
    accept_student: async (username) => {
        const response = await api.post(`/education/allstudent/submit/${username}`);
        return response.data;
    },
    reject_student: async (username) => {
        const response = await api.post(`/education/student/reject/${username}`);
        return response.data;
    },
    remove_student: async (username) => {
        const response = await api.delete(`/education/student/remove/${username}`);
        return response.data;
    }
};

// ==========================================
//  EDUCATION / STUDENT API REQUESTS
// ==========================================
export const student = {
    login: async (credentials) => {
        const response = await api.post('/education/student/login', credentials);
        return response.data;
    },
    register_profile: async (data) => {
        const response = await api.post('/education/student/register', data);
        return response.data;
    },
    get_all_teachers: async (filters = {}) => {
        const response = await api.get('/education/student/allteacher', { 
            params: filters 
        });
        return response.data;
    },
    get_teacher_profile: async (username) => {
        const response = await api.get(`/education/student/teacher/${username}`);
        return response.data;
    },
    apply_teacher: async (username) => {
        const response = await api.post(`/education/student/apply/${username}`);
        return response.data;
    },
    get_dashboard: async () => {
        const response = await api.get('/education/student/dashboard');
        return response.data;
    },
    update_profile: async (data) => {
        const response = await api.patch('/education/student/profile/update', data);
        return response.data;
    },
    withdraw_application: async (username) => {
        const response = await api.post(`/education/student/withdraw/${username}`);
        return response.data;
    }
};

// ============================================================================
// COMPLAINT USER APIs
// ============================================================================
export const complaintUser = {
    // Authentication
    register: async (data) => {
        const response = await api.post('/complaintuser/register', data);
        return response.data;
    },
    
    login: async (credentials) => {
        const response = await api.post('/complaintuser/login', credentials);
        return response.data;
    },

    // Dashboard
    get_dashboard: async () => {
        const response = await api.get('/complaintuser/dashboard');
        return response.data;
    },

    // ✅ Connection Management
    connect_to_admin: async (adminId) => {
        const response = await api.post(`/complaintuser/connect/${adminId}`);
        return response.data;
    },

    // ✅ File Complaint (to connected admin)
    file_complaint: async (adminId, formData) => {
        const response = await api.post(`/complaintuser/file-complaint/${adminId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Complaint Management
    get_details: async (id) => {
        const response = await api.get(`/complaintuser/details/${id}`);
        return response.data;
    },
    
    withdraw_complaint: async (id) => {
        const response = await api.delete(`/complaintuser/withdraw/${id}`);
        return response.data;
    }
};

// ============================================================================
// COMPLAINT ADMIN APIs
// ============================================================================
export const complaintAdmin = {
    // Authentication
    register: async (formData) => {
        const response = await api.post('/ComplaintAdmin/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    
    login: async (credentials) => {
        const response = await api.post('/ComplaintAdmin/login', credentials);
        return response.data;
    },

    // Profile
    get_current_admin: async () => {
        const response = await api.get('/ComplaintAdmin/getuserbyid');
        return response.data;
    },
    
    update_profile: async (data) => {
        const response = await api.patch('/ComplaintAdmin/profile/update', data);
        return response.data;
    },

    // Dashboard
    get_stats: async () => {
        const response = await api.get('/ComplaintAdmin/dashboard/stats');
        return response.data;
    },
    
    get_all_complaints: async () => {
        const response = await api.get('/ComplaintAdmin/allcomplaints');
        return response.data;
    },

    // ✅ Connection Requests
    get_connection_requests: async () => {
        const response = await api.get('/ComplaintAdmin/requests');
        return response.data;
    },
    
    handle_connection_request: async (status, userId) => {
        const response = await api.patch(`/ComplaintAdmin/requests/${status}/${userId}`);
        return response.data;
    },

    // Complaint Actions
    resolve_complaint: async (id, responseMessage) => {
        const response = await api.patch(`/ComplaintAdmin/resolve/${id}`, { responseMessage });
        return response.data;
    },
    
    reject_complaint: async (id, reason) => {
        const response = await api.patch(`/ComplaintAdmin/reject/${id}`, { reason });
        return response.data;
    },

    // Public
    get_all_officials: async () => {
        const response = await api.get('/ComplaintAdmin/public/officials');
        return response.data;
    }
};



// ==========================================
//  TRAVELLER ADMIN API REQUESTS
// ==========================================
export const travellerAdmin = {
    register: async (formData) => {
        const response = await api.post('/traveller/traveladminregister', formData);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/traveller/traveladminlogin', credentials);
        return response.data;
    },
    get_current_admin: async () => {
        const response = await api.get('/traveller/gettraveladminbyid');
        return response.data;
    },
    get_all_admins: async () => {
        const response = await api.get('/traveller/allTravelAdmin');
        return response.data;
    },
    get_admin_by_param: async (param) => {
        const response = await api.get(`/traveller/gettraveladmin/${param}`);
        return response.data;
    },
    get_by_category: async (category) => {
        const response = await api.get(`/traveller/gettraveladminCat/${category}`);
        return response.data;
    },
    get_by_type: async (type) => {
        const response = await api.get(`/traveller/gettraveladminTyp/${type}`);
        return response.data;
    },
    delete_served_user: async (param) => {
        const response = await api.delete(`/traveller/deleteserveuser/${param}`);
        return response.data;
    },
    accept_traveller: async (travellerId) => {
        const response = await api.patch(`/traveller/accepttraveller/${travellerId}`);
        return response.data;
    },
    leave_admin: async (adminId) => {
        const response = await api.patch(`/traveller/leave-admin/${adminId}`);
        return response.data;
    }
};

// ==========================================
//  TRAVELLER USER API REQUESTS
// ==========================================
export const travellerUser = {
    register: async (data) => {
        const response = await api.post('/traveller/traveluserregister', data);
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/traveller/traveluserlogin', credentials);
        return response.data;
    },
    get_details: async () => {
        const response = await api.get('/traveller/user');
        return response.data;
    },
    request_ride: async (adminId) => {
        const response = await api.post(`/traveller/setuserintoadmin/${adminId}`);
        return response.data;
    },
    cancel_ride: async () => {
        const response = await api.post('/traveller/cancelride');
        return response.data;
    }
};



// ==========================================
//  CYBER ADMIN API REQUESTS (New ✅)
// ==========================================
export const cyberAdmin = {
    // 1. Admin Login
    login: async (credentials) => {
        const response = await api.post('/cyberadmin/adminlogin', credentials);
        return response.data;
    },

    // 2. Admin Register (Multipart for shop pic)
    register: async (formData) => {
        const response = await api.post('/cyberadmin/adminregister', formData);
        return response.data;
    },

    // 3. Get Dashboard Stats
    get_stats: async () => {
        const response = await api.get('/cyberadmin/stats');
        return response.data;
    },

    // 4. Get All Users (Requests)
    get_all_users: async () => {
        const response = await api.get('/cyberadmin/allcyber');
        return response.data;
    },

    // 5. Get Current Admin Profile
    get_profile: async () => {
        const response = await api.get('/cyberadmin/profile');
        return response.data;
    },

    // 6. Update User Status (Accept/Reject/Select)
    // Matches: router.route("/cyberSumbit").post(verifyJWT, cyberSumbit);
    // Body: { username, status }
    update_user_status: async (username, status) => {
        const response = await api.post('/cyberadmin/cyberSumbit', { username, status });
        return response.data;
    },
        // Update Profile
    update_profile: async (formData) => {
        const response = await api.patch('/cyberadmin/profile', formData);
        return response.data;
    }
};


export const cyberUser = {
    // 1. User Login
    login: async (credentials) => {
        const response = await api.post('/cyberuser/login', credentials);
        return response.data;
    },

    // 2. User Register
    register: async (data) => {
        const response = await api.post('/cyberuser/register', data);
        return response.data;
    },

    // 3. Get All Cyber Shops (Admins)
    get_all_shops: async () => {
        const response = await api.get('/cyberuser/allcyber');
        return response.data;
    },

    // 4. Get User Profile
    get_profile: async () => {
        const response = await api.get('/cyberuser/profile');
        return response.data;
    },

    // 5. Apply to Shop
    apply_shop: async (adminUsername) => {
        const response = await api.post(`/cyberuser/apply/${adminUsername}`);
        return response.data;
    },

    // 6. Withdraw Application
    // Body: { adminUsername }
    withdraw_application: async (adminUsername) => {
        const response = await api.post('/cyberuser/withdraw', { adminUsername });
        return response.data;
    },
     // Update Profile
    update_profile: async (data) => {
        const response = await api.patch('/cyberuser/profile', data);
        return response.data;
    }
};

// ==========================================
//  DOCUMENT API REQUESTS
// ==========================================
export const documents = {
    // Upload Document
    upload: async (formData) => {
        const response = await api.post('/documents/upload', formData);
        return response.data;
    },

    // Get Documents for a Room
    getRoomDocuments: async (roomId) => {
        const response = await api.get(`/documents/room/${roomId}`);
        return response.data;
    },

    // Update Document Status
    updateStatus: async (documentId, status) => {
        const response = await api.patch(`/documents/status/${documentId}`, { status });
        return response.data;
    },

    // Delete Document
    delete: async (documentId) => {
        const response = await api.delete(`/documents/delete/${documentId}`);
        return response.data;
    }
};


export default api;
