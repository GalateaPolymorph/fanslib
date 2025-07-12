import { useQuery } from "@tanstack/react-query";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Download } from "lucide-react";
import { useState } from "react";
import { FanslyPostWithAnalytics } from "../../../../features/analytics/api-type";
import { formatNumber } from "../../../../lib/fansly-analytics";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

type SortConfig = {
  sortBy: string;
  sortDirection: "asc" | "desc";
};

export const FanslyAnalyticsGrid = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    sortBy: "date",
    sortDirection: "desc",
  });

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["fanslyPosts", sortConfig],
    queryFn: () =>
      window.api["analytics:getFanslyPostsWithAnalytics"](
        sortConfig.sortBy,
        sortConfig.sortDirection
      ),
  });

  const exportToCsv = () => {
    const headers = [
      "Date",
      "Caption",
      "Views",
      "Avg. Engagement (s)",
      "Engagement %",
      "Video Length (s)",
      "Hashtags",
    ];
    const csvData = posts.map((post) => [
      format(new Date(post.date), "yyyy-MM-dd"),
      post.caption,
      post.totalViews,
      post.averageEngagementSeconds.toFixed(1),
      post.averageEngagementPercent.toFixed(1),
      post.videoLength,
      post.hashtags.join(", "),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fansly-analytics-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnDef<FanslyPostWithAnalytics>[] = [
    {
      accessorKey: "date",
      header: ({ column: _ }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSortConfig({
              sortBy: "date",
              sortDirection:
                sortConfig.sortBy === "date" && sortConfig.sortDirection === "asc" ? "desc" : "asc",
            })
          }
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(new Date(row.getValue("date")), "MMM d, yyyy"),
    },
    {
      accessorKey: "thumbnailUrl",
      header: "Thumbnail",
      cell: ({ row }) => (
        <img
          src={row.getValue("thumbnailUrl")}
          alt=""
          className="h-24 w-24 object-contain rounded"
        />
      ),
    },
    {
      accessorKey: "caption",
      header: "Caption",
      cell: ({ row }) => <div className="max-w-md truncate">{row.getValue("caption")}</div>,
    },
    {
      accessorKey: "totalViews",
      header: ({ column: _ }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSortConfig({
              sortBy: "views",
              sortDirection:
                sortConfig.sortBy === "views" && sortConfig.sortDirection === "asc"
                  ? "desc"
                  : "asc",
            })
          }
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xl">{formatNumber(row.getValue("totalViews"))}</span>
      ),
    },
    {
      accessorKey: "averageEngagementSeconds",
      header: ({ column: _ }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSortConfig({
              sortBy: "engagement",
              sortDirection:
                sortConfig.sortBy === "engagement" && sortConfig.sortDirection === "asc"
                  ? "desc"
                  : "asc",
            })
          }
        >
          Avg. Engagement
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xl">
          {(row.getValue("averageEngagementSeconds") as number).toFixed(1)}s
        </span>
      ),
    },
    {
      accessorKey: "averageEngagementPercent",
      header: ({ column: _ }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSortConfig({
              sortBy: "engagementPercent",
              sortDirection:
                sortConfig.sortBy === "engagementPercent" && sortConfig.sortDirection === "asc"
                  ? "desc"
                  : "asc",
            })
          }
        >
          Engagement %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xl">
          {(row.getValue("averageEngagementPercent") as number).toFixed(1)}%
        </span>
      ),
    },
    {
      accessorKey: "videoLength",
      header: ({ column: _ }) => (
        <Button
          variant="ghost"
          onClick={() =>
            setSortConfig({
              sortBy: "videoLength",
              sortDirection:
                sortConfig.sortBy === "videoLength" && sortConfig.sortDirection === "asc"
                  ? "desc"
                  : "asc",
            })
          }
        >
          Video Length
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-xl">{(row.getValue("videoLength") as number).toFixed(1)}s</span>
      ),
    },
    {
      accessorKey: "hashtags",
      header: "Hashtags",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {(row.getValue("hashtags") as string[]).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: posts,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={exportToCsv} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="text-center" key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
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
    </div>
  );
};
