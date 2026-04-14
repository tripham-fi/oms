import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import { Table, Badge, Button } from "react-bootstrap";
import { useStore } from "../../api/store";
import LoadingComponent from "../../components/LoadingComponent";
import type { UserListItem } from "../../constants/ResponseType";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmDisableUser from "../../components/modal/ConfirmDisableUser";

const columnHelper = createColumnHelper<UserListItem>();

const UserTable = observer(() => {
  const { userStore, modalStore } = useStore();
  const { loadingInitial } = userStore;

  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(
    () => userStore.userByNameSort.slice(),
    [userStore.userByNameSort],
  );
  
  const handleDelete = async (id: number) => {
    modalStore.openModal(<ConfirmDisableUser id={id} />, "md");
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("username", { header: "Username" }),
      columnHelper.accessor("fullName", { header: "Full Name" }),
      columnHelper.accessor("email", { header: "Email" }),
      columnHelper.accessor("role", { header: "Role" }),
      columnHelper.accessor("enabled", {
        header: "Status",
        cell: (info) => (
          <Badge bg={info.getValue() ? "success" : "danger"}>
            {info.getValue() ? "Active" : "Disabled"}
          </Badge>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "Actions",
        cell: (info) => (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(info.row.original.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        ),
      }),
    ],
    [],
  );

  // 4. Initialize Table Logic
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loadingInitial) return <LoadingComponent content="Loading users..." />;
  if (data.length === 0)
    return <div className="text-center mt-5">No users found.</div>;

  return (
    <div className="table-responsive">
      <Table striped bordered hover className="align-middle">
        <thead className="table-dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={
                    header.column.columnDef.id !== "actions"
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  style={{
                    cursor:
                      header.column.columnDef.id !== "actions"
                        ? "pointer"
                        : "default",
                  }}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {header.column.columnDef.id !== "actions" && (
                    <span>
                      {{ asc: " 🔼", desc: " 🔽" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
});

export default UserTable;
