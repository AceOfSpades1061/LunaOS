const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;

// base paths
const websitePath = path.join(__dirname, "website");
const assetsPath = path.join(__dirname, "assets");

const server = http.createServer((req, res) => {
  let filePath;

  // serve assets folder
  if (req.url.startsWith("/assets/")) {
    filePath = path.join(__dirname, req.url);
  } else {
    // default to website folder
    filePath = path.join(websitePath, req.url === "/" ? "index.html" : req.url);
  }

  // prevent directory traversal
  if (!filePath.startsWith(websitePath) && !filePath.startsWith(assetsPath)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  // determine MIME type
  const ext = path.extname(filePath);
  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".ico": "image/x-icon",
    ".svg": "image/svg+xml"
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
