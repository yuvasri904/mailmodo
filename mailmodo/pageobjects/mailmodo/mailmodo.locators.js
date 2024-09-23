export class MailmodoLocators {
  constructor(page) {
    this.page = page;
    this.contacts = page.locator("//span[text()='Contacts']");
    this.addcontacts = page.locator("//*[text()='Add Contacts']");
    this.uploading_CSV = page.locator("//*[text()=' Upload using CSV']");
    this.importTab = page.locator("//*[text()='Import Contacts via CSV']");
    this.add_name = page.locator("//*[@placeholder='Add name of the list']");
    this.csvImport = page.locator("//input[@type='file']");
    this.mapColumns = page.locator("//*[text()='Map columns']");
    this.emailAddress = page.locator("(//div[text()='Email Address'])[2]");
    this.donotImport = page.locator("(//*[text()='Do not import column'])[12]");
    this.reviewImport = page.locator("//*[text()='Review Import']");
    this.importContacts = page.locator("//*[text()='Import contacts']");
    this.importOkay = page.locator("//*[text()='Okay']");
    this.spin = page.locator("//*[@class='tooltip']");
    this.archive = page.locator("//*[text()='Archive']");
    this.archiveCheckbox = page.locator("#archive-contacts-checkbox");
    this.downloadbackup = page.locator("//div[text()='Download backup']");
    this.downloadPopup = page.locator(
      "//*[contains(text(),'You will receive the download link shortly on your email')]"
    );
    this.cancelButton = page.locator("//button//*[text()='Cancel']");
    this.searchContact = page.getByPlaceholder("Search contacts list by name");
    this.archiveOption = page.locator("//li//*[text()='Archive']");
    this.backdownLoaded = page.locator("//*[text()='You can archive once the backup is downloaded']")
    this.expostCSV = page.locator("//*[text()='Export to CSV']")
    this.archiveListButton = page.locator("//button//*[text()=' Archive  list']");
    this.limtReached = page.locator("//*[text()='Request Limit Reached']");
  }

  csvdownload(contactName) {
    return this.page.locator(
      `//*[text()='${contactName}']//..//..//span[@role='img']`
    );
  }

  moreIcon(contactName) {
    return this.page.locator(
      `//*[text()='${contactName}']//..//..//span[@role='img']`
    );
  }

  contactCount(contactName) {
    return this.page.locator(`//td//*[text()='${contactName}']//..//..//span`);
  }

  locateByText(text){
    return this.page.locator(`//*[text()='${text}']`)
  }
}
