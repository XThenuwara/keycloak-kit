import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef } from "@tanstack/react-table";


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

export const UserViewTableColumns: ColumnDef<User>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "enabled",
    header: "enabled",
    cell: ({ row }) => {
      const cell: any = row.getValue("roles");

      return (
        <div className="flex gap-1 items-center">
          {cell ? (
            <span className="text-xs bg-teal-500 font-semibold dark:text-teal-900 p-1 rounded-full">
            
            </span>
          ) : (
            <span className="text-xs bg-pink-500 font-semibold text-pink-50 p-1 rounded-full">
             
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
        const cell: any = row.getValue("emailVerified");
  
        return (
          <div className="flex gap-1 items-center">
            {cell ? (
              <span className="text-xs bg-teal-500 font-semibold dark:text-teal-900 p-1 rounded-full">
               
              </span>
            ) : (
              <span className="text-xs bg-pink-500 font-semibold text-pink-50 p-1 rounded-full">
                
              </span>
            )}
          </div>
        );
      },
  },
  {
    accessorKey: "createdTimestamp",
    header: "Created Timestamp",
    cell: ({ row }) => {
        //format
        const cell: any = row.getValue("createdTimestamp");
        const date = new Date(cell);
        const formattedDate = date.toLocaleString();

        return (
          <div className="text-sm">
            {formattedDate}
          </div>
        );
    },
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const cell: any = row.getValue("roles");
      if (!cell) return null;

      return (
        <div className="flex gap-1 items-center">
          {cell.map((item: any, index: number) => (
            <span className="text-xs bg-teal-500 font-semibold dark:text-teal-900 p-1 rounded-full" key={index}>{item.name}</span>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "groups",
    header: "Groups",
    cell: ({ row }) => {
      const cell: any = row.getValue("groups");
      if (!cell) return null;
      // first display the status of the user and popover to display the message
      // then groups and roles
      return (
        <div>
          {cell.map((item: any, index: number ) => (
            <span className="text-xs bg-teal-500 font-semibold dark:text-teal-900 p-1 rounded-full" key={index}>{item.name}</span>
          ))}
        </div>
      );
    },
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function UserViewTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
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
