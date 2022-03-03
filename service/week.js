const weekDao = require('../dao/week');

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
      writer: weekTemp.adminIdx,
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

module.exports = {
  createWeek,
  findWeekByTitle,
};
