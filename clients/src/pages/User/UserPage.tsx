import { observer } from "mobx-react-lite";
import { useStore } from "../../api/store";
import { useEffect } from "react";
import UserHeader from "./UserHeader";
import UserTable from "./UserTable";

const UserPage = observer(() => {
  const { userStore } = useStore();
  useEffect(() => {
    userStore.loadUsers();
  }, [userStore]);

  return (
    <div className="max-w-7xl mx-auto">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Manage Users</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <UserHeader />
        <UserTable />
      </div>
    </div>
  );
});

export default UserPage;
