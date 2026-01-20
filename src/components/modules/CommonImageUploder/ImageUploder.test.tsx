import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploader from "./ImageUploder";

describe("ImageUploader", () => {
  it("라벨이 올바르게 렌더링된다", () => {
    render(<ImageUploader label="프로필 이미지" />);

    expect(screen.getByText("프로필 이미지")).toBeInTheDocument();
  });

  it("기본 placeholder가 표시된다", () => {
    render(<ImageUploader />);

    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("도움말 텍스트가 올바르게 표시된다", () => {
    render(<ImageUploader maxSize={5} acceptedFormats={[".png", ".jpg"]} />);

    expect(screen.getByText(/5MB 미만의 .png, .jpg 파일/)).toBeInTheDocument();
  });

  it("파일 입력 요소가 올바른 accept 속성을 가진다", () => {
    render(<ImageUploader acceptedFormats={[".png", ".jpg", ".jpeg"]} />);

    const fileInput = screen
      .getByRole("textbox", { hidden: true })
      .closest("input[type='file']");
    expect(fileInput).toHaveAttribute("accept", ".png,.jpg,.jpeg");
  });

  it("이미지 업로드 영역 클릭 시 파일 선택 창이 열린다", () => {
    render(<ImageUploader />);

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, "click");

    const uploadBox = screen.getByText("+").closest("div");
    fireEvent.click(uploadBox!);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("유효한 이미지 파일 선택 시 미리보기가 표시된다", async () => {
    const handleImageChange = vi.fn();
    render(<ImageUploader onImageChange={handleImageChange} />);

    const file = new File(["dummy content"], "test.png", {
      type: "image/png",
    });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(handleImageChange).toHaveBeenCalledWith(file);
    });
  });

  it("최대 크기를 초과하는 파일 선택 시 경고가 표시된다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    const handleImageChange = vi.fn();

    render(<ImageUploader maxSize={1} onImageChange={handleImageChange} />);

    // 2MB 파일 생성
    const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });

    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [largeFile],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith("파일 크기는 1MB 이하여야 합니다.");
    });

    expect(handleImageChange).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it("파일이 선택되면 onImageChange 콜백이 호출된다", async () => {
    const handleImageChange = vi.fn();
    render(<ImageUploader onImageChange={handleImageChange} />);

    const file = new File(["content"], "test.jpg", { type: "image/jpeg" });
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: false,
    });

    fireEvent.change(fileInput);

    await waitFor(() => {
      expect(handleImageChange).toHaveBeenCalledWith(file);
    });
  });

  it("커스텀 최대 크기 설정이 적용된다", () => {
    render(<ImageUploader maxSize={10} />);

    expect(screen.getByText(/10MB 미만/)).toBeInTheDocument();
  });

  it("커스텀 허용 파일 형식이 표시된다", () => {
    render(<ImageUploader acceptedFormats={[".gif", ".webp"]} />);

    expect(screen.getByText(/\.gif, \.webp/)).toBeInTheDocument();
  });
});
