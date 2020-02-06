import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { NgxRxStateService } from './ngx-rx-state.service';

describe('NgxRxStateService', () => {
  let spectator: SpectatorService<NgxRxStateService>;
  const createService = createServiceFactory(NgxRxStateService);

  beforeEach(() => spectator = createService());

  it('should...', () => {
    expect(spectator.service).toBeTruthy();
  });
});