import { Spectator, createComponentFactory } from '@ngneat/spectator';

import { NgxRxStateComponent } from './ngx-rx-state.component';

describe('NgxRxStateComponent', () => {
  let spectator: Spectator<NgxRxStateComponent>;
  const createComponent = createComponentFactory(NgxRxStateComponent);

  it('should create', () => {
    spectator = createComponent();

    expect(spectator.component).toBeTruthy();
  });
});
