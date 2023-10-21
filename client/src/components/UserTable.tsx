import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type Roles = {
  name: string;
  status: boolean;
  message: string;
};

type Groups = {
  name: string;
  status: boolean;
  message: string;
};
type Status = {
  status: boolean;
  message: string;
  roles: Roles[];
  groups: Groups[];
};

export type User = {
  username: string;
  password: string;
  roles: string;
  groups: string;
  status: Status;
};

export const UserTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "password",
    header: "Password",
  },
  {
    accessorKey: "roles",
    header: "Roles",
  },
  {
    accessorKey: "groups",
    header: "Groups",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const cell: Status = row.getValue("status");
      if (!cell) return null;
      const { status, message, roles, groups } = cell;
      // first display the status of the user and popover to display the message
      // then groups and roles
      return (
        <div className="space-y-1 flex items-center gap-1">
          <div>{status ? <span className="text-xs font-semibold px-2 text-dark p-1 rounded-full bg-teal-500 text-teal-950 ">{message}</span> : <span className="text-xs font-semibold text-pink-300 bg-pink-500  px-2 text-dark p-1 rounded-full">{message}</span>}</div>
          <div className="">
            {roles?.map((item, index) => {
              return (
                <Popover key={index}>
                  <PopoverTrigger className={`text-xs font-semibold px-2 text-dark p-1 rounded-full ${item.status ? "bg-teal-500" : "text-pink-200 bg-pink-500 "}`}>{item.name}</PopoverTrigger>
                  <PopoverContent>{item.message}</PopoverContent>
                </Popover>
              );
            })}
          </div>
          <div className="">
            {groups?.map((item, index) => {
              return (
                <Popover key={index}>
                  <PopoverTrigger className={`text-xs font-semibold px-2 text-dark p-1 rounded-full ${item.status ? "bg-teal-500" : "text-pink-200 bg-pink-500 "}`}>{item.name}</PopoverTrigger>
                  <PopoverContent>{item.message}</PopoverContent>
                </Popover>
              );
            })}
          </div>
        </div>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md dark:bg-background bg-gray-50">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} className="font-bold">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
