"use client";
import { useState } from "react";
import { useGetStudyLogsList } from "../hooks/useGetStudyLogsList";
import { useStudyLogModals } from "../hooks/useStudyLogModals";
import { RecordsTable } from "./records/RecordsTable";
import { RecordsPagination } from "./records/RecordsPagination";

export function RecordsSection() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetStudyLogsList(page);
  const { openStudyLogDetailModal } = useStudyLogModals();

  const records = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  return (
    <section className="recordsSection" aria-label="학습 기록">
      <h2 className="recordsTitle">학습 기록</h2>
      <RecordsTable
        records={records}
        isLoading={isLoading}
        isError={isError}
        onGoalClick={openStudyLogDetailModal}
      />
      <RecordsPagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </section>
  );
}
