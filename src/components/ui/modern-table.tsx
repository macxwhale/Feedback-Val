
import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

const ModernTable = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        "w-full caption-bottom text-sm border-separate border-spacing-0",
        className
      )}
      {...props}
    />
  </div>
));
ModernTable.displayName = "ModernTable";

const ModernTableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    className={cn(
      "bg-gray-50 dark:bg-gray-800/50",
      className
    )} 
    {...props} 
  />
));
ModernTableHeader.displayName = "ModernTableHeader";

const ModernTableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn(
      "bg-white dark:bg-gray-900",
      className
    )}
    {...props}
  />
));
ModernTableBody.displayName = "ModernTableBody";

const ModernTableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-gray-50/50 font-medium dark:bg-gray-800/50",
      className
    )}
    {...props}
  />
));
ModernTableFooter.displayName = "ModernTableFooter";

const ModernTableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
      className
    )}
    {...props}
  />
));
ModernTableRow.displayName = "ModernTableRow";

interface ModernTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

const ModernTableHead = React.forwardRef<HTMLTableCellElement, ModernTableHeadProps>(
  ({ className, sortable, sortDirection, onSort, children, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-semibold text-gray-700 dark:text-gray-300 first:rounded-tl-lg last:rounded-tr-lg",
        sortable && "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      <div className="flex items-center space-x-2">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUp 
              className={cn(
                "h-3 w-3 transition-colors",
                sortDirection === "asc" ? "text-blue-600" : "text-gray-400"
              )} 
            />
            <ChevronDown 
              className={cn(
                "h-3 w-3 -mt-1 transition-colors",
                sortDirection === "desc" ? "text-blue-600" : "text-gray-400"
              )} 
            />
          </div>
        )}
      </div>
    </th>
  )
);
ModernTableHead.displayName = "ModernTableHead";

const ModernTableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-3 align-middle text-gray-900 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
ModernTableCell.displayName = "ModernTableCell";

export {
  ModernTable,
  ModernTableHeader,
  ModernTableBody,
  ModernTableFooter,
  ModernTableHead,
  ModernTableRow,
  ModernTableCell,
};
