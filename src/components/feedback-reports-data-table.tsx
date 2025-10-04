"use client";

import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import Link from "next/link";
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
import {
  getAllReports,
  ReportsSearchPayload,
  updateReportStatus,
  UpdateReportStatusData,
} from "@/requests/feedback.requests";
import { Badge } from "@/components/ui/badge";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import { paths } from "@/routes/paths";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, MagnifyingGlass } from "@phosphor-icons/react";

export type Report = {
  id: number;
  reporter_email: string;
  subject: string;
  description: string;
  status: "pending" | "in_progress" | "resolved" | "closed" | "rejected";
  type: "contact_form" | "question_issue" | "general_app";
  created_at: string;
  updated_at: string;
  user_id: number | null;
  question_id: number | null;
  admin_notes?: string;
};

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const typeLabels = {
  contact_form: "Contact Form",
  question_issue: "Question Issue",
  general_app: "General App",
};

interface FeedbackReportsDataTableProps {
  onView?: (report: Report) => void;
}

export function FeedbackReportsDataTable({
  onView,
}: FeedbackReportsDataTableProps) {
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
  // Filter states
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [typeFilter, setTypeFilter] = React.useState<string>("all");

  // Dialog state
  const [selectedReport, setSelectedReport] = React.useState<Report | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [updatingStatus, setUpdatingStatus] = React.useState(false);
  const [newStatus, setNewStatus] = React.useState<string>("");
  const [adminNotes, setAdminNotes] = React.useState("");

  // Debounced search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);
  // Prepare API request params
  const apiParams: ReportsSearchPayload = React.useMemo(() => {
    const params: ReportsSearchPayload = {
      page: pagination.pageIndex + 1, // API uses 1-based index
      per_page: pagination.pageSize,
      search: debouncedSearchQuery || null,
    };

    if (statusFilter && statusFilter !== "all") {
      params.status = statusFilter as ReportsSearchPayload["status"];
    }

    if (typeFilter && typeFilter !== "all") {
      params.type = typeFilter as ReportsSearchPayload["type"];
    }

    return params;
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchQuery,
    statusFilter,
    typeFilter,
  ]);

  // Generate a cache key for SWR based on params
  const cacheKey = React.useMemo(() => {
    return JSON.stringify(["reports", apiParams]);
  }, [apiParams]);

  // SWR data fetching
  const {
    data: reportsResponse,
    isLoading,
    error,
    mutate,
  } = useSWR(
    cacheKey,
    async () => {
      const response = await getAllReports(apiParams);
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
    { ...withoutRevalidateOnFocus }
  );

  // Extract data and pagination info
  const reports = React.useMemo(() => {
    return reportsResponse?.data || [];
  }, [reportsResponse]);

  const paginationMeta: PaginationMeta | null = React.useMemo(() => {
    if (!reportsResponse) return null;
    return {
      current_page: reportsResponse.current_page,
      last_page: reportsResponse.last_page,
      per_page: reportsResponse.per_page,
      total: reportsResponse.total,
    };
  }, [reportsResponse]);

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
  const formatDate = React.useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handleOpenReport = (report: Report) => {
    setSelectedReport(report);
    setNewStatus(report.status);
    setAdminNotes(report.admin_notes || "");
    setIsDialogOpen(true);
  };
  const handleUpdateStatus = async () => {
    if (!selectedReport) return;

    setUpdatingStatus(true);
    try {
      const payload: UpdateReportStatusData = {
        id: selectedReport.id,
        status: newStatus as UpdateReportStatusData["status"],
        admin_notes: adminNotes.trim() || undefined,
      };

      const response = await updateReportStatus(payload);
      if (!response.error) {
        toast.success("Statusul raportului a fost actualizat cu succes.");
        mutate(); // Refresh the data
        setIsDialogOpen(false);
      } else {
        toast.error("Nu s-a putut actualiza statusul raportului.");
      }
    } catch {
      toast.error("A apărut o eroare la actualizarea statusului.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Define table columns
  const columns: ColumnDef<Report>[] = React.useMemo(
    () => [
      {
        accessorKey: "reporter_email",
        header: "Email Reporter",
        cell: ({ row }) => (
          <div className="font-medium">{row.getValue("reporter_email")}</div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "subject",
        header: "Subiect",
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate">
            {row.getValue("subject")}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "type",
        header: "Tip",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {typeLabels[type as keyof typeof typeLabels]}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              className={statusColors[status as keyof typeof statusColors]}
              variant="outline">
              {status.replace("_", " ").toUpperCase()}
            </Badge>
          );
        },
      },
      {
        accessorKey: "created_at",
        header: "Data creării",
        cell: ({ row }) => (
          <div className="text-sm text-muted-foreground">
            {formatDate(row.getValue("created_at"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Acțiuni",
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Vezi detalii"
                onClick={() => handleOpenReport(row.original)}>
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      },
    ],
    [formatDate]
  );

  // Initialize table
  const table = useReactTable({
    data: reports,
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
        <div className="flex items-center gap-2 max-w-sm relative">
          <MagnifyingGlass className="absolute left-2.5 top-3.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Caută rapoarte..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-md pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          {" "}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate</SelectItem>
              <SelectItem value="contact_form">Contact Form</SelectItem>
              <SelectItem value="question_issue">Question Issue</SelectItem>
              <SelectItem value="general_app">General App</SelectItem>
            </SelectContent>
          </Select>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`${isLoading ? "animate-spin" : ""}`}>
              <path d="M21 12a9 9 0 0 1-9 9c-4.97 0-9-4.03-9-9s4.03-9 9-9h9" />
              <path d="M15 3 21 9 15 15" />
            </svg>
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
                  Nu a fost găsit niciun raport.
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
      </div>{" "}
      {/* Additional info */}
      <div className="text-sm text-muted-foreground">
        Pagina {paginationMeta?.current_page || 0} din{" "}
        {paginationMeta?.last_page || 0}
      </div>
      {/* Report Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="dialog-custom max-w-3xl">
          <DialogHeader>
            <DialogTitle>Detalii raport #{selectedReport?.id}</DialogTitle>
          </DialogHeader>
          {selectedReport && (
            <div className="space-y-6 ">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email Reporter
                  </Label>
                  <p className="mt-1">{selectedReport.reporter_email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Tip
                  </Label>
                  <p className="mt-1">
                    <Badge variant="outline">
                      {typeLabels[selectedReport.type]}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Status Curent
                  </Label>
                  <p className="mt-1">
                    <Badge
                      className={statusColors[selectedReport.status]}
                      variant="outline">
                      {selectedReport.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Data creării
                  </Label>
                  <p className="mt-1">
                    {formatDate(selectedReport.created_at)}
                  </p>
                </div>
                {selectedReport.user_id && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      ID Utilizator
                    </Label>
                    <p className="mt-1">{selectedReport.user_id}</p>
                  </div>
                )}
                {selectedReport.question_id && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">
                      Întrebare
                    </Label>
                    <div className="mt-1">
                      <Button asChild variant="outline" size="sm">
                        <Link 
                          href={paths.dashboard.question.edit(selectedReport.question_id)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Vezi întrebarea #{selectedReport.question_id}
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subject */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Subiect
                </Label>
                <p className="mt-1 font-medium">{selectedReport.subject}</p>
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Descriere
                </Label>
                <div className="mt-1 p-4 bg-muted rounded-md">
                  <p className="whitespace-pre-wrap">
                    {selectedReport.description}
                  </p>
                </div>
              </div>

              {/* Current Admin Notes */}
              {selectedReport.admin_notes && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Note Admin Existente
                  </Label>
                  <div className="mt-1 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="whitespace-pre-wrap text-blue-900">
                      {selectedReport.admin_notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Status Update Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Actualizare Status</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status-select" className="mb-2">
                      Nou Status
                    </Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selectează statusul" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="admin-notes mb-2">Note Admin</Label>
                    <Textarea
                      id="admin-notes"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Adaugă note administrative (opțional)..."
                      rows={4}
                      className="mt-2 resize-none h-40"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Închide
            </Button>
            <Button
              onClick={handleUpdateStatus}
              disabled={updatingStatus || !selectedReport}>
              {updatingStatus ? "Se actualizează..." : "Actualizează Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
