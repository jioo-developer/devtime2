export type PaginationItem = number | "...";

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

function getPageBounds(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
) {
  return {
    left: Math.max(currentPage - siblingCount, 1),
    right: Math.min(currentPage + siblingCount, totalPages),
  };
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
): PaginationItem[] {
  if (totalPages <= 0) return [];

  const totalNumbers = siblingCount * 2 + 3;
  const totalBlocks = totalNumbers + 2;

  if (totalBlocks >= totalPages) {
    return range(1, totalPages);
  }

  const { left, right } = getPageBounds(currentPage, totalPages, siblingCount);

  const showLeftDots = left > 2;
  const showRightDots = right < totalPages - 1;

  if (!showLeftDots && showRightDots) {
    return [...range(1, 3 + siblingCount * 2), "...", totalPages];
  }

  if (showLeftDots && !showRightDots) {
    return [
      1,
      "...",
      ...range(totalPages - (2 + siblingCount * 2), totalPages),
    ];
  }

  return [1, "...", ...range(left, right), "...", totalPages];
}
