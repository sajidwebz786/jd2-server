require("dotenv").config();

const fs = require("fs");
const path = require("path");
const slugify = require("slugify");
const { v2: cloudinary } = require("cloudinary");

const imageRoot = path.resolve(__dirname, "..", "..", "jd2-client", "public", "images");
const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".bmp", ".tif", ".tiff", ".svg"]);

if (!process.env.CLOUDINARY_URL) throw new Error("CLOUDINARY_URL is not configured");
cloudinary.config({ secure: true });

function findImages(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) return findImages(absolute);
    return supportedExtensions.has(path.extname(entry.name).toLowerCase()) ? [absolute] : [];
  });
}

async function main() {
  const requestedFiles = process.argv.slice(2);
  const files = requestedFiles.length
    ? requestedFiles.map((relative) => path.resolve(imageRoot, relative))
    : findImages(imageRoot);
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;
  for (const [index, file] of files.entries()) {
    const relative = path.relative(imageRoot, file);
    const relativeDirectory = path.dirname(relative) === "." ? "" : path.dirname(relative).split(path.sep).join("/");
    const folder = relativeDirectory ? `images/${relativeDirectory}` : "images";
    const publicId = slugify(path.basename(file, path.extname(file)), { lower: true, strict: true });
    try {
      await cloudinary.uploader.upload(file, { folder, public_id: publicId, resource_type: "image", overwrite: false, unique_filename: false });
      uploaded += 1;
      process.stdout.write(`[${index + 1}/${files.length}] uploaded ${folder}/${publicId}\n`);
    } catch (error) {
      const message = error?.message || error?.error?.message || JSON.stringify(error) || "Unknown Cloudinary error";
      if (error.http_code === 409 || /already exists/i.test(error.message)) {
        skipped += 1;
        process.stdout.write(`[${index + 1}/${files.length}] exists ${folder}/${publicId}\n`);
      } else {
        failed += 1;
        process.stderr.write(`[${index + 1}/${files.length}] failed ${relative}: ${message}\n`);
      }
    }
  }
  process.stdout.write(`Complete: ${uploaded} uploaded, ${skipped} already present, ${failed} failed.\n`);
  if (failed) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
