"use client";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
type RecordsPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function RecordsPagination({ page, totalPages, onPageChange }: RecordsPaginationProps) {
  return (
    <nav className="pagination" aria-label="학습 기록 페이지 이동">
      <CommonButton theme="tertiary" width="auto" aria-label="첫 페이지" disabled={page <= 1} onClick={() => onPageChange(1)}>
        &laquo;
      </CommonButton>
      <CommonButton theme="tertiary" width="auto" aria-label="이전 페이지" disabled={page <= 1} onClick={() => onPageChange(Math.max(1, page - 1))}>
        &lsaquo;
      </CommonButton>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <CommonButton
          key={pageNum}
          theme="tertiary"
          width="auto"
          aria-label={`${pageNum}페이지`}
          aria-current={pageNum === page ? "page" : undefined}
          onClick={() => onPageChange(pageNum)}
        >
          {pageNum}
        </CommonButton>
      ))}
      <CommonButton theme="tertiary" width="auto" aria-label="다음 페이지" disabled={page >= totalPages} onClick={() => onPageChange(Math.min(totalPages, page + 1))}>
        &rsaquo;
      </CommonButton>
      <CommonButton theme="tertiary" width="auto" aria-label="마지막 페이지" disabled={page >= totalPages} onClick={() => onPageChange(totalPages)}>
        &raquo;
      </CommonButton>
    </nav>
  );
}
