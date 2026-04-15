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
import { Table } from "semantic-ui-react";
import { Badge, Button } from "react-bootstrap";
import { useStore } from "../../api/store";
import LoadingComponent from "../../components/LoadingComponent";
import type { UserListItem } from "../../constants/ResponseType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import ConfirmDisableUser from "../../components/modal/ConfirmDisableUser";

const columnHelper = createColumnHelper<UserListItem>();

const UserTable = observer(() => {
  const { userStore, modalStore } = useStore();
  const { loadingInitial, userByNameSort } = userStore;

  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => [...userByNameSort], [userByNameSort]);

  const handleDisable = (id: number) => {
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
            onClick={() => handleDisable(info.row.original.id)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        ),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loadingInitial) return <LoadingComponent content="Loading users..." />;
  if (data.length === 0) return <div className="text-center py-10">No users found.</div>;

  return (
    <div className="overflow-x-auto">
      <Table celled striped selectable>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell
                  key={header.id}
                  onClick={
                    header.column.columnDef.id !== "actions"
                      ? header.column.getToggleSortingHandler()
                      : undefined
                  }
                  style={{
                    cursor: header.column.columnDef.id !== "actions" ? "pointer" : "default",
                  }}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.columnDef.id !== "actions" && (
                    <span className="ml-2">
                      {{ asc: "↑", desc: "↓" }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  )}
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>

        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
});

export default UserTable;