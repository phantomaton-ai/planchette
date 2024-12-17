import {expect} from 'lovecraft';
import hierophant from 'hierophant';

import plugin from './plugin.js';

describe('plugin', () => {
  let container;

  beforeEach(() => {
    container = hierophant();
  });

  it('installs', () => {
    plugin().install.forEach(component => container.install(component));
  });
});
