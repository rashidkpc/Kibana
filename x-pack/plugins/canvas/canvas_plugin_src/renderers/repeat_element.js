/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import ReactDOM from 'react-dom';
import React from 'react';
import { ElementContent } from '../../public/components/element_content';

export const repeatElement = () => ({
  name: 'repeatElement',
  displayName: 'Repeat Element',
  help: 'Create multiple elements from a data table',
  reuseDomNode: false,
  render(domNode, config, handlers) {
    const { elements } = config;
    const noop = () => {};
    const elementHandlers = { getFilter: noop, setFilter: noop, done: noop, onComplete: noop };
    const draw = () => {
      const height = Math.floor(domNode.clientHeight / elements.length);
      const content = (
        <div>
          {elements.map((element, i) => {
            return (
              <div key={i} style={{ height }}>
                <ElementContent state="done" renderable={element} handlers={elementHandlers} />
              </div>
            );
          })}
        </div>
      );
      ReactDOM.render(content, domNode, () => handlers.done());
    };
    draw();

    const destroy = () => ReactDOM.unmountComponentAtNode(domNode);

    handlers.onDestroy(destroy);
    handlers.onResize(() => {
      destroy();
      draw();
    });
  },
});
