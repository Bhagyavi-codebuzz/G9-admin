import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import Modal from 'react-bootstrap/Modal'; 
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css'; // Add this import at the top to ensure styles load

// Define status order and allowed transitions
const statusOrder = [
    'Pending',
    'Accepted',
    'On-processing',
    'On the way',
    'Delivered'
];

// Final states: Rejected, Cancelled (Delivered is now treated as terminal, not final in the array but handled separately)
const finalStatuses = ['Rejected', 'Cancelled'];

const getAllowedOptions = (currentStatus) => {
    if (finalStatuses.includes(currentStatus) || currentStatus === 'Delivered') {
        return []; // No options for final states or Delivered
    }

    const currentIndex = statusOrder.indexOf(currentStatus);
    if (currentIndex === -1) return [];

    // Start with current status and all following ones
    let options = statusOrder.slice(currentIndex);

    // Only allow "Rejected" before order is accepted
    if (currentStatus === 'Pending') {
        options = ['Pending', 'Rejected', ...options.slice(1)];
    } 
    // Once accepted or beyond, no Rejected option
    else if (['Accepted', 'On-processing', 'On the way'].includes(currentStatus)) {
        // do nothing — just keep the forward statuses
    }

    return options;
};

const TotalItems = () => {
    const location = useLocation();
    const [totalItems, setTotalItems] = useState(location.state?.items || []);

    const { id } = useParams();

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'Rejected' or 'On-processing'
    const [rejectionReason, setRejectionReason] = useState('');
    const [processingInput, setProcessingInput] = useState(''); 
    const [selectedRow, setSelectedRow] = useState(null); 
    const [modalLoading, setModalLoading] = useState(false);

    const filtertotalItems = Array.isArray(totalItems)
        ? totalItems.filter((i) => {
            const searchstr = (i?.title || "").toLowerCase();
            return searchstr.includes(search.toLowerCase());
        })
        : [];

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filtertotalItems.slice(startIndex, startIndex + perPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    // Open modal for special statuses
    const openModal = (type, row) => {
        setModalType(type);
        setSelectedRow(row);
        setRejectionReason('');
        setProcessingInput('');
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setModalType('');
        setSelectedRow(null);
        setModalLoading(false);
    };

    // Submit modal and call API
    const handleModalSubmit = async () => {
        if (!selectedRow) return;

        let payload = {
            orderId: Number(id),
            purityValue: selectedRow.purity.value,
            productId: selectedRow.productId,
            status: modalType,
        };

        if (modalType === 'Rejected') {
            if (!rejectionReason.trim()) {
                toast.error('Please enter rejection reason');
                return;
            }
            payload.message = rejectionReason; 
        } else if (modalType === 'On-processing') {
            if (!processingInput.trim()) {
                toast.error('Please enter processing details');
                return;
            }
            payload.message = processingInput; 
        }

        setModalLoading(true);

        try {
            const res = await Axios.post(apiendpoints.orderStatus, payload, authorizationHeaders());

            if (res.data?.status) {
                toast.success(res.data?.message);

                // Update state
                setTotalItems((prev) =>
                    prev.map((item) =>
                        item.productId === selectedRow.productId
                            ? { ...item, status: modalType }
                            : item
                    )
                );

                closeModal();
            } else {
                toast.error(res.data?.message);
            }
        } catch (error) {
            toast.error("Error updating status");
            console.error(error);
        } finally {
            setModalLoading(false);
        }
    };

    const columns = [
        {
            name: 'No.',
            selector: (_, index) => (currentPage - 1) * perPage + (index + 1),
            width: '90px',
            style: {
                margin: '10px 0'
            }
        },
        {
            name: 'Title',
            cell: (row) => row.title || "-",
            width: "11%",
        },
        {
            name: 'Color',
            cell: (row) => row.media?.[0]?.name || "-",
            width: "11%",
        },
        {
            name: 'Purity',
            cell: (row) => row.purity.name || "-",
            width: "11%",
        },
        {
            name: 'Quantity',
            cell: (row) => row.quantity || "-",
            width: "11%",
        },
        {
            name: 'Unit Price',
            cell: (row) => row.price || "-",
            width: "11%",
        },
        {
            name: 'Total Price',
            cell: (row) => row.subtotal || "-",
            width: "11%",
        },
        {
            name: 'Status',
            cell: (row) => {
                const [localStatus, setLocalStatus] = useState(row.status);

                useEffect(() => {
                    setLocalStatus(row.status);
                }, [row.status]);

                const allowedOptions = getAllowedOptions(localStatus);

                // If final status, Delivered, or no options, show disabled select with single option
                if (finalStatuses.includes(localStatus) || localStatus === 'Delivered' || allowedOptions.length === 0) {
                    return (
                        <select
                            value={localStatus}
                            disabled
                            style={{
                                padding: "4px 6px",
                                borderRadius: "4px",
                                border: "1px solid #ccc",
                                backgroundColor: "#e9ecef",
                                opacity: 0.65
                            }}
                        >
                            <option value={localStatus}>{localStatus}</option>
                        </select>
                    );
                }

                return (
                    <select
                        value={localStatus}
                        onChange={(e) => {  
                            const newStatus = e.target.value;

                            if (newStatus === 'Rejected' || newStatus === 'On-processing') {
                                e.target.value = localStatus;
                                openModal(newStatus, row);
                                return;
                            }

                            (async () => {
                                try {
                                    const res = await Axios.post(
                                        apiendpoints.orderStatus,
                                        {
                                            orderId: Number(id),
                                            purityValue: row.purity.value,
                                            productId: row.productId,
                                            status: newStatus,
                                        },
                                        authorizationHeaders()
                                    );

                                    if (res.data?.status) {
                                        toast.success(res.data?.message || 'Status updated successfully');
                                        setTotalItems((prev) =>
                                            prev.map((item) =>
                                                item.productId === row.productId
                                                    ? { ...item, status: newStatus }
                                                    : item
                                            )
                                        );
                                        setLocalStatus(newStatus);
                                    } else {
                                        toast.error(res.data?.message || 'Update failed');
                                        e.target.value = localStatus;
                                    }
                                } catch (error) {
                                    toast.error("Error updating status");
                                    e.target.value = localStatus; 
                                }
                            })();
                        }}
                        style={{
                            padding: "4px 6px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    >
                        {allowedOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                );
            },
            width: "14%",
        }
    ];

    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h2 className="d-flex mb-0 title">
                                        <div className='pe-4' style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                                            <img src={left} alt="" style={{ height: '30px' }} />
                                        </div>
                                        <div>
                                            Total Items
                                        </div>
                                    </h2>
                                </div>
                            </div>

                            <div className="card-body table-responsive">
                                <div className="row mt-2 mb-2 justify-content-between">
                                    <div className="col-md-auto search ms-auto">
                                        <div className="dt-search d-flex align-items-center gap-1">
                                            <label htmlFor="dt-search-0" className='search-label'>
                                                Search:
                                            </label>
                                            <input
                                                type="search"
                                                className="form-control form-control-sm search"
                                                id="dt-search-0"
                                                name='search'
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {
                                    error ? (
                                        <div className="text-center text-dark my-5" style={{ fontSize: '22px', fontWeight: '700' }}>
                                            Data Not Found
                                        </div>
                                    ) : (
                                        <DataTableComponents
                                            columns={columns}
                                            currentPageData={currentPageData}
                                            loader={loader}
                                            filterDataLength={filtertotalItems.length || 0}
                                            perPage={perPage}
                                            handleRowsPerPageChange={handleRowsPerPageChange}
                                            handlePageChange={handlePageChange}
                                        />
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for Rejected and On-processing */}
            <Modal show={showModal} onHide={closeModal} centered backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalType === 'Rejected' ? 'Reject Order Item' : 'Set On-Processing'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalType === 'Rejected' ? (
                        <Form.Group>
                            <Form.Label>Rejection Reason</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                placeholder="Enter reason for rejection"
                            />
                        </Form.Group>
                    ) : modalType === 'On-processing' ? (
                        <Form.Group>
                            <Form.Label>Processing Details</Form.Label>
                            <Form.Control
                                type="text"
                                value={processingInput}
                                onChange={(e) => setProcessingInput(e.target.value)}
                                placeholder="Enter details"
                            />
                        </Form.Group>
                    ) : null}
                </Modal.Body>
                <Modal.Footer>
                    <button type='button' className="delete-btn" onClick={closeModal} disabled={modalLoading}>
                        Cancel
                    </button>
                    <button type='button' onClick={handleModalSubmit} disabled={modalLoading} className={`close-btn ${modalLoading ? "btn-loading" : ""}`}>
                        {modalLoading ? 'Submitting...' : 'Submit'}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default TotalItems