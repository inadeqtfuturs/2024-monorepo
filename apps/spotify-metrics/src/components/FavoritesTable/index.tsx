import { useContext, useMemo, useState } from 'react';
import { DashboardContext, type Track } from '@/context/DashboardContext';
import classname from '@if/ui/utils/classname';
import {
  CaretUpIcon,
  CaretDownIcon,
  TableIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HamburgerMenuIcon,
} from '@radix-ui/react-icons';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type SortDirection,
  type ColumnDef,
  type PaginationState,
  type Table,
  getPaginationRowModel,
} from '@tanstack/react-table';

import styles from './index.module.css';

const columnHelper = createColumnHelper<Track>();

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const columns = [
  columnHelper.accessor('name', {
    cell: (info) => info.getValue(),
    sortingFn: 'alphanumeric',
  }),
  {
    id: 'artist',
    accessorFn: (row) => row.artist,
    cell: (info) => info.getValue().join(', '),
    filterFn: 'includesString',
    sortingFn: 'auto',
  },
  {
    id: 'album',
    accessorFn: (row) => row.album,
    cell: (info) => info.getValue(),
    sortingFn: 'alphanumeric',
  },
  columnHelper.accessor('duration', {
    cell: (info) => info.getValue(),
    enableGlobalFilter: false,
  }),
  {
    id: 'release date',
    accessorFn: (row) => row.releaseDate,
    cell: (info) => formatter.format(info.getValue() as Date),
    sortingFn: 'datetime',
    enableGlobalFilter: false,
  },
  columnHelper.accessor('added', {
    cell: (info) => formatter.format(info.getValue()),
    sortingFn: 'datetime',
    enableGlobalFilter: false,
  }),
  columnHelper.accessor('popularity', {
    cell: (info) => info.getValue(),
    enableGlobalFilter: false,
  }),
] as ColumnDef<Track>[];

function ToggleIndicator({ direction }: { direction: false | SortDirection }) {
  if (!direction) {
    return <></>;
  }
  return direction === 'asc' ? <CaretUpIcon /> : <CaretDownIcon />;
}

function Header({ asideState }) {
  return (
    <header className={styles.header}>
      <div className={styles.titleWrapper}>
        <h2>favorites</h2>
      </div>
      <button
        className={classname([
          styles.toggleAsideButton,
          styles.actionToggleButton,
        ])}
        type='button'
        onClick={() => asideState.setOpen(!asideState.open)}
      >
        <HamburgerMenuIcon />
      </button>
    </header>
  );
}

function ColumnToggle({ table }: { table: Table<Track> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type='button'
        className={styles.actionToggleButton}
        onClick={() => setOpen(!open)}
      >
        <TableIcon />
      </button>
      <div
        className={classname([open && styles.open, styles.columnSelectWrapper])}
      >
        {table.getAllLeafColumns().map((column) => {
          return (
            <label className={styles.checkboxLabel} key={column.id}>
              <input
                {...{
                  type: 'checkbox',
                  checked: column.getIsVisible(),
                  onChange: column.getToggleVisibilityHandler(),
                }}
              />{' '}
              {column.id}
            </label>
          );
        })}
      </div>
    </>
  );
}

function Toolbar({ table, fetchFavorites }: { table: Table<Track> }) {
  return (
    <nav className={styles.toolbar}>
      <div className={styles.inputWrapper}>
        <input
          name='search'
          id='search'
          className={styles.search}
          value={table.getState().globalFilter ?? ''}
          onChange={({ target: { value } }) =>
            table.setGlobalFilter(String(value))
          }
          placeholder='Search...'
        />
        <button
          type='button'
          onClick={async () => await fetchFavorites()}
          className={styles.toggleButton}
        >
          refresh
        </button>
      </div>

      <ColumnToggle table={table} />
    </nav>
  );
}

function Pagination({ table }: { table: Table<Track> }) {
  const pageCount = table.getPageCount();
  const Options = useMemo(
    () =>
      Array.from({ length: pageCount }, (_, x: number) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <option key={x} value={x}>
          {x + 1}
        </option>
      )),
    [pageCount],
  );
  return (
    <div className={styles.paginationWrapper}>
      <div className={styles.perPageWrapper}>
        <select
          name='pageSize'
          id='pageSize'
          value={table.getState().pagination.pageSize}
          className={styles.perPageSelect}
          onChange={({ target: { value } }) => {
            table.setPageSize(Number(value));
          }}
        >
          {[10, 25, 50, 100].map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <small>per page</small>
      </div>
      <div className={styles.perPageWrapper}>
        <button
          type='button'
          disabled={!table.getCanPreviousPage()}
          onClick={() => table.previousPage()}
          className={styles.actionToggleButton}
        >
          <ChevronLeftIcon />
        </button>
        <select
          name='page'
          id='page'
          value={table.getState().pagination.pageIndex}
          className={styles.perPageSelect}
          onChange={({ target: { value } }) => {
            table.setPageIndex(Number(value));
          }}
        >
          {Options}
        </select>

        <button
          type='button'
          disabled={!table.getCanNextPage()}
          onClick={() => table.nextPage()}
          className={styles.actionToggleButton}
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}

function Loading({ loadingState }) {
  return (
    <div className={styles.loadingWrapper}>
      <h1>loading</h1>
      <small>just a sec</small>
      {loadingState && <small>loaded {loadingState} tracks</small>}
    </div>
  );
}

function LoadTracksModal({ fetchFavorites }) {
  return (
    <div className={styles.loadingWrapper}>
      <p>no local data. pull spotify data from spotify</p>
      <button
        type='button'
        className={styles.loadDataButton}
        onClick={async () => await fetchFavorites()}
      >
        load data
      </button>
    </div>
  );
}

function FavoritesTable({ asideState }) {
  const { loading, loadingState, tracks, fetchFavorites } =
    useContext(DashboardContext);
  const [globalFilter, setGlobalFilter] = useState<string>();
  const [columnVisibility, setColumnVisibility] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const table = useReactTable({
    data: tracks,
    columns,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: 'includesString',
    getColumnCanGlobalFilter: () => true,
    initialState: {
      sorting: [
        {
          id: 'name',
          desc: false,
        },
      ],
    },
    state: {
      globalFilter,
      columnVisibility,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
  });

  return (
    <div className={styles.favoritesWrapper} suppressHydrationWarning>
      {loading && <Loading loadingState={loadingState} />}
      <Header asideState={asideState} />
      {!loading && !tracks?.length && (
        <LoadTracksModal fetchFavorites={fetchFavorites} />
      )}
      {tracks.length >= 1 && (
        <div className={classname([styles.content, loading && styles.loading])}>
          <Toolbar table={table} fetchFavorites={fetchFavorites} />
          <div className={classname([styles.gridWrapper])}>
            <div className={styles.headerWrapper}>
              {table.getFlatHeaders().map((header) => {
                const sortDirection = header.column.getIsSorted();
                return (
                  <div
                    id={header.id}
                    key={header.id}
                    className={styles.headerItem}
                  >
                    <button
                      type='button'
                      onClick={() => header.column.toggleSorting()}
                      className={styles.toggleButton}
                    >
                      {header.id}
                      <ToggleIndicator direction={sortDirection} />
                    </button>
                  </div>
                );
              })}
            </div>
            {table.getRowModel().rows.map((row) => (
              <div key={row.id} className={styles.row}>
                {row.getVisibleCells().map((cell) => (
                  <div key={cell.id} className={styles.cell}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Pagination table={table} />
        </div>
      )}
    </div>
  );
}

export default FavoritesTable;
