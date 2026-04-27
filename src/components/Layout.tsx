import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import "../styles/Layout.scss";
import SearchModal from "./SearchModal";

const Layout: React.FC = () => {
  const isMobile = window.innerWidth <= 800;
  const location = useLocation();
  const hideRoutes = ["/signin", "/signup"] as const;
  const hideCheckout = "/checkout" as const;
  const hideNavFooter = (hideRoutes as readonly string[]).includes(
    location.pathname
  );
  const hideFooter = location.pathname.includes(hideCheckout);

  return (
    <div className="page">
      {isMobile ? (
        <>
          {!hideNavFooter && (
            <div className="navbar-mobile">
              <Navbar />
            </div>
          )}
          {!hideNavFooter && <SearchModal />}
          <main
            className={`${hideFooter ? "main-no-footer-mobile" : `${hideNavFooter ? "main-no-navbar-mobile" : "main-mobile"}`}`}
          >
            <Outlet />
          </main>
          {hideFooter ? null : !hideNavFooter && <Footer />}
        </>
      ) : (
        <>
          {!hideNavFooter && (
            <div className="navbar">
              <Navbar />
            </div>
          )}
          {!hideNavFooter && <SearchModal />}
          <main
            className={`${hideFooter ? "main-no-footer" : `${hideNavFooter ? "main-no-navbar" : "main"}`}`}
          >
            <Outlet />
          </main>
          {hideFooter ? null : !hideNavFooter && <Footer />}
        </>
      )}
    </div>
  );
};

export default Layout;
