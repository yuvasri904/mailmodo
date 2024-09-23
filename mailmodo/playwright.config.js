// @ts-check
const { devices } = require("@playwright/test");
require("dotenv").config();
require("dotenv").config({ path: ".env.aws" });

const config = {
  globalSetup: "./utils/global-setup",
  testDir: "./tests/",
  retries: 0,
  forbidOnly: true,
  trace: "on",
  /* Maximum time one test can run for. */
  timeout: 60 * 1000,
  expect: {
    timeout: 25000,
  },

  reporter: [
    ['html', { open: 'never' }], // HTML report
    ['./utils/CustomEventListeners.js'] // Custom event listener
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    browserName: "chromium",
    headless: false,
    viewport: null,
    screenshot: "on",
    trace: "off", // off,on,
    launchOptions: {
      args: ["--start-maximized"],
    },

    updateTestResultsInBrowserstackTestManagement: false,
    updateAutomationStatusInBrowserstackTestManagement: false,
    mode: "parallel",
    storageState: "./LoginAuth.json",
    navigationTimeout: 60000
  },
  workers: 4,
  projects: [
    {
      name: "staging",
      use: {
        baseURL: process.env.WEB_APP_URL,
        email: process.env.AUTOMATION_ADMIN_EMAIL,
        password: process.env.AUTOMATION_PASSWORD,
        storageState: "./LoginAuth.json",
      },
    },
  ],
};

module.exports = config;
