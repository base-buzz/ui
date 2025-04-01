#!/usr/bin/env node
/**
 * Wallet Authentication Test Script
 *
 * This script tests the wallet authentication flow by:
 * 1. Checking if a wallet exists
 * 2. Creating or signing in with a wallet
 * 3. Verifying the returned session token
 *
 * Run with: npx tsx test-wallet-auth.ts
 */

// Configuration
const BASE_URL = "http://localhost:3333"; // Change this if your app runs on a different port
const TEST_WALLET = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e"; // Replace with a test wallet address

async function testWalletAuth() {
  console.log("🧪 Starting wallet authentication test...");
  console.log(`📝 Using wallet address: ${TEST_WALLET}`);

  try {
    // Step 1: Check if the wallet exists
    console.log("\n1️⃣ Checking if wallet exists...");
    const userResponse = await fetch(
      `${BASE_URL}/api/users?wallet=${TEST_WALLET}`,
    );
    const userExists = userResponse.ok;

    console.log(`✅ Wallet check complete. User exists: ${userExists}`);
    console.log(`📊 Status: ${userResponse.status}`);

    if (userExists) {
      const userData = await userResponse.json();
      console.log(`👤 Found user: ${userData.display_name || userData.id}`);

      // Step 2a: Sign in with existing wallet
      console.log("\n2️⃣ Signing in with existing wallet...");
      const signinResponse = await fetch(`${BASE_URL}/api/auth/wallet/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: TEST_WALLET }),
      });

      if (signinResponse.ok) {
        const signinData = await signinResponse.json();
        console.log("✅ Signin successful");
        console.log("🔑 Session info:", {
          user_id: signinData.user?.id,
          has_access_token: !!signinData.session?.access_token,
          has_refresh_token: !!signinData.session?.refresh_token,
        });
      } else {
        console.log("❌ Signin failed");
        console.log("Error:", await signinResponse.json());
      }
    } else {
      // Step 2b: Create new account with wallet
      console.log("\n2️⃣ Creating new account with wallet...");
      const signupResponse = await fetch(`${BASE_URL}/api/auth/wallet/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: TEST_WALLET }),
      });

      if (signupResponse.ok) {
        const signupData = await signupResponse.json();
        console.log("✅ Signup successful");
        console.log("🔑 Session info:", {
          user_id: signupData.user?.id,
          has_access_token: !!signupData.session?.access_token,
          has_refresh_token: !!signupData.session?.refresh_token,
        });
      } else {
        console.log("❌ Signup failed");
        console.log("Error:", await signupResponse.json());
      }
    }

    // Step 3: Verify the complete flow works
    console.log(
      "\n3️⃣ Final check - Querying user profile with wallet address...",
    );
    const finalCheck = await fetch(
      `${BASE_URL}/api/users?wallet=${TEST_WALLET}`,
    );

    if (finalCheck.ok) {
      const profile = await finalCheck.json();
      console.log("✅ Successfully retrieved user profile");
      console.log("👤 Profile:", {
        id: profile.id,
        address: profile.address,
        display_name: profile.display_name,
        created_at: profile.created_at,
      });
    } else {
      console.log("❌ Failed to retrieve user profile");
      console.log("Error:", await finalCheck.json());
    }
  } catch (error) {
    console.error("❌ Test failed with error:", error);
  }

  console.log("\n🏁 Test completed");
}

// Run the test
testWalletAuth().catch(console.error);
