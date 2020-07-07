const router = require('express').Router();
const tvSeriesController = require('../controllers/tvSeriesController');

router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'tv-series server is running'
    })
});
router.get('/tv', tvSeriesController.findAll);
router.get('/tv/:id', tvSeriesController.findById);
router.post('/tv', tvSeriesController.createTvSeries);
router.delete('/tv/:id', tvSeriesController.deleteTvSeries);
router.patch('/tv/:id', tvSeriesController.updateTvSeries);

module.exports = router;
