import { VIDEO_PATH } from "@src/utils/constant";
const http = require("http");
const fs = require("fs");
const path = require("path");

const httpServer = () => {
  const server = http.createServer((req: { url: string }, res: any) => {
    const pathName = path.join(VIDEO_PATH, req.url);

    fs.readFile(pathName, (err: Error, data: any) => {
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
