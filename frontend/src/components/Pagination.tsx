import { Pagination as AntPagination } from 'antd'

interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number) => void
}

const Pagination = ({ current, pageSize, total, onChange }: PaginationProps) => {
  return (
    <div className="pagination-container">
      <AntPagination
        current={current}
        pageSize={pageSize}
        total={total}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper
        showTotal={(total) => `共 ${total} 条`}
      />
    </div>
  )
}

export default Pagination