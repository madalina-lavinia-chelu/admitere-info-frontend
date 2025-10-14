"use client";

import * as React from "react";
import useSWR from "swr";
import { toast } from "sonner";
import { z } from "zod";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
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
  deleteQuestionRequest,
  getAllQuestionsRequest,
  getChaptersRequest,
  getSourcesRequest,
} from "@/requests/question.requests";
import { QuestionsSearchPayloadType } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { withoutRevalidateOnFocus } from "@/utils/api.utils";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { IconCirclePlusFilled } from "@tabler/icons-react";
import { paths } from "@/routes/paths";
import { MagnifyingGlass } from "@phosphor-icons/react";

const questionResponseSchema = z.object({
  id: z.number(),
  question_text: z.string(),
  type: z.string(),
  is_free: z.boolean(),
  difficulty: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  source: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
  chapters: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      slug: z.string().optional(),
    })
  ),
  answers: z.array(
    z.object({
      id: z.number(),
      answer_text: z.string(),
      is_correct: z.boolean(),
    })
  ),
});

export type Question = z.infer<typeof questionResponseSchema>;

const paginationMetaSchema = z.object({
  current_page: z.number(),
  last_page: z.number(),
  per_page: z.number(),
  total: z.number(),
});

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

interface QuestionsDataTableProps {
  onEdit?: (question: Question) => void;
  onDelete?: (questionId: number) => void;
  onPreview?: (question: Question) => void;
}

export function QuestionsDataTable({
  onEdit,
  onDelete,
  onPreview,
}: QuestionsDataTableProps) {
  // State for table filters, sorting, and pagination
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // State for responsive behavior
  const [windowWidth, setWindowWidth] = React.useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // Pagination state
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0, // 0-based index
    pageSize: 10,
  });

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = React.useState("");

  // Filter state
  const [isFreeFilter, setIsFreeFilter] = React.useState<string>("all");
  const [chapterFilter, setChapterFilter] = React.useState<string>("all");
  const [sourceFilter, setSourceFilter] = React.useState<string>("all");

  // Debounced search query
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Handle window resize for responsive behavior
  React.useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      // Auto-hide columns on smaller screens
      if (window.innerWidth < 768) {
        setColumnVisibility({
          chapters: false,
          source: false,
        });
      } else if (window.innerWidth < 1024) {
        setColumnVisibility({
          chapters: false,
          source: true,
        });
      } else {
        setColumnVisibility({
          chapters: true,
          source: true,
        });
      }
    };

    // Set initial visibility
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset pagination when filters change
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearchQuery, isFreeFilter, chapterFilter, sourceFilter]);

  // Prepare API request params
  const apiParams: QuestionsSearchPayloadType = React.useMemo(
    () => ({
      page: pagination.pageIndex + 1, // API uses 1-based index
      per_page: pagination.pageSize,
      search: debouncedSearchQuery || null,
      is_free: isFreeFilter === "all" ? null : isFreeFilter === "free",
      chapter_id: chapterFilter === "all" ? null : parseInt(chapterFilter),
      source_id: sourceFilter === "all" ? null : parseInt(sourceFilter),
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearchQuery,
      isFreeFilter,
      chapterFilter,
      sourceFilter,
    ]
  );

  // Generate a cache key for SWR based on params
  const cacheKey = React.useMemo(() => {
    return JSON.stringify(["questions", apiParams]);
  }, [apiParams]);
  // SWR data fetching for questions
  const {
    data: questionsResponse,
    isLoading,
    error,
    mutate,
  } = useSWR(
    cacheKey,
    async () => {
      const response = await getAllQuestionsRequest(apiParams);
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
    { ...withoutRevalidateOnFocus }
  );

  // SWR data fetching for chapters
  const { data: chaptersResponse } = useSWR(
    "chapters",
    async () => {
      const response = await getChaptersRequest();
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
    { ...withoutRevalidateOnFocus }
  );

  // SWR data fetching for sources
  const { data: sourcesResponse } = useSWR(
    "sources",
    async () => {
      const response = await getSourcesRequest();
      if (response.error) {
        throw new Error(response.message);
      }
      return response.data;
    },
    { ...withoutRevalidateOnFocus }
  );

  // Extract data and pagination info
  const questions = React.useMemo(() => {
    return questionsResponse?.data || [];
  }, [questionsResponse]);

  const chapters = React.useMemo(() => {
    // Ensure chapters is always an array
    const chaptersData = chaptersResponse?.data || chaptersResponse || [];
    return Array.isArray(chaptersData) ? chaptersData : [];
  }, [chaptersResponse]);

  const sources = React.useMemo(() => {
    // Ensure sources is always an array
    const sourcesData = sourcesResponse?.data || sourcesResponse || [];
    return Array.isArray(sourcesData) ? sourcesData : [];
  }, [sourcesResponse]);

  const paginationMeta: PaginationMeta | null = React.useMemo(() => {
    if (!questionsResponse) return null;
    return {
      current_page: questionsResponse.current_page,
      last_page: questionsResponse.last_page,
      per_page: questionsResponse.per_page,
      total: questionsResponse.total,
    };
  }, [questionsResponse]);

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
  const columns: ColumnDef<Question>[] = React.useMemo(
    () => [
      {
        accessorKey: "question_text",
        header: "Întrebare",
        cell: ({ row }) => {
          // Strip HTML tags and limit length
          const plainText = row.original.question_text.replace(/<[^>]*>/g, "");

          // Responsive text truncation based on screen size
          const getTruncatedText = () => {
            // For small screens (mobile), show very short text
            if (windowWidth < 640) {
              return plainText.length > 25
                ? plainText.slice(0, 25) + "..."
                : plainText;
            }
            // For medium screens (tablet), show medium text
            if (windowWidth < 1024) {
              return plainText.length > 45
                ? plainText.slice(0, 45) + "..."
                : plainText;
            }
            // For large screens, show longer text
            return plainText.length > 80
              ? plainText.slice(0, 80) + "..."
              : plainText;
          };

          const truncatedText = getTruncatedText();

          return (
            <div
              className="min-w-0 max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[350px] cursor-help overflow-hidden"
              title={plainText}>
              <span className="block truncate text-sm leading-tight">
                {truncatedText}
              </span>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "type",
        header: "Tip",
        cell: ({ row }) => {
          const type = row.getValue("type") as string;
          return (
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {type === "single"
                ? "Cu un singur răspuns"
                : "Cu răspunsuri multiple"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "is_free",
        header: "Acces",
        cell: ({ row }) => {
          const isFree = row.getValue("is_free") as boolean;
          return (
            <Badge
              variant={isFree ? "secondary" : "default"}
              className={
                isFree
                  ? "text-green-700 bg-green-50"
                  : "text-blue-700 bg-blue-50"
              }>
              {isFree ? "Gratuit" : "Pro"}
            </Badge>
          );
        },
      },
      {
        accessorKey: "chapters",
        header: "Capitole",
        cell: ({ row }) => {
          const chapters = row.original.chapters;
          if (!chapters || chapters.length === 0) {
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Fără capitol
              </Badge>
            );
          }

          // Show first chapter and count if multiple
          const firstChapter = chapters[0];
          const additionalCount = chapters.length - 1;

          return (
            <div className="flex flex-wrap gap-1">
              <Badge
                variant="outline"
                className="text-purple-700 bg-purple-50 text-xs"
                title={chapters?.map((c) => c.name).join(", ")}>
                {firstChapter.name}
                {additionalCount > 0 && ` +${additionalCount}`}
              </Badge>
            </div>
          );
        },
        enableSorting: false,
      },
      {
        accessorKey: "source",
        header: "Sursă",
        cell: ({ row }) => {
          const source = row.original.source;
          if (!source) {
            return (
              <Badge variant="outline" className="text-muted-foreground">
                Fără sursă
              </Badge>
            );
          }

          return (
            <Badge
              variant="outline"
              className="text-orange-700 bg-orange-50 text-xs"
              title={source.name}>
              {source.name}
            </Badge>
          );
        },
        enableSorting: false,
      },
      {
        id: "actions",
        header: "Acțiuni",
        enableHiding: false,
        cell: ({ row }) => {
          // Extract the first 30 characters of the question text for display in confirmation
          const questionText =
            row.original.question_text
              .replace(/<[^>]*>/g, "") // Remove HTML tags
              .slice(0, 30) +
            (row.original.question_text.length > 30 ? "..." : "");

          return (
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onPreview?.(row.original)}
                aria-label="Preview">
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit?.(row.original)}
                aria-label="Edit">
                <Pencil className="h-4 w-4" />
              </Button>
              <DeleteConfirmationDialog
                itemId={row.original.id}
                itemName={questionText}
                itemType="Întrebare"
                deleteFunction={deleteQuestionRequest}
                onDeleteSuccess={() => {
                  mutate();

                  if (onDelete) {
                    onDelete(row.original.id);
                  }
                }}
                triggerButton={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete"
                    className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                }
              />
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onPreview, mutate, windowWidth]
  );

  // Initialize table
  const table = useReactTable({
    data: questions,
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          <div className="flex items-center gap-2 max-w-sm relative">
            <MagnifyingGlass className="absolute left-2.5 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Caută întrebări..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-md pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Label
                htmlFor="access-filter"
                className="text-sm whitespace-nowrap">
                Acces:
              </Label>
              <Select value={isFreeFilter} onValueChange={setIsFreeFilter}>
                <SelectTrigger className="h-9 w-[120px]" id="access-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  <SelectItem value="free">Gratuit</SelectItem>
                  <SelectItem value="pro">Pro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="chapter-filter"
                className="text-sm whitespace-nowrap">
                Capitol:
              </Label>
              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger className="h-9 w-[150px]" id="chapter-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  {Array.isArray(chapters) &&
                    chapters.map((chapter: any) => (
                      <SelectItem
                        key={chapter.id}
                        value={chapter.id.toString()}>
                        {chapter.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Label
                htmlFor="source-filter"
                className="text-sm whitespace-nowrap">
                Sursă:
              </Label>
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="h-9 w-[150px]" id="source-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toate</SelectItem>
                  {Array.isArray(sources) &&
                    sources.map((source: any) => (
                      <SelectItem key={source.id} value={source.id.toString()}>
                        {source.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {" "}
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
          <Button asChild>
            <Link href={paths.dashboard.question.new} target="_blank">
              <IconCirclePlusFilled className="mr-2 h-4 w-4" />
              Adaugă grilă
            </Link>
          </Button>
        </div>
      </div>
      {/* Table */}
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
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
                    Nu a fost găsită nicio întrebare.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
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
