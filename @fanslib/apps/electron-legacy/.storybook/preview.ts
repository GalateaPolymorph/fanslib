import type { Preview } from "@storybook/react";
import { createElement } from "react";
import "../src/renderer/src/index.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      toc: true,
    },
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "light", title: "Light" },
          { value: "dark", title: "Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || "light";
      return createElement(
        "div",
        { className: theme === "dark" ? "dark" : "" },
        createElement(
          "div",
          { className: "bg-background text-foreground p-4" },
          createElement(Story)
        )
      );
    },
  ],
};

export default preview;
