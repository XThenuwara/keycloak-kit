export const handlePromise = async (promise) => {
  try {
    const data = await promise;
    return [null, data];
  } catch (e) {
    return [e, null];
  }
};
