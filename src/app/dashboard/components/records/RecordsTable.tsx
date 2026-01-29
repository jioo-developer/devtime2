"use client";
import { MdOutlineDelete } from "react-icons/md";
import CommonButton from "@/components/atoms/CommonButton/CommonButton";
import type { StudyLogListItem } from "../../types";
import { formatMinToHm, formatTaskRate } from "../../utils/formatStats";

type RecordsTableProps = {
  records: StudyLogListItem[];
  isLoading: boolean;
  isError: boolean;
  onGoalClick: (studyLogId: string | number) => void;
};

export function RecordsTable({ records, isLoading, isError, onGoalClick }: RecordsTableProps) {
  return (
    <div className="recordsTableWrap">
      <table className="recordsTable">
        <thead>
          <tr>
            <th>날짜</th>
            <th>목표</th>
            <th>공부 시간</th>
            <th>할일 갯수</th>
            <th>미완료 할 일</th>
            <th>달성률</th>
            <th className="colDelete" scope="col" />
          </tr>
        </thead>
        <tbody aria-busy={isLoading}>
          {records.length === 0 && !isLoading ? (
            <tr>
              <td colSpan={7} className="recordsEmpty">
                {isError ? "목록을 불러오지 못했습니다." : "기록이 없습니다."}
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.studyLogId}>
                <td className="colDate">{record.date ? record.date.replace(/-/g, ".") : record.date}</td>
                <td className="colGoal">
                  <CommonButton
                    type="button"
                    theme="none"
                    className="recordGoalButton"
                    onClick={() => onGoalClick(record.studyLogId)}
                  >
                    {record.goal}
                  </CommonButton>
                </td>
                <td>{formatMinToHm(record.studyTimeMinutes)}</td>
                <td>{record.todoCount}</td>
                <td>{record.unfinishedCount}</td>
                <td>{formatTaskRate(record.completionRate)}</td>
                <td className="colDelete">
                  <CommonButton type="button" theme="none" aria-label="삭제">
                    <MdOutlineDelete size={18} aria-hidden />
                  </CommonButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
