import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import Papa from "papaparse";
import { saveAs } from "file-saver";
import CustomDateFilterModal from '../../componet/modal/CustomDateFilter/CustomDateFilterModal';
import { IoChevronDownSharp } from 'react-icons/io5';

const Order = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);


    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [order, setOrder] = useState([]);

    const [modalShow, setModalShow] = useState({
        deleteorder: false,
    });

    const handleClose = () => {
        setModalShow({
            deleteorder: false,
        });
    }

    const filterorder = (order || []).filter((o) => {
        const searchTerm = search.toLowerCase();
        return (
            (o.name || "").toLowerCase().includes(searchTerm) ||
            (o.orderId || "").toString().toLowerCase().includes(searchTerm)
        );
    });

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filterorder.slice(startIndex, startIndex + perPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleRowsPerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        setCurrentPage(1);
    };

    const columns = [
        {
            name: 'No.',
            selector: (_, index) => (currentPage - 1) * perPage + (index + 1),
            width: '80px',
            style: {
                margin: '10px 0'
            }
        },
        // {
        //     name: 'Image',
        //     cell: (row) => (
        //         <img
        //             src={row.image === null ? UserImage : row.image}
        //             alt="Image"
        //             className={`${row.image === null && 'rounded-circle'}`}
        //             style={{
        //                 maxHeight: "80px",
        //                 maxWidth: "80px",
        //                 width: "100%",
        //                 height: "100%",
        //                 padding: '8px 0',
        //             }}
        //         />
        //     ),
        //     width: "180px",
        // },
        {
            name: 'Order Id',
            cell: (row) => row.orderId || "-",
            width: "12%",
        },
        {
            name: 'Name',
            cell: (row) => row.name || "-",
            width: "12%",
        },
        {
            name: 'Amount',
            cell: (row) => row.paymentDetails?.total
                ? `$${row.paymentDetails.total.toFixed(2)}`
                : "-",
            width: "12%",
        },
        {
            name: 'Status',
            cell: (row) => row.status || "-",
            width: "11%",
        },
        {
            name: 'Total Items',
            cell: (row) => (
                row.totalItems ? (
                    <span
                        onClick={() =>
                            navigate(`/admin/totalitem/${row.id}`, {
                                state: { items: row.items }
                            })
                        }
                        style={{
                            cursor: "pointer",
                            textDecoration: "underline"
                        }}
                    >
                        {row.totalItems}
                    </span>
                ) : (
                    "-"
                )
            ),
            width: "10%",
        },

// {
//     name: 'Description',
//     cell: (row) => (
//         row.description
//             ? <div dangerouslySetInnerHTML={{ __html: row.description }} />
//             : "-"
//     ),
//     width: "15%",
// },
{
            name: 'Created Date',
            cell: (row) => (
                CreatedDate(row.createdAt) || "-"
            ),
            minwidth: "80px",
            width: "18%"
        },
        {
            name: 'Action',
            cell: (row) =>
            (
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/order-details/${row?.id}`);
                        }}
                    >
                        <FaEye />
                    </button>
                </div>
            ),
            width: '100px'
        },
    ];

    const fetchOrder = async () => {
        setLoader(true);

        try {
            const res = await Axios.get(`${apiendpoints.order}`, authorizationHeaders());

            if (res.data?.status) {
                setOrder(res.data?.data?.orders || []);
            } else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                setError(err.message);
            }
            if (err.response?.status === 404) {
                setError(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                setError(err.response.data.message);
            }
        } finally {
            setLoader(false);
        }
    }


    useEffect(() => {
        fetchOrder();
    }, [])

    const handleExportCSV = async () => {
        try {
            const res = await Axios.get(apiendpoints.order, authorizationHeaders());

            if (res.data?.status) {
                const orders = res.data?.data?.orders || [];
                if (!orders.length) {
                    toast.error("No orders available to export!");
                    return;
                }

                // 🔽 Flatten each order + items
                const csvData = [];
                orders.forEach((order, index) => {
                    order.items.forEach((item, itemIndex) => {
                        csvData.push({
                            "S.No.": `${index + 1}.${itemIndex + 1}`, // unique row
                            "Order ID": order.orderId || "-",
                            "Customer Name": order.name || "-",
                            "Order Status": order.status || "-",
                            "Product ID": item.productId || "-",
                            "Product Title": item.title || "-",
                            "Selling Price": item.selling_price || "-",
                            "Quantity": item.quantity || "-",
                            "Item Total": item.totalPrice || "-",
                            "Order Subtotal": order.paymentDetails?.subtotal || "-",
                            "Order GST": order.paymentDetails?.gst || "-",
                            "Order Total": order.paymentDetails?.total || "-",
                            "Created Date": order.createdAt
                                ? new Date(order.createdAt).toLocaleString()
                                : "-",
                            "Item Status": item.status || "-",
                            "Product Images": item.images?.join(", ") || "-"
                        });
                    });
                });

                // ✅ Convert JSON → CSV
                const csv = Papa.unparse(csvData);

                // ✅ Download
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                saveAs(blob, "orders.csv");

                toast.success("Orders exported successfully!");
            } else {
                toast.error(res.data?.message || "Something went wrong!");
            }
        } catch (err) {
            console.error("Export-CSV-Error++", err);
            toast.error("Failed to export data");
        }
    };

    const handleFilter = (type) => {
        let startDate = "";
        let endDate = "";
        const today = new Date();

        const formatDate = (date) => {
            const d = new Date(date);
            const month = `${d.getMonth() + 1}`.padStart(2, "0");
            const day = `${d.getDate()}`.padStart(2, "0");
            const year = d.getFullYear();
            return `${year}/${month}/${day}`;
        };

        if (type === "thisWeek") {
            const day = today.getDay(); // 0 (Sun) - 6 (Sat)
            const sunday = new Date(today);
            sunday.setDate(today.getDate() - day);
            const saturday = new Date(sunday);
            saturday.setDate(sunday.getDate() + 6);

            startDate = formatDate(sunday);
            endDate = formatDate(saturday);

        } else if (type === "lastWeek") {
            const day = today.getDay();
            const lastSunday = new Date(today);
            lastSunday.setDate(today.getDate() - day - 7);
            const lastSaturday = new Date(lastSunday);
            lastSaturday.setDate(lastSunday.getDate() + 6);

            startDate = formatDate(lastSunday);
            endDate = formatDate(lastSaturday);

        } else if (type === "thisMonth") {
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            startDate = formatDate(firstDay);
            endDate = formatDate(lastDay);

        } else if (type === "lastMonth") {
            const firstDay = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);

            startDate = formatDate(firstDay);
            endDate = formatDate(lastDay);
        }

        // Call API with filtered dates
        fetchFilteredData(startDate, endDate);
    };

    const fetchFilteredData = async (startDate, endDate) => {
        try {
            // Build URL with query parameters in correct order
            let url = `${apiendpoints.order}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;

            const res = await Axios.get(url, authorizationHeaders()); // simple header call

            if (res.data?.status) {
                setOrder(res.data?.data?.orders || []);
            } else {
                toast.error(res.data?.message || "Failed to fetch data");
            }
        } catch (err) {
            console.error("Filter-API-Error++", err);
            toast.error("Failed to fetch data");
        }
    };


    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h3 className="mb-0 page-title">
                                        Orders
                                    </h3>
                                    <div className='d-flex gap-3 flex-column align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <div className="dropdown">
                                                <button
                                                    className="add-btn d-flex align-items-center gap-2"
                                                    onClick={() => {
                                                        setShowFilterDropdown(!showFilterDropdown)
                                                        setShowCustomDatePicker(false);
                                                        setCustomStartDate(null);  // 🔹 reset start date
                                                        setCustomEndDate(null);
                                                    }

                                                    }
                                                >
                                                    Filter<IoChevronDownSharp />
                                                </button>

                                                {showFilterDropdown && (
                                                    <div className="dropdown-menu show p-2">

                                                        <button className="dropdown-item" onClick={() => { handleFilter(""); setShowFilterDropdown(false); }}>All</button>
                                                        <button className="dropdown-item" onClick={() => { handleFilter("thisWeek"); setShowFilterDropdown(false); }}>This Week</button>
                                                        <button className="dropdown-item" onClick={() => { handleFilter("lastWeek"); setShowFilterDropdown(false); }}>Last Week</button>
                                                        <button className="dropdown-item" onClick={() => { handleFilter("thisMonth"); setShowFilterDropdown(false); }}>This Month</button>
                                                        <button className="dropdown-item" onClick={() => { handleFilter("lastMonth"); setShowFilterDropdown(false); }}>Last Month</button>
                                                        <button
                                                            className="dropdown-item"
                                                            onClick={() => {
                                                                setShowCustomDatePicker(true);
                                                                setShowFilterDropdown(false);
                                                                setCustomStartDate(null);
                                                                setCustomEndDate(null);
                                                            }}
                                                        >
                                                            Select Date
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ✅ Export Button */}
                                            <button
                                                className="add-btn"
                                                type="button"
                                                onClick={handleExportCSV}
                                            >
                                                Export CSV
                                            </button>
                                        </div>

                                    </div>
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
                                            filterDataLength={filterorder.length || 0}


                                            // ✅ real total from API
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

            {/* Custom Date Filter Modal */}
            <CustomDateFilterModal
                show={showCustomDatePicker}
                handleClose={() => setShowCustomDatePicker(false)}
                customStartDate={customStartDate}
                setCustomStartDate={setCustomStartDate}
                customEndDate={customEndDate}
                setCustomEndDate={setCustomEndDate}
                toast={toast}
                onApply={(start, end) => {
                    setSelectedStart(start);
                    setSelectedEnd(end);

                    fetchFilteredData(start, end);
                }}
            />

            {/* Delete-Company Modal */}
            {/* <Delete show={modalShow.deleteorder} handleClose={handleClose} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} role={"order"} /> */}
        </>
    )
}

export default Order