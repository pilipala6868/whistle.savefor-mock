module.exports = (ctx) => {
  const { localStorage } = ctx.req;
  ctx.body = {
    defaultDir: localStorage.getProperty('defaultDir'),
    autoOpenFile: localStorage.getProperty('autoOpenFile'),
    autoCopy: localStorage.getProperty('autoCopy'),
    autoCopyProtocal: localStorage.getProperty('autoCopyProtocal'),
  };
};
