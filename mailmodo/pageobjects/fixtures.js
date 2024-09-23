import base from '@playwright/test';

import { BasePage } from './basePage.methods';
import { MailmodoMethods } from './mailmodo/mailmodo.methods';

export const test = base.extend({
  email: async ({ }, use, testInfo) => {
    use(testInfo.project.use.email);
  },
  otp: async ({ }, use, testInfo) => {
    use(testInfo.project.use.otp);
  },
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
  mailmodo: async ({ page }, use) => {
    const mailmodo = new MailmodoMethods(page);
    await use(mailmodo);
  },
});