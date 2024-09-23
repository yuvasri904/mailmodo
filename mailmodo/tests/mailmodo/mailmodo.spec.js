import { test } from "../../pageobjects/fixtures";

let contactName = "test1451";

/**
 * author @Yuvasri
 */
test.describe.parallel("Contact Suite", () => {
  test.beforeEach(async ({ baseURL, basePage, page, mailmodo }) => {
    await basePage.goToUrl(baseURL);
    page.on("console", (msg) => console.log(`BROWSER LOG: ${msg.text()}`));
    if (test.info().title === "test1") {
      await mailmodo.archiveContact(contactName);
    }
    test.setTimeout(180000);
  });

  test("test1", async ({ mailmodo }) => {
    await mailmodo.createContact(contactName);
  });

  test("test2", async ({ mailmodo }) => {
    await mailmodo.exportCSV(contactName);
  });
});
