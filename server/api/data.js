const router = require('express').Router()
const { QuickDrawGetter } = require('../../script/QuickDrawGetter')
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    const data = await QuickDrawGetter();
    res.json(data)
  } catch (err) {
    next(err)
  }
})
