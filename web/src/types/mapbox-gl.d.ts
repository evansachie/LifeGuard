import * as mapboxgl from 'mapbox-gl';

// Extend the mapboxgl namespace to include the workerClass property
declare module 'mapbox-gl' {
  export interface MapboxOptions {
    workerClass?: typeof Worker;
    workerCount?: number;
  }

  export default interface mapboxgl {
    workerClass: typeof Worker;
  }
}
