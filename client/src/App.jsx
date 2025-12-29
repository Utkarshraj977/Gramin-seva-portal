import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "./user/Home";
import Login from "./user/login";
import Register from "./user/resisation";
import Logout from "./user/Logout";
import ChangePassword from "./user/ChangePassword";
import UpdateAccount from "./user/UpdateAccount";
import Profile from "./user/Profile";
import { Errorpage } from "./pages/ErrorPage";
import AppLayout from "./assets/component/AppLayout";
import TravellerAdmin from "./travellar/TravellerAdmin";
import CyberAdmin from "./cyber/CyberAdmin";
import EducationAdmin from "./edcutaion/EducationAdmin";
import DoctorAdmin from "./doctor/DoctorAdmin";
import ComplaintAdmin from "./complaint/ComplaintAdmin";
import Services from "./service/Services";
import Home from "./complaint/Home";
import TravellerAdminRegister from "./travellar/TravellerAdminRegister";
import TravellerAdminLogin from "./travellar/TravellerAdminLogin";

import AppLayoutt from "./assets1/component/AppLayout1";


// Router configuration



const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayoutt />,
    errorElement: <Errorpage />,
    children: [{ index : true , element: <LandingPage /> },
      { path: "login", element: <Login />,},
      { path: "register",element: <Register />, }, { path: "logout", element: <Logout />,},
      { path: "dashboard", element: <Logout />, },
      { path: "changePassword", element: <ChangePassword />,},
      { path: "updateAccount", element: <UpdateAccount />, },
      { path: "profile", element: <Profile />,},
    ],
  },
  {
    path: "/traveller",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <TravellerAdmin /> },
      { path: "admin", element: <TravellerAdmin />,},
      { path: "register", element: <TravellerAdminRegister />,},
      { path: "login", element: <TravellerAdminLogin />,},
      
    ], 
  },
  {
    path: "/cyber",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <CyberAdmin /> },
      { path: "admin", element: <CyberAdmin />,},
      
    ], 
  },
  {
    path: "/education",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <EducationAdmin /> },
      { path: "admin", element: <EducationAdmin />,},
      
    ], 
  },
  {
    path: "/doctor",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <DoctorAdmin /> },
      { path: "admin", element: <DoctorAdmin />,},
      
    ], 
  },
  {
    path: "/complaint",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <ComplaintAdmin /> },
      { path: "admin", element: <ComplaintAdmin />,},
    ], 
  },
  {
    path: "/services",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <Services /> },
      { path: "admin", element: <Services />,},
      
    ], 
  },
  {
    path: "/home",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <Home /> },
      { path: "admin", element: <Home />,},
      
    ], 
  },
  
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
