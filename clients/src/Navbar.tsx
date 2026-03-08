import { observer } from "mobx-react-lite";
import { Container, Dropdown, Menu } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import { useStore } from "./api/store";
import "./Navbar.css";
import Logout from "./components/modal/ConfirmLogout";
import ChangePasswordModal from "./components/modal/ChangePasswordModal";

const Navbar = observer(() => {
  const { accountStore, modalStore } = useStore();
  const { account } = accountStore;
  const location = useLocation();

  // Simple page title mapping (add more as you create pages)
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/" || path === "") return "Home";
    if (path.startsWith("/users")) return "Users";
    if (path.startsWith("/rooms")) return "Rooms";
    // Add more routes here later
    return "Dashboard";
  };

  if (!account) return null;

  return (
    <Menu inverted fixed="top" style={{ backgroundColor: "#CF2338" }}>
      <Container>
        {/* Left side: Page title */}
        <Menu.Item header style={{ color: "white", fontSize: "1.1rem" }}>
          {getPageTitle()}
        </Menu.Item>

        {/* Right side: User dropdown */}
        <Menu.Menu position="right">
          <Dropdown item text={account.username} pointing="top right">
            <Dropdown.Menu>
              <Dropdown.Item
                icon="key"
                text="Change Password"
                onClick={() => modalStore.openModal(<ChangePasswordModal />, "md")}
              />
              <Dropdown.Divider />
              <Dropdown.Item
                icon="sign-out"
                text="Logout"
                onClick={() => modalStore.openModal(<Logout />, "sm")}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
      </Container>
    </Menu>
  );
});

export default Navbar;