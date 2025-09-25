const imaps = require('imap-simple');
const { simpleParser } = require('mailparser');
const cypress = require('cypress'); // Import Cypress
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

module.exports = {
  e2e: {
    baseUrl: process.env.LOGIN_URL, // Use imported Cypress
    viewportWidth: 1366,
    viewportHeight: 768,
    // For Consecutive Failed Tests
    // retries: 2,
    // numTestsKeptInMemory: 1,
    defaultCommandTimeout: 30000,
    pageLoadTimeout: 60000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    reporter: "cypress-multi-reporters",
    reporterOptions: {
      reporterEnabled: "mochawesome",
      mochawesomeReporterOptions: {
        reportDir: "cypress/reports/mochawesome",
        overwrite: false,
        html: false,
        json: true
      }
    },
    setupNodeEvents(on, config) {
      on('task', {
        async getGmailOTP({ retries = 8, delayMs = 5000 } = {}) {
          async function fetchOTP(attempt = 1) {
            const configIMAP = {
              imap: {
                user: config.env.gmail_user,
                password: process.env.GMAIL_PASS,
                host: 'imap.gmail.com',
                port: 993,
                authTimeout: 100000,
                tls: true,
                // tlsOptions: {
                //   rejectUnauthorized: false   // ✅ accept self-signed / unverified certs
                // }
                
              }
            };

            const connection = await imaps.connect(configIMAP);
            await connection.openBox('INBOX');

            const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();

            const searchCriteria = [
              'UNSEEN',
              ['SINCE', since],
              ['HEADER', 'SUBJECT', 'User Verification'] // Only OTP emails
            ];

            const fetchOptions = {
              bodies: ['HEADER', 'TEXT'],
              markSeen: true
            };

            const results = await connection.search(searchCriteria, fetchOptions);

            if (results.length) {
              // Sort emails by most recent date
              results.sort((a, b) => new Date(b.attributes.date) - new Date(a.attributes.date));

              const latest = results[0];
              const all = latest.parts.find(part => part.which === 'TEXT');
              const parsed = await simpleParser(all.body);

              // Regex for OTP inside parentheses
              const match = parsed.text.match(/\(\s*(\d{4,6})\s*\)/);
              if (match) {
                return match[1]; // Found OTP
              }
            }

            // No OTP found yet, retry if attempts left
            if (attempt < retries) {
              console.log(`Attempt ${attempt} failed. Retrying in ${delayMs / 1000}s...`);
              await new Promise(r => setTimeout(r, delayMs));
              return fetchOTP(attempt + 1);
            }

            throw new Error('OTP email not found after max retries');
          }

          return fetchOTP();
        }
      });
    }
  }
};
