import React, { useState } from "react";
import TodoListItem from "@/components/modules/TodoListItem/TodoListItem";
import ProfileCard from "@/components/modules/ProfileCard/ProfileCard";
import ImageUploader from "@/components/modules/ImageUploader/ImageUploader";
import AlertPopup from "@/components/modules/Popup/Alert/AlertPopup";
import ConfirmPopup from "@/components/modules/Popup/Confirm/ConfirmPopup";
import styles from "./componentTab.module.css";

export default function ModulesTab() {
  const [showAlert, setShowAlert] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [todoText, setTodoText] = useState("TODO List Item");
  const [todoStatus, setTodoStatus] = useState<
    "active" | "typing" | "empty" | "completed" | "default" | "disabled"
  >("default");

  const handleTodoTextChange = (nextText: string) => {
    setTodoText(nextText);
  };

  const handleTodoStatusChange = (
    nextStatus:
      | "active"
      | "typing"
      | "empty"
      | "completed"
      | "default"
      | "disabled"
  ) => {
    setTodoStatus(nextStatus);
  };

  const handleTodoDelete = () => {
    alert("삭제되었습니다!");
  };

  return (
    <div className={styles.tabContainer}>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ImageUploader</h2>
        <div className={styles.componentBox}>
          <ImageUploader />
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>TodoListItem</h2>
        <div className={styles.componentBox}>
          <div className={styles.column}>
            <TodoListItem
              text={todoText}
              initialStatus={todoStatus}
              onTextChange={handleTodoTextChange}
              onStatusChange={handleTodoStatusChange}
              onDelete={handleTodoDelete}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>ProfileCard</h2>
        <div className={styles.componentBox}>
          <div className={styles.column}>
            <ProfileCard
              rank={1}
              username="CoffeeScripted"
              description="구글 앞이 코딩하기... 아니 긴 구글 이와 거조아!"
              accumulated="420시간"
              dailyAverage="4.5시간"
              period="4 - 7년"
              tags={["Item", "Item", "Item", "Item", "Item"]}
            />
            <ProfileCard
              rank={4}
              username="CoffeeScripted"
              description="구글 앞이 코딩하기... 아니 긴 구글 이와 거조아!"
              accumulated="420시간"
              dailyAverage="4.5시간"
              period="0 - 3년"
              tags={["Item", "Item", "Item", "Item", "Item"]}
            />
            <ProfileCard
              rank={9999}
              username="CoffeeScripted"
              description="구글 앞이 코딩하기... 아니 긴 구글 이와 거조아!"
              accumulated="420시간"
              dailyAverage="4.5시간"
              period="11년 이상"
              tags={["Item", "Item", "Item", "Item", "Item"]}
            />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Popup</h2>
        <div className={styles.componentBox}>
          <div className={styles.row}>
            <button
              className={styles.demoButton}
              onClick={() => setShowAlert(true)}
            >
              Show Alert
            </button>
            <button
              className={styles.demoButton}
              onClick={() => setShowConfirm(true)}
            >
              Show Confirm
            </button>
          </div>
        </div>
      </section>

      {showAlert && (
        <AlertPopup
          title="알림"
          message="이것은 Alert 팝업입니다."
          onConfirm={() => setShowAlert(false)}
        />
      )}

      {showConfirm && (
        <ConfirmPopup
          title="확인"
          message="정말로 진행하시겠습니까?"
          onConfirm={() => {
            setShowConfirm(false);
            alert("확인되었습니다!");
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
