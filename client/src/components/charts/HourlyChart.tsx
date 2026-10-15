import React from 'react';
import { HourlyDistribution } from '../../shared/types/chat';

interface HourlyChartProps {
  distribution: HourlyDistribution[];
}

export const HourlyChart: React.FC<HourlyChartProps> = ({ distribution }) => {
  const maxCount = Math.max(...distribution.map(d => d.count), 1);

  return (
    <div className="bg-[#FFFEFA] rounded-2xl border border-[#E3E1D9] p-6 lg:p-8 space-y-4 shadow-xs">
      <div className="flex justify-between items-center border-b border-[#E3E1D9] pb-3">
        <div>
          <h4 className="text-base font-bold text-[#242923]">Time-of-Day Activity Pattern</h4>
          <p className="text-xs text-[#7F8A7D]">Message distribution across 24 hours</p>
        </div>
      </div>

      <div className="pt-4">
        {/* Bar Chart Container */}
        <div className="flex items-end gap-1 sm:gap-1.5 h-36 w-full pt-4">
          {distribution.map((item) => {
            const heightPercent = Math.max(6, Math.round((item.count / maxCount) * 100));
            const isPeak = item.count > 0 && item.count === maxCount;

            return (
              <div
                key={item.hour}
                className="flex-1 flex flex-col items-center group relative h-full justify-end"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-8 hidden group-hover:flex flex-col items-center z-10 pointer-events-none">
                  <div className="bg-[#242923] text-[#FFFEFA] text-[10px] px-2 py-1 rounded shadow-xs whitespace-nowrap">
                    {item.hour}:00 — {item.count} msgs ({item.percentage}%)
                  </div>
                </div>

                {/* Vertical Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t transition-all ${
                    isPeak
                      ? 'bg-[#304A34]'
                      : item.count > 0
                      ? 'bg-[#718B65] group-hover:bg-[#304A34]'
                      : 'bg-[#E3E1D9]'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Hour Axis Labels */}
        <div className="flex justify-between text-[10px] text-[#7F8A7D] pt-2 border-t border-[#E3E1D9] mt-2">
          <span>12 AM</span>
          <span>4 AM</span>
          <span>8 AM</span>
          <span>12 PM</span>
          <span>4 PM</span>
          <span>8 PM</span>
          <span>11 PM</span>
        </div>
      </div>
    </div>
  );
};
