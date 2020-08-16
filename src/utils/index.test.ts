import { assignProps, shallowMerge } from '.';

describe('Exported utils', () => {
  it('exports assignProps', () => {
    expect(assignProps).toBeDefined();
  });

  it('exports shallowMerge', () => {
    expect(shallowMerge).toBeDefined();
  });
});
