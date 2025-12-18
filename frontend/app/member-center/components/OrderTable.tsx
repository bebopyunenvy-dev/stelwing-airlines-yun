import type React from "react"

export interface Column {
  key: string;
  title: string;
  width?: number;
  align?: "left" | "center" | "right"
  render?: (value: any, row: any, index: number) => React.ReactNode
}

interface OrderTableProps {
  columns: Column[];
  data: any[];
}

export default function OrderTable({ columns, data }: OrderTableProps) {
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center"
      case "right":
        return "text-right"
      default:
        return "text-left"
    }
  };

  return (
    <div className="rounded-[18px] border border-[#CDA870] bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full bg-white text-sm text-[#1F2E3C]">
          <thead className="bg-[#1F2E3C] text-white text-[15px]">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.key}
                  className={`py-3 px-5 font-semibold ${getAlignClass(column.align)} ${
                    index === 0 ? "rounded-tl-[16px]" : ""
                  } ${index === columns.length - 1 ? "rounded-tr-[16px]" : ""}`}
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-[#E8D7B5] last:border-b-0 hover:bg-[#FDF8EE] transition-colors"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`py-3 px-5 ${getAlignClass(column.align)} align-middle`}
                  >
                    {column.render ? column.render(row[column.key], row, rowIndex) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
