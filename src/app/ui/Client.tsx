"use client";
import React, { useState } from "react";
import styles from "./style.module.css";
import AtomsTab from "./components/AtomsTab";
import ModulesTab from "./components/ModulesTab";

export default function Client() {
  const [activeTab, setActiveTab] = useState<"atoms" | "modules">("atoms");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Component Library</h1>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${
              activeTab === "atoms" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("atoms")}
          >
            Atoms
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "modules" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("modules")}
          >
            Modules
          </button>
        </div>
      </div>

      <div className={styles.content}>
        {activeTab === "atoms" ? <AtomsTab /> : <ModulesTab />}
      </div>
    </div>
  );
}
