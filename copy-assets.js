const fs = require("fs-extra");
const path = require("path");

const distDir = "dist"; // output directory

async function copyAssets() {
  try {
    // Define source and destination paths for various asset groups
    const copyOperations = [
      {
        source: "./*.{html,css,json,js}", // Adjust if you need to copy package.json, etc. explicitly
        destination: distDir,
        // fs-extra.copy doesn't directly support glob patterns for source,
        // so we'll list them explicitly or use a glob library
      },
      { source: "./fonts", destination: path.join(distDir, "fonts") },
      { source: "./images", destination: path.join(distDir, "images") },
      { source: "./libraries", destination: path.join(distDir, "libraries") },
      { source: "./scripts", destination: path.join(distDir, "scripts") },
    ];

    console.log("Starting asset copying...");

    // Handle root files first (index.html, style.css, fonts.css, etc.)
    // For globbing in Node, you'd typically use 'glob' or 'fast-glob'
    // Since you only have a few root files, explicit copies might be simpler
    await fs.copy("index.html", path.join(distDir, "index.html"), {
      overwrite: true,
    });
    await fs.copy("style.css", path.join(distDir, "style.css"), {
      overwrite: true,
    });
    await fs.copy("fonts.css", path.join(distDir, "fonts.css"), {
      overwrite: true,
    });
    await fs.copy("manifest.json", path.join(distDir, "manifest.json"), {
      overwrite: true,
    });
    await fs.copy("sw.js", path.join(distDir, "sw.js"), { overwrite: true });

    // Now copy directories
    await fs.copy("./fonts", path.join(distDir, "fonts"), { overwrite: true });
    await fs.copy("./images", path.join(distDir, "images"), {
      overwrite: true,
    });
    await fs.copy("./libraries", path.join(distDir, "libraries"), {
      overwrite: true,
    });
    await fs.copy("./scripts", path.join(distDir, "scripts"), {
      overwrite: true,
    });

    console.log("Asset copying complete!");
  } catch (err) {
    console.error("Error copying assets:", err);
    process.exit(1); // Exit with an error code if copying fails
  }
}

copyAssets();
