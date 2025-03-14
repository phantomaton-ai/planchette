import { expect } from 'lovecraft';

import os from 'os';

import Session from './session.js';
import planchette from './planchette.js';

describe('Planchette', () => {
  const tmp = os.tmpdir();

  it('should start a session', () => {
    const session = planchette({ root: tmp });
    expect(session).instanceof(Session);
    expect(session.root).to.equal(tmp);
  });
});
