const express = require('express');
const router = express.Router();

router.get('/categories', (req, res) => {
    res.json([
        {
            id: "dairy",
            name: "Dairy Farming",
            description: "Milk production and local distribution.",
            typical_starting_cost: 500000,
            market_type: "Local",
            seasonality: "Year-round",
            risk_level: "Medium",
            sample_products: ["Milk", "Curd", "Ghee"]
        }
    ]);
});

module.exports = router;
