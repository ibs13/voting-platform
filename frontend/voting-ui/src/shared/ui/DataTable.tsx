type Column<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  loading?: boolean;
  loadingText?: string;
  emptyMessage?: string;
};

export const DataTable = <T,>({
  columns,
  data,
  keyField,
  loading = false,
  loadingText = "Loading...",
  emptyMessage = "No data found.",
}: DataTableProps<T>) => {
  if (loading) {
    return <div className="text-gray-600">{loadingText}</div>;
  }

  if (data.length === 0) {
    return <div className="text-gray-600">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`border px-4 py-3 text-left text-sm font-medium text-gray-700 ${column.className ?? ""}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr
              key={String(row[keyField])}
              className="border-t hover:bg-gray-50"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`border px-4 py-3 text-sm text-gray-800 ${column.className ?? ""}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
