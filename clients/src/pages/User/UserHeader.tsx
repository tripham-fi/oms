import { observer } from "mobx-react-lite";
import { Button, Input } from "semantic-ui-react";
import { useStore } from "../../api/store";
import CreateUserModal from "../../components/modal/CreateUserModal";

const UserHeader = observer(() => {
  const { userStore, modalStore } = useStore();
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
        icon="plus"
        onClick={() => modalStore.openModal(<CreateUserModal />, "lg")}
      >
        Create New User
      </Button>
    </div>
  );
});

export default UserHeader;