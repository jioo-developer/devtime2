import clsx from "clsx";
import styles from "./CommonPagination.module.css";

type NavButtonProps = {
  ariaLabel: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

type PageButtonProps = {
  page: number;
  active: boolean;
  onClick: () => void;
};

export function NavButton({
  ariaLabel,
  disabled,
  onClick,
  children,
}: NavButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.navButton, disabled && styles.disabled)}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function PageButton({ page, active, onClick }: PageButtonProps) {
  return (
    <button
      type="button"
      className={clsx(styles.pageButton, active && styles.active)}
      onClick={onClick}
      aria-label={`${page}페이지`}
      aria-current={active ? "page" : undefined}
    >
      {page}
    </button>
  );
}

export type PaginationItem = number | "...";

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
): PaginationItem[] {
  if (totalPages <= 0) return [];

  const items: PaginationItem[] = [];

  // 항상 보여줄 페이지 수 계산 (첫 페이지 + 마지막 페이지 + 현재 페이지 + 양쪽 siblings)
  const totalNumbers = siblingCount * 2 + 3;
  const totalBlocks = totalNumbers + 2; // ellipsis 포함

  if (totalBlocks >= totalPages) {
    // 모든 페이지를 표시
    for (let i = 1; i <= totalPages; i++) {
      items.push(i);
    }
    return items;
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftDots = leftSiblingIndex > 2;
  const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftDots && shouldShowRightDots) {
    // 왼쪽 dots 없음
    const leftItemCount = 3 + 2 * siblingCount;
    for (let i = 1; i <= leftItemCount; i++) {
      items.push(i);
    }
    items.push("...");
    items.push(lastPageIndex);
  } else if (shouldShowLeftDots && !shouldShowRightDots) {
    // 오른쪽 dots 없음
    const rightItemCount = 3 + 2 * siblingCount;
    items.push(firstPageIndex);
    items.push("...");
    for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
      items.push(i);
    }
  } else if (shouldShowLeftDots && shouldShowRightDots) {
    // 양쪽 dots 있음
    items.push(firstPageIndex);
    items.push("...");
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      items.push(i);
    }
    items.push("...");
    items.push(lastPageIndex);
  }

  return items;
}
