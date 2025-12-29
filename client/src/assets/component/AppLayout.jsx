import Header from "./Header";
import { Footer } from "./Footer/Footer";
import { Outlet, useNavigation } from "react-router-dom";
// import "./appLayout.css";

/* 🔵 Top Loading Bar */
const TopLoader = () => {
  return <div className="top-loader" />;
};

/* 🔵 Skeleton Loader */
const SkeletonPage = () => {
  return (
    <div className="skeleton-wrapper">
      <div className="skeleton skeleton-title"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text"></div>
      <div className="skeleton skeleton-text short"></div>
    </div>
  );
};

const AppLayout = () => {
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";
  const isSubmitting = navigation.state === "submitting";
  const isBusy = isLoading || isSubmitting;

  return (
    <>
      {/* 🔝 Top Loader */}
      {isBusy && <TopLoader />}

      {/* 🔰 Header */}
      <Header />

      {/* 🧱 Main Content */}
      <main
        className={`main-container ${isBusy ? "busy" : ""}`}
      >
        {isLoading ? <SkeletonPage /> : <Outlet />}
      </main>

      {/* 🔐 Submitting Indicator */}
      {isSubmitting && (
        <p className="submitting-text">Submitting data…</p>
      )}

      {/* 🔻 Footer */}
      <Footer />
    </>
  );
};

export default AppLayout;
