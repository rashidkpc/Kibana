/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { registries } from 'plugins/interpreter/registries';
import PropTypes from 'prop-types';
import { compose, withProps } from 'recompose';
import { get } from 'lodash';
import { ElementContent as Component } from './element_content';

export const ElementContent = compose(
  withProps(({ renderable }) => ({
    renderFunction: registries.renderers.get(get(renderable, 'as')),
  }))
)(Component);

ElementContent.propTypes = {
  renderable: PropTypes.shape({
    as: PropTypes.string,
  }),
};
