const fs = require("fs");
const path = require("path");

// 去掉 url 中的 xxx 参数
exports.filterUrl = (url, filters) => {
  if (url.indexOf("?") === -1) return url;
  const urlSplit = url.split("?");

  const params = urlSplit[1].split("&").map((q) => q.split("="));
  const finalParamStr = params
    .filter((q) => filters.indexOf(q[0]) === -1)
    .map((q) => q.join("="))
    .join("&");

  return `${urlSplit[0]}${finalParamStr ? "?" : ""}${finalParamStr || ""}`;
};

// 检测路径合法
exports.readStat = (dir) => {
  return new Promise((resolve) => {
    fs.stat(dir, (err, stat) => {
      if (err) {
        return resolve({
          errorMsg:
            err.code === "ENOENT"
              ? "该目录不存在，请手动创建"
              : "系统异常，请稍后再试",
        });
      }
      if (!stat.isDirectory()) {
        return resolve({
          errorMsg: "路径非目录",
        });
      }
      resolve();
    });
  });
};

// 文件路径处理
exports.handleFilePath = (origalPath, defaultDir, defaultSuffix = ".json") => {
  let fullPath = origalPath.trim();
  // 相对路径处理
  if (fullPath[0] !== "/" && defaultDir) {
    fullPath = path.join(defaultDir, fullPath);
  }
  // 路径为文件夹，直接用时间戳作为文件名
  if (fullPath.slice(-1) === "/") {
    fullPath = fullPath + new Date().valueOf();
  }
  // 默认文件类型后缀
  if (fullPath.split("/").slice(-1)[0].search(/\./) === -1) {
    fullPath = fullPath + defaultSuffix;
  }
  return fullPath;
};

// localStorage 设置默认值
exports.setDefault = (storage, property, val) => {
  if (!storage.getProperty(property)) {
    storage.setProperty(property, val);
  }
};
