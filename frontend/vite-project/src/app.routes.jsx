import { createBrowserRouter } from 'react-router'
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Otpverify from "./features/auth/pages/Otpverify";
import Protected from "./features/components/Protected";
import Home from "./features/interview/pages/Home";
import Report from "./features/interview/pages/Report";
import AllReport from "./features/interview/pages/AllReport";
import Navbar from "./features/interview/components/Navbar";
import Footer from "./features/interview/components/Footer";







export const router=createBrowserRouter([

    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",    
        element:<Register/>
    },
    {
        path:"/otpverify",
        element:<Otpverify/>
    }
,
    {
        path:"/",    
        element: <Protected>
        <>
          <Navbar />
          <Home />
          <Footer/>
        </>
      </Protected>
    }
,
    {
        path:"/report/:id",    
        element: <Protected>
        <>
          <Navbar />
          <Report/>
          <Footer />
        </>
      </Protected>
    }
,
    {
        path:"/allreports",    
        element: <Protected>
        <>
          <Navbar />
          <AllReport/>
          <Footer />
        </>
      </Protected>
    }



    
])