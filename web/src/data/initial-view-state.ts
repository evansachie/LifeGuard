interface ViewState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export const INITIAL_VIEW_STATE: ViewState = {
  latitude: 5.6505,
  longitude: -0.187,
  zoom: 15,
  bearing: 0,
  pitch: 0,
};
