const express = require('express');
const router = express.Router();

router.get('/search', (req, res) => {
    // Prototype sample data
    res.json({
        results: [
            {
                village: "Rampur",
                block: "Palampur",
                district: "Kangra",
                state: "Himachal Pradesh",
                latitude: 32.11,
                longitude: 76.53
            }
        ]
    });
});

module.exports = router;
