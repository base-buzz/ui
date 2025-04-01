/**
 * Browser Cookie Testing Script
 *
 * This simple Express server helps diagnose cookie issues in the browser.
 * It sets up routes to test cookie setting and retrieval, helping identify
 * issues with SameSite, domain, and other cookie attributes.
 *
 * Usage:
 * 1. Start this server with: node browser-cookie-test.js
 * 2. Open browser to http://localhost:3334
 * 3. Follow the instructions on the page
 */

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3334;

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3333", // Allow your main app's origin
    credentials: true,
  }),
);

// Home page with instructions
app.get("/", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Cookie Test Tool</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        h1, h2 { color: #333; }
        button { padding: 8px 16px; background: #0070f3; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin: 10px 10px 10px 0; }
        button:hover { background: #0051a8; }
        pre { background: #f1f1f1; padding: 10px; border-radius: 4px; overflow-x: auto; }
        .success { color: #10b981; }
        .error { color: #ef4444; }
        #results { margin-top: 20px; border: 1px solid #ddd; padding: 16px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>Browser Cookie Testing Tool</h1>
      <p>This tool helps diagnose cookie handling issues between your browser and the server.</p>
      
      <h2>Test Set 1: Basic Cookie Setting</h2>
      <button onclick="testSetCookie('test_cookie', 'test_value')">Set Basic Cookie</button>
      <button onclick="testCheckCookie('test_cookie')">Check Basic Cookie</button>
      
      <h2>Test Set 2: Cookie Attributes</h2>
      <button onclick="testSetCookie('secure_cookie', 'secure_value', {secure: true})">Set Secure Cookie</button>
      <button onclick="testSetCookie('http_only_cookie', 'http_only_value', {httpOnly: true})">Set HttpOnly Cookie</button>
      <button onclick="testSetCookie('same_site_strict_cookie', 'strict_value', {sameSite: 'strict'})">Set SameSite=Strict Cookie</button>
      <button onclick="testSetCookie('same_site_lax_cookie', 'lax_value', {sameSite: 'lax'})">Set SameSite=Lax Cookie</button>
      <button onclick="testSetCookie('same_site_none_cookie', 'none_value', {sameSite: 'none', secure: true})">Set SameSite=None Cookie</button>
      
      <h2>Test Set 3: Cookie Format</h2>
      <button onclick="testSetCookie('json_cookie', JSON.stringify({id: '123', name: 'Test User'}))">Set JSON Cookie</button>
      <button onclick="testCheckCookie('json_cookie')">Check JSON Cookie</button>
      
      <h2>Test Set 4: BaseBuzz Specific</h2>
      <button onclick="testSetWalletSession()">Set BaseBuzz Wallet Session</button>
      <button onclick="testCheckCookie('basebuzz_wallet_session')">Check BaseBuzz Session</button>
      <button onclick="testSetCrossOriginCookie()">Test Cross-Origin Cookie</button>
      
      <h2>Test Set 5: Clear Cookies</h2>
      <button onclick="clearAllCookies()">Clear All Cookies</button>
      
      <div id="results">
        <h3>Results</h3>
        <pre id="output">Click a button to run a test...</pre>
      </div>
      
      <script>
        // Helper to update output
        function updateOutput(text, isError = false) {
          const output = document.getElementById('output');
          output.innerHTML = text;
          output.className = isError ? 'error' : 'success';
        }
        
        // Test setting a cookie
        async function testSetCookie(name, value, options = {}) {
          try {
            const response = await fetch('/set-cookie', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, value, options }),
              credentials: 'include'
            });
            
            const data = await response.json();
            updateOutput(JSON.stringify(data, null, 2));
          } catch (error) {
            updateOutput('Error: ' + error.message, true);
          }
        }
        
        // Test checking a cookie
        async function testCheckCookie(name) {
          try {
            const response = await fetch('/check-cookie?name=' + name, {
              credentials: 'include'
            });
            
            const data = await response.json();
            updateOutput(JSON.stringify(data, null, 2));
          } catch (error) {
            updateOutput('Error: ' + error.message, true);
          }
        }
        
        // Test setting a BaseBuzz wallet session cookie
        async function testSetWalletSession() {
          try {
            const response = await fetch('/set-basebuzz-session', {
              method: 'POST',
              credentials: 'include'
            });
            
            const data = await response.json();
            updateOutput(JSON.stringify(data, null, 2));
          } catch (error) {
            updateOutput('Error: ' + error.message, true);
          }
        }
        
        // Test Cross-Origin Cookie Setting (requires your actual app to be running)
        async function testSetCrossOriginCookie() {
          try {
            updateOutput('Making request to BaseBuzz app...');
            
            const response = await fetch('http://localhost:3333/api/auth/wallet/connect', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                address: '0x720F67E23D4AAE122f33cC11352063166A65377A' 
              }),
              credentials: 'include'
            });
            
            const data = await response.json();
            updateOutput('Response from BaseBuzz: ' + JSON.stringify(data, null, 2));
            
            // Now check if we got cookies
            const cookies = document.cookie;
            updateOutput('Current cookies: ' + (cookies ? cookies : 'No cookies found!'));
          } catch (error) {
            updateOutput('Error: ' + error.message, true);
          }
        }
        
        // Clear all cookies
        async function clearAllCookies() {
          try {
            const response = await fetch('/clear-cookies', {
              method: 'POST',
              credentials: 'include'
            });
            
            const data = await response.json();
            updateOutput(JSON.stringify(data, null, 2));
          } catch (error) {
            updateOutput('Error: ' + error.message, true);
          }
        }
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// Set a cookie with specified attributes
app.post("/set-cookie", (req, res) => {
  const { name, value, options } = req.body;

  res.cookie(name, value, options);

  res.json({
    success: true,
    message: `Cookie '${name}' set`,
    cookieValue: value,
    options,
  });
});

// Check for a cookie's existence and value
app.get("/check-cookie", (req, res) => {
  const { name } = req.query;
  const cookieValue = req.cookies[name];

  if (cookieValue) {
    res.json({
      success: true,
      message: `Cookie '${name}' found`,
      value: cookieValue,
    });
  } else {
    res.json({
      success: false,
      message: `Cookie '${name}' not found`,
    });
  }
});

// Set a BaseBuzz wallet session cookie (similar to your app)
app.post("/set-basebuzz-session", (req, res) => {
  const walletSession = {
    user_id: "94412f46-80ee-4943-b539-b5f30f9e9375",
    wallet_address: "0x720f67e23d4aae122f33cc11352063166a65377a",
    created_at: new Date().toISOString(),
    auth_type: "wallet",
    timestamp: Date.now(),
    debug_info: {
      creation_timestamp: Date.now(),
      user_agent: req.headers["user-agent"],
      test: true,
    },
  };

  // Test different cookie settings
  const sameSiteOptions = ["strict", "lax", "none"];
  const cookieExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // First clear any existing cookies
  res.clearCookie("basebuzz_wallet_session");

  // Then set with the selected SameSite value
  const sameSite = req.query.sameSite || "none";

  const options = {
    expires: cookieExpires,
    path: "/",
    sameSite: sameSite,

    // SameSite=None requires Secure
    secure: sameSite === "none" ? true : false,

    // httpOnly prevents JavaScript access
    httpOnly: req.query.httpOnly === "true",
  };

  res.cookie("basebuzz_wallet_session", JSON.stringify(walletSession), options);

  res.json({
    success: true,
    message: "BaseBuzz wallet session cookie set",
    options: options,
    session: walletSession,
  });
});

// Clear all cookies
app.post("/clear-cookies", (req, res) => {
  const cookies = req.cookies;
  const cookieNames = Object.keys(cookies);

  cookieNames.forEach((name) => {
    res.clearCookie(name);
  });

  res.json({
    success: true,
    message: "All cookies cleared",
    clearedCookies: cookieNames,
  });
});

// Cookie debugging info
app.get("/debug-cookies", (req, res) => {
  res.json({
    cookies: req.cookies,
    rawCookieHeader: req.headers.cookie,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Cookie test server running at http://localhost:${port}`);
});
