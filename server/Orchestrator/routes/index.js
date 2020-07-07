const router = require('express').Router();
const moviesController = require('../controllers/moviesController');
const tvSeriesController = require('../controllers/tvSeriesController');
const OrchestratorController = require('../controllers/OrchestratorController');

router.get('/', (req, res) => {
  res.status(200).json({
    msg: 'Orchestrator server is running',
  });
});
router.get('/entertainme', OrchestratorController.getAll)

// movies
router.get('/movies', moviesController.getAll);
router.post('/movies', moviesController.addMovie);
router.delete('/movies/:id', moviesController.deleteMovie);
router.patch('/movies/:id', moviesController.updateMovie);

// tv-series
router.get('/tv', tvSeriesController.getAll);
router.post('/tv', tvSeriesController.addTv);
router.delete('/tv/:id', tvSeriesController.deleteTv);
router.patch('/tv/:id', tvSeriesController.updateTv);

module.exports = router;