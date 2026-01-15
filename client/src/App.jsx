import { createBrowserRouter, RouterProvider } from "react-router-dom";

import LandingPage from "./user/Home";
import Login from "./user/login";
import Register from "./user/Register";
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
import About from "./user/About";
import Servicess from "./user/Servicehome";
import Contact from "./user/Contact";
import AppLayouttt from "./assets2/component/AppLayout";
import PatientUser from "./doctor/PatientUser";
import StudentUser from "./edcutaion/StudentUser";
import TravellerUser from "./travellar/TravellerUser";
import CyberUser from "./cyber/CyberUser";
import ComplaintUser from "./complaint/ComplaintUser";
import ServicesUser from "./service/ServicesUser";

// --- Merged Imports (Traveller & Doctor) ---
import TravelUserRegister from "./travellar/TravelUserRegister";
import TravelUserLogin from "./travellar/TravelUserLogin";
import TravelUserDashboard from "./travellar/TravelUserDashboard";
import TravellerAdminDashboard from "./travellar/TravellerAdminDashboard";

import DoctorAdminRegister from "./doctor/DoctorAdminRegister";
import DoctorAdminLogin from "./doctor/DoctorAdminLogin";
import DoctorUserLogin from "./doctor/DoctorUserLogin";
import DoctorUserRegister from "./doctor/DoctorUserRegister";
import DoctorUserDashboard from "./doctor/DoctorUserDashboard";
import DoctorAdminDashboard from "./doctor/DoctorAdminDashboard";
import CyberUserRegister from "./cyber/CyberUserRegister";
import CyberUserLogin from "./cyber/CyberUserLogin";
import CyberAdminRegister from "./cyber/CyberAdminRegister";
import CyberAdminLogin from "./cyber/CyberAdminLogin";
import ComplaintUserRegister from "./complaint/ComplaintUserRegister";
import ComplaintUserLogin from "./complaint/ComplaintUserLogin";
import ComplaintAdminRegister from "./complaint/ComplaintAdminRegister";
import ComplaintAdminLogin from "./complaint/ComplaintAdminLogin";
import EducationLogin from "./edcutaion/EducationLogin";
import EducationRegister from "./edcutaion/EducationRegister";
import StudentRegister from "./edcutaion/StudentRegister";
import StudentLogin from "./edcutaion/StudentLogin";
import StudentDashboard from "./edcutaion/StudentDashboard";
import EducationDashboard from "./edcutaion/EducationDashboard";
import CyberDashboard from "./cyber/CyberDashboard";
import CyberUserDashboard from "./cyber/CyberUserDashboard";
import ComplaintAdminDashboard from "./complaint/ComplaintAdminDashboard";
import ComplaintUserDashboard from "./complaint/ComplaintUserDashboard";

// Router configuration

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayoutt />,
    errorElement: <Errorpage />,
    children: [{ index: true, element: <LandingPage /> },
    { path: "login", element: <Login />, },
    { path: "register", element: <Register />, },
    { path: "logout", element: <Logout />, },
    { path: "changePassword", element: <ChangePassword />, },
    { path: "updateAccount", element: <UpdateAccount />, },
    { path: "profile", element: <Profile />, },
    { path: "about", element: <About />, },
    { path: "service", element: <Servicess />, },
    { path: "contact", element: <Contact />, },
    ],
  },

  {
    path: "/traveller",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <TravellerAdmin />,},
      { path: "register", element: <TravellerAdminRegister />,},
      { path: "login", element: <TravellerAdminLogin />,},
      { path: "dashboard", element: <TravellerAdminDashboard />,}, 
    ], 
  },
  {
    path: "/cyber",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <CyberAdmin />, },
      { path: "admin/register", element: <CyberAdminRegister />,},
      { path: "admin/login", element: <CyberAdminLogin />,},
      { path: "admin/dashboard", element: <CyberDashboard />,},

    ],
  },
  {
    path: "/education",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <EducationAdmin />, },
      { path: "admin/register", element: <EducationRegister />,},
      { path: "admin/login", element: <EducationLogin />,},
      { path: "admin/dashboard", element: <EducationDashboard />,},

    ],
  },
  {
    path: "/doctor",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <DoctorAdmin />, },
      { path: "register", element:<DoctorAdminRegister/>},
      { path: "login", element:<DoctorAdminLogin/>},
      { path: "admindashboard",element:<DoctorAdminDashboard/>}
    ],
  },
  {
    path: "/complaint",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <ComplaintAdmin />, },
      { path: "admin/register", element: <ComplaintAdminRegister />,},
      { path: "admin/login", element: <ComplaintAdminLogin />,},
      { path: "admin/dashboard", element: <ComplaintAdminDashboard />,},
    ],
  },
  {
    path: "/services",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <Services />, },

    ],
  },
  {
    path: "/home",
    element: <AppLayout />,
    errorElement: <Errorpage />,
    children: [
      { path: "admin", element: <Home />, },

    ],
  },



  {
    path: "/traveller",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index : true ,  element: <TravellerAdmin /> },
      { path: "user", element: <TravellerUser />,},
      { path: "user/register", element: <TravelUserRegister />,},
      { path: "user/login", element: <TravelUserLogin />,},
      { path: "user/dashboard", element: <TravelUserDashboard />,},
    ], 
  },
  {
    path: "/cyber",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <CyberAdmin /> },
      { path: "user", element: <CyberUser />, },
      { path: "user/register", element: <CyberUserRegister />,},
      { path: "user/login", element: <CyberUserLogin />,},
      { path: "user/dashboard", element: <CyberUserDashboard />,},

    ],
  },
  {
    path: "/education",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <EducationAdmin /> },
      { path: "user", element: <StudentUser />, },
      { path: "user/register", element: <StudentRegister />,},
      { path: "user/login", element: <StudentLogin />,},
      { path: "user/dashboard", element: <StudentDashboard />,},
    ],
  },
  {
    path: "/doctor",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <DoctorAdmin /> },
      { path: "user", element: <PatientUser />, },
      { path: "userlogin", element:<DoctorUserLogin/>},
      { path: "userregister", element:<DoctorUserRegister/>},
      { path: "userdashboard", element:<DoctorUserDashboard/>}
    ],
  },
  {
    path: "/complaint",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <ComplaintAdmin /> },
      { path: "user", element: <ComplaintUser />, },
      { path: "user/register", element: <ComplaintUserRegister />,},
      { path: "user/login", element: <ComplaintUserLogin />,},
      { path: "user/dashboard", element: <ComplaintUserDashboard />,},
    ],
  },
  {
    path: "/services",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Services /> },
      { path: "user", element: <ServicesUser />, },

    ],
  },
  {
    path: "/home",
    element: <AppLayouttt />,
    errorElement: <Errorpage />,
    children: [
      { index: true, element: <Home /> },
      { path: "user", element: <Home />, },

    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;