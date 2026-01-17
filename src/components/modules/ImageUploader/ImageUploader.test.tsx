import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ImageUploader from "./ImageUploader";

describe("ImageUploader", () => {
  it("기본 레이블로 렌더링된다", () => {
    render(<ImageUploader />);
    expect(screen.getByText("Label")).toBeInTheDocument();
  });

  it("커스텀 레이블로 렌더링된다", () => {
    render(<ImageUploader label="Upload Avatar" />);
    expect(screen.getByText("Upload Avatar")).toBeInTheDocument();
  });

  it("파일 형식과 크기가 포함된 도움말 텍스트를 표시한다", () => {
    render(<ImageUploader maxSize={10} acceptedFormats={[".png", ".jpg"]} />);
    expect(screen.getByText(/10MB 미만의 .png, .jpg 파일/)).toBeInTheDocument();
  });

  it("이미지가 업로드되지 않았을 때 플러스 기호를 표시한다", () => {
    render(<ImageUploader />);
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("업로드 박스를 클릭하면 파일 입력이 열린다", () => {
    render(<ImageUploader />);
    const fileInput = document.querySelector('input[type="file"]');
  });

  it("파일 업로드 후 미리보기를 표시한다", async () => {
    const handleImageChange = vi.fn();
    render(<ImageUploader onImageChange={handleImageChange} />);

    const file = new File(["test"], "test.png", { type: "image/png" });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (input) {
      Object.defineProperty(input, "files", {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(handleImageChange).toHaveBeenCalledWith(file);
      });
    }
  });

  it("파일 크기를 검증한다", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<ImageUploader maxSize={1} />);

    const largeFile = new File(["x".repeat(2 * 1024 * 1024)], "large.png", {
      type: "image/png",
    });
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    if (input) {
      Object.defineProperty(input, "files", {
        value: [largeFile],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "파일 크기는 1MB 이하여야 합니다."
        );
      });
    }

    alertSpy.mockRestore();
  });

  it("지정된 파일 형식을 허용한다", () => {
    render(<ImageUploader acceptedFormats={[".png", ".gif"]} />);
    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;

    expect(input).toHaveAttribute("accept", ".png,.gif");
  });
});
