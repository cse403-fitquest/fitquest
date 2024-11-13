/* converts seconds to xminutes xseconds so for display purposes*/
export const secondsToMinutes = (seconds: number) => {
  return Math.floor(seconds / 60) + 'm' + (seconds % 60) + 's';
};

export const addToTemplate = () => {};
export const removeFromTemplate = () => {};
export const submitTemplate = () => {};
export const resetTemplate = () => {};
