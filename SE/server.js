const http = require("http");
const fs = require("fs");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT) || 5173;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function sendFile(filePath, res) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mimeTypes[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = req.url.split("?")[0];
  const cleanPath = urlPath === "/" ? "/index.html" : urlPath;
  const resolvedPath = path.normalize(path.join(root, cleanPath));

  if (!resolvedPath.startsWith(root)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  if (cleanPath.startsWith("/projects/") || cleanPath === "/invitations" || cleanPath === "/notifications") {
    sendFile(path.join(root, "index.html"), res);
    return;
  }

  sendFile(resolvedPath, res);
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
