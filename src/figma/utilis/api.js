const api = require('axios');
const FILE_ID = 'EEH18lQVLGJJPVA5AIsU95';
export const headers = {
  'X-FIGMA-TOKEN': '140347-4084f1f3-b692-4478-82f0-6142a7278af4'
};
/**
 * api endpoint for files
 *
 */
export const instanceFiles = api.create({
  baseURL: `https://api.figma.com/v1/files/${process.env.FILE_KEY}`,
  headers
});
/**
 * api endpoint for images
 *
 */
export const instanceImages = api.create({
  baseURL: `https://api.figma.com/v1/images/Its50TWEgHeAstfAahfdMe/`,
  headers
});
/**
 * get Figma document info
 *
 * @return {Promise<Object>}
 */
export const getDocument = async () => instanceFiles.get('/');
/**
 * get Figma node info
 *
 * @param {string} nodeId
 * @return {Promise<Object>}
 */
export const getNode = async nodeId =>
  instanceFiles.get(`/nodes?ids=${decodeURIComponent(nodeId)}`);
/**
 * get Figma node children
 *
 * @param {string} nodeId
 * @return {Promise<[Object]>}
 */
export const getNodeChildren = async nodeId => {
  const {
    data: { nodes }
  } = await instanceFiles.get(`/nodes?ids=${decodeURIComponent(nodeId)}`);
  return nodes[nodeId].document.children;
};
/**
 * get svg image resource url
 *
 * @param {string} nodeId
 * @return {Promise<string>}
 */
export const getSvgImageUrl = async nodeId => {
  const {
    data: { images, err }
  } = await instanceImages.get(`?ids=337%3A28&format=svg`);
  return images[nodeId];
};
export const getIconContent = async url => api.get(url);
