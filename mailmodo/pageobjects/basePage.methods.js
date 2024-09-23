import { BasePageLocators } from './basePage.locators';
import { expect } from '@playwright/test';

export class BasePage {
    /**
       * constructor
        @param {} page
       */
    constructor(page) {
        this.page = page;
        this.locators = new BasePageLocators(this.page);
    }

    /**
     *
      @param {} menuName
     */
    async openMenuItem(menuName) {
        // click on menu item and navigate to the specific module.
        this.locators.getMenuItemLocator(menuName).click();
    }

    async verifySideBarMenuIsVisible() {
        await expect(async () => {
            await expect(this.locators.sideBarMenu).toBeAttached();
            await expect(this.locators.sideBarMenu).toBeVisible();
        }).toPass();
    }

    /**
     *
      @param {} menuName
     */
    async openNewMenuItem(menuName) {
        // click on menu item and navigate to the specific module.
        await expect(this.locators.pageHeader).toBeVisible();
        await expect(async () => {
            await expect(this.locators.getMenuItemLocator(menuName)).toBeAttached();
            await expect(this.locators.getMenuItemLocator(menuName)).toBeVisible();
        }).toPass({ timeout: 60000 })
        await this.locators.getMenuItemLocator(menuName).click();
    }

    /**
   * Navigate to given URL
    @param {} url
   */
    async goToUrl(url) {
        await this.page.goto(url, { timeout: 120000 });
        await this.page.waitForLoadState('load', { timeout: 65000 });
    }

    /**
   * Login in to application when email and password is provided.
   * @param {*} email
   * @param {*} password
   */
    async loginIntoApplication(email, password) {
        await this.locators.emailField.fill(email);
        await this.locators.passwordField.fill(password);
        await this.locators.loginButton.click();
        await this.page.waitForLoadState('load', { timeout: 60000 });
    }

}
