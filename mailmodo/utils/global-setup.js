const { chromium } = require('@playwright/test');
const { BasePage } = require('../pageobjects/basePage.methods.js')
const config = require('../playwright.config.js');

/**
 * @author TD Team
 * This global setup is required to login once in to application and then reusing the state(LoginAuth.json) for other test cases
 * This is applicable for single user login.
 */
async function globalSetup() {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();
    const basePage = new BasePage(page);
    // Get the project name from command-line arguments
    const projectArg = process.argv.find(arg => arg.startsWith('--project=')) || `--project=${process.env.PROJECT}`;
    const projectName = projectArg.split('=')[1];

    // Fetch project-specific config
    const projectConfig = config.projects.find(project => project.name === projectName)?.use;

    if (!projectConfig) {
        throw new Error("Project configuration not found");
    }

    const { baseURL, email, password } = projectConfig;
    try {
        console.log(`Navigating to URL: ${baseURL}`);
        await basePage.goToUrl(baseURL);
    } catch (error) {
        console.error(`Failed to navigate to URL: ${baseURL}`, error);
        await browser.close();
        throw error;
    }

    try {
        console.log(`Logging in with email: ${email}`);
        await basePage.loginIntoApplication(email, password);
    } catch (error) {
        console.error('Failed during login process', error);
        await browser.close();
        throw error;
    }
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Check cookies and local storage before saving
    const cookies = await context.cookies();
    const storage = await context.storageState();
    // console.log('Cookies:', cookies);
    // console.log('Storage:', storage);

    await page.context().storageState({ path: './LoginAuth.json' });
    await browser.close();
}

module.exports = globalSetup;