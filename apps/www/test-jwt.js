// Test JWT functionality
import jwt from "jsonwebtoken";

// Create a test secret key
const JWT_SECRET = "test-secret-key";

// Create a test payload
const payload = {
  id: "user123",
  wallet: "0x123456789abcdef123456789abcdef123456789",
  auth_method: "wallet",
};

try {
  // Sign a JWT token
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  console.log("Token successfully created:", token);

  // Verify the token
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log("Token successfully verified!");
  console.log("Decoded token:", decoded);

  console.log("\nJWT package is working correctly!");
} catch (error) {
  console.error("Error testing JWT:", error);
}
