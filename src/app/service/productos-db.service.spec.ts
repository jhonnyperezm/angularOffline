import { TestBed } from '@angular/core/testing';

import { ProductosDBService } from './productos-db.service';

describe('ProductosDBService', () => {
  let service: ProductosDBService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductosDBService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
