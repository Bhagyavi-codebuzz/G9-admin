// DataTable
import { createTheme } from "react-data-table-component";


// Theme
createTheme('blackTheme', {
    text: {
        primary: '#ffffff',
        secondary: '#b2b2b2',
    },
    background: {
        default: '#000000',
    },
    divider: {
        default: '#333333',
    },
    pagination: {
        background: '#000000',
        color: '#ffffff',
    },
    rows: {
        highlightOnHoverBackground: '#333333',
    },
});

// css
export const customStyles = {
    table: {
        style: {
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderBottom: 'none',
            borderCollapse: 'collapse',
        },
    },
    tableWrapper: {
        style: {
            borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // 👈 stays visible even on scroll
        },
    },
    header: {
        style: {
            backgroundColor: '#101316 !important',
        },
    },
    headCells: {
        style: {
            fontSize: '15px',
            fontWeight: '700',
        },
    },
    rows: {
        style: {
            borderBottom: '1px solid rgba(0,0,0,0.2)',
        },
    },
    cells: {
        style: {
            fontSize: '14px',
            fontWeight: '600',
            whiteSpace: 'pre-wrap !important'
        },
    },
    pagination: {
        style: {
            color: '#000',
            fontSize: '13px',
            fontWeight: '500',
        },
    },
};
