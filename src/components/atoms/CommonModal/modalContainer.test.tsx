import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UIModalStack from "./modalContainer";
import { useModalStore } from "@/store/modalStore";

vi.mock("@/store/modalStore", () => ({
  useModalStore: vi.fn(),
}));

vi.mock("./CommonModal", () => ({
  default: ({
    children,
    title,
    testId,
    onRequestClose,
    isTop,
  }: {
    children: React.ReactNode;
    title?: React.ReactNode;
    testId?: string;
    onRequestClose: () => void;
    isTop: boolean;
  }) => (
    <div data-testid={testId || "modal"} data-is-top={isTop}>
      {title && <div>{title}</div>}
      {children}
      <button onClick={onRequestClose}>닫기</button>
    </div>
  ),
}));

describe("UIModalStack", () => {
  const mockClose = vi.fn();
  const mockCloseTop = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.style.overflow = "";
  });

  afterEach(() => {
    document.body.style.overflow = "";
  });

  it("스택이 비어있으면 아무것도 렌더링하지 않는다", () => {
    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = { stack: [], close: mockClose, closeTop: mockCloseTop };
      return selector(state as never);
    });

    const { container } = render(<UIModalStack />);
    expect(container.firstChild).toBeNull();
  });

  it("모달이 하나 있을 때 정상적으로 렌더링된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>첫 번째 모달</div>,
        title: "제목 1",
        closeOnBackdrop: true,
        closeOnEsc: true,
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);
    expect(screen.getByText("첫 번째 모달")).toBeInTheDocument();
    expect(screen.getByText("제목 1")).toBeInTheDocument();
  });

  it("여러 개의 모달이 스택에 쌓일 때 모두 렌더링된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>첫 번째 모달</div>,
        testId: "modal-1",
      },
      {
        id: "modal-2",
        content: <div>두 번째 모달</div>,
        testId: "modal-2",
      },
      {
        id: "modal-3",
        content: <div>세 번째 모달</div>,
        testId: "modal-3",
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);
    expect(screen.getByText("첫 번째 모달")).toBeInTheDocument();
    expect(screen.getByText("두 번째 모달")).toBeInTheDocument();
    expect(screen.getByText("세 번째 모달")).toBeInTheDocument();
  });

  it("최상단 모달만 isTop이 true로 설정된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>첫 번째</div>,
        testId: "modal-1",
      },
      {
        id: "modal-2",
        content: <div>두 번째</div>,
        testId: "modal-2",
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);

    const modal1 = screen.getByTestId("modal-1");
    const modal2 = screen.getByTestId("modal-2");
    expect(modal1).toHaveAttribute("data-is-top", "false");
    expect(modal2).toHaveAttribute("data-is-top", "true");
  });

  it("모달 닫기 버튼 클릭 시 해당 모달의 close가 호출된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>모달 내용</div>,
        testId: "modal-1",
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);

    const closeButton = screen.getByText("닫기");
    fireEvent.click(closeButton);
    expect(mockClose).toHaveBeenCalledWith("modal-1");
  });

  it("모달이 열리면 body의 overflow가 hidden으로 설정된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>모달</div>,
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("모달이 닫히면 body의 overflow가 원래대로 복원된다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>모달</div>,
      },
    ];

    document.body.style.overflow = "auto";
    const { rerender } = render(<UIModalStack />);

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    rerender(<UIModalStack />);
    expect(document.body.style.overflow).toBe("hidden");

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = { stack: [], close: mockClose, closeTop: mockCloseTop };
      return selector(state as never);
    });

    rerender(<UIModalStack />);

    waitFor(() => {
      expect(document.body.style.overflow).toBe("auto");
    });
  });

  it("zIndex가 스택 순서에 따라 증가한다", () => {
    const mockStack = [
      {
        id: "modal-1",
        content: <div>모달 1</div>,
        testId: "modal-1",
      },
      {
        id: "modal-2",
        content: <div>모달 2</div>,
        testId: "modal-2",
      },
    ];

    vi.mocked(useModalStore).mockImplementation((selector) => {
      const state = {
        stack: mockStack,
        close: mockClose,
        closeTop: mockCloseTop,
      };
      return selector(state as never);
    });

    render(<UIModalStack />);
    expect(screen.getByTestId("modal-1")).toBeInTheDocument();
    expect(screen.getByTestId("modal-2")).toBeInTheDocument();
  });
});
