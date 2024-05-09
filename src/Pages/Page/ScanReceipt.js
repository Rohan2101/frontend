// import React, { useState } from 'react';

// const ScanReceipt = ({ onScan }) => {
//     const [isLoading, setIsLoading] = useState(false);

//     const handleScanReceipt = () => {
//         setIsLoading(true);
//         onScan(); // Placeholder function to simulate scanning process
//         setTimeout(() => {
//             setIsLoading(false);
//         }, 2000); // Simulate loading time for scanning
//     };

//     return (
//         <div className="scan-receipt-section">
//             <h2>Scan Your Receipt</h2>
//             <p>Scan your receipt to automatically add items to your inventory.</p>
//             <button onClick={handleScanReceipt} disabled={isLoading}>
//                 {isLoading ? 'Scanning...' : 'Scan Receipt'}
//             </button>
//             {isLoading && <div className="loading-animation">Loading...</div>}
//         </div>
//     );
// };

// export default ScanReceipt;


import React, { useState } from 'react';
import './ScanReceipt.css'; // Ensure you have a CSS file for ScanReceipt specific styles

const ScanReceipt = () => {
    const [isLoading, setIsLoading] = useState(false);

    const handleScanReceipt = () => {
        setIsLoading(true);
        // Simulate a scanning process
        setTimeout(() => {
            setIsLoading(false);
            // Here you can add the functionality to handle the actual receipt scanning logic
        }, 2000);
    };

    return (
        <div className="scan-receipt-section">
            <h2>Scan Your Receipt</h2>
            <p>Scan your receipt to automatically add items to your inventory.</p>
            <button onClick={handleScanReceipt} disabled={isLoading}>
                {isLoading ? 'Scanning...' : 'Scan Receipt'}
            </button>
            {isLoading && <div className="loading-animation">Loading...</div>}
        </div>
    );
};

export default ScanReceipt;

