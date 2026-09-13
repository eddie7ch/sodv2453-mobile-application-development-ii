import { EdgePadding, LatLng, Region } from 'react-native-maps';

// Shared map settings, so every map in the app starts in the same place and uses the same padding.

/** Where maps centre before any events load: south-west Calgary. */
export const DEFAULT_POSITION: LatLng = {
    latitude: 51.03,
    longitude: -114.093,
};

/** How zoomed in the map starts. Smaller numbers mean closer in (a few city blocks here). */
export const DEFAULT_DELTA = { latitudeDelta: 0.008, longitudeDelta: 0.008 };

/** Starting view for maps: {@link DEFAULT_POSITION} at the {@link DEFAULT_DELTA} zoom level. */
export const DEFAULT_REGION: Region = {
    ...DEFAULT_POSITION,
    ...DEFAULT_DELTA,
};

/** Space in pixels kept clear around the map's edges, so markers aren't hidden behind the buttons and footer. */
export const EDGE_PADDING: EdgePadding = {
    top: 64,
    right: 16,
    bottom: 104,
    left: 16,
};
