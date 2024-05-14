// export const calculateFinancialMetrics = (inventory) => {
//     let totalSpent = 0;
//     let saved = 0;
//     let wasted = 0;

//     inventory.forEach(item => {
//         if (item.status === 'waiting') {
//             totalSpent += parseFloat(item.spent);
//         } else if (item.status === 'saved') {
//             saved += parseFloat(item.spent);
//         } else if (item.status === 'wasted') {
//             wasted += parseFloat(item.spent);
//         }
//     });

//     const waitingToBeConsumed = totalSpent - (saved + wasted);

//     return {
//         totalSpent,
//         saved,
//         wasted,
//         waitingToBeConsumed
//     };
// };

//works
/////////////////////////////////////////


// export const updateFinancialMetrics = (inventory) => {
//     // Calculate financial metrics based on the current state of the inventory
//     let totalSpent = 0;
//     let saved = 0;
//     let wasted = 0;
//     let waitingToBeConsumed = 0;

//     inventory.forEach(item => {
//         totalSpent += parseFloat(item.spent);
//         if (item.status === 'saved') {
//             saved += parseFloat(item.spent);
//         } else if (item.status === 'wasted') {
//             wasted += parseFloat(item.spent);
//         } else {
//             waitingToBeConsumed += parseFloat(item.spent);
//         }
//     });

//     return {
//         totalSpent,
//         saved,
//         wasted,
//         waitingToBeConsumed
//     };
// };

// export const calculateFinancialMetrics = (inventory) => {
//     // Returns data for the pie chart visualization
//     const metrics = updateFinancialMetrics(inventory);
//     return [
//         { name: 'Saved', value: metrics.saved },
//         { name: 'Wasted', value: metrics.wasted },
//         { name: 'Waiting to be consumed', value: metrics.waitingToBeConsumed },
//         { name: 'Spent', value: metrics.totalSpent }
//     ];
// };




// export const calculateFinancialMetrics = (inventory) => {
//     let totalSpent = 0;
//     let saved = 0;
//     let wasted = 0;
//     let potentialWaste = 0;  // This will hold the sum of waste scores for items nearing expiration

//     inventory.forEach(item => {
//         totalSpent += parseFloat(item.spent);
//         if (item.status.message.startsWith('Expired')) {
//             wasted += parseFloat(item.spent);
//         }
//         // Add the wasteScore from each item to the potentialWaste total
//         potentialWaste += item.status.wasteScore * parseFloat(item.spent);
//     });

//     return [
//         { name: 'Saved', value: saved },
//         { name: 'Wasted', value: wasted },
//         { name: 'Potential Waste', value: potentialWaste.toFixed(2) },
//         { name: 'Spent', value: totalSpent }
//     ];
// };


// import { calculateStatus } from './inventory';

// export const calculateFinancialMetrics = (inventory) => {
//     let totalSpent = 0;
//     let saved = 0;
//     let wasted = 0;
//     let aboutToSave = 0;

//     inventory.forEach(item => {
//         totalSpent += parseFloat(item.spent);
//         const status = calculateStatus(item.expiryDate).message;
//         if (status.includes('Expired')) {
//             wasted += parseFloat(item.spent);
//         } else if (status.includes('Expires Today') || status.includes('d to Expire') || status.includes('Safe')) {
//             aboutToSave += parseFloat(item.spent);
//         }
//     });

//     return [
//         { name: 'Saved', value: saved },
//         { name: 'Wasted', value: wasted },
//         { name: 'About To Save', value: aboutToSave },
//         { name: 'Total Spent', value: totalSpent }
//     ];
// };


// ////////////////////////////////////////////////////////////////////////////////////


// export const logTransaction = (transactions, setTransactions, type, amount) => {
//     const newTransaction = { type, amount, date: new Date() };
//     const updatedTransactions = [...transactions, newTransaction];
//     setTransactions(updatedTransactions);
//     localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
// };

  
// export const calculateInitialMetrics = (transactions) => {
//     let totalSpent = 0;
//     transactions.forEach(transaction => {
//         totalSpent += transaction.amount;
//     });
//     return { totalSpent };
// };



import { calculateStatus } from './inventory';

export const calculateFinancialMetrics = (secondInventory) => {
    let totalSpent = 0;
    let saved = 0;
    let wasted = 0;
    let aboutToSave = 0;

    secondInventory.forEach(item => {
        totalSpent += parseFloat(item.spent);
        const status = calculateStatus(item.expiryDate).message;
        if (status.includes('Expired')) {
            wasted += parseFloat(item.spent);
        } else if (status.includes('Expires Today') || status.includes('d to Expire') || status.includes('Safe')) {
            aboutToSave += parseFloat(item.spent);
        }
    });

    return [
        { name: 'Saved', value: saved },
        { name: 'Wasted', value: wasted },
        { name: 'About To Save', value: aboutToSave },
        { name: 'Total Spent', value: totalSpent }
    ];
};

export const logTransaction = (transactions, setTransactions, type, amount) => {
    const newTransaction = { type, amount, date: new Date() };
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
};

export const calculateInitialMetrics = (transactions) => {
    let totalSpent = 0;
    transactions.forEach(transaction => {
        totalSpent += transaction.amount;
    });
    return { totalSpent };
};
