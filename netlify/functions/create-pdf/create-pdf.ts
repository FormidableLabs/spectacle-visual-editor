import { Handler } from '@netlify/functions';

import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { URL } from 'url';

const handler: Handler = async (event) => {
  if (!event.body || (event.body && typeof event.body !== 'string')) {
    return {
      statusCode: 400,
      body: 'This method requires a json payload.'
    };
  }

  const urlParts = new URL(event.rawUrl);
  const exportUrl =
    urlParts.origin + '/.netlify/functions/one-page/?exportMode=true';

  let pdfBody;
  try {
    pdfBody = await generatePDFBase64(exportUrl, event.body);
  } catch (err) {
    return {
      statusCode: 500,
      body: `Error creating PDF:\n${err}`
    };
  }

  return {
    statusCode: 200,
    headers: { 'content-type': 'application/pdf' },
    body: pdfBody,
    isBase64Encoded: true
  };
};

const generatePDFBase64 = async (
  url: string,
  eventBody: string
): Promise<string> => {
  // To run this in dev, set CHROME_EXECUTABLE_PATH to point to your Chrome executable
  const browser = await puppeteer.launch({
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    headless: true
  });

  // Intercept only the first request, change it to a POST and add our JSON payload
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.once('request', async (interceptedRequest) => {
    const newRequest = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      postData: eventBody
    };
    interceptedRequest.continue(newRequest);
    await page.setRequestInterception(false);
  });
  await page.goto(url, { waitUntil: 'load' });

  const pdf = await page.pdf({
    printBackground: true,
    preferCSSPageSize: true
  });
  const pdfString = pdf.toString('base64');
  await browser.close();

  return pdfString;
};

export { handler };
