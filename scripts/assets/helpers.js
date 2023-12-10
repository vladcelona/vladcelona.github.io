/**
 * Function that checks if current device is mobile one or not
 * @returns A boolean answer
 */
export function checkDeviceType() {
  const mobileDeviceNames = [
    /Android/i, /webOS/i, /iPhone/i,
    /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i
  ];
  return mobileDeviceNames.some((deviceName) => {
    return navigator.userAgent.match(deviceName);
  });
}

/**
 * Function that gets products list sorted by a certaon category
 * @param {string} category 
 */
export function getProductList(category) {

}

export function getCartList() {

}

/**
 * Function that gets news from server
 */
export function getNewsList() {

}

/**
 * Function that navigates to page selected (clicked) from navigation bar
 * @param {string | URL} location Selected (clicked) page location
 */
export function handleClick(location) {
  window.location.replace(location)
}