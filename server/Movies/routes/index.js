const router = require('express').Router();
const movieController = require('../controllers/movieController');

router.get('/', (req, res) => {
    res.status(200).json({
        msg: 'movies server is running'
    })
});
router.get('/movies', movieController.findAll);
router.get('/movies/:id', movieController.findById);
router.post('/movies', movieController.createMovie);
router.delete('/movies/:id', movieController.deleteMovie);
router.patch('/movies/:id', movieController.updateMovie);

module.exports = router;
