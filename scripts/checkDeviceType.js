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