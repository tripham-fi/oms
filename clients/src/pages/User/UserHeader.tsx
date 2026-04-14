import { observer } from "mobx-react-lite";
import { Button, Input } from "semantic-ui-react";
import { NavLink } from "react-router-dom";
import { useStore } from "../../api/store";

const UserHeader = observer(() => {
  const { userStore } = useStore();
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    userStore.setSearchQuery(e.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-6 gap-4">
      <div className="flex-1 max-w-md">
        <Input
          fluid
          icon="search"
          placeholder="Search by username, name or email..."
          value={userStore.searchQuery}
          onChange={handleSearch}
        />
      </div>

      <Button
        color="red"
        as={NavLink}
        to="/users/create"
        icon="plus"
      >
        Create New User
      </Button>
    </div>
  );
});

export default UserHeader;