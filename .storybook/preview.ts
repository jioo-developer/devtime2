import type { Preview } from "@storybook/nextjs-vite";
import "../src/asset/reset.css";
import "../src/asset/common.css";

// Pretendard 폰트 적용
const style = document.createElement("style");
style.innerHTML = `
  @font-face {
    font-family: 'Pretendard Variable';
    src: url('/fonts/PretendardVariable.woff2') format('woff2');
    font-weight: 45 920;
    font-display: swap;
  }
  body {
    font-family: 'Pretendard Variable', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  }
`;
document.head.appendChild(style);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
