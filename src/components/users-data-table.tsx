"use client";

import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { z } from "zod";
import { StatusToggleConfirmation } from "./status-toggle-confirmation";
import {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  getAllUsersRequest,
  toggleActiveStatusRequest,
} from "@/requests/user.requests";
import { format } from "date-fns";
import { ro } from "date-fns/locale";
import { UserSearchPayloadType } from "@/types/types";
import { ArrowClockwise, MagnifyingGlass, Pencil } from "@phosphor-icons/react";

// Define user schema for validation
const userResponseSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  role_id: z.number(),
  created_at: z.string(),
  is_active: z.boolean().default(true),
  is_pro: z.boolean().default(false),
  role: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
});

export type User = z.infer<typeof userResponseSchema>;

// Define schema for pagination metadata
const paginationMetaSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

interface UsersDataTableProps {
  onEdit?: (user: User) => void;
}

export function UsersDataTable({ onEdit }: UsersDataTableProps) {
  // State for table filters, sorting, and pagination
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Pagination state
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0, // 0-based index
    pageSize: 10,
  });

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");

  // Filter state
  const [isProFilter, setIsProFilter] = React.useState<string>("all");

  // Debounced search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchQuery, isProFilter]);

  // Prepare API request params
  const apiParams: UserSearchPayloadType = React.useMemo(
    () => ({
      page: pagination.pageIndex + 1, // API uses 1-based index
      per_page: pagination.pageSize,
      search: debouncedSearchQuery || null,
      is_pro: isProFilter === "all" ? null : isProFilter === "pro",
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearchQuery,
      isProFilter,
    ]
  );

  // Generate a cache key for SWR based on params
  const cacheKey = React.useMemo(() => {
    return JSON.stringify(["users", apiParams]);
  }, [apiParams]);

  // SWR data fetching
  const {
    data: usersResponse,
    isLoading,
    error,
    mutate,
  } = useSWR(
    cacheKey,
    async () => {
      const response = await getAllUsersRequest(apiParams);
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
    { ...withoutRevalidateOnFocus }
  );

  // Extract data and pagination info
  const users = React.useMemo(() => {
    return usersResponse?.data || [];
  }, [usersResponse]);

  const paginationMeta: PaginationMeta | null = React.useMemo(() => {
    if (!usersResponse) return null;
    return {
      current_page: usersResponse.current_page,
      last_page: usersResponse.last_page,
      per_page: usersResponse.per_page,
      total: usersResponse.total,
    };
  }, [usersResponse]);

  // Synchronize table pagination with API pagination
  React.useEffect(() => {
    if (paginationMeta) {
      // Only update if there's a mismatch to avoid loops
      if (paginationMeta.current_page !== pagination.pageIndex + 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: paginationMeta.current_page - 1,
        }));
      }
    }
  }, [paginationMeta, pagination.pageIndex]);

  // Define table columns
  const columns: ColumnDef<User>[] = React.useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Nume",
        cell: ({ row }) => {
          const firstName = row.original.first_name;
          const lastName = row.original.last_name;
          return <div>{`${firstName} ${lastName}`}</div>;
        },
        enableSorting: true,
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        enableSorting: true,
      },
      {
        accessorKey: "role",
        header: "Rol",
        cell: ({ row }) => {
          const role = row.original.role;
          return (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {role?.name || "Fără rol"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Data adăugării",
        cell: ({ row }) => {
          const created_at = row.getValue("created_at") as string;
          return (
            <div>
              {created_at
                ? format(new Date(created_at), "dd MMM yyyy, HH:mm", {
                    locale: ro,
                  })
                : "N/A"}
            </div>
          );
        },
        enableSorting: true,
      },
      {
        accessorKey: "is_active",
        header: "Status",
        cell: ({ row }) => {
          const isActive = row.getValue("is_active") as boolean;
          return (
            <Badge
              variant={isActive ? "success" : "destructive"}
              className="px-2">
              {isActive ? "Activ" : "Inactiv"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "is_pro",
        header: "Abonament",
        cell: ({ row }) => {
          const isPro = row.getValue("is_pro") as boolean;
          return (
            <Badge
              variant={isPro ? "default" : "secondary"}
              className={
                isPro ? "text-blue-700 bg-blue-50" : "text-gray-700 bg-gray-50"
              }>
              {isPro ? "Pro" : "Gratuit"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "Acțiuni",
        enableHiding: false,
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          const userName = row.original.name || row.original.email;

          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(row.original)}
                aria-label="Edit">
                <Pencil className="h-6 w-6" />
              </Button>
              <StatusToggleConfirmation
                itemId={row.original.id}
                itemName={userName}
                itemType="Utilizator"
                isActive={isActive}
                toggleFunction={(id) => toggleActiveStatusRequest(id)}
                onToggleSuccess={() => mutate()}
              />
            </div>
          );
        },
      },
    ],
    [onEdit, mutate]
  );

  // Initialize table
  const table = useReactTable({
    data: users,
    columns,
    pageCount: paginationMeta?.last_page || -1,
    state: {
      pagination,
      sorting,
      columnFilters,
      columnVisibility,
    },
    enableMultiSort: false,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true, // We're handling pagination on the server
  });

  return (
    <div className="space-y-4">
      {/* Search input and filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 max-w-sm relative">
            <MagnifyingGlass className="absolute left-2.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Caută utilizatori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-md pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="pro-filter" className="text-sm whitespace-nowrap">
              Abonament:
            </Label>
            <Select value={isProFilter} onValueChange={setIsProFilter}>
              <SelectTrigger className="h-9 w-[120px]" id="pro-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toate</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="free">Gratuit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              toast.info("Se reîmprospătează datele...");
              mutate();
            }}
            disabled={isLoading}
            aria-label="Reîmprospătează datele"
            title="Reîmprospătează datele">
            <ArrowClockwise className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Se încarcă...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-destructive">
                  Eroare la încărcarea datelor. Încercați din nou mai târziu.
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Nu a fost găsit niciun utilizator.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination controls */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Label htmlFor="rows-per-page">Rânduri per pagină</Label>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}>
              <SelectTrigger className="h-8 w-[70px]" id="rows-per-page">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <span className="text-sm text-muted-foreground">
            {paginationMeta ? (
              <>
                Arată{" "}
                {(paginationMeta.current_page - 1) * paginationMeta.per_page +
                  1}
                -
                {Math.min(
                  paginationMeta.current_page * paginationMeta.per_page,
                  paginationMeta.total
                )}{" "}
                din {paginationMeta.total}
              </>
            ) : (
              "Încărcare..."
            )}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage() || isLoading}
            aria-label="Prima pagină">
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage() || isLoading}
            aria-label="Pagina anterioară">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage() || isLoading}
            aria-label="Pagina următoare">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage() || isLoading}
            aria-label="Ultima pagină">
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {/* Additional info */}
      <div className="text-sm text-muted-foreground">
        Pagina {paginationMeta?.current_page || 0} din{" "}
        {paginationMeta?.last_page || 0}
      </div>
    </div>
  );
}
