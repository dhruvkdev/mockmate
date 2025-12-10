import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
    const averageRating = total > 0
        ? (feedbackList.reduce((acc, item) => acc + (Number(item.rating) || 0), 0) / total).toFixed(1)
        : "N/A";

    return (
        <div className='p-6 bg-white border rounded-lg shadow-sm my-6 flex flex-col md:flex-row items-center gap-10'>
            <div className='flex-1 w-full h-[300px] relative pointer-events-none md:pointer-events-auto'>
                <ResponsiveContainer width="100%" height="100%">
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
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none'>
                    <h2 className='text-3xl font-bold'>{averageRating}</h2>
                    <p className='text-gray-500 text-sm'>Avg Rating</p>
                </div>
            </div>

            <div className='flex-1 flex flex-col gap-4'>
                <h2 className='text-xl font-bold'>Analysis</h2>
                {data.map((item, index) => (
                    <div key={index} className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded-full' style={{ backgroundColor: item.color }}></div>
                        <span className='text-gray-600'>{item.name}: {item.value}</span>
                    </div>
                ))}
                {total > 0 && <p className='text-sm text-gray-500 mt-2'>Based on {total} questions.</p>}
            </div>
        </div>
    )
}

export default FeedbackChart
