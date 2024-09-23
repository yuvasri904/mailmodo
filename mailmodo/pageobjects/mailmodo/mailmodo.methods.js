import { MailmodoLocators } from "./mailmodo.locators";
import { expect } from "@playwright/test";
const { generateRandomNumber } = require("../../utils/utils");

export class MailmodoMethods {
  constructor(page) {
    this.page = page;
    this.locators = new MailmodoLocators(page);
  }

  async createContact(contactName) {
    await expect(this.locators.contacts.first()).toBeVisible();
    await this.locators.contacts.first().click();
    await this.locators.searchContact.clear();
    await expect(this.locators.addcontacts).toBeVisible();
    await this.locators.addcontacts.click();
    await expect(this.locators.uploading_CSV).toBeVisible();
    await this.locators.uploading_CSV.click();
    await expect(this.locators.importTab).toBeVisible();
    await this.locators.add_name.click();
    await this.locators.add_name.fill(contactName);
    const filePath1 = "./mailmodo/testdata/contactCreation/CSV_Import.csv";
    await this.locators.csvImport.setInputFiles(filePath1);
    await expect(this.locators.mapColumns).toBeVisible();
    await this.locators.mapColumns.click();
    await this.locators.emailAddress.scrollIntoViewIfNeeded();
    await this.locators.emailAddress.click();
    await expect(this.locators.donotImport).toBeVisible();
    await this.locators.donotImport.click();
    await expect(this.locators.reviewImport).toBeVisible();
    await this.locators.reviewImport.click();
    await expect(this.locators.importContacts).toBeVisible();
    await this.locators.importContacts.click();
    await expect(this.locators.importOkay).toBeVisible();
    await this.locators.importOkay.click();
    await this.locators.spin
      .first()
      .waitFor({ state: "hidden", timeout: 120000 });
  }
  async exportCSV(contactName) {
    await expect(this.locators.contacts.first()).toBeVisible();
    await this.locators.contacts.first().click();
    await this.locators
      .moreIcon(contactName)
      .waitFor({ state: "visible", timeout: 60000 });
    await this.locators.moreIcon(contactName).click();
    await expect(this.locators.archive).toBeVisible();
    await this.locators.archive.click();
    await expect(this.locators.archiveCheckbox).toBeVisible();
    await this.locators.archiveCheckbox.click();
    await expect(this.locators.archiveCheckbox).toBeVisible();
    await this.locators.archiveCheckbox.check();
    await expect(this.locators.downloadbackup).toBeVisible();
    await this.locators.downloadbackup.click();
    await expect(this.locators.downloadPopup).toBeVisible();
    await this.locators.downloadPopup.click();
    await expect(this.locators.backdownLoaded).toBeVisible();
    await this.locators.backdownLoaded.click();
    await expect(this.locators.downloadPopup).not.toBeVisible( {timeout: 90000});
    await expect(this.locators.cancelButton).toBeVisible();
    await this.locators.cancelButton.click();
    await this.locators.moreIcon(contactName).click();
    await expect(this.locators.expostCSV).toBeVisible();
    await this.locators.expostCSV.click();
    await expect(this.locators.limtReached).toBeVisible();
    await this.locators.limtReached.click();
  }

  async archiveContact(contactName) {
    await expect(this.locators.contacts).toBeVisible();
    await this.locators.contacts.click();
    await this.locators.searchContact.fill(contactName);
    await this.page.waitForTimeout(2000);
    if (await this.locators.locateByText(contactName).isVisible()) {
      await this.locators.moreIcon(contactName).first().click();
      await expect(async () => {
        await expect(this.locators.archiveOption).toBeVisible();
        await expect(this.locators.archiveOption).toBeEnabled();
      }).toPass();
      await this.locators.archiveOption.click();
      await expect(async () => {
        await expect(this.locators.archiveListButton).toBeVisible();
        await expect(this.locators.archiveListButton).toBeEnabled();
      }).toPass();
      await this.locators.archiveListButton.click();
      await expect(async () => {
        await expect(this.locators.locateByText(contactName)).toBeVisible();
      }).toPass();
    }
  }
}
