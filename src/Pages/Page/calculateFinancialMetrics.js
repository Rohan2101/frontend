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


export const updateFinancialMetrics = (inventory) => {
    // Calculate financial metrics based on the current state of the inventory
    let totalSpent = 0;
    let saved = 0;
    let wasted = 0;
    let waitingToBeConsumed = 0;

    inventory.forEach(item => {
        totalSpent += parseFloat(item.spent);
        if (item.status === 'saved') {
            saved += parseFloat(item.spent);
        } else if (item.status === 'wasted') {
            wasted += parseFloat(item.spent);
        } else {
            waitingToBeConsumed += parseFloat(item.spent);
        }
    });

    return {
        totalSpent,
        saved,
        wasted,
        waitingToBeConsumed
    };
};

export const calculateFinancialMetrics = (inventory) => {
    // Returns data for the pie chart visualization
    const metrics = updateFinancialMetrics(inventory);
    return [
        { name: 'Saved', value: metrics.saved },
        { name: 'Wasted', value: metrics.wasted },
        { name: 'Waiting to be consumed', value: metrics.waitingToBeConsumed },
        { name: 'Spent', value: metrics.totalSpent }
    ];
};


