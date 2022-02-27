// 다중 insert query 반환
const getArrayQuery = (sql, idx, array) => {
  const getValues = array.map(v => `(${idx}, ${v})`).join(', ');
  return sql.trim() + getValues;
};

module.exports = {
  getArrayQuery,
};
