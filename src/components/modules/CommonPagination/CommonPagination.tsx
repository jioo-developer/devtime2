"use client";
import styles from "./style.module.css";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

import { NavButton } from "./component/NavButton";
import { PageButton } from "./component/PageButton";
import { getPaginationItems, type PaginationItem } from "./handlePaginate";

type CommonPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
  testId?: string;
};

function CommonPagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  testId,
}: CommonPaginationProps) {
  const isFirst = currentPage === 1;
  const isLast = currentPage === totalPages;

  const items: PaginationItem[] = getPaginationItems(
    currentPage,
    totalPages,
    siblingCount,
  );

  const moveTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (page === currentPage) return;
    onPageChange(page);
  };

  return (
    <div
      className={styles.pagination}
      {...(testId ? { "data-testid": testId } : {})}
    >
      {showFirstLast && (
        <NavButton
          ariaLabel="처음 페이지"
          disabled={isFirst}
          onClick={() => moveTo(1)}
        >
          <MdKeyboardDoubleArrowLeft size={18} />
        </NavButton>
      )}

      <NavButton
        ariaLabel="이전 페이지"
        disabled={isFirst}
        onClick={() => moveTo(currentPage - 1)}
      >
        <MdChevronLeft size={18} />
      </NavButton>

      {items.map((item, index) =>
        item === "..." ? (
          <span key={`ellipsis-${index}`} className={styles.ellipsis}>
            ...
          </span>
        ) : (
          <PageButton
            key={item}
            page={item}
            active={item === currentPage}
            onClick={() => moveTo(item)}
          />
        ),
      )}

      <NavButton
        ariaLabel="다음 페이지"
        disabled={isLast}
        onClick={() => moveTo(currentPage + 1)}
      >
        <MdChevronRight size={18} />
      </NavButton>

      {showFirstLast && (
        <NavButton
          ariaLabel="마지막 페이지"
          disabled={isLast}
          onClick={() => moveTo(totalPages)}
        >
          <MdKeyboardDoubleArrowRight size={18} />
        </NavButton>
      )}
    </div>
  );
}

export default CommonPagination;
