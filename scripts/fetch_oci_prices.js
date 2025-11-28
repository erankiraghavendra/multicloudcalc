// scripts/fetch_oci_prices.js
// Fetch OCI pricing and create prices.json

import fs from "fs";

// Oracle official public pricing API (reliable endpoint)
const OCI_PRODUCTS_API = "https://apexapps.oracle.com/pls/apex/cetools/api/v1/products/";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed: ${res.status} ${res.statusText}`);
  return res.json();
}

function extractCompute(products) {
  return products
    .filter(p => p.service_name === "Compute" && p.metric_name.includes("OCPU"))
    .map(p => ({
      region: p.region,
      shape: p.part_number,
      unit: p.metric_name,
      price: p.price
    }));
}

function extractBlockStorage(products) {
  return products
    .filter(p => p.service_name === "Block Volume" && p.metric_name.includes("GB"))
    .map(p => ({
      region: p.region,
      type: p.part_number,
      unit: p.metric_name,
      price: p.price
    }));
}

function extractNetwork(products) {
  return products
    .filter(p => p.service_name === "Network" && p.metric_name.includes("GB"))
    .map(p => ({
      region: p.region,
      type: p.part_number,
      unit: p.metric_name,
      price: p.price
    }));
}

(async () => {
  console.log("Fetching OCI pricing...");

  const data = await fetchJson(OCI_PRODUCTS_API);

  const products = data.items || [];

  const out = {
    generated_at: new Date().toISOString(),
    oci: {
      compute: extractCompute(products),
      block: extractBlockStorage(products),
      network: extractNetwork(products)
    }
  };

  fs.writeFileSync("prices.json", JSON.stringify(out, null, 2));
  console.log("Created prices.json with real OCI data.");
})();
