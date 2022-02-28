const stretchingDao = require('../dao/stretching');

const createStretching = async stretching => {
  try {
    const newStretchingIdx = await stretchingDao.createStretching(stretching);
    return newStretchingIdx;
  } catch (err) {
    console.error(`=== Stretching Service createStretching Error: ${err} === `);
    throw new Error(err);
  }
};

const findStretchingByTitle = async title => {
  try {
    const stretching = await stretchingDao.findStretchingByTitle(title);
    return stretching;
  } catch (err) {
    console.error(`=== Stretching Service findStretchingByTitle Error: ${err} === `);
    throw new Error(err);
  }
};

const deleteStretching = async stretchingIdx => {
  try {
    const isDelete = await stretchingDao.deleteStretching(stretchingIdx);
    return isDelete;
  } catch (err) {
    console.error(`=== Stretching Service deleteStretching Error: ${err} === `);
    throw new Error(err);
  }
};

const updateStretching = async stretching => {
  try {
    const isUpdate = await stretchingDao.updateStretching(stretching);
    return isUpdate
  } catch (err) {
    console.error(`=== Stretching Service updateStretching Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  createStretching,
  findStretchingByTitle,
  deleteStretching,
  updateStretching,
};
