import React from 'react';

export const loaders = {
    small:
        <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
        ></span>,
    table:
        <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '20vh' }}
        >
            <div className="spinner-border text-dark" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>,
    noDataTable:
        <div
            className="text-center my-5"
            style={{ fontSize: '22px', fontWeight: '700' }}
        >
            Data Not Found
        </div>
}