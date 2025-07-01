const axios = require('axios');

const validatePayment = async (paymentId) => {
  const res = await axios.get(`https://api.minepi.com/v2/payments/${paymentId}`, {
    headers: { Authorization: `Key ${process.env.PI_API_KEY}` }
  });
  const payment = res.data;
  if (payment.status !== 'pending') throw new Error("Payment not pending.");
  return payment;
};

module.exports = { validatePayment };
