import { TableCell, TableRow } from "@/components/ui/table";

export const TableRowSkeleton = ({ arrLen }: { arrLen: number }) => (
    <TableRow>
        {Array(arrLen).fill(0).map((_, i) => (
            <TableCell key={i} className="px-5 py-4 sm:px-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </TableCell>
        ))}
    </TableRow>
);