import axios from 'axios';

const api=axios.create({
    baseURL:import.meta.env.VITE_BASE_URL,
    withCredentials:true,
    headers:{
        'Content-Type':'application/json'
    },
    //secure:true
})

//from here all post or get request
export const user={
    login: async (userdata) =>{
        const response =await api.post('/users/login',userdata);
        return response.data;
    },

    register: async (userdata) =>{
        const response=await api.post('/users/register',userdata);
        return response.data;
    }
}