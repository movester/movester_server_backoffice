// 다중 insert query 반환
const getArrayQuery = (sql, idx, array) => {
  const getValues = array.map(v => `(${idx}, ${v})`).join(', ');
  return sql.trim() + getValues;
};

const getInsertWeekDayStretchingSql = (weekStretchingIdx, weekArr) => {
  const insertSql = `INSERT
                       INTO week_day_stretching (week_stretching_idx, week_day, stretching_idx)
                     VALUES`;
  const getValues = weekArr.map((v, i) => `(${weekStretchingIdx}, ${i}, ${v})`).join(', ');
  return insertSql.trim() + getValues;
};

module.exports = {
  getArrayQuery,
  getInsertWeekDayStretchingSql
};
