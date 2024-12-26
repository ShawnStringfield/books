import type { StorybookConfig } from "@storybook/nextjs";
import path from "path";

const config: StorybookConfig = {
  stories: ["../app/**/*.mdx", "../app/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/addon-themes",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@/contexts/AuthContext": path.resolve(
          __dirname,
          "./mocks/authContext.ts"
        ),
        "@/app/lib/firebase/services/books": path.resolve(
          __dirname,
          "./mocks/firebase-services.ts"
        ),
        "@/app/lib/firebase/services/highlights": path.resolve(
          __dirname,
          "./mocks/firebase-services.ts"
        ),
      };
    }
    return config;
  },
};

export default config;
