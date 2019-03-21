/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getType } from '../../../../../../packages/kbn-interpreter/src/common/lib/get_type';
import { groupTable } from './ply/lib/group_table';

export const repeatElement = () => ({
  name: 'repeatElement',
  type: 'render',
  help:
    'Subdivide a datatable, pass the resulting tables into an expression that returns a set of renderable elements',
  context: {
    types: ['datatable'],
  },
  args: {
    by: {
      types: ['string'],
      help: 'The column to subdivide on',
      multi: true,
    },
    expression: {
      types: ['render'],
      resolve: false,
      aliases: ['fn', 'function'],
      help:
        'An expression to pass each resulting data table into. Tips: \n' +
        ' Expressions must return a render type.\n' +
        ' All render types do not have to be the same',
    },
    // In the future it may make sense to add things like shape, or tooltip values, but I think what we have is good for now
    // The way the function below is written you can add as many arbitrary named args as you want.
  },
  fn: (context, args) => {
    let originalDatatables;

    if (args.by) {
      originalDatatables = groupTable(context, args.by);
    } else {
      originalDatatables = [context];
    }

    const renderPromises = originalDatatables.map(originalDatatable => {
      return args.expression(originalDatatable).then(maybeRender => {
        if (getType(maybeRender) !== 'render') {
          throw new Error(
            'repeatElement expressions must return a render. Stick a | render on the end of your expression if you have to'
          );
        }
        return maybeRender;
      });
    });

    return Promise.all(renderPromises).then(elements => {
      return {
        type: 'render',
        as: 'repeatElement',
        value: {
          elements: elements,
        },
      };
    });
  },
});
