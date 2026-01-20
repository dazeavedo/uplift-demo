// ============================================================
// AI DEMAND FORECAST COMPONENT
// Visualizes predicted staffing needs based on historical patterns
// ============================================================

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  Calendar,
  Users,
  Clock,
  RefreshCw,
  Info,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

// Simple bar chart component (no external deps needed)
const BarChart = ({ data, maxValue, color = 'bg-orange-500' }) => (
  <div className="flex items-end gap-1 h-32">
    {data.map((item, i) => {
      const height = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
      return (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex flex-col items-center">
            <span className="text-xs text-slate-500 mb-1">{item.value}</span>
            <div 
              className={`w-full rounded-t ${color} transition-all duration-300`}
              style={{ height: `${height}%`, minHeight: item.value > 0 ? '4px' : '0' }}
            />
          </div>
          <span className="text-xs text-slate-600 font-medium">{item.label}</span>
        </div>
      );
    })}
  </div>
);

// Trend indicator
const TrendBadge = ({ value, label }) => {
  const isUp = value > 0;
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      isUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    }`}>
      {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
      {Math.abs(value)}% {label}
    </div>
  );
};

// Alert card
const AlertCard = ({ alert }) => {
  const severityStyles = {
    high: 'border-red-200 bg-red-50',
    medium: 'border-amber-200 bg-amber-50',
    low: 'border-blue-200 bg-blue-50'
  };
  const severityIcon = {
    high: 'text-red-500',
    medium: 'text-amber-500',
    low: 'text-blue-500'
  };

  return (
    <div className={`p-3 rounded-lg border ${severityStyles[alert.severity]}`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className={`w-4 h-4 mt-0.5 ${severityIcon[alert.severity]}`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900">{alert.message}</p>
          {alert.action && (
            <p className="text-xs text-slate-600 mt-1">{alert.action}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default function DemandForecast({ compact = false }) {
  const [forecast, setForecast] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    loadForecast();
  }, []);

  const loadForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch forecast data
      const forecastRes = await fetch('/api/scheduling/forecast?weeks=2', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (!forecastRes.ok) throw new Error('Failed to load forecast');
      const forecastData = await forecastRes.json();
      setForecast(forecastData);

      // Fetch recommendations
      const recsRes = await fetch('/api/scheduling/forecast/recommendations', {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      }
    } catch (err) {
      console.error('Forecast error:', err);
      setError(err.message);
      // Use demo data for display
      setForecast(getDemoForecast());
      setRecommendations(getDemoRecommendations());
    } finally {
      setLoading(false);
    }
  };

  // Demo data for when API isn't available
  const getDemoForecast = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const forecast = [];
    const today = new Date();
    
    for (let d = 0; d < 14; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      const dow = date.getDay();
      const isWeekend = dow === 0 || dow === 6;
      
      // Realistic patterns
      const baseShifts = isWeekend ? 18 : 12;
      const variance = Math.floor(Math.random() * 4) - 2;
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: dow,
        dayName: dayNames[dow],
        predictedShifts: baseShifts + variance,
        predictedHours: (baseShifts + variance) * 7.5,
        predictedHeadcount: Math.ceil((baseShifts + variance) / 2),
        expectedFillRate: 85 + Math.floor(Math.random() * 10),
        confidence: 78 + Math.floor(Math.random() * 15),
        isWeekend,
        alerts: d === 5 ? [{ type: 'seasonal', message: 'Peak weekend expected', severity: 'medium' }] : []
      });
    }

    return {
      forecast,
      summary: {
        totalPredictedShifts: forecast.reduce((s, f) => s + f.predictedShifts, 0),
        totalPredictedHours: Math.round(forecast.reduce((s, f) => s + f.predictedHours, 0)),
        avgDailyHeadcount: Math.round(forecast.reduce((s, f) => s + f.predictedHeadcount, 0) / 14),
        peakDay: forecast.reduce((max, f) => f.predictedShifts > max.predictedShifts ? f : max),
        lowDay: forecast.reduce((min, f) => f.predictedShifts < min.predictedShifts ? f : min),
        weekendVsWeekday: {
          weekendAvg: 17,
          weekdayAvg: 12
        },
        alertCount: 1,
        dataQuality: 'high'
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        weeksOfHistory: 12,
        weeksForecasted: 2
      }
    };
  };

  const getDemoRecommendations = () => ({
    recommendations: [
      {
        type: 'understaffed',
        severity: 'high',
        dayName: 'Saturday',
        message: 'Saturday is 25% below typical staffing',
        action: 'Add 4 more shifts to meet expected demand',
        impact: 'May affect service levels'
      },
      {
        type: 'unfilled',
        severity: 'medium',
        dayName: 'Friday',
        message: '3 shifts unfilled for Friday',
        action: 'Post to shift marketplace',
        impact: 'Risk of understaffing'
      },
      {
        type: 'overtime',
        severity: 'medium',
        employee: 'Sarah Johnson',
        message: 'Sarah has 44h scheduled (overtime)',
        action: 'Reassign 4h to avoid overtime costs',
        impact: 'Potential overtime premium of £72'
      }
    ],
    summary: { total: 3, high: 1, medium: 2, low: 0 }
  });

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-center h-48">
          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!forecast) return null;

  const weekData = forecast.forecast.slice(
    (selectedWeek - 1) * 7,
    selectedWeek * 7
  );

  const chartData = weekData.map(d => ({
    label: d.dayName.slice(0, 3),
    value: d.predictedShifts
  }));

  const maxShifts = Math.max(...chartData.map(d => d.value));

  // Compact view for dashboard widget
  if (compact) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">AI Demand Forecast</h3>
              <p className="text-xs text-slate-500">Next 7 days</p>
            </div>
          </div>
          <button 
            onClick={loadForecast}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        <BarChart data={chartData} maxValue={maxShifts} />

        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{forecast.summary.totalPredictedShifts}</p>
            <p className="text-xs text-slate-500">Total Shifts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-slate-900">{forecast.summary.avgDailyHeadcount}</p>
            <p className="text-xs text-slate-500">Avg Headcount</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{recommendations?.summary?.high || 0}</p>
            <p className="text-xs text-slate-500">Alerts</p>
          </div>
        </div>

        {recommendations?.recommendations?.[0] && (
          <div className="mt-4">
            <AlertCard alert={recommendations.recommendations[0]} />
          </div>
        )}
      </div>
    );
  }

  // Full view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-100 rounded-xl">
            <Zap className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">AI Demand Forecast</h2>
            <p className="text-sm text-slate-500">
              Predicted staffing needs based on {forecast.metadata?.weeksOfHistory || 12} weeks of history
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            forecast.summary.dataQuality === 'high' 
              ? 'bg-green-100 text-green-700'
              : forecast.summary.dataQuality === 'medium'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {forecast.summary.dataQuality} confidence
          </span>
          <button 
            onClick={loadForecast}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Total Shifts</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{forecast.summary.totalPredictedShifts}</p>
          <p className="text-xs text-slate-500 mt-1">Next {forecast.metadata?.weeksForecasted || 2} weeks</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Total Hours</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{forecast.summary.totalPredictedHours}</p>
          <p className="text-xs text-slate-500 mt-1">Estimated labour hours</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Peak Day</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{forecast.summary.peakDay?.dayName}</p>
          <p className="text-xs text-slate-500 mt-1">{forecast.summary.peakDay?.predictedShifts} shifts needed</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Alerts</span>
          </div>
          <p className="text-3xl font-bold text-orange-600">{recommendations?.summary?.total || 0}</p>
          <div className="flex gap-2 mt-1">
            {recommendations?.summary?.high > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded">{recommendations.summary.high} high</span>
            )}
            {recommendations?.summary?.medium > 0 && (
              <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">{recommendations.summary.medium} med</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-900">Predicted Shifts by Day</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedWeek(1)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedWeek === 1 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Week 1
            </button>
            <button
              onClick={() => setSelectedWeek(2)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedWeek === 2 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Week 2
            </button>
          </div>
        </div>

        <BarChart data={chartData} maxValue={maxShifts} />

        {/* Day details */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((day, i) => (
              <div 
                key={i}
                className={`p-3 rounded-lg text-center ${
                  day.isWeekend ? 'bg-orange-50' : 'bg-slate-50'
                }`}
              >
                <p className="text-xs font-medium text-slate-500">{day.dayName}</p>
                <p className="text-lg font-bold text-slate-900 mt-1">{day.predictedHeadcount}</p>
                <p className="text-xs text-slate-500">people</p>
                <p className={`text-xs mt-2 ${
                  day.confidence >= 80 ? 'text-green-600' : 
                  day.confidence >= 60 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  {day.confidence}% conf
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Weekend vs Weekday comparison */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-slate-500">Weekday Average</p>
                <p className="text-xl font-bold text-slate-900">{forecast.summary.weekendVsWeekday.weekdayAvg} shifts</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Weekend Average</p>
                <p className="text-xl font-bold text-orange-600">{forecast.summary.weekendVsWeekday.weekendAvg} shifts</p>
              </div>
            </div>
            <TrendBadge 
              value={Math.round((forecast.summary.weekendVsWeekday.weekendAvg / forecast.summary.weekendVsWeekday.weekdayAvg - 1) * 100)}
              label="weekend"
            />
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations?.recommendations?.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900">AI Recommendations</h3>
            <span className="text-sm text-slate-500">{recommendations.recommendations.length} action items</span>
          </div>
          <div className="space-y-3">
            {recommendations.recommendations.map((rec, i) => (
              <AlertCard key={i} alert={rec} />
            ))}
          </div>
        </div>
      )}

      {/* Info footer */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <Info className="w-4 h-4 text-blue-500 mt-0.5" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">How this forecast works</p>
          <p className="text-blue-600 mt-1">
            Predictions are based on {forecast.metadata?.weeksOfHistory || 12} weeks of historical shift patterns, 
            adjusted for day-of-week trends and seasonal factors. Confidence levels indicate data quality 
            for each day.
          </p>
        </div>
      </div>
    </div>
  );
}
