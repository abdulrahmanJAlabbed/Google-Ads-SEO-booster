const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const https = require('https');

// Use StealthPlugin to prevent detection
puppeteer.use(StealthPlugin());

// Function to launch the browser
async function launchBrowser() {
  
  const userAgents = [
    // Chrome on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

    // Firefox on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:87.0) Gecko/20100101 Firefox/87.0",

    // Safari on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.2 Safari/605.1.15",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.2 Safari/605.1.15",

    // Chrome on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",

    // Firefox on macOS
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6; rv:88.0) Gecko/20100101 Firefox/88.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6; rv:87.0) Gecko/20100101 Firefox/87.0",

    // Chrome on Android
    "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 9; SM-G960F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Mobile Safari/537.36",
    "Mozilla/5.0 (Linux; Android 8.1.0; SM-J530F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Mobile Safari/537.36",

    // Safari on iOS
    "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Mobile/15E148 Safari/604.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1",

    // Edge on Windows
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.864.48 Safari/537.36 Edg/91.0.864.48",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.818.62 Safari/537.36 Edg/90.0.818.62",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.774.63 Safari/537.36 Edg/89.0.774.63",
  ];

  const randomUserAgent =
    userAgents[Math.floor(Math.random() * userAgents.length)];

  const randomViewport = {
    width: Math.floor(Math.random() * (1400 - 1200 + 1)) + 1200,
    height: Math.floor(Math.random() * (900 - 700 + 1)) + 500,
  };

  const browser = await puppeteer.launch({
     executablePath: "/opt/google/chrome/google-chrome", // for linux
   // executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", // for windows
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--incognito", // Incognito mode
      "--disable-blink-features=AutomationControlled", // Disables automation detection
      "--window-size=900,1200",
      "--disable-web-security",
      "--disable-features=IsolateOrigins,site-per-process",
      "--ignore-certificate-errors",
      "--disable-popup-blocking",
      "--disable-notifications",
      "--disable-offer-store-unmasked-wallet-cards",
      "--disable-offer-upload-credit-cards",
      "--disable-infobars",
      "--disable-session-crashed-bubble",
      "--disable-translate",
      "--disable-save-password-bubble",
      "--disable-features=TranslateUI",
      "--disable-features=ImprovedCookieControls",
      "--disable-features=IdleDetection",
      "--disable-features=AudioServiceOutOfProcess",
      '--ignore-certificate-errors',
      
    ],
  });


  const page = (await browser.pages())[0];
  const client = await page.target().createCDPSession();
  await client.send("Network.clearBrowserCookies");
  await client.send("Network.clearBrowserCache");

  await page.setUserAgent(randomUserAgent);
  await page.setViewport(randomViewport);
  await page.setRequestInterception(true);
  await page.setDefaultNavigationTimeout(90000);

  page.on("request", (req) => {
    if (["image", "stylesheet", "font"].includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  return { browser, page };
}

// Function to introduce a delay
async function Delay(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// Function to get user input
async function getUserInput(prompt) {
  const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
  });

  return new Promise((resolve) => {
      rl.question(prompt, (answer) => {
          rl.close();
          resolve(answer);
      });
  });
}

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

async function launchBrowserAndPage() {
  // Launch the browser and return the browser and page objects
  const launchResult = await launchBrowser();
  const browser = launchResult.browser;
  const page = launchResult.page;


  return { browser, page };
}

// Improved function to extract the URL from the saved link string
function extractLink(savedLinkString) {
  const linkMatch = savedLinkString.match(/Link:\s*(https?:\/\/[^\s,]+)/);
  return linkMatch ? linkMatch[1].trim() : null;  // Ensures no extra spaces
}

async function saveNavigatedLinks(link, keyword, timesNavigated) {
  const filePath = path.join(__dirname, `./saved_links/navigated_links.txt`);

  const dataToSave = `Link: ${link}, Keyword: ${keyword}, Times Navigated: ${timesNavigated}\n`;
  fs.appendFileSync(filePath, dataToSave, 'utf-8');
  console.log(`Navigated link saved: ${dataToSave}`);
}

async function navigateMultipleTimes(page, link, keyword, times) {
  for (let j = 0; j < times; j++) {
    console.log(`Opening the link ${j + 1} of ${times}...`);
    await page.goto(link);
    await autoScroll(page);
    await Delay(7000); // Delay for interaction or observation
  }
  // Save the link in 'saved_links' after successful navigation
  await saveNavigatedLinks(link, keyword, times);
}

async function Start() {
  let browser;
  let page;

  try {
    // Ask the user how to start the process
    const startOption = await getUserInput(
      "Do you want to (1) scrape from queries.txt, (2) enter a query manually, or (3) start navigating instantly? (1/2/3): "
    );

    if (startOption === '3') {
      // Start navigating instantly
      const useSavedLinks = await getUserInput("Do you want to use saved links (s) or enter a custom URL (c)? ");
      
      let link;
      let keyword = 'custom';
      if (useSavedLinks.toLowerCase() === 's') {
        const filePath = path.join(__dirname, `./saved_links/navigated_links.txt`);
        if (!fs.existsSync(filePath)) {
          console.log("No saved links found.");
          return;
        }
        const savedLinks = fs.readFileSync(filePath, 'utf-8')
          .split('\n')
          .filter(Boolean)
          .map((line, index) => `${index + 1} - ${line}`);
        
        console.log("Saved links:");
        console.log(savedLinks.join('\n'));
      
        const chosenLink = await getUserInput(`Pick a link (1-${savedLinks.length}): `);
        const chosenIndex = parseInt(chosenLink, 10) - 1;
      
        if (chosenIndex >= 0 && chosenIndex < savedLinks.length) {
          const savedLinkString = savedLinks[chosenIndex];
          link = extractLink(savedLinkString);  // Use the extraction function here
          if (link) {
            console.log(`Extracted link: ${link}`);
          } else {
            console.log("Failed to extract the link.");
          }
        } else {
          console.log("Invalid choice.");
        }
      } else if (useSavedLinks.toLowerCase() === 'c') {
        link = await getUserInput("Please enter the URL: ");
      } else {
        console.log("Invalid option. Exiting...");
        return;
      }

      const timesToOpen = await getUserInput("How many times do you want to open the link? ");
      ({ browser, page } = await launchBrowserAndPage());
      console.log(`page: ${page}` , `link: ${link}` , `keyword: ${keyword}` , `timesToOpen: ${timesToOpen}`);
      await navigateMultipleTimes(page, link, keyword, parseInt(timesToOpen, 10));
      return;
    }

    let searchKeywords = [];

    if (startOption === '1') {
      searchKeywords = fs.readFileSync('queries.txt', 'utf-8')
        .split('\n')
        .map(keyword => keyword.trim())
        .filter(keyword => keyword.length > 0);

      if (searchKeywords.length === 0) {
        console.log("Please place search keywords one per line in queries.txt");
        return;
      }
    } else if (startOption === '2') {
      const userQuery = await getUserInput("Please enter your search query: ");
      if (!userQuery.trim()) {
        console.log("Invalid query input. Exiting...");
        return;
      }
      searchKeywords.push(userQuery);
    } else {
      console.log("Invalid input. Exiting...");
      return;
    }

    console.log("Using search keywords:");
    console.log(searchKeywords);

    ({ browser, page } = await launchBrowserAndPage());

    for (let i = 0; i < searchKeywords.length; i++) {
      let query = searchKeywords[i];
      console.log(`Scraping for keyword: ${query}`);

      let searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      let allLinks = [];
      let retryRequested = false;

      while (allLinks.length === 0 || retryRequested) {
        if (retryRequested) {
          await browser.close();
          ({ browser, page } = await launchBrowserAndPage());
        }

        retryRequested = false;
        await page.goto(searchUrl);
        await Delay(5000);

        const adsLinks = await page.$$eval('.v5yQqb a', links => links.map(link => link.href));
        const additionalLinks = await page.$$eval('.bC8sde > div > div a', links => links.map(link => link.href));

        allLinks = [...adsLinks, ...additionalLinks];

        if (allLinks.length === 0) {
          console.log(`No links found for keyword "${query}".`);
          const retryOrExit = await getUserInput("Retry (r) or skip (s)? ");
          if (retryOrExit.toLowerCase() === 'r') {
            retryRequested = true;
            continue;
          } else {
            break;
          }
        }
      }

      if (allLinks.length > 0) {
        console.log(`Links found for keyword "${query}":`);
        allLinks.forEach((link, index) => {
          console.log(`${index + 1} - ${link}`);
        });

        const userChoice = await getUserInput(`Pick a link (1-${allLinks.length}) or type 'r' for random: `);
        let selectedLink;
        if (userChoice.toLowerCase() === 'r') {
          selectedLink = allLinks[Math.floor(Math.random() * allLinks.length)];
        } else {
          const chosenIndex = parseInt(userChoice, 10) - 1;
          selectedLink = allLinks[chosenIndex] || null;
        }

        if (selectedLink) {
          const timesToOpen = await getUserInput("How many times do you want to open the link? ");
          await navigateMultipleTimes(page, selectedLink, query, parseInt(timesToOpen, 10));
        }
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    if (browser) {
      await browser.close();
    }
    setTimeout(Start, 5000);
  }
}


Start();
