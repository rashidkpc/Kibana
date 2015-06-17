define(function (require, module, exports) {

  require('plugins/goto/controllers/goto');
  require('css!plugins/goto/styles/main.css');

  var apps = require('registry/apps');
  apps.register(function GotoAppModule() {
    return {
      id: 'goto',
      name: 'Slides',
      order: 9999999
    };
  });
});
