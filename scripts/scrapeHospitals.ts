/*
 * Simple hospital scraper for Vandalur, Tamil Nadu.
 *
 * This script fetches a public directory page (JustDial) and extracts
 * hospital names and addresses, then writes JSON to stdout or file. It is
 * intended for developer use only and may require adjustments if the site
 * changes or blocks scraping.
 *
 * Usage:
 *   npx ts-node scripts/scrapeHospitals.ts > hospitals.json
 */

import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

async function scrape() {
  const url = "https://www.justdial.com/Vandalur/Hospitals";
  console.log("Fetching", url);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; CarelytixBot/1.0)",
    },
  });
  const text = await res.text();
  const $ = cheerio.load(text);
  const results: any[] = [];

  $(".cntanr").each((i, el) => {
    if (i >= 20) return; // limit
    const name = $(el).find(".lng_cont_name").text().trim();
    const address = $(el).find(".cont_fl_addr").text().trim();
    const phone = $(el).find(".cont_fl_no").text().trim();
    if (name) {
      results.push({ name, address, phone });
    }
  });

  console.log(JSON.stringify(results, null, 2));
}

scrape().catch((err) => {
  console.error("Scrape failed", err);
  process.exit(1);
});
