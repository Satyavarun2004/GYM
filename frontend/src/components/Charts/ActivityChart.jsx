import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = ({ data = [] }) => {
    // Process data to show Day names if dates are provided
    const chartData = data.map(item => ({
        ...item,
        name: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : item.name
    }));

    if (chartData.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center text-dark-muted font-bold text-sm uppercase tracking-widest">
                No activity data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorSteps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                    dy={10}
                />
                <YAxis hide />
                <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#8B5CF6' }}
                    cursor={{ stroke: '#8B5CF6', strokeWidth: 2 }}
                />
                <Area
                    type="monotone"
                    dataKey="steps"
                    stroke="#8B5CF6"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorSteps)"
                    animationDuration={2000}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default ActivityChart;
