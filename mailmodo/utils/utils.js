const fs = require("fs");

/**
 * Extracts the test case ID from a given title.
 * @param {string} title - The title of the test case.
 * @returns {string} The extracted test case ID or 'Not Specified' if no ID is found.
 */
function extractTestCaseIds(title) {
  const idPattern = /TC-\d+/g; // Pattern to find test case ID like "TC-XXX"
  const matches = title.match(idPattern);
  return matches ? matches : [];
}

/**
 * Gets the current date formatted as dd/MM/yyyy.
 * @returns {string} Formatted date string.
 */
function getFormattedCurrentDate() {
  const currentDate = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return dateFormatter.format(currentDate); // Returns date in dd/MM/yyyy format
}

function log(message) {
  console.log(message);
}

/**
 * function used to set metadata like policyName, frameworkName, controlName etc.
 * @param {*} metaData
 */
function setMetadata(metaData = {}) {
  // Read the existing JSON data from the file
  const jsonData = JSON.parse(fs.readFileSync("metadata.json", "utf8"));

  console.log("Pushing the following metadata:", JSON.stringify(metaData));

  // Add the new metadata to the data array
  jsonData.data.push({
    policyName: metaData.policyName,
  });

  // Write the updated JSON data back to the file
  fs.writeFileSync("metadata.json", JSON.stringify(jsonData), "utf8");
}

/**
 * To get the current timestamp in yyyyMMddHHmmss format
 */
function getFormattedCurrentDateAndTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");
  const second = String(now.getSeconds()).padStart(2, "0");
  const timestamp = year + month + day + hour + minute + second;
  const randomNumber = generateRandomNumber();
  return `${timestamp}${randomNumber}`;
}

/**
   *
   * To generate Random Numbers
   */
function generateRandomNumber() {
  const randomNum = Math.random() * 9000;
  return Math.floor(1000 + randomNum);
}

module.exports = {
  extractTestCaseIds,
  getFormattedCurrentDate,
  log,
  setMetadata,
  getFormattedCurrentDateAndTime,
  generateRandomNumber
};
