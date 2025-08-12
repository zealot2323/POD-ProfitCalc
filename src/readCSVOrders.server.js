import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Papa from "papaparse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function readCSVOrders() {
  const filePath = path.resolve(__dirname, "../data/EtsySoldOrderItems22-25.csv");
  const file = await fs.readFile(filePath, "utf8");
  return Papa.parse(file, {
    header: true,
    skipEmptyLines: true
  }).data;
}