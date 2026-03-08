import "./App.css";

import { Route, Routes, useNavigate } from "react-router-dom";
import { Container } from "semantic-ui-react";
import LoginPage from "./pages/Login/LoginPage";
import { observer } from "mobx-react-lite";
import CustomRoute from "./components/CustomRoute";
import { useStore } from "./api/store";
import ModalContainer from "./components/ModalContainer";
import ChangePasswordFirstLoginModal from "./components/modal/ChangePasswordFirstLoginModal";
import { useEffect } from "react";
import LoadingComponent from "./components/LoadingComponent";
import Navbar from "./Navbar";

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
      setAppLoaded
    },
    modalStore,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      setAccount()
        .finally(() => setAppLoaded());
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
    <div>
      <ModalContainer />
      {isLoggedIn && <Navbar />}
      <Container fluid className="p-0 min-h-screen">
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Home />} />

          <Route
            element={<CustomRoute requiredRole={["ADMIN", "SUPER_ADMIN"]} />}
          >
            {/* <Route path="/users" element={<UserPage />} /> Later */}
          </Route>

          <Route
            path="*"
            element={
              <div className="p-10 text-center text-2xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </Container>
    </div>
  );
});

export default App;
