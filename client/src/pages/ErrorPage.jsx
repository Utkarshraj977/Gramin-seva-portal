
import { NavLink, useRouteError } from "react-router-dom";
//  import './errorpage.css';

export const Errorpage = () => {
  const error = useRouteError();
  console.log("⚠️ Error Info: ", error); // Debugging

  // Add a defensive check
  if (error && error.status === 404) {
    return (
      <section className="error-section">
        <div id="error-text">
          <figure>
            <img 
              src="https://cdn.dribbble.com/users/722246/screenshots/3066818/404-page.gif"
              alt="404 page"
            />
          </figure>

          <div className="text-center">
            <p className="p-a">
              The page you were looking for could not be found
            </p>

            <NavLink to="/"> Go to home.. </NavLink>

            <p className="p-b" onClick={() => window.history.back()}>
              --- Back to previous page
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Fallback for other errors or when error is undefined
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Something went wrong!</h1>
      <p>{error?.statusText || error?.message || "Unknown error"}</p>
    </div>
  );
};
