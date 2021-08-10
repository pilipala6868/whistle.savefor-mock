const getSettings = require('./getSettings');
const { readStat } = require('../../utils');

module.exports = async (ctx) => {
  let { defaultDir, autoOpenFile, autoCopy, autoCopyProtocal } = ctx.request.body;
  if (typeof defaultDir !== 'string') {
    defaultDir = '';
  }
  if (defaultDir) {
    const result = await readStat(defaultDir);
    if (result) {
      ctx.body = result;
      return;
    }
  }
  const { localStorage } = ctx.req;
  localStorage.setProperty('defaultDir', defaultDir);
  localStorage.setProperty('autoOpenFile', autoOpenFile);
  localStorage.setProperty('autoCopy', autoCopy);
  localStorage.setProperty('autoCopyProtocal', autoCopyProtocal);
  getSettings(ctx);
};