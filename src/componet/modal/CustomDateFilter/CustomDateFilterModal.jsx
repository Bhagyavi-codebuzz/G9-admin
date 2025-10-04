import React from "react";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDateFilterModal = ({
    show,
    handleClose,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    toast,
    onApply
}) => {
    const formatDate = (date) => {
        const d = new Date(date);
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const year = d.getFullYear();
        return `${year}/${month}/${day}`;
    };

    return (
        <Modal className="form" show={show} backdrop="static" centered>
            <div className="modal-header">
                <h5 className="modal-title m-auto mb-3">Select Date Range</h5>
            </div>

            <div className="modal-body">
                <div className="d-flex gap-2 align-items-center justify-content-center mb-3">
                    <DatePicker
                        selected={customStartDate}
                        onChange={(date) => setCustomStartDate(date)}
                        placeholderText="Start Date"
                        dateFormat="yyyy/MM/dd"
                        maxDate={new Date()}
                        className="form-control"
                    />
                    <DatePicker
                        selected={customEndDate}
                        onChange={(date) => setCustomEndDate(date)}
                        placeholderText="End Date"
                        dateFormat="yyyy/MM/dd"
                        minDate={customStartDate}
                        maxDate={new Date()}
                        className="form-control"
                    />
                </div>

                <div className="mt-4 d-flex justify-content-end gap-3">



                    <button
                        type="button"
                        className="delete-btn"
                        onClick={() => {
                            setCustomStartDate(null);
                            setCustomEndDate(null);
                            handleClose();
                        }}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="close-btn"
                        onClick={() => {
                            if (customStartDate && customEndDate) {
                                const start = formatDate(customStartDate);
                                const end = formatDate(customEndDate);
                                onApply(start, end);
                                handleClose();
                            } else {
                                toast.error("Please select both start and end date");
                            }
                        }}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CustomDateFilterModal;
