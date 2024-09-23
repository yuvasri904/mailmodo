const { request } = require('@playwright/test');
const { use } = require('../playwright.config');
const { extractTestCaseIds, getFormattedCurrentDate } = require('./utils'); // Import utility functions

/**
 * @author Shashank Gumte
 * This class is useful for below operations
 * 1. Create new test run at the begining of execution by including test case ids of each test cases in the run.
 * 2. Updating the newly created test run at the end of test suite exexcution by marking the test case status based on automation execution.
 */
class CustomEventListeners {

  constructor() {
    this.testResults = {
      results: [],
    }; // Initialize an empty array to store test results for each test case
  }

  testRunId;
  projectId = process.env.PROJECT_ID || 'PR-2';
  apiContext;
  testPlanId = process.env.TEST_PLAN_ID || 'TP-1';
  assignee = process.env.ASSIGNEE_EMAIL_ID || 'shashank@scrut.io'

  /**
  * This function executes at the begining of test suite execution.
  * @param {*} config 
  * @param {*} suite 
  */
  async onBegin(config, suite) {
    if (use.updateTestResultsInBrowserstackTestManagement === true) {
      // create new test run under PR-2 project id
      const testCaseIds = suite.allTests().flatMap(test => extractTestCaseIds(test.title));
      console.log("Test case ids:", testCaseIds);
      const formattedDate = getFormattedCurrentDate();
      const testRunName = `Automation Test Run - ${formattedDate}`; // Append the formatted date to the name
      const createTestRunEndpoint = `/api/v2/projects/${this.projectId}/test-runs`

      this.apiContext = await request.newContext({
        baseURL: 'https://test-management.browserstack.com',
        extraHTTPHeaders: {
          // Basic authentication with Base64 encoding
          'Authorization': 'Basic ' + Buffer.from(use.browserstackAuthentication).toString('base64'),
          'Content-Type': 'application/json', // Ensure correct content type
        },
      });
      const requestBody = {
        test_run: {
          name: testRunName,
          description: "Test run created using automation run on " + formattedDate,
          assignee: this.assignee,
          test_plan_id: this.testPlanId,
          test_cases: testCaseIds,
          include_all: false
        }
      };

      const response = await this.apiContext.post(createTestRunEndpoint, {
        data: requestBody
      });

      if (response.ok()) {
        console.log("Test run created successfully");
        const responseBody = await response.json(); // Parse response to JSON
        this.testRunId = responseBody.test_run.identifier;
        console.log(`testRunId is ${this.testRunId}`);
      } else {
        console.error(`Failed to create test run. Status: ${response.status()}`);
      }
      console.log(`Starting test run with ${suite.allTests().length} tests.`);
    }
    else {
      console.log('Test run creation not required');
    }
  }

  /**
   * This function executes at the starting of each test case execution.
   * @param {*} test 
   */
  onTestBegin(test) {
    console.log(`Test started: ${test.title}`);
  }

  /**
   * This function executes at the end of each test case execution.
   * @param {*} test 
   * @param {*} result 
   */
  onTestEnd(test, result) {
    console.log(`Test finished with status ${result.status}: ${test.title}`);
    if (use.updateTestResultsInBrowserstackTestManagement === true) {
      const testCaseIds = extractTestCaseIds(test.title);
      // Treat "timed out" as "failed"
      const status = result.status === 'timedOut' ? 'failed' : result.status;

      // create payload for updating multiple test results using
      // Extract the test case ID from the test title
      // Create a JSON object to represent this test result
      // Loop through each test case ID
      testCaseIds.forEach(testCaseId => {
        // Create a JSON object to represent this test result
        const testResult = {
          test_result: {
            status: status, // Use result.status to get the status of the test
          },
          test_case_id: testCaseId, // Add the test case ID
        };

        // Append the test result to the array
        this.testResults.results.push(testResult);
        //console.log(`Test result for ${testCaseId} appended to array.`);
      });
    } else {
      console.log('Test results object updation is not required');
    }
  }


  /**
   * This function executes at the end of test suite
   * @param {*} result 
   */
  async onEnd(result) {
    console.log(`Finished the test suite with status: ${result.status}`);
    let isUpdationRequiredInBrowserstack = false;
    if (use.updateTestResultsInBrowserstackTestManagement === true) {
      isUpdationRequiredInBrowserstack = true;
      // Add MultipleTestResults in a test run at the end of test suite
      const addMultipleTestResultsEndpoint = `/api/v2/projects/${this.projectId}/test-runs/${this.testRunId}/results`;
      const response = await this.apiContext.post(addMultipleTestResultsEndpoint, {
        data: this.testResults
      });
      if (response.ok()) {
        console.log("Added Multiple TestResults in Test run.");
      } else {
        console.error(`Failed to AddMultiple TestResults in Test run: ${response.status()}`);
      }
    }

    if (use.updateAutomationStatusInBrowserstackTestManagement === true) {
      isUpdationRequiredInBrowserstack = true;
      const testCaseIds = this.testResults.results.map(result => result.test_case_id);

      const requestBody = {
        test_case: {
          ids: testCaseIds,
          automation_status: "automated"
        }
      };

      // Bulk edit test cases with status as "Automated"
      const bulkEditTestCasesEndpoint = `/api/v2/projects/${this.projectId}/test-cases`;
      const response = await this.apiContext.patch(bulkEditTestCasesEndpoint, {
        data: requestBody
      });

      if (response.ok()) {
        console.log("Successfully updated automation status for test cases.");
      } else {
        console.error(`Failed to update automation status: ${response.status()}`);
      }
    }

    if (!isUpdationRequiredInBrowserstack) {
      console.log('test run or test case updation is not required in Browserstack test case management tool.');
    }
  }
}
module.exports = CustomEventListeners; 