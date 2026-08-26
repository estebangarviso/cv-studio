'use client';

import { useState } from 'react';
import {
	type ColumnDef,
	type SortingState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from '@tanstack/react-table';

import { Button } from '@shared/ui/button';
import { cn } from '@shared/utils/cn';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	/** Global search input placeholder. Pass `null` to hide the search box. */
	searchPlaceholder?: string | null;
	/** Rows per page (default 10). */
	pageSize?: number;
	className?: string;
}

/**
 * Generic, presentational table powered by TanStack Table.
 *
 * Business-logic agnostic: callers supply typed `columns` and `data`. Sorting,
 * global filtering, and pagination are handled client-side out of the box.
 */
export function DataTable<TData, TValue>({
	columns,
	data,
	searchPlaceholder = 'Search…',
	pageSize = 10,
	className,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data,
		columns,
		state: { sorting, globalFilter },
		initialState: { pagination: { pageSize } },
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
	});

	return (
		<div className={cn('space-y-4', className)}>
			{searchPlaceholder !== null && (
				<input
					value={globalFilter}
					onChange={(event) => setGlobalFilter(event.target.value)}
					placeholder={searchPlaceholder}
					aria-label={searchPlaceholder}
					className="h-9 w-full max-w-xs rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
				/>
			)}

			<div className="overflow-x-auto rounded-md border border-border">
				<table className="w-full text-sm">
					<thead className="bg-muted/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr
								key={headerGroup.id}
								className="border-b border-border"
							>
								{headerGroup.headers.map((header) => {
									const canSort = header.column.getCanSort();
									const sorted = header.column.getIsSorted();
									return (
										<th
											key={header.id}
											className="px-4 py-3 text-left font-medium text-muted-foreground"
										>
											{header.isPlaceholder ? null : canSort ? (
												<button
													type="button"
													onClick={header.column.getToggleSortingHandler()}
													className="inline-flex items-center gap-1 hover:text-foreground"
												>
													{flexRender(
														header.column.columnDef
															.header,
														header.getContext(),
													)}
													<span aria-hidden="true">
														{sorted === 'asc'
															? '▲'
															: sorted === 'desc'
																? '▼'
																: '↕'}
													</span>
												</button>
											) : (
												flexRender(
													header.column.columnDef
														.header,
													header.getContext(),
												)
											)}
										</th>
									);
								})}
							</tr>
						))}
					</thead>
					<tbody>
						{table.getRowModel().rows.length ? (
							table.getRowModel().rows.map((row) => (
								<tr
									key={row.id}
									className="border-b border-border last:border-0 hover:bg-muted/30"
								>
									{row.getVisibleCells().map((cell) => (
										<td key={cell.id} className="px-4 py-3">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</td>
									))}
								</tr>
							))
						) : (
							<tr>
								<td
									colSpan={columns.length}
									className="px-4 py-10 text-center text-muted-foreground"
								>
									No results.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<div className="flex items-center justify-between gap-4">
				<p className="text-sm text-muted-foreground">
					Page {table.getState().pagination.pageIndex + 1} of{' '}
					{table.getPageCount() || 1}
				</p>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	);
}
