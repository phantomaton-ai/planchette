import { expect } from 'lovecraft';

import os from 'os';

import Session from './session.js';
import planchette from './planchette.js';

describe('Planchette', () => {
  const tmp = os.tmpdir();

  it('starts a session', () => {
    const session = planchette({ home: tmp });
    expect(session).instanceof(Session);
    expect(session.workspace.home).to.equal(tmp);
  });
});
