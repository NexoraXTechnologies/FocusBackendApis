const axios = require('axios');
const BASE_URL = process.env.FOCUS8_BASE_URL;

const fetchTaxMasters = async (sessionId) => {
  const response = await axios.get(
    `${BASE_URL}/Focus8API/List/Masters/Core__TaxMaster`,
    {
      headers: {
        'Content-Type': 'application/json',
        fSessionId: sessionId
      }
    }
  );

  return response.data;
};

const updateIsPosted = async (sessionId, masterIds) => {
  const payload = {
    data: masterIds.map(id => ({
      iMasterId: String(id),
      IsPosted: "Yes"
    }))
  };

  await axios.post(
    `${BASE_URL}/Focus8API/Masters/Core__TaxMaster`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        fSessionId: sessionId
      }
    }
  );
};

module.exports = {
  fetchTaxMasters,
  updateIsPosted
};