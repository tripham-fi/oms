import { observer } from "mobx-react-lite";
import { useStore } from "./api/store";
import { NavLink } from "react-router-dom";
import { Menu } from "semantic-ui-react";

const style = {
  width: "90%",
  textAlign: "left" as const,
  color: "black",
  marginTop: "2px",
};

const Sidebar = observer(() => {
  const {
    accountStore: { account },
  } = useStore();
  const isRoleHigher =
    account?.role === "ADMIN" || account?.role === "SUPER_ADMIN";

  return (
    <div className="w-64 flex-shrink-0 bg-white border-r border-gray-200" style={{ fontSize: "14px", paddingTop: "20px" }}>
      {/* Navigation Menu */}
      <Menu vertical inverted style={{ background: "transparent", border: "none", boxShadow: "none" }}>
        {/* Home - visible to all */}
        <Menu.Item
          className="navitem"
          color="red"
          as={NavLink}
          to="/"
          style={style}
        >
          <strong>Home</strong>
        </Menu.Item>

        {/* Users - only Admin and Super Admin */}
        {isRoleHigher && (
          <Menu.Item
            className="navitem"
            color="red"
            as={NavLink}
            to="/users"
            style={style}
          >
            <strong>Manage Users</strong>
          </Menu.Item>
        )}

        {/* Rooms & Bookings - visible to all logged-in users */}
        <Menu.Item
          className="navitem"
          color="red"
          as={NavLink}
          to="/rooms"
          style={style}
        >
          <strong>Rooms</strong>
        </Menu.Item>

        <Menu.Item
          className="navitem"
          color="red"
          as={NavLink}
          to="/bookings"
          style={style}
        >
          <strong>Bookings</strong>
        </Menu.Item>
      </Menu>
    </div>
  );
});

export default Sidebar;
