import { SankeyData } from '../types';

export const sankeyData: SankeyData = {
    nodes: [
        { name: 'Imports' },
        { name: 'Production' },
        { name: 'Supply' },
        { name: 'Allocation' },
        { name: 'Losses' },
        { name: 'Stocks' },
        { name: 'Exports' },
        { name: 'Processing Use' },
        { name: 'Other' },
        { name: 'Ti Metal' },
        { name: 'TiO2 Pigment' },
    ],
    links: [
        // Supply
        { source: 0, target: 2, value: 300 }, // Imports -> Supply
        { source: 1, target: 2, value: 800 }, // Production -> Supply
        // Allocation
        { source: 2, target: 3, value: 1100 }, // Supply -> Allocation
        // Outputs from Allocation
        { source: 3, target: 4, value: 10 }, // Allocation -> Losses
        { source: 3, target: 5, value: 50 }, // Allocation -> Stocks
        { source: 3, target: 6, value: 200 }, // Allocation -> Exports
        { source: 3, target: 7, value: 840 }, // Allocation -> Processing Use
        // Split of Processing Use
        { source: 7, target: 8, value: 25 }, // Processing Use -> Other
        { source: 7, target: 9, value: 59 }, // Processing Use -> Ti Metal
        { source: 7, target: 10, value: 756 }, // Processing Use -> TiO2 Pigment
    ],
};
