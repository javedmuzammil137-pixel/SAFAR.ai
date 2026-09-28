import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface BudgetBreakdownChartProps {
  foodTotal: number;
  ticketsTotal: number;
  transportTotal: number;
  remainingSurplus: number;
  totalBudget: number;
}

export const BudgetBreakdownChart: React.FC<BudgetBreakdownChartProps> = ({
  foodTotal,
  ticketsTotal,
  transportTotal,
  remainingSurplus,
  totalBudget,
}) => {
  const grandTotal = foodTotal + ticketsTotal + transportTotal;
  const isSurplus = remainingSurplus > 0;

  const data = {
    labels: ['Food & Chai', 'Transport & Rides', 'Tickets & Activities', ...(isSurplus ? ['Surplus Left'] : [])],
    datasets: [
      {
        data: isSurplus
          ? [foodTotal, transportTotal, ticketsTotal, remainingSurplus]
          : [foodTotal, transportTotal, ticketsTotal],
        backgroundColor: isSurplus
          ? ['#F97316', '#0D9488', '#6366F1', '#10B981']
          : ['#F97316', '#0D9488', '#6366F1'],
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const val = context.parsed || 0;
            return ` PKR ${val.toLocaleString()}`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-bold text-slate-900">Budget Cost Allocation</h4>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          Total: PKR {totalBudget.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Doughnut Chart */}
        <div className="relative w-28 h-28 shrink-0">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] text-slate-400 uppercase font-medium">Spent</span>
            <span className="text-xs font-bold text-slate-800 tabular-nums">
              PKR {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Legend / Metrics */}
        <div className="flex-1 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F97316]" />
              Food & Chai
            </span>
            <span className="font-semibold text-slate-800 tabular-nums">
              Rs. {foodTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
              Transport
            </span>
            <span className="font-semibold text-slate-800 tabular-nums">
              Rs. {transportTotal.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6366F1]" />
              Tickets & Entry
            </span>
            <span className="font-semibold text-slate-800 tabular-nums">
              Rs. {ticketsTotal.toLocaleString()}
            </span>
          </div>

          {isSurplus && (
            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                Remaining Surplus
              </span>
              <span className="font-bold text-emerald-700 tabular-nums">
                Rs. {remainingSurplus.toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
