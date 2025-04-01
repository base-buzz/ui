#!/usr/bin/env node
/**
 * Authentication Flow Debugging Script
 *
 * This script performs a detailed step-by-step test of the entire authentication flow
 * to identify where issues might be occurring. It tests each endpoint individually
 * and preserves cookies between requests to simulate a browser session.
 */

const fetch = require("node-fetch");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// Configuration
const BASE_URL = "http://localhost:3333";
const TEST_WALLET = "0x720F67E23D4AAE122f33cC11352063166A65377A";
const TEST_WALLET_LOWER = TEST_WALLET.toLowerCase();

// Colors for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Store cookies between requests
let cookies = [];

// Helper function to print section headers
function printHeader(text) {
  console.log(
    `\n${colors.bright}${colors.cyan}======== ${text} ========${colors.reset}\n`,
  );
}

// Helper function to print test results
function printResult(success, message, details = null) {
  if (success) {
    console.log(`${colors.green}✓ ${message}${colors.reset}`);
  } else {
    console.log(`${colors.red}✗ ${message}${colors.reset}`);
  }

  if (details) {
    if (typeof details === "string") {
      console.log(`  ${colors.dim}${details}${colors.reset}`);
    } else {
      console.log(
        `  ${colors.dim}${JSON.stringify(details, null, 2)}${colors.reset}`,
      );
    }
  }
}

// Helper function to extract and store cookies from response headers
function extractCookies(headers) {
  const setCookieHeader = headers.get("set-cookie");
  if (setCookieHeader) {
    // Parse Set-Cookie header(s)
    const newCookies = setCookieHeader.split(",").map((cookie) => {
      const [main] = cookie.split(";");
      return main.trim();
    });

    // Store cookies for subsequent requests
    cookies = [...cookies, ...newCookies];

    printResult(true, `Received cookies: ${newCookies.length}`);
    newCookies.forEach((cookie) => {
      console.log(`  ${colors.dim}${cookie}${colors.reset}`);
    });
  } else {
    printResult(false, "No cookies received from server");
  }
}

// Helper function to make authenticated requests
async function makeRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  // Include stored cookies in the request
  const cookieHeader = cookies.join("; ");

  const requestOptions = {
    ...options,
    headers: {
      ...options.headers,
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      "X-Custom-Auth": "true",
    },
  };

  console.log(
    `${colors.blue}→ ${options.method || "GET"} ${url}${colors.reset}`,
  );
  if (cookieHeader) {
    console.log(`  ${colors.dim}Cookie: ${cookieHeader}${colors.reset}`);
  }

  const response = await fetch(url, requestOptions);

  console.log(
    `${colors.magenta}← ${response.status} ${response.statusText}${colors.reset}`,
  );

  // Extract any new cookies
  extractCookies(response.headers);

  try {
    const data = await response.json();
    return { response, data };
  } catch (error) {
    const text = await response.text();
    return { response, data: text };
  }
}

// Step 1: Check if the database is online
async function testDatabase() {
  printHeader("DATABASE CONNECTION TEST");

  try {
    const { stdout } = await execPromise(`curl -s ${BASE_URL}/api/health`);
    const data = JSON.parse(stdout);

    if (data.database === "connected") {
      printResult(true, "Database is connected");
    } else {
      printResult(false, "Database connection issue", data);
    }

    return data.database === "connected";
  } catch (error) {
    printResult(false, "Error checking database status", error.message);
    return false;
  }
}

// Step 2: Test the session endpoint with no authentication
async function testSessionUnauthenticated() {
  printHeader("SESSION CHECK (UNAUTHENTICATED)");

  const { response, data } = await makeRequest("/api/auth/session");

  const success = response.status === 200;
  printResult(success, "Session endpoint response", data);

  return { success, data };
}

// Step 3: Test the wallet connect endpoint
async function testWalletConnect() {
  printHeader("WALLET CONNECT TEST");

  const { response, data } = await makeRequest("/api/auth/wallet/connect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ address: TEST_WALLET }),
  });

  const success = response.status === 200 && data.user && data.user.id;
  printResult(success, "Wallet connection successful", data);

  if (data.custom_session) {
    printResult(
      true,
      "Custom session created",
      `User ID: ${data.custom_session.user_id}`,
    );
  } else {
    printResult(false, "No custom session data returned");
  }

  return { success, data };
}

// Step 4: Test the session endpoint with authentication
async function testSessionAuthenticated() {
  printHeader("SESSION CHECK (AUTHENTICATED)");

  const { response, data } = await makeRequest("/api/auth/session");

  const success = response.status === 200 && data.authenticated === true;
  printResult(success, "Session authentication status", data);

  return { success, data };
}

// Step 5: Test the user profile endpoint
async function testUserProfile() {
  printHeader("USER PROFILE TEST");

  const { response, data } = await makeRequest("/api/auth/user");

  const success = response.status === 200 && data.id;
  printResult(success, "User profile retrieval", data);

  if (success) {
    printResult(
      data.wallet_address?.toLowerCase() === TEST_WALLET_LOWER,
      "Wallet address matches test wallet",
      `${data.wallet_address} vs ${TEST_WALLET}`,
    );
  }

  return { success, data };
}

// Step 6: Test the posts endpoint
async function testPosts() {
  printHeader("POSTS RETRIEVAL TEST");

  const { response, data } = await makeRequest("/api/posts");

  const success = response.status === 200 && Array.isArray(data);
  printResult(
    success,
    "Posts retrieval",
    Array.isArray(data) ? `Received ${data.length} posts` : data,
  );

  return { success, data };
}

// Step 7: Analyze cookie content
function analyzeCookies() {
  printHeader("COOKIE ANALYSIS");

  const walletSessionCookie = cookies.find((c) =>
    c.startsWith("basebuzz_wallet_session="),
  );

  if (walletSessionCookie) {
    const [, value] = walletSessionCookie.split("=");
    try {
      // URL decode the cookie value
      const decodedValue = decodeURIComponent(value);
      const sessionData = JSON.parse(decodedValue);

      printResult(true, "Wallet session cookie found and parsed", sessionData);

      // Check for required fields
      const requiredFields = [
        "user_id",
        "wallet_address",
        "auth_type",
        "timestamp",
      ];
      const missingFields = requiredFields.filter(
        (field) => !sessionData[field],
      );

      if (missingFields.length > 0) {
        printResult(
          false,
          "Missing required fields in session cookie",
          missingFields,
        );
      } else {
        printResult(true, "All required fields present in session cookie");

        // Check wallet address format
        if (sessionData.wallet_address.toLowerCase() !== TEST_WALLET_LOWER) {
          printResult(
            false,
            "Wallet address format mismatch",
            `${sessionData.wallet_address} vs ${TEST_WALLET}`,
          );
        } else {
          printResult(true, "Wallet address format is correct");
        }
      }
    } catch (error) {
      printResult(false, "Error parsing session cookie", error.message);
    }
  } else {
    printResult(false, "No wallet session cookie found");
  }
}

// Step 8: Check for CORS issues
async function testCORS() {
  printHeader("CORS TEST");

  try {
    const { stdout } = await execPromise(
      `curl -s -I -X OPTIONS -H "Origin: http://localhost:3000" ${BASE_URL}/api/auth/session`,
    );

    const corsHeaders = [
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
    ];

    const foundHeaders = corsHeaders.filter((header) =>
      stdout.includes(header),
    );

    if (foundHeaders.length === corsHeaders.length) {
      printResult(true, "All CORS headers are properly set");
    } else {
      const missing = corsHeaders.filter(
        (header) => !foundHeaders.includes(header),
      );
      printResult(false, "Missing CORS headers", missing);
    }

    if (stdout.includes("Access-Control-Allow-Credentials: true")) {
      printResult(true, "Credentials are allowed in CORS");
    } else {
      printResult(false, "Credentials not allowed in CORS");
    }

    return foundHeaders.length === corsHeaders.length;
  } catch (error) {
    printResult(false, "Error checking CORS headers", error.message);
    return false;
  }
}

// Step 9: Test the full authentication flow
async function testFullAuthFlow() {
  printHeader("FULL AUTHENTICATION FLOW");

  // Clear cookies to start fresh
  cookies = [];

  // 1. Connect wallet
  const connect = await testWalletConnect();
  if (!connect.success) {
    printResult(false, "Failed at wallet connect step");
    return false;
  }

  // 2. Check session authentication
  const session = await testSessionAuthenticated();
  if (!session.success) {
    printResult(false, "Failed at session check step");
    return false;
  }

  // 3. Get user profile
  const profile = await testUserProfile();
  if (!profile.success) {
    printResult(false, "Failed at user profile step");
    return false;
  }

  // 4. Get posts
  const posts = await testPosts();
  if (!posts.success) {
    printResult(false, "Failed at posts retrieval step");
    return false;
  }

  printResult(true, "Full authentication flow completed successfully");
  return true;
}

// Run all tests
async function runTests() {
  console.log(
    `${colors.bright}${colors.yellow}AUTHENTICATION FLOW DEBUGGING${colors.reset}`,
  );
  console.log(`${colors.dim}Testing wallet: ${TEST_WALLET}${colors.reset}\n`);

  // Test database connection first
  const dbConnected = await testDatabase();
  if (!dbConnected) {
    console.log(
      `${colors.red}Database connection issues detected. Aborting tests.${colors.reset}`,
    );
    return;
  }

  // Execute each test in sequence
  await testSessionUnauthenticated();
  await testWalletConnect();
  await testSessionAuthenticated();
  await testUserProfile();
  await testPosts();
  analyzeCookies();
  await testCORS();

  // Full flow test
  printHeader("SUMMARY");
  const fullFlowSuccess = await testFullAuthFlow();

  if (fullFlowSuccess) {
    console.log(
      `\n${colors.green}${colors.bright}All tests passed successfully!${colors.reset}`,
    );
  } else {
    console.log(
      `\n${colors.red}${colors.bright}Authentication flow tests failed.${colors.reset}`,
    );

    // Provide recommendations based on cookie analysis
    if (cookies.length === 0) {
      console.log(`\n${colors.yellow}Possible issues:${colors.reset}`);
      console.log(`1. No cookies are being set by the server`);
      console.log(
        `2. SameSite/Secure cookie settings might be too restrictive for your development environment`,
      );
      console.log(
        `3. The wallet connect endpoint might not be setting cookies correctly`,
      );
    } else if (!cookies.some((c) => c.startsWith("basebuzz_wallet_session="))) {
      console.log(`\n${colors.yellow}Possible issues:${colors.reset}`);
      console.log(`1. Wallet session cookie is not being set correctly`);
      console.log(
        `2. The wallet connect endpoint might not be creating a session properly`,
      );
      console.log(
        `3. Check that your wallet address format matches what's expected in the database`,
      );
    }
  }
}

// Run all tests and catch any unhandled errors
runTests().catch((error) => {
  console.error(
    `${colors.red}Unhandled error during tests:${colors.reset}`,
    error,
  );
});
