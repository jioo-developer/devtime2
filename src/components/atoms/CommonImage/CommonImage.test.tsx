import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CommonImage from "./CommonImage";

describe("CommonImage", () => {
  it("이미지가 올바르게 렌더링된다", () => {
    render(
      <CommonImage
        src="/test-image.jpg"
        alt="테스트 이미지"
        width={100}
        height={100}
      />,
    );

    const image = screen.getByAltText("테스트 이미지");
    expect(image).toBeInTheDocument();
  });

  it("alt 텍스트가 올바르게 설정된다", () => {
    render(
      <CommonImage
        src="/test-image.jpg"
        alt="프로필 사진"
        width={200}
        height={200}
      />,
    );

    const image = screen.getByAltText("프로필 사진");
    expect(image).toHaveAttribute("alt", "프로필 사진");
  });

  it("src 속성이 올바르게 설정된다", () => {
    render(<CommonImage src="/logo.png" alt="로고" width={150} height={150} />);

    const image = screen.getByAltText("로고");
    expect(image).toHaveAttribute("src");
  });

  it("width와 height가 올바르게 전달된다", () => {
    render(
      <CommonImage src="/test.jpg" alt="테스트" width={300} height={200} />,
    );

    const image = screen.getByAltText("테스트");
    expect(image).toHaveAttribute("width", "300");
    expect(image).toHaveAttribute("height", "200");
  });

  it("fill 속성이 true일 때 width/height가 전달되지 않는다", () => {
    render(<CommonImage src="/test.jpg" alt="테스트" fill />);

    const image = screen.getByAltText("테스트");
    expect(image).not.toHaveAttribute("width");
    expect(image).not.toHaveAttribute("height");
  });

  it("className이 올바르게 적용된다", () => {
    render(
      <CommonImage
        src="/test.jpg"
        alt="테스트"
        width={100}
        height={100}
        className="custom-image-class"
      />,
    );

    const image = screen.getByAltText("테스트");
    expect(image).toHaveClass("custom-image-class");
  });

  it("fill이 true일 때 sizes가 자동으로 100vw로 설정된다", () => {
    render(<CommonImage src="/test.jpg" alt="테스트" fill />);

    const image = screen.getByAltText("테스트");
    expect(image).toHaveAttribute("sizes", "100vw");
  });

  it("커스텀 sizes가 전달되면 그대로 사용된다", () => {
    render(
      <CommonImage
        src="/test.jpg"
        alt="테스트"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
      />,
    );

    const image = screen.getByAltText("테스트");
    expect(image).toHaveAttribute("sizes", "(max-width: 768px) 100vw, 50vw");
  });

  it("추가 props가 올바르게 전달된다", () => {
    render(
      <CommonImage
        src="/test.jpg"
        alt="테스트"
        width={100}
        height={100}
        priority
        quality={90}
      />,
    );

    const image = screen.getByAltText("테스트");
    expect(image).toBeInTheDocument();
  });

  it("StaticImageData 타입의 src를 받을 수 있다", () => {
    const staticImage = {
      src: "/static-image.jpg",
      height: 400,
      width: 600,
      blurDataURL: "data:image/jpeg;base64,/9j/...",
    };

    render(
      <CommonImage
        src={staticImage}
        alt="정적 이미지"
        width={600}
        height={400}
      />,
    );

    const image = screen.getByAltText("정적 이미지");
    expect(image).toBeInTheDocument();
  });
});
