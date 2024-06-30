const redis = require('../redis')
const express = require('express');
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/statistics', async (req, res) => {
  const stats = await redis.getAsync('added_todos');

  if (!stats) {
    return res.json({ "error": "no stats available" })
  }

  res.json({ "added_todos": stats })

})

module.exports = router;
