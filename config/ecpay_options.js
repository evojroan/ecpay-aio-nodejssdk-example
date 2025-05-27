const options = {
    OperationMode: "Test",
    MercProfile: {
      MerchantID: `${process.env.MerchantID}`,
      HashKey: `${process.env.HASH_KEY}`,
      HashIV: `${process.env.HASH_IV}`,
    },
    IgnorePayment: [],
    IsProjectContractor: false,
  };

  module.exports = options;