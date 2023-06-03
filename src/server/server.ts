const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const httpServer = () => {
  const server = http.createServer((req: any, res: any) => {
    const pathName = path.join("/Users/xiawu/Downloads/video", req.url);

    fs.readFile(pathName, (err: any, data: any) => {
      if (err) {
        res.writeHead(404, {
          "Content-Type": "text/plain;charset=utf-8",
        });
        res.write("404 Not Found");
        res.end();
      } else {
        res.writeHead(200, {
          "Content-Type": Buffer.byteLength(data),
        });
        res.write(data);
        res.end("ok");
      }
    });
  });

  server.listen(7778, () => "server is running");
};

export { httpServer };
