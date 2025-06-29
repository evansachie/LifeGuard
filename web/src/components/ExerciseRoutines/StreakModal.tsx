import { useState, useEffect, useCallback } from 'react';
import {
  FaTrophy,
  FaCalendarCheck,
  FaCalendarAlt,
  FaExclamationCircle,
  FaFire,
} from 'react-icons/fa';
import Modal from '../Modal/Modal';
import exerciseService from '../../services/exerciseService';
import HeatMap from '@uiw/react-heat-map';
import Tooltip from '@uiw/react-tooltip';
import {
  eachDayOfInterval,
  format,
  isValid,
  parseISO,
  parse,
  differenceInCalendarDays,
} from 'date-fns';

interface WorkoutDay {
  date: string;
  workout_count: number;
  workout_types: string;
}

interface StreakStats {
  CurrentStreak?: number;
  LongestStreak?: number;
  LastWorkoutDate?: string;
  [key: string]: any;
}

interface StreakDataState {
  history: Array<any>;
  stats: StreakStats;
  workoutDays: WorkoutDay[];
  streakMilestones: Array<any>;
  current: number;
  longest: number;
}

interface HeatMapDataItem {
  date: string;
  count: number;
}

type Period = '7days' | '30days' | '90days';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

const StreakModal = ({ isOpen, onClose, isDarkMode }: StreakModalProps) => {
  const [period, setPeriod] = useState<Period>('7days');
  const [streakData, setStreakData] = useState<StreakDataState>({
    history: [],
    stats: {},
    workoutDays: [],
    streakMilestones: [],
    current: 0,
    longest: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStreakHistory = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await exerciseService.getStreakHistory(period);
      setStreakData(data as unknown as StreakDataState);
    } catch (error) {
      console.error('Error fetching streak history:', error);
      setError('Failed to load streak data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    if (isOpen) {
      fetchStreakHistory();
    }
  }, [isOpen, period, fetchStreakHistory]);

  const safeFormatDate = (dateInput: string | Date | undefined): string => {
    let dateObj: Date | undefined;

    if (!dateInput) {
      return 'N/A';
    }

    if (dateInput instanceof Date) {
      dateObj = dateInput;
    } else if (typeof dateInput === 'string') {
      if (dateInput.includes('/')) {
        dateObj = parse(dateInput, 'yyyy/MM/dd', new Date());
      } else {
        dateObj = parseISO(dateInput);
      }
    }

    if (!dateObj || !isValid(dateObj)) {
      console.warn('Invalid date encountered:', dateInput);
      return 'N/A';
    }

    return format(dateObj, 'yyyy/MM/dd');
  };

  const getFullHeatmapData = (
    workoutDays: WorkoutDay[],
    startDate: Date,
    endDate: Date
  ): HeatMapDataItem[] => {
    if (!isValid(startDate) || !isValid(endDate)) {
      console.warn('Invalid start/end date for heatmap:', startDate, endDate);
      return [];
    }

    const allDates = eachDayOfInterval({ start: startDate, end: endDate });
    const activityMap = new Map<string, number>();

    (workoutDays || []).forEach((day) => {
      if (!day.date) return;
      const dateObj = day.date.includes('/') ? new Date(day.date) : parseISO(day.date);

      if (!isValid(dateObj)) {
        console.warn('Invalid workout day.date:', day.date);
        return;
      }

      const date = safeFormatDate(dateObj);
      if (!date) return;

      activityMap.set(date, day.workout_count || 1);
    });

    return allDates
      .map((dateObj) => {
        if (!isValid(dateObj)) {
          console.warn('Invalid date in allDates:', dateObj);
          return null;
        }

        const date = safeFormatDate(dateObj);
        if (!date) return null;

        return {
          date,
          count: activityMap.get(date) || 0,
        };
      })
      .filter((item): item is HeatMapDataItem => item !== null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isDarkMode={isDarkMode}
      maxWidth="max-w-4xl"
      zIndex="z-[1000]"
      showCloseButton={true}
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Workout Streak Analysis
          </h2>
          <div className="flex gap-2">
            {(['7days', '30days', '90days'] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-blue-500 text-white'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {p === '7days' ? 'Last 7 Days' : p === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-t-blue-500 animate-spin" />
            <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading streak data...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <FaExclamationCircle className="text-2xl text-red-500" />
            </div>
            <p className={`mt-4 text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {error}
            </p>
            <button
              onClick={() => {
                setError(null);
                fetchStreakHistory();
              }}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (!Array.isArray(streakData.workoutDays) || streakData.workoutDays.length === 0) &&
          (!streakData.stats?.CurrentStreak || streakData.stats.CurrentStreak === 0) ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaCalendarCheck className="text-3xl text-gray-400" />
            </div>
            <p
              className={`mt-4 text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              No streak activity found for this period.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } flex items-center gap-4`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaFire className="text-2xl text-blue-500" />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Current Streak
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {streakData.stats?.CurrentStreak || 0} days
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } flex items-center gap-4`}
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <FaTrophy className="text-2xl text-amber-500" />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Longest Streak
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {streakData.stats?.LongestStreak || 0} days
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } flex items-center gap-4`}
              >
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <FaCalendarAlt className="text-2xl text-green-500" />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Active Days
                  </p>
                  <p
                    className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}
                  >
                    {streakData.workoutDays.length}
                  </p>
                </div>
              </div>

              <div
                className={`p-4 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                } flex items-center gap-4`}
              >
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <FaCalendarCheck className="text-2xl text-purple-500" />
                </div>
                <div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Last Workout
                  </p>
                  <p className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                    {streakData.stats?.LastWorkoutDate
                      ? new Date(streakData.stats.LastWorkoutDate).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`p-4 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} mb-6 flex flex-col items-center border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <h3
                className={`text-lg font-semibold mb-4 tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}
              >
                Streak Activity Heatmap
              </h3>
              <div
                className={`mb-2 text-sm font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-700'}`}
              >
                Total Active Days: {streakData.workoutDays.length}
              </div>
              <div className="w-full flex flex-col items-center">
                <div
                  className={`w-full overflow-auto ${isDarkMode ? 'heatmap-container-dark' : 'heatmap-container-light'}`}
                >
                  {(() => {
                    const validDates = (streakData.workoutDays || [])
                      .map(
                        (d) =>
                          d &&
                          d.date &&
                          (d.date.includes('/') ? new Date(d.date) : parseISO(d.date))
                      )
                      .filter((d): d is Date => d instanceof Date && isValid(d));

                    const today = new Date();
                    let startDate, endDate;
                    if (validDates.length > 0) {
                      const minDate = new Date(Math.min(...validDates.map((d) => d.getTime())));
                      const minRangeStart = new Date(today);
                      minRangeStart.setDate(today.getDate() - 29);
                      startDate = minDate < minRangeStart ? minDate : minRangeStart;
                      endDate = today;
                    } else {
                      startDate = new Date(today);
                      startDate.setDate(today.getDate() - 29);
                      endDate = today;
                    }
                    const daysInRange = differenceInCalendarDays(endDate, startDate);
                    const numWeeks = Math.ceil((daysInRange + 1) / 7); // Calculate number of weeks

                    const calculatedWidth = Math.min(700, numWeeks * 18 + 60); // Approx week width * space + labels

                    const fullHeatmapData = getFullHeatmapData(
                      streakData.workoutDays,
                      startDate,
                      endDate
                    );
                    if (
                      !fullHeatmapData ||
                      fullHeatmapData.length === 0 ||
                      !fullHeatmapData.some((d) => d.count > 0)
                    ) {
                      return (
                        <div className="text-gray-400 text-center py-8">
                          No activity in this period.
                        </div>
                      );
                    }
                    return (
                      <HeatMap
                        value={fullHeatmapData}
                        width={calculatedWidth}
                        rectSize={12}
                        space={3}
                        weekLabels={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}
                        startDate={startDate}
                        endDate={endDate}
                        panelColors={{
                          0: isDarkMode ? '#171d27' : '#ebedf0',
                          1: '#9be9a8',
                          2: '#40c463',
                          3: '#30a14e',
                          4: '#216e39',
                        }}
                        monthLabels={[
                          'Jan',
                          'Feb',
                          'Mar',
                          'Apr',
                          'May',
                          'Jun',
                          'Jul',
                          'Aug',
                          'Sep',
                          'Oct',
                          'Nov',
                          'Dec',
                        ]}
                        className={isDarkMode ? 'heatmap-dark' : 'heatmap-light'}
                        legendCellSize={0}
                        rectProps={{
                          rx: 2,
                          style: {
                            stroke: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            strokeWidth: 1,
                          },
                        }}
                        rectRender={(props, data) => {
                          return (
                            <Tooltip
                              placement="top"
                              content={`${data.date || 'N/A'}: ${data.count || 0} workout${data.count === 1 ? '' : 's'}`}
                            >
                              <rect {...props} />
                            </Tooltip>
                          );
                        }}
                        style={{
                          color: isDarkMode ? '#a0aec0' : '#4a5568',
                          fontSize: '10px',
                        }}
                      />
                    );
                  })()}
                </div>

                <div className="flex items-center gap-1 mt-3 text-xs">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Less</span>
                  {[
                    isDarkMode ? '#171d27' : '#ebedf0',
                    '#9be9a8',
                    '#40c463',
                    '#30a14e',
                    '#216e39',
                  ].map((color, index) => (
                    <span
                      key={color}
                      className={`w-3 h-3 rounded-sm inline-block ${
                        index === 0
                          ? isDarkMode
                            ? 'bg-heatmap-dark border border-white border-opacity-10'
                            : 'bg-heatmap-light border border-black border-opacity-10'
                          : index === 1
                            ? 'bg-heatmap-level1'
                            : index === 2
                              ? 'bg-heatmap-level2'
                              : index === 3
                                ? 'bg-heatmap-level3'
                                : 'bg-heatmap-level4'
                      }`}
                    ></span>
                  ))}
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>More</span>
                </div>
              </div>
              <style>{`
                /* Refine week label styles */
                .w-echarts-heatmap-week-label {
                  font-size: 9px !important;
                  fill: ${isDarkMode ? '#a0aec0' : '#4a5568'} !important;
                  alignment-baseline: central;
                }
                
                /* Ensure month labels have consistent color */
                .heatmap-dark text, .heatmap-light text {
                   fill: ${isDarkMode ? '#a0aec0' : '#4a5568'} !important;
                   font-size: 10px !important;
                }
                
                /* Ensure rects don't have unwanted default outlines */
                .heatmap-dark rect, .heatmap-light rect {
                  shape-rendering: geometricPrecision;
                }
                
                /* Custom color classes for heatmap levels */
                :root {
                  --heatmap-dark: #171d27;
                  --heatmap-light: #ebedf0;
                  --heatmap-level1: #9be9a8;
                  --heatmap-level2: #40c463;
                  --heatmap-level3: #30a14e;
                  --heatmap-level4: #216e39;
                }
                
                .bg-heatmap-dark { background-color: var(--heatmap-dark); }
                .bg-heatmap-light { background-color: var(--heatmap-light); }
                .bg-heatmap-level1 { background-color: var(--heatmap-level1); }
                .bg-heatmap-level2 { background-color: var(--heatmap-level2); }
                .bg-heatmap-level3 { background-color: var(--heatmap-level3); }
                .bg-heatmap-level4 { background-color: var(--heatmap-level4); }
              `}</style>
            </div>

            <div
              className={`rounded-xl overflow-hidden ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <table className="w-full">
                <thead>
                  <tr className={isDarkMode ? 'bg-gray-600' : 'bg-gray-100'}>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Workouts</th>
                    <th className="px-4 py-3 text-left">Types</th>
                    <th className="px-4 py-3 text-left">Streak Status</th>
                  </tr>
                </thead>
                <tbody>
                  {streakData.workoutDays.map((day) => (
                    <tr
                      key={day.date}
                      className={`border-t ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
                    >
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {safeFormatDate(day.date)}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {day.workout_count}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {day.workout_types}
                      </td>
                      <td className={`px-4 py-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            day.date === streakData.stats?.LastWorkoutDate
                              ? isDarkMode
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-green-100 text-green-800'
                              : isDarkMode
                                ? 'bg-gray-600 text-gray-300'
                                : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {day.date === streakData.stats?.LastWorkoutDate ? 'Latest' : 'Completed'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default StreakModal;
