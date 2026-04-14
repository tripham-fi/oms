import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import { observer } from "mobx-react-lite";
import CustomRoute from "./components/CustomRoute";
import { useStore } from "./api/store";
import ModalContainer from "./components/ModalContainer";
import ChangePasswordFirstLoginModal from "./components/modal/ChangePasswordFirstLoginModal";
import { useEffect } from "react";
import LoadingComponent from "./components/LoadingComponent";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import UserPage from "./pages/User/UserPage";

const Home = () => (
  <div className="p-5 text-center">
    <h1 className="text-3xl font-bold">Welcome to OMS</h1>
    <p>
      Go to <a href="/login">Login</a>
    </p>
  </div>
);

const App = observer(() => {
  const {
    accountStore: {
      isLoggedIn,
      setAccount,
      appLoaded,
      isFirstLogin,
      setAppLoaded,
    },
    modalStore,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setAccount().finally(() => setAppLoaded());
    } else {
      setAppLoaded();
      navigate("/login");
    }
  }, [isLoggedIn, setAccount, setAppLoaded]);

  if (isLoggedIn && appLoaded && isFirstLogin) {
    modalStore.openModal(<ChangePasswordFirstLoginModal />, "md", true);
  }

  if (!appLoaded) {
    return <LoadingComponent content="Loading App..." />;
  }

  return (
    <div className="h-screen w-full">
      <ModalContainer />

      {/* Navbar - Fixed at top */}
      {isLoggedIn && <Navbar />}

      {/* Main layout container - accounts for fixed navbar height */}
      <div style={{ display: 'flex', height: '100%', paddingTop: isLoggedIn ? '42px' : '0' }}>
        {/* Sidebar */}
        {isLoggedIn && <Sidebar />}

        {/* Main Content */}
        <div style={{ flex: 1, overflow: 'auto', backgroundColor: '#f9fafb', padding: '1.5rem' }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route path="/" element={<Home />} />

            <Route
              element={<CustomRoute requiredRole={["ADMIN", "SUPER_ADMIN"]} />}
            >
              <Route
                path="/users"
                element={<UserPage />}
              />
            </Route>

            <Route
              path="/rooms"
              element={<div>Rooms Page (Coming Soon)</div>}
            />
            <Route
              path="/bookings"
              element={<div>Bookings Page (Coming Soon)</div>}
            />

            <Route
              path="*"
              element={
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-7xl font-bold text-gray-200">404</h1>
                    <p className="mt-4 text-xl text-gray-600">Page Not Found</p>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
});

export default App;
