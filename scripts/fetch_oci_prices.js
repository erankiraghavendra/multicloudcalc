// scripts/fetch_oci_prices.js
import fs from "fs";
import raw from "oci-pricing";

// OCI pricing API returns all products under raw.services
const prices = {
  timestamp: new Date().toISOString(),
  oci: {
    block: raw.services.blockstorage || {},
    compute: raw.services.compute || {},
    network: raw.services.networking || {}
  }
};

// Write JSON file
fs.writeFileSync("prices.json", JSON.stringify(prices, null, 2));
console.log("✔ OCI prices.json generated successfully!");
