const express = require('express');
const router = express.Router();
const FinancialService = require('../services/financialService');
const SchemeRouter = require('../services/schemeRouter');
const AIService = require('../services/aiService');

router.post('/analyze', (req, res) => {
    const { location, available_margin, business_category } = req.body;
    
    if (!available_margin || available_margin <= 0) {
        return res.status(400).json({ error: "Invalid margin" });
    }

    const { projectCost, financingRequirement } = FinancialService.calculateProjectCost(available_margin);
    const scheme = SchemeRouter.recommend(projectCost, available_margin);
    const freq = scheme.scheme === "MICRO FINANCE SCHEME" ? "quarterly" : "monthly";
    const schedule = FinancialService.calculateRepayment(
        scheme.recommended_loan, scheme.interest_rate, scheme.tenure_years, freq
    );
    
    const aiInsights = AIService.generateAdvisory(location, business_category, available_margin);
    
    res.json({
        request_summary: { location, business_category, margin: available_margin },
        feasibility: aiInsights.feasibility,
        market_analysis: aiInsights.market_analysis,
        competitor_analysis: aiInsights.competitor_analysis,
        swot: aiInsights.swot,
        risks: aiInsights.risks,
        financial_plan: {
            available_margin,
            estimated_project_cost: projectCost,
            financing_requirement: financingRequirement
        },
        scheme_recommendation: scheme,
        repayment_plan: {
            loan_amount: scheme.recommended_loan,
            interest_rate: scheme.interest_rate,
            tenure_years: scheme.tenure_years,
            frequency: freq,
            schedule
        },
        recommendations: [`Apply for ${scheme.scheme}`, "Conduct detailed market survey"],
        disclaimer: "Prototype estimates only. Actual repayment terms are subject to the applicable channelizing agency / sanction terms."
    });
});

module.exports = router;
