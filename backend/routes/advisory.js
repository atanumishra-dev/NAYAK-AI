const express = require('express');
const router = express.Router();
const FinancialService = require('../services/financialService');
const SchemeRouter = require('../services/schemeRouter');
const GeminiService = require('../services/geminiService');
const { getMarketData } = require('../data_sources/marketDataClient');
const { getWeatherData } = require('../data_sources/weatherDataClient');
const { getBusinessBenchmark } = require('../data_sources/businessBenchmarkClient');
const Advisory = require('../models/Advisory');

router.post('/analyze', async (req, res) => {
    const { location, available_margin, business_category } = req.body;
    
    if (!available_margin || available_margin <= 0) {
        return res.status(400).json({ error: "Invalid margin" });
    }

    // 1. Financial Engine (Deterministic)
    const { projectCost, financingRequirement } = FinancialService.calculateProjectCost(available_margin);
    const scheme = SchemeRouter.recommend(projectCost, available_margin);
    const freq = scheme.scheme === "MICRO FINANCE SCHEME" ? "quarterly" : "monthly";
    const schedule = FinancialService.calculateRepayment(
        scheme.recommended_loan, scheme.interest_rate, scheme.tenure_years, freq
    );

    // 2. Data Ingestion (Parallel)
    const [marketData, weatherData, benchmarkData] = await Promise.all([
        getMarketData(business_category, location.district),
        getWeatherData(location.district),
        getBusinessBenchmark(business_category)
    ]);

    // 3. Assemble Grounded Context
    const groundedContext = {
        user_profile: {
            location: location,
            available_margin: available_margin,
            business_category: business_category
        },
        market_data: marketData,
        weather_data: weatherData,
        business_benchmark: benchmarkData,
        financial_model: {
            project_cost: projectCost,
            margin: available_margin,
            financing_requirement: financingRequirement,
            estimated_monthly_payment: schedule[1] ? schedule[1].payment : 0,
        },
        scheme_matches: [scheme]
    };

    let aiReport = null;
    let fallbackWarning = null;

    // 4. Gemini AI Analysis
    try {
        aiReport = await GeminiService.generateReport(groundedContext);
    } catch (err) {
        fallbackWarning = "AI analysis temporarily unavailable. Displaying deterministic baseline.";
        console.error("Gemini Failure:", err.message);
        
        // Deterministic Fallback
        aiReport = {
            executive_summary: {
                headline: `Business Assessment for ${business_category}`,
                summary: "Standard deterministic projection based on available benchmarks.",
                key_observations: ["Please review market data below."],
                important_caveats: ["AI analysis was disabled or failed."]
            },
            market_analysis: { market_signal: "mixed", observations: ["See external data"], price_trend: "stable" },
            financial_interpretation: { summary: "Project cost estimated deterministically.", cash_flow_observations: [], break_even_interpretation: "N/A" },
            scheme_interpretation: [{
                scheme_name: scheme.scheme,
                why_it_may_apply: "Matches generic financial thresholds.",
                eligibility_conditions: [], benefits: [], limitations: [], source: "Prototype Logic"
            }],
            risk_analysis: [{ risk: "Execution Risk", severity: "medium", reason: "General business risk", mitigation: "Plan carefully." }],
            swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
            action_plan: { next_7_days: ["Review plan"], next_30_days: [], next_90_days: [] },
            recommendations: [{ priority: 1, recommendation: "Analyze market", reason: "Standard practice", evidence: "N/A" }],
            data_quality: { overall: "medium", missing_data: ["AI Analysis"], stale_data: [], assumptions: ["Deterministic defaults used"] }
        };
    }

    // 5. Structure Final Output
    const payload = {
        analysis_id: `ANL-${Date.now()}`,
        generated_at: new Date().toISOString(),
        request_summary: { location, business_category, margin: available_margin },
        financial_structure: {
            margin_capital: available_margin,
            estimated_project_cost: projectCost,
            calculated_financing_requirement: financingRequirement
        },
        repayment_schedule: {
            loan_amount: scheme.recommended_loan,
            interest_rate: `${scheme.interest_rate}% p.a.`,
            tenure_years: scheme.tenure_years,
            frequency: freq,
            schedule
        },
        financing_scheme: scheme,
        data_sources: {
            market: marketData,
            weather: weatherData,
            benchmark: benchmarkData
        },
        ai_report: aiReport,
        warnings: fallbackWarning ? [fallbackWarning] : [],
        disclaimer: "Prototype estimates only. Actual terms are subject to sanction."
    };

    // 6. Save to MongoDB
    try {
        const advisoryRecord = new Advisory({
            location: {
                state: location.state || '',
                district: location.district || '',
                village: location.village || ''
            },
            business_category,
            margin_capital: available_margin,
            project_cost: projectCost,
            financing_requirement: financingRequirement,
            recommended_scheme: scheme.scheme,
            analysis_result: payload
        });
        await advisoryRecord.save();
    } catch (err) {
        console.error("MongoDB Save Error:", err);
    }
    
    res.json(payload);
});

module.exports = router;
