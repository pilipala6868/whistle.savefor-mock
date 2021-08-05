const clipboardy = require("clipboardy");
const zlib = require("zlib");
const { writeJSON } = require("write-json-safe");
const { writeFile } = require("write-file-safe");
const { filterUrl, setDefault, handleFilePath } = require("./utils");

module.exports = (server, { storage }) => {
  // 默认storage值
  setDefault(storage, "autoCopy", 1);
  setDefault(storage, "autoCopyProtocal", "file");

  server.on("request", (req, res) => {
    const { url, originalReq } = req;
    const { ruleValue } = originalReq;

    const defaultDir = storage.getProperty("defaultDir");
    const autoCopy = storage.getProperty("autoCopy");
    const autoCopyProtocal = storage.getProperty("autoCopyProtocal");

    if (ruleValue.trim() !== "") {
      const fullPath = handleFilePath(ruleValue, defaultDir);
      const client = req.request((svrRes) => {
        const encoding = svrRes.headers["content-encoding"];
        let body;
        svrRes.on("data", (data) => {
          body = body ? Buffer.concat([body, data]) : data;
        });
        svrRes.on("end", () => {
          const originalBody = body
          if (body) {
            // 部分需先解压
            if (encoding === "gzip") {
              body = zlib.gunzipSync(body);
            } else if (encoding === "deflate") {
              body = zlib.inflateSync(body);
            }
            // 创建并写入文件
            let content = body.toString();
            try {
              writeJSON(fullPath, JSON.parse(content));
            } catch {
              writeFile(fullPath, content);
            }
            // 将新规则复制到剪切板
            if (Number(autoCopy)) {
              const handleUrl = filterUrl(url, ["t", "timestamp"]);
              clipboardy.write(
                `${
                  handleUrl[0] === "/" ? "**" : ""
                }${handleUrl} ${autoCopyProtocal}://${fullPath}`
              );
            }
            res.end(originalBody);
          } else {
            res.end();
          }
        });
      });
      req.pipe(client);
    } else {
      req.passThrough();
    }
  });

  // handle websocket request
  server.on("upgrade", (req, socket) => {
    // do something
    req.passThrough();
  });

  // handle tunnel request
  server.on("connect", (req, socket) => {
    // do something
    req.passThrough();
  });
};
