import { generateAllMockData } from "../utils/mockDataGenerator";

// Run the generator
(async () => {
  console.log("Generating mock data...");
  try {
    await generateAllMockData();
    console.log("Mock data generated successfully!");
  } catch (error) {
    console.error("Error generating mock data:", error);
    process.exit(1);
  }
})();
