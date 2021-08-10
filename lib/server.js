const clipboardy = require("clipboardy");
const zlib = require("zlib");
const spawn = require('child_process').spawn;
const { writeJSONSync } = require("write-json-safe");
const { writeFileSync } = require("write-file-safe");
const { filterUrl, setDefault, handleFilePath } = require("./utils");

module.exports = (server, { storage }) => {
  // 默认storage
  setDefault(storage, "autoOpenFile", 0);
  setDefault(storage, "autoCopy", 1);
  setDefault(storage, "autoCopyProtocal", "file");

  server.on("request", (req, res) => {
    const { url, originalReq } = req;
    const { ruleValue } = originalReq;

    const defaultDir = storage.getProperty("defaultDir");
    const autoOpenFile = storage.getProperty("autoOpenFile");
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
              writeJSONSync(fullPath, JSON.parse(content));
            } catch {
              writeFileSync(fullPath, content);
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
            // 尝试自动打开文件
            if (Number(autoOpenFile)) {
              try {
                spawn('code', [fullPath])
              } catch {}
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
