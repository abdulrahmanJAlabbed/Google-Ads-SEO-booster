# Google Ads SEO Booster

This project automates the process of querying Google, identifying and selecting Google Ads links relevant to the query, and navigating through those links using rotating proxies. Built with Puppeteer and enhanced with stealth and CAPTCHA-handling plugins, this tool simulates natural browsing behavior to interact with Google Ads, making it suitable for environments that require detection avoidance.

## Features

- **Stealth Mode**: Uses `puppeteer-extra-plugin-stealth` to minimize detection risk and simulate real user interactions.
- **Automated Google Ads Interaction**: Conducts Google searches for user-provided queries, finds Google Ads links, and navigates through these links.
- **Rotating Proxies**: Integrates rotating proxies to ensure secure, continuous, and undetectable navigation across multiple links.
- **Customizable User Agents and Viewport**: Configurable settings for browser characteristics such as user agent and viewport for more realistic browsing sessions.
- **Link Storage and Revisit Options**: Stores previously visited links for reference or repeated use, allowing efficient link management.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/abdulrahmanJAlabbed/Google-Ads-SEO-booster.git
   cd Google-Ads-SEO-booster
## Install Dependencies
   ```bash
   npm install puppeteer-extra puppeteer-extra-plugin-stealth puppeteer-extra-plugin-recaptcha
