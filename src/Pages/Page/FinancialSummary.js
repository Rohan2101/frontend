// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export const FinancialSummary = ({ financialData }) => {
//     return (
//         <div className="financial-summary-card">
//             <h3>Financial Summary</h3>
//             <PieChart width={400} height={400}>
//                 <Pie data={financialData} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label>
//                     {financialData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//             </PieChart>
//             <div className="financial-details">
//                 <p>Congratulations! You have saved ${financialData.find(d => d.name === 'Saved').value}.</p>
//                 <p>You have spent ${financialData.find(d => d.name === 'Spent').value}.</p>
//                 <p>Waste ${financialData.find(d => d.name === 'Wasted').value}.</p>
//                 <p>Waiting to be consumed ${financialData.find(d => d.name === 'Waiting to be consumed').value}.</p>
//             </div>
//         </div>
//     );
// };

// // export default FinancialSummary;



// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export const FinancialSummary = ({ financialData }) => {
//     return (
//         <div className="financial-summary-card">
//             <h3>Financial Summary</h3>
//             <PieChart width={400} height={400}>
//                 <Pie data={financialData} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label>
//                     {financialData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//             </PieChart>
//             <div className="financial-details">
//                 <p>Congratulations! You have saved ${financialData.find(d => d.name === 'Saved').value}.</p>
//                 <p>You have spent ${financialData.find(d => d.name === 'Spent').value}.</p>
//                 <p>Waste ${financialData.find(d => d.name === 'Wasted').value}.</p>
//                 <p>Waiting to be consumed ${financialData.find(d => d.name === 'Waiting to be consumed').value}.</p>
//             </div>
//         </div>
//     );
// };

// export default FinancialSummary;




// import React from 'react';
// import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

// const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// export const FinancialSummary = ({ financialData }) => {
//     return (
//         <div className="financial-summary-card">
//             <h3>Financial Summary</h3>
//             <PieChart width={400} height={400}>
//                 <Pie data={financialData} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label>
//                     {financialData.map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                     ))}
//                 </Pie>
//                 <Tooltip />
//                 <Legend />
//             </PieChart>
//             <div className="financial-details">
//                 <p>Congratulations! You have saved ${financialData.find(d => d.name === 'Saved').value}.</p>
//                 <p>You have spent ${financialData.find(d => d.name === 'Spent').value}.</p>
//                 <p>Wasted ${financialData.find(d => d.name === 'Wasted').value}.</p>
//                 <p>Potential Waste $${financialData.find(d => d.name === 'Potential Waste').value} (Based on nearing expiration).</p>
//             </div>
//         </div>
//     );
// };


import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export const FinancialSummary = ({ financialData }) => {
    return (
        <div className="financial-summary-card">
            <h3>Financial Summary</h3>
            <PieChart width={400} height={400}>
                <Pie data={financialData} cx={200} cy={200} outerRadius={80} fill="#8884d8" dataKey="value" label>
                    {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
            <div className="financial-details">
                <p>You have saved: ${financialData.find(d => d.name === 'Saved').value}</p>
                <p>Total Spent: ${financialData.find(d => d.name === 'Total Spent').value}</p>
                <p>Wasted: ${financialData.find(d => d.name === 'Wasted').value}</p>
                <p>Upcoming Waste: ${financialData.find(d => d.name === 'Upcoming Waste').value}</p>
            </div>
        </div>
    );
};
