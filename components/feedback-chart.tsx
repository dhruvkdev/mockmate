import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface FeedbackChartProps {
    feedbackList: any[];
}

function FeedbackChart({ feedbackList }: FeedbackChartProps) {

    const calculateData = () => {
        let bad = 0;
        let average = 0;
        let good = 0;

        feedbackList.forEach(item => {
            const rating = Number(item.rating);
            if (rating < 5) bad++;
            else if (rating >= 5 && rating < 8) average++;
            else good++;
        });

        return [
            { name: 'Bad (<5)', value: bad, color: '#ef4444' }, // red-500
            { name: 'Average (5-7)', value: average, color: '#eab308' }, // yellow-500
            { name: 'Good (8+)', value: good, color: '#22c55e' } // green-500
        ].filter(item => item.value > 0);
    }

    const data = calculateData();
    const total = feedbackList.length;
    const numericAverage = total > 0
        ? (feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / total)
        : 0;
    const averageRating = total > 0 ? numericAverage.toFixed(2) : "N/A";

    // Mock data for Radar Chart based on average rating
    const radarData = [
        { subject: 'Professionalism', A: Math.min(10, Math.max(0, numericAverage + 1)), fullMark: 10 },
        { subject: 'Attitude', A: Math.min(10, Math.max(0, numericAverage + 0.5)), fullMark: 10 },
        { subject: 'Creativity', A: Math.min(10, Math.max(0, numericAverage - 1)), fullMark: 10 },
        { subject: 'Communication', A: Math.min(10, Math.max(0, numericAverage + 1.5)), fullMark: 10 },
        { subject: 'Leadership', A: Math.min(10, Math.max(0, numericAverage - 0.5)), fullMark: 10 },
        { subject: 'Teamwork', A: Math.min(10, Math.max(0, numericAverage + 0.8)), fullMark: 10 },
        { subject: 'Sociability', A: Math.min(10, Math.max(0, numericAverage + 0.2)), fullMark: 10 },
    ];

    const barData = feedbackList.map((item, index) => ({
        name: `Q${index + 1}`,
        rating: Number(item.rating) || 0,
        fullMark: 10
    }));

    return (
        <div id="feedback-chart" className='p-6 bg-white border rounded-lg shadow-sm my-6 flex flex-col md:flex-row items-center gap-10 flex-wrap'>
            {/* Pie Chart Section */}
            <div className='flex-1 min-w-[300px] h-[300px] relative pointer-events-none md:pointer-events-auto'>
                <h2 className='text-center font-bold mb-4'>Rating Distribution</h2>
                <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                        <Tooltip />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                <div className='absolute top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none'>
                    <h2 className='text-3xl font-bold'>{averageRating}</h2>
                    <p className='text-gray-500 text-sm'>Avg</p>
                </div>
            </div>

            {/* Radar Chart Section */}
            <div className='flex-1 min-w-[300px] h-[300px]'>
                <h2 className='text-center font-bold mb-4'>Interview Readiness</h2>
                <ResponsiveContainer width="100%" height="90%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis domain={[0, 10]} angle={30} stroke="#8884d8" />
                        <Radar
                            name="Mike"
                            dataKey="A"
                            stroke="#8884d8"
                            fill="#8884d8"
                            fillOpacity={0.6}
                        />
                        <Tooltip />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart Section */}
            <div className='flex-1 min-w-[300px] h-[300px]'>
                <h2 className='text-center font-bold mb-4'>Rating Per Question</h2>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart
                        data={barData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="rating" fill="#8884d8" barSize={30} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    )
}

export default FeedbackChart
