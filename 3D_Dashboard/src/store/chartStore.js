import { create } from 'zustand'

export const useChartStore = create((set) => ({
  hoveredBar: null,
  setHoveredBar: (barIndex) => set({ hoveredBar: barIndex }),
  tooltipData: null,
  setTooltipData: (data) => set({ tooltipData: data }),
}))
