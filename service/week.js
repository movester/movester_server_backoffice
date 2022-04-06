const weekDao = require('../dao/week');

const getWeeks = async () => {
  try {
    const weeks = await weekDao.getWeeks();
    return weeks;
  } catch (err) {
    console.error(`=== Week Service getWeeks Error: ${err} === `);
    throw new Error(err);
  }
};

const createWeek = async weekTemp => {
  try {
    const week = {
      title: weekTemp.title,
      mon: weekTemp.week[0],
      tue: weekTemp.week[1],
      wed: weekTemp.week[2],
      thu: weekTemp.week[3],
      fri: weekTemp.week[4],
      sat: weekTemp.week[5],
      sun: weekTemp.week[6],
      adminIdx: weekTemp.adminIdx,
    };
    const newWeekIdx = await weekDao.createWeek(week);
    return newWeekIdx;
  } catch (err) {
    if (String(err) === 'Error: ER_NO_REFERENCED_ROW_2') {
      return false;
    }
    console.error(`=== Week Service createWeek Error: ${err} === `);
    throw new Error(err);
  }
};

const findWeekByTitle = async title => {
  try {
    const week = await weekDao.findWeekByTitle(title);
    return week;
  } catch (err) {
    console.error(`=== Week Service findWeekByTitle Error: ${err} === `);
    throw new Error(err);
  }
};

const findWeekByIdx = async idx => {
  try {
    const week = await weekDao.findWeekByIdx(idx);
    return week;
  } catch (err) {
    console.error(`=== Week Service findWeekByIdx Error: ${err} === `);
    throw new Error(err);
  }
};

const deleteWeek = async weekIdx => {
  try {
    const isDelete = await weekDao.deleteWeek(weekIdx);
    return isDelete;
  } catch (err) {
    console.error(`=== Week Service deleteWeek Error: ${err} === `);
    throw new Error(err);
  }
};

const updateWeek = async weekTemp => {
  try {
    const week = {
      title: weekTemp.title,
      mon: weekTemp.week[0],
      tue: weekTemp.week[1],
      wed: weekTemp.week[2],
      thu: weekTemp.week[3],
      fri: weekTemp.week[4],
      sat: weekTemp.week[5],
      sun: weekTemp.week[6],
      adminIdx: weekTemp.adminIdx,
      weekIdx: weekTemp.weekIdx,
    };
    const isUpdate = await weekDao.updateWeek(week);
    return isUpdate;
  } catch (err) {
    if (String(err) === 'Error: ER_NO_REFERENCED_ROW_2') {
      return false;
    }
    console.error(`=== Week Service updateWeek Error: ${err} === `);
  }
};

const getWeek = async weekIdx => {
  try {
    const weekTemp = await weekDao.getWeek(weekIdx);
    if (!weekTemp) return null;

    const week = {
      weekIdx: weekTemp.weekIdx,
      title: weekTemp.title,
      week: weekTemp.titles.map(v => v.title),
      adminIdx: weekTemp.adminIdx,
      createAt: weekTemp.createAt,
      isExpose: weekTemp.isExpose,
    };

    return week;
  } catch (err) {
    console.error(`=== Week Service getWeek Error: ${err} === `);
    throw new Error(err);
  }
};

const updateExposeWeek = async weekIdx => {
  try {
    await weekDao.updateExposeWeek(weekIdx);
  } catch (err) {
    console.error(`=== Week Service updateExposeWeek Error: ${err} === `);
    throw new Error(err);
  }
};

const cancelExposeWeek = async weekIdx => {
  try {
    const week = await findWeekByIdx(weekIdx);
    if (!week.isExpose) return false;

    const isCancel = await weekDao.cancelExposeWeek(weekIdx);
    return isCancel;
  } catch (err) {
    console.error(`=== Week Service cancelExposeWeek Error: ${err} === `);
    throw new Error(err);
  }
};

const getExposeWeek = async () => {
  try {
    const week = await weekDao.getExposeWeek();
    return week;
  } catch (err) {
    console.error(`=== Week Service getExposeWeek Error: ${err} === `);
    throw new Error(err);
  }
};

module.exports = {
  getWeeks,
  createWeek,
  findWeekByTitle,
  findWeekByIdx,
  deleteWeek,
  updateWeek,
  getWeek,
  updateExposeWeek,
  cancelExposeWeek,
  getExposeWeek,
};
