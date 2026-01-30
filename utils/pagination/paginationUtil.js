const buildPaginationMeta = ({ total = 0, limit = 10, offset = 0 }) => {
  const safeTotal = Number(total) || 0;
  const safeLimit = Number(limit) || 0;
  const safeOffset = Number(offset) || 0;

  return {
    total: safeTotal,
    limit: safeLimit,
    offset: safeOffset,

    hasNext: safeOffset + safeLimit < safeTotal,
    hasPrev: safeOffset > 0,

    currentPage:
      safeLimit > 0 ? Math.floor(safeOffset / safeLimit) + 1 : 1,

    totalPages:
      safeLimit > 0 ? Math.ceil(safeTotal / safeLimit) : 1,
  };
};

module.exports = {
  buildPaginationMeta,
};
