import Timer from "@/app/Home/component/Timer";
import "./style.css";
export default async function Page() {
  return (
    <main className="mainPageWrap">
      <h2 className="motivationalText">오늘도 열심히 달려봐요!</h2>
      <Timer />
    </main>
  );
}
