export const RATINGS_CHANGED = 'cineverse:ratings-changed';

export function notifyRatingsChanged() {
  window.dispatchEvent(new Event(RATINGS_CHANGED));
}
