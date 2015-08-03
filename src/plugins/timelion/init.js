module.exports = function (server) {
  //var config = server.config();
  server.route({
    method: 'POST',
    path: '/timelion/sheet',
    handler: require('./routes/sheet.js')
  });

};