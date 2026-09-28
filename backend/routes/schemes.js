const express = require('express');
const router = express.Router();
const SchemeRouter = require('../services/schemeRouter');

router.post('/recommend', (req, res) => {
    const { project_cost, available_margin } = req.body;
    const recommendation = SchemeRouter.recommend(project_cost, available_margin);
    res.json(recommendation);
});

module.exports = router;
