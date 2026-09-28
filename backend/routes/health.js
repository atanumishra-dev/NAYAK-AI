const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({
        status: "ok",
        service: "GramVenture AI Backend",
        version: "0.1.0"
    });
});

module.exports = router;
