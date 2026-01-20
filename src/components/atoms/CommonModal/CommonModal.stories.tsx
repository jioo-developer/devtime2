import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import React, { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import UIModalStack from "./modalContainer";
import CommonButton from "../CommonButton/CommonButton";

const meta = {
  title: "Atoms/CommonModal",
  component: UIModalStack,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UIModalStack>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalExample() {
  const push = useModalStore((state) => state.push);

  const openSimpleModal = () => {
    push({
      title: "간단한 모달",
      content: <div style={{ padding: "20px" }}>이것은 간단한 모달입니다.</div>,
    });
  };

  const openModalWithFooter = () => {
    push({
      title: "푸터가 있는 모달",
      content: (
        <div style={{ padding: "20px" }}>
          <p>이 모달은 푸터 버튼을 가지고 있습니다.</p>
        </div>
      ),
      footer: (
        <div
          style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
        >
          <CommonButton
            theme="secondary"
            onClick={() => useModalStore.getState().closeTop()}
          >
            취소
          </CommonButton>
          <CommonButton
            theme="primary"
            onClick={() => {
              alert("확인!");
              useModalStore.getState().closeTop();
            }}
          >
            확인
          </CommonButton>
        </div>
      ),
    });
  };

  const openNoBackdropModal = () => {
    push({
      title: "배경 클릭 불가",
      content: (
        <div style={{ padding: "20px" }}>
          <p>이 모달은 배경 클릭으로 닫을 수 없습니다.</p>
          <p>X 버튼이나 하단 버튼을 사용하세요.</p>
        </div>
      ),
      BackdropMiss: false,
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => useModalStore.getState().closeTop()}
        >
          닫기
        </CommonButton>
      ),
    });
  };

  const openMultipleModals = () => {
    push({
      title: "첫 번째 모달",
      content: (
        <div style={{ padding: "20px" }}>
          <p>첫 번째 모달입니다.</p>
          <CommonButton
            theme="primary"
            onClick={() => {
              push({
                title: "두 번째 모달",
                content: (
                  <div style={{ padding: "20px" }}>
                    <p>두 번째 모달입니다.</p>
                    <CommonButton
                      theme="primary"
                      onClick={() => {
                        push({
                          title: "세 번째 모달",
                          content: (
                            <div style={{ padding: "20px" }}>
                              세 번째 모달입니다. ESC를 눌러 차례로 닫아보세요.
                            </div>
                          ),
                        });
                      }}
                    >
                      세 번째 모달 열기
                    </CommonButton>
                  </div>
                ),
              });
            }}
          >
            두 번째 모달 열기
          </CommonButton>
        </div>
      ),
    });
  };

  const openLongContentModal = () => {
    push({
      title: "긴 컨텐츠 모달",
      content: (
        <div style={{ padding: "20px", maxHeight: "400px", overflow: "auto" }}>
          <h3>긴 컨텐츠</h3>
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i}>
              이것은 {i + 1}번째 문단입니다. 스크롤이 필요한 긴 컨텐츠를
              테스트하기 위한 내용입니다.
            </p>
          ))}
        </div>
      ),
      footer: (
        <CommonButton
          theme="primary"
          onClick={() => useModalStore.getState().closeTop()}
        >
          닫기
        </CommonButton>
      ),
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <CommonButton theme="primary" onClick={openSimpleModal}>
        간단한 모달 열기
      </CommonButton>
      <CommonButton theme="primary" onClick={openModalWithFooter}>
        푸터가 있는 모달 열기
      </CommonButton>
      <CommonButton theme="primary" onClick={openNoBackdropModal}>
        배경 클릭 불가 모달 열기
      </CommonButton>
      <CommonButton theme="primary" onClick={openMultipleModals}>
        다중 모달 열기
      </CommonButton>
      <CommonButton theme="primary" onClick={openLongContentModal}>
        긴 컨텐츠 모달 열기
      </CommonButton>
      <UIModalStack />
    </div>
  );
}

export const Default: Story = {
  render: () => <ModalExample />,
};

export const SimpleModal: Story = {
  render: () => {
    const push = useModalStore((state) => state.push);

    useEffect(() => {
      push({
        title: "간단한 모달",
        content: (
          <div style={{ padding: "20px" }}>이것은 간단한 모달입니다.</div>
        ),
      });
    }, [push]);

    return <UIModalStack />;
  },
};

export const WithFooter: Story = {
  render: () => {
    const push = useModalStore((state) => state.push);

    useEffect(() => {
      push({
        title: "푸터가 있는 모달",
        content: (
          <div style={{ padding: "20px" }}>
            <p>이 모달은 푸터 버튼을 가지고 있습니다.</p>
          </div>
        ),
        footer: (
          <div
            style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}
          >
            <CommonButton
              theme="secondary"
              onClick={() => useModalStore.getState().closeTop()}
            >
              취소
            </CommonButton>
            <CommonButton
              theme="primary"
              onClick={() => useModalStore.getState().closeTop()}
            >
              확인
            </CommonButton>
          </div>
        ),
      });
    }, [push]);

    return <UIModalStack />;
  },
};

export const NoBackdropClose: Story = {
  render: () => {
    const push = useModalStore((state) => state.push);

    useEffect(() => {
      push({
        title: "배경 클릭 불가",
        content: (
          <div style={{ padding: "20px" }}>
            <p>이 모달은 배경 클릭으로 닫을 수 없습니다.</p>
            <p>X 버튼을 사용하세요.</p>
          </div>
        ),
        BackdropMiss: false,
      });
    }, [push]);

    return <UIModalStack />;
  },
};
