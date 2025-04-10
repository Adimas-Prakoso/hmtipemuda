'use client';

import { useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

export default function ChartJSInitializer() {
  useEffect(() => {
    // Register ChartJS components
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      zoomPlugin
    );
  }, []);

  // This component doesn't render anything
  return null;
}
