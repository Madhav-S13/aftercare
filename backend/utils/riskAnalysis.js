/**
 * AI-Based Health Risk Analysis
 * Analyzes patient vitals and trends to calculate risk scores
 */

// Normal ranges for vitals
const NORMAL_RANGES = {
    bloodPressure: {
        systolic: { min: 90, max: 120, ideal: 110 },
        diastolic: { min: 60, max: 80, ideal: 70 }
    },
    heartRate: { min: 60, max: 100, ideal: 75 },
    spO2: { min: 95, max: 100, ideal: 98 },
    temperature: { min: 97, max: 99, ideal: 98.6 }
};

// Critical thresholds
const CRITICAL_THRESHOLDS = {
    bloodPressure: {
        systolic: { low: 90, high: 180 },
        diastolic: { low: 60, high: 120 }
    },
    heartRate: { low: 50, high: 120 },
    spO2: { low: 90 },
    temperature: { low: 95, high: 103 }
};

/**
 * Calculate risk score for individual vital
 */
const calculateVitalRisk = (value, normalRange, criticalThreshold) => {
    let risk = 0;

    // Check if value is in normal range
    if (value >= normalRange.min && value <= normalRange.max) {
        // Calculate how far from ideal
        const deviation = Math.abs(value - normalRange.ideal);
        const maxDeviation = Math.max(
            normalRange.ideal - normalRange.min,
            normalRange.max - normalRange.ideal
        );
        risk = (deviation / maxDeviation) * 30; // Max 30 points for normal range deviation
    } else {
        // Out of normal range
        if (value < normalRange.min) {
            const diff = normalRange.min - value;
            const criticalDiff = normalRange.min - (criticalThreshold.low || 0);
            risk = 30 + (diff / criticalDiff) * 40; // 30-70 points
        } else {
            const diff = value - normalRange.max;
            const criticalDiff = (criticalThreshold.high || 300) - normalRange.max;
            risk = 30 + (diff / criticalDiff) * 40; // 30-70 points
        }
    }

    // Check critical thresholds
    if (criticalThreshold.low && value < criticalThreshold.low) {
        risk = Math.max(risk, 70);
    }
    if (criticalThreshold.high && value > criticalThreshold.high) {
        risk = Math.max(risk, 70);
    }

    return Math.min(Math.max(risk, 0), 100);
};

/**
 * Analyze single health data entry
 */
exports.analyzeHealthData = (healthData) => {
    const risks = {};

    // Analyze blood pressure
    const bpSystolicRisk = calculateVitalRisk(
        healthData.bloodPressure.systolic,
        NORMAL_RANGES.bloodPressure.systolic,
        CRITICAL_THRESHOLDS.bloodPressure.systolic
    );

    const bpDiastolicRisk = calculateVitalRisk(
        healthData.bloodPressure.diastolic,
        NORMAL_RANGES.bloodPressure.diastolic,
        CRITICAL_THRESHOLDS.bloodPressure.diastolic
    );

    risks.bloodPressure = Math.max(bpSystolicRisk, bpDiastolicRisk);

    // Analyze heart rate
    risks.heartRate = calculateVitalRisk(
        healthData.heartRate,
        NORMAL_RANGES.heartRate,
        CRITICAL_THRESHOLDS.heartRate
    );

    // Analyze SpO2
    risks.spO2 = calculateVitalRisk(
        healthData.spO2,
        NORMAL_RANGES.spO2,
        CRITICAL_THRESHOLDS.spO2
    );

    // Analyze temperature
    risks.temperature = calculateVitalRisk(
        healthData.temperature,
        NORMAL_RANGES.temperature,
        CRITICAL_THRESHOLDS.temperature
    );

    // Calculate overall risk score (weighted average)
    const weights = {
        bloodPressure: 0.3,
        heartRate: 0.25,
        spO2: 0.3,
        temperature: 0.15
    };

    const overallRisk =
        risks.bloodPressure * weights.bloodPressure +
        risks.heartRate * weights.heartRate +
        risks.spO2 * weights.spO2 +
        risks.temperature * weights.temperature;

    // Determine risk level
    let riskLevel = 'normal';
    if (overallRisk > 70) {
        riskLevel = 'critical';
    } else if (overallRisk > 40) {
        riskLevel = 'warning';
    }

    return {
        riskScore: Math.round(overallRisk),
        riskLevel,
        individualRisks: risks,
        alerts: generateAlerts(healthData, risks, riskLevel)
    };
};

/**
 * Generate alert messages based on risk analysis
 */
const generateAlerts = (healthData, risks, riskLevel) => {
    const alerts = [];

    // Blood pressure alerts
    if (healthData.bloodPressure.systolic > 180 || healthData.bloodPressure.diastolic > 120) {
        alerts.push({
            severity: 'critical',
            message: 'Hypertensive Crisis - Immediate medical attention required',
            vital: 'bloodPressure'
        });
    } else if (healthData.bloodPressure.systolic > 140 || healthData.bloodPressure.diastolic > 90) {
        alerts.push({
            severity: 'high',
            message: 'High Blood Pressure detected',
            vital: 'bloodPressure'
        });
    } else if (healthData.bloodPressure.systolic < 90 || healthData.bloodPressure.diastolic < 60) {
        alerts.push({
            severity: 'high',
            message: 'Low Blood Pressure detected',
            vital: 'bloodPressure'
        });
    }

    // Heart rate alerts
    if (healthData.heartRate > 120) {
        alerts.push({
            severity: 'high',
            message: 'Elevated heart rate detected',
            vital: 'heartRate'
        });
    } else if (healthData.heartRate < 50) {
        alerts.push({
            severity: 'high',
            message: 'Low heart rate detected',
            vital: 'heartRate'
        });
    }

    // SpO2 alerts
    if (healthData.spO2 < 90) {
        alerts.push({
            severity: 'critical',
            message: 'Critically low oxygen saturation - Seek immediate medical help',
            vital: 'spO2'
        });
    } else if (healthData.spO2 < 95) {
        alerts.push({
            severity: 'high',
            message: 'Low oxygen saturation detected',
            vital: 'spO2'
        });
    }

    // Temperature alerts
    if (healthData.temperature > 103) {
        alerts.push({
            severity: 'critical',
            message: 'High fever detected - Immediate attention required',
            vital: 'temperature'
        });
    } else if (healthData.temperature > 100.4) {
        alerts.push({
            severity: 'medium',
            message: 'Fever detected',
            vital: 'temperature'
        });
    } else if (healthData.temperature < 95) {
        alerts.push({
            severity: 'high',
            message: 'Hypothermia risk - Low body temperature',
            vital: 'temperature'
        });
    }

    return alerts;
};

/**
 * Analyze trend across multiple readings
 */
exports.analyzeTrend = (healthDataArray) => {
    if (!healthDataArray || healthDataArray.length < 2) {
        return { trendAnalysis: 'Insufficient data for trend analysis' };
    }

    // Sort by date
    const sortedData = [...healthDataArray].sort((a, b) =>
        new Date(a.recordedAt) - new Date(b.recordedAt)
    );

    const trends = {
        bloodPressure: analyzeSingleTrend(sortedData.map(d => ({
            value: d.bloodPressure.systolic,
            date: d.recordedAt
        }))),
        heartRate: analyzeSingleTrend(sortedData.map(d => ({
            value: d.heartRate,
            date: d.recordedAt
        }))),
        spO2: analyzeSingleTrend(sortedData.map(d => ({
            value: d.spO2,
            date: d.recordedAt
        }))),
        temperature: analyzeSingleTrend(sortedData.map(d => ({
            value: d.temperature,
            date: d.recordedAt
        })))
    };

    return trends;
};

/**
 * Analyze trend for single vital
 */
const analyzeSingleTrend = (dataPoints) => {
    if (dataPoints.length < 2) return { trend: 'stable' };

    // Calculate simple moving average
    const values = dataPoints.map(d => d.value);
    const recentAvg = values.slice(-3).reduce((a, b) => a + b, 0) / Math.min(3, values.length);
    const olderAvg = values.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, values.length - 3);

    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;

    let trend = 'stable';
    if (percentChange > 10) {
        trend = 'increasing';
    } else if (percentChange < -10) {
        trend = 'decreasing';
    }

    return {
        trend,
        percentChange: percentChange.toFixed(1),
        recentAverage: recentAvg.toFixed(1),
        oldAverage: olderAvg.toFixed(1)
    };
};

/**
 * Get health recommendations based on risk analysis
 */
exports.getRecommendations = (riskAnalysis, healthData) => {
    const recommendations = [];

    if (riskAnalysis.riskLevel === 'critical') {
        recommendations.push('⚠️ Seek immediate medical attention');
        recommendations.push('Contact your doctor or visit emergency room');
    } else if (riskAnalysis.riskLevel === 'warning') {
        recommendations.push('⚠️ Schedule a consultation with your doctor soon');
        recommendations.push('Monitor your vitals more frequently');
    }

    // Specific recommendations based on vitals
    if (riskAnalysis.individualRisks.bloodPressure > 50) {
        recommendations.push('Reduce salt intake and manage stress');
        recommendations.push('Consider light exercise as recommended by doctor');
    }

    if (riskAnalysis.individualRisks.heartRate > 50) {
        recommendations.push('Practice relaxation techniques');
        recommendations.push('Avoid caffeine and strenuous activity');
    }

    if (riskAnalysis.individualRisks.spO2 > 50) {
        recommendations.push('Ensure proper ventilation');
        recommendations.push('Practice deep breathing exercises');
    }

    if (riskAnalysis.individualRisks.temperature > 50) {
        recommendations.push('Stay hydrated');
        recommendations.push('Rest and monitor temperature regularly');
    }

    if (recommendations.length === 0) {
        recommendations.push('✅ Your vitals are within normal range');
        recommendations.push('Continue maintaining a healthy lifestyle');
    }

    return recommendations;
};
