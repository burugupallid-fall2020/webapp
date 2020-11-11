var SDC = require('statsd-client'),
sdc = new SDC({ port: 8125 });
module.exports = sdc;