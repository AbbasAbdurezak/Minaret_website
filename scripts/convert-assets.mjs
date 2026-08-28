import { readdir, stat, unlink, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const assetsDir = join(process.cwd(), "public", "assets");
const contentJsonPath = join(process.cwd(), "data", "content.json");
const siteTsPath = join(process.cwd(), "data", "site.ts");

async function main() {
  console.log("Inspecting assets in:", assetsDir);
  const files = await readdir(assetsDir);
  const conversions = [];

  for (const file of files) {
    if (!file.toLowerCase().endsWith(".png")) {
      continue;
    }

    const filePath = join(assetsDir, file);
    const fileStat = await stat(filePath);

    // If file size is larger than 1 MB (1,000,000 bytes)
    if (fileStat.size > 1000000) {
      const baseName = file.substring(0, file.length - 4);
      const webpFileName = `${baseName}.webp`;
      const webpFilePath = join(assetsDir, webpFileName);

      conversions.push({
        pngFile: file,
        pngPath: filePath,
        webpFile: webpFileName,
        webpPath: webpFilePath,
        sizeMb: (fileStat.size / (1024 * 1024)).toFixed(2)
      });
    }
  }

  if (conversions.length === 0) {
    console.log("No PNG assets larger than 1MB found.");
    return;
  }

  console.log(`Found ${conversions.length} PNG assets to optimize:`);
  for (const conv of conversions) {
    console.log(` - ${conv.pngFile} (${conv.sizeMb} MB)`);
  }

  // Transcode each PNG to WebP with Sharp
  for (const conv of conversions) {
    console.log(`Transcoding ${conv.pngFile} to WebP...`);
    await sharp(conv.pngPath)
      .webp({ quality: 82 })
      .toFile(conv.webpPath);
    console.log(`Generated ${conv.webpFile}`);
  }

  // Load and update reference files
  console.log("Updating file references...");
  let contentJson = await readFile(contentJsonPath, "utf8");
  let siteTs = await readFile(siteTsPath, "utf8");

  for (const conv of conversions) {
    const pngRef = `/assets/${conv.pngFile}`;
    const webpRef = `/assets/${conv.webpFile}`;

    // Standard replaceAll replaces all occurrences of the string
    contentJson = contentJson.replaceAll(pngRef, webpRef);
    siteTs = siteTs.replaceAll(pngRef, webpRef);
  }

  await writeFile(contentJsonPath, contentJson, "utf8");
  await writeFile(siteTsPath, siteTs, "utf8");
  console.log("Updated references in content.json and site.ts.");

  // Delete the heavy PNG originals
  console.log("Removing heavy PNG original files...");
  for (const conv of conversions) {
    await unlink(conv.pngPath);
    console.log(`Deleted ${conv.pngFile}`);
  }

  console.log("Asset conversion optimization successfully completed!");
}

main().catch(console.error);
