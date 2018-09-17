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

import Chainable from '../lib/classes/chainable';
import { zip } from 'lodash';

export default new Chainable('median', {
  args: [
    {
      name: 'inputSeries',
      types: ['seriesList'],
    },
  ],
  help: 'Pointwise median of all series in a list',
  aliases: ['add', 'plus'],
  fn: function medianFn(args) {
    function median(values) {
      values.sort((a, b) => {
        return a - b;
      });

      if (values.length === 0) return 0;

      const half = Math.floor(values.length / 2);

      if (values.length % 2) return values[half];
      else return (values[half - 1] + values[half]) / 2.0;
    }

    const seriesList = args[0];
    const zipped = zip(...seriesList.list.map(series => series.data.map(point => point[1])));

    const medians = zipped.map(median);

    return {
      ...seriesList,
      list: [
        {
          type: 'series',
          label: seriesList.list[0].label,
          data: seriesList.list[0].data.map((point, i) => [point[0], medians[i]]),
        },
      ],
    };
  },
});
