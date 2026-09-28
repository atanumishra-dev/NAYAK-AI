const express = require('express');
const router = express.Router();
const FinancialService = require('../services/financialService');

router.post('/calculate', (req, res) => {
    const { available_margin } = req.body;
    if (!available_margin || available_margin <= 0) {
        return res.status(400).json({ error: "Invalid margin" });
    }
    const { projectCost, financingRequirement } = FinancialService.calculateProjectCost(available_margin);
    res.json({
        estimated_project_cost: projectCost,
        financing_requirement: financingRequirement
    });
});

router.post('/repayment', (req, res) => {
    const { loan_amount, interest_rate, tenure_years, frequency } = req.body;
    const schedule = FinancialService.calculateRepayment(loan_amount, interest_rate, tenure_years, frequency);
    res.json({
        loan_amount,
        interest_rate,
        tenure_years,
        frequency,
        schedule
    });
});

module.exports = router;
