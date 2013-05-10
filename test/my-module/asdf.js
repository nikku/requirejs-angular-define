ngDefine('my.module.bar', [
  './service'
],
function(module, service) {
  service.loaded = true;
});