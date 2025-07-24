import { execSync } from "child_process";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables from .env file
dotenv.config();

const fetchSchema = async () => {
  try {
    const token = process.env.POSTPONE_TOKEN;

    if (!token) {
      throw new Error("POSTPONE_TOKEN not found in .env file");
    }

    const outputPath = path.join(__dirname, "../src/graphql/postpone/schema.graphql");

    // Ensure directory exists
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    // Fetch schema using get-graphql-schema
    const schema = execSync(
      `npx get-graphql-schema https://api.postpone.app/gql -h "Authorization=Bearer ${token}"`,
      { encoding: "utf-8" }
    );

    // Write schema to file
    fs.writeFileSync(outputPath, schema);

    console.log("Successfully fetched and saved GraphQL schema");
  } catch (error) {
    console.error("Error fetching schema:", error);
    process.exit(1);
  }
};

fetchSchema();
