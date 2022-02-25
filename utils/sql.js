const getArrayQuery = (sql, idx, array) => {
  const getValues = array.map(v => `(${idx}, ${v})`).join(', ');
  return sql + getValues;
};

module.exports = {
  getArrayQuery,
};
