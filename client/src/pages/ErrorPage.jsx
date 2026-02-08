import { NavLink, useRouteError, useNavigate } from "react-router-dom";

export const Errorpage = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  

  // Function to go back cleanly
  const handleGoBack = () => {
    navigate(-1);
  };

  // 404 Page Layout
  if (error && error.status === 404) {
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6 py-12">
        <div className="text-center max-w-lg w-full">
          
          {/* Animated Image Container */}
          <figure className="mb-8 transition-transform duration-500 hover:scale-105">
            <img
              src="https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif"
              alt="404 page animation"
              className="w-full h-auto mx-auto rounded-lg drop-shadow-xl mix-blend-multiply"
            />
          </figure>

          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 animate-fade-in-down">
              Oops! Page Not Found
            </h1>
            
            <p className="text-gray-500 text-lg">
              The page you are looking for might have been removed or is temporarily unavailable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6">
              
              {/* Home Button with Hover Animation */}
              <NavLink
                to="/"
                className="px-6 py-3 bg-green-600 text-white rounded-full font-semibold shadow-lg hover:bg-green-700 hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Go to Home
              </NavLink>

              {/* Back Button with Hover Animation */}
              <button
                onClick={handleGoBack}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-full font-semibold shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18" />
                </svg>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Fallback for Generic Errors (500, etc.)
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-50 p-6 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 max-w-md w-full">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-red-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong!</h1>
        <p className="text-gray-600 mb-6 font-mono text-sm bg-gray-50 p-2 rounded">
          {error?.statusText || error?.message || "Unknown error occurred"}
        </p>
        <NavLink 
          to="/" 
          className="inline-block w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          Return to Safety
        </NavLink>
      </div>
    </div>
  );
};