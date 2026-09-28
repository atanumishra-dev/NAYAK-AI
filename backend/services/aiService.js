class AIService {
    static generateAdvisory(location, category, margin) {
        return {
            feasibility: {
                level: "High (Illustrative / Prototype Estimate)",
                reasons: ["Consistent local demand", "Manageable starting cost"],
                suggested_next_steps: ["Survey local vendors", "Apply for loan"]
            },
            market_analysis: {
                estimated_local_customer_base: "500 households",
                suggested_service_radius: "5 km",
                distribution_channels: ["Direct to home", "Local retail shops"]
            },
            competitor_analysis: {
                competitor_density: "Low",
                competitor_types: ["Unorganized vendors"],
                competitive_observations: ["Scope for quality packaging"]
            },
            swot: {
                Strengths: ["Local sourcing"],
                Weaknesses: ["Initial capital"],
                Opportunities: ["Government schemes"],
                Threats: ["Seasonal fluctuations"]
            },
            risks: ["Supply bottlenecks", "Price fluctuations"]
        };
    }
}

module.exports = AIService;
