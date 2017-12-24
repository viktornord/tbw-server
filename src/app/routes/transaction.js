const router = require('express').Router();

router.post('/transactions', transactionPOST);

router.get('/transactions', transactionListGET);

module.exports = router;

async function transactionPOST(req, res, next) {
  res.end();
}
async function transactionListGET(req, res, next) {
  res.end();

}