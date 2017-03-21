const alter = require('../lib/alter.js');
const Chainable = require('../lib/classes/chainable');
const _ = require('lodash');

module.exports = new Chainable('labelwise', {
  args: [
    {
      name: 'inputSeries',
      types: ['seriesList']
    },
    {
      name: 'with',
      types: ['seriesList']
    },
    {
      name: 'do',
      types: ['partial']
    }
  ],
  help: 'Runs a function against a seriesList on a per-label basis',
  fn: function labelwiseFn(args) {
    const inputSeries = args.byName.inputSeries;
    const indexedWith = _.indexBy(args.byName.with.list, 'label');
    const fn = args.byName.do;

    const seriesPromises = _.map(inputSeries.list, function (series) {
      const first = { type: 'seriesList', list: [series] };
      const second = { type: 'seriesList', list: [indexedWith[series.label]] };
      return fn([first, second]).then(function (seriesList) {
        return seriesList.list[0];
      });
    });

    return Promise.all(seriesPromises).then(function (seriesArray) {
      inputSeries.list = seriesArray;
      console.log(JSON.stringify(inputSeries));
      return inputSeries;
    });
  }
});
