declare module 'mapbox-gl' {
  export interface MapboxOptions {
    workerClass?: typeof Worker;
    workerCount?: number;
  }

  export default interface mapboxgl {
    workerClass: typeof Worker;
  }
}
