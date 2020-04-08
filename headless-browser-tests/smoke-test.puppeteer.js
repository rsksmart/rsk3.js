const assert = require('assert');

const puppeteer = require('puppeteer');

const url = `http://localhost:${process.env.HTTP_SERVER_PORT}`;

(async () => {
  const browser = await setUp();

  const results = {
    names: [],
    failures: [],
  };

  await runTest(testHtmlTitle, browser, results);
  await runTest(testHtmlClassSelector, browser, results);
  await runTest(testJavascriptNoError, browser, results);
  await runTest(testJavascriptWithError, browser, results);
  await runTest(testCssClassSelector, browser, results);

  await tearDown(browser, results);
})();


async function setUp() {
  const browser = await puppeteer.launch();
  return browser;
}

async function tearDown(browser, results) {
  if (results.failures.length > 0) {
    results.failures.forEach((failure, index) => {
      console.log(`#${index}) ${failure.name}`);
      console.error(failure.error);
    });
    console.log(`${results.failures.length}/${results.names.length} tests failed`);
  } else {
    console.log(`All ${results.names.length} tests passed`);
  }
  await browser.close();
}

async function runTest(testFunction, browser, results) {
  const testName = testFunction.name;
  results.names.push(testName);
  try {
    await testFunction(browser);
  } catch (ex) {
    results.failures.push({
      name: testName,
      error: ex,
    });
  }
}

async function testHtmlClassSelector(browser) {
  const page = await browser.newPage();
  await page.goto(`${url}/index.html`, { waitUntil: 'networkidle0' });
  const fooH1Text = await page.$eval(
    '.foo > h1',
    (el) => (el.innerText),
  );
  assert.equal(fooH1Text, '.foo h1',
    'unexpected inner text for ".foo h1"');
}

async function testHtmlTitle(browser) {
  const page = await browser.newPage();
  await page.goto(`${url}/index.html`, { waitUntil: 'networkidle0' });
  const title = await page.title();
  assert.equal(title, 'title',
    'unexpected title');
}

async function testJavascriptNoError(browser) {
  const page = await browser.newPage();

  const consoleMessages = [];
  const pageErrors = [];
  page
    .on('console', (message) => {
      consoleMessages.push(message);
    });
  page
    .on('pageerror', (error) => {
      error.parsedMessage = error.message.split('\n')[0];
      pageErrors.push(error);
    });

  await page.goto(`${url}/javascript-no-error.html`, { waitUntil: 'networkidle0' });
  await page.waitFor(100);

  assert.equal(consoleMessages.length, 1,
    'unexpected output count');
  assert.equal(consoleMessages[0].type(), 'log',
    'unexpected output[0] type');
  assert.equal(consoleMessages[0].text(), 'foo',
    'unexpected output[0] text');

  // should not reach the console statement, error thrown when loading the script file
  assert.equal(pageErrors.length, 0,
    'unexpected page errors count');
}

async function testJavascriptWithError(browser) {
  const page = await browser.newPage();

  const consoleMessages = [];
  const pageErrors = [];
  page
    .on('console', (message) => {
      consoleMessages.push(message);
    });
  page
    .on('pageerror', (error) => {
      error.parsedMessage = error.message.split('\n')[0];
      pageErrors.push(error);
    });

  await page.goto(`${url}/javascript-with-error.html`, { waitUntil: 'networkidle0' });
  await page.waitFor(100);

  // should not reach the console statement, error thrown when loading the script file
  assert.equal(consoleMessages.length, 0,
    'unexpected output count');

  assert.equal(pageErrors.length, 1,
    'unexpected page errors count');
  assert.equal(
    pageErrors[0].parsedMessage,
    'ReferenceError: myFunctionWhichDoesNotExist is not defined',
    'unexpected page error[0] parsed message',
  );
}

async function testCssClassSelector(browser) {
  const page = await browser.newPage();
  await page.goto(`${url}/css.html`, { waitUntil: 'networkidle0' });

  const foobarBgColour = await page.evaluate(() => {
    const el = document.querySelector('.foo .bar');
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });
  const foobazBgColour = await page.evaluate(() => {
    const el = document.querySelector('.foo .baz');
    return window.getComputedStyle(el).getPropertyValue('background-color');
  });

  assert.equal(foobarBgColour, 'rgb(255, 0, 255)',
    'unexpected background colour for ".bar"');
  assert.equal(foobazBgColour, 'rgb(0, 255, 255)',
    'unexpected background colour for ".baz"');
}
