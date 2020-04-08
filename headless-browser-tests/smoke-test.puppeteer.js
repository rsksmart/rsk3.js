const assert = require('assert');

const puppeteer = require('puppeteer');

const url = `http://localhost:${process.env.HTTP_SERVER_PORT}${process.env.INDEX_PATH}`;

(async () => {
  const browser = await setUp();

  const results = {
    names: [],
    failures: [],
  };

  await runTest(testTitle, browser, results);
  await runTest(testClassSelector, browser, results);

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

async function testTitle(browser) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  // const title = await page.title();
  const fooH1Text = await page.$eval(
    '.foo > h1',
    (el) => (el.innerText),
  );
  assert.equal(fooH1Text, '.foo h1',
    'unexpected inner text for ".foo h1"');
}

async function testClassSelector(browser) {
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });
  const title = await page.title();
  assert.equal(title, 'title',
    'unexpected title');
}
