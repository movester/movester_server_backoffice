const stretchingDao = require('../dao/stretching');
const CODE = require('../utils/statusCode');

const createStretching = async ({
  mainPart,
  subPart,
  tool,
  postures,
  effects,
  youtubeUrl,
  title,
  contents,
  image,
  adminIdx,
}) => {
  try {
    await stretchingDao.createStretching(mainPart, subPart, tool, youtubeUrl, title, contents, image, adminIdx);

    const stretchingIdx = await stretchingDao.getLastIdx();

    await Promise.all([
      ...postures.map(posture => stretchingDao.createStretchingPosture(stretchingIdx, posture)),
      ...effects.map(effect => stretchingDao.createStretchingEffect(stretchingIdx, effect)),
    ]);

    return { stretchingIdx };
  } catch (err) {
    return CODE.INTERNAL_SERVER_ERROR;
  }
};

const findStretchingByTitle = async title => {
  try {
    const result = await stretchingDao.findStretchingByTitle(title);
    return result;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  createStretching,
  findStretchingByTitle,
};
