/**
 * Utility function that waits t milliseconds before resolving.
 * Wrapper for Promise setTimeout.
 * @param {Number} t Time in milliseconds
 * @returns {Promise<void>}
 */
export default async function sleep(t=1000):Promise<void>{
  if(t<1) return;
  if(t>10000) throw new Error(`Sleep exceeds 10s. What are you trying to achieve?`);
  await new Promise(r => setTimeout(r, t));
}