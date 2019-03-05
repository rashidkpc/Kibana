/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';
import fetch from 'node-fetch';
import Datasource from '../lib/classes/datasource';

const codes = {
  price: 'c89c0047-50d2-47df-a257-e6781e7563a4',
  ps: 'ee64f82e-09cf-4b30-b45c-b72a5b03e37a',
};

export default new Datasource('stockrow', {
  args: [
    {
      name: 'ticker',
      types: ['string', 'null'],
      help:
        'Ticker symbol, or multiple ticket symbols seperated by ":". For example "APPL:MSFT". 100 max.',
    },
    {
      name: 'indicator',
      types: ['string', 'null'],
      help:
        'Stockrow indicator code. I pull these from the network debugger. I have no translation layer for this, sorry',
    },
  ],
  aliases: ['sr'],
  help: `
    [experimental]
    Pull from stockrow.com`,
  fn: function stockrow(args) {
    const config = _.defaults(args.byName, {
      ticker: 'AAPL:MSFT',
      indicator: 'c89c0047-50d2-47df-a257-e6781e7563a4',
    });

    const body = {
      indicators: [codes[config.indicator] || config.indicator],
      tickers: config.ticker.split(':').map(ticker => ticker.trim()),
    };

    return fetch('https://stockrow.com/api/fundamentals.json', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(resp => {
        return resp.json();
      })
      .then(resp => {
        const list = resp.series.map(series => {
          return {
            data: series.data, //.map(point => ([point[0] * 1000, point[1]])),
            type: 'series',
            label: series.name,
            _meta: {
              stockrow_id: series.id,
            },
          };
        });

        return {
          type: 'seriesList',
          list,
        };
      })
      .catch(e => {
        throw e;
      });
  },
});
