module.exports = (ctx) => {
  const { localStorage } = ctx.req;
  ctx.body = {
    defaultDir: localStorage.getProperty('defaultDir'),
    autoCopy: localStorage.getProperty('autoCopy'),
    autoCopyProtocal: localStorage.getProperty('autoCopyProtocal'),
  };
};
