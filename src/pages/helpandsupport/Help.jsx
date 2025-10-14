import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import CustomDateFilterModal from '../../componet/modal/CustomDateFilter/CustomDateFilterModal';
import { IoChevronDownSharp } from 'react-icons/io5';
import Papa from "papaparse";
import { saveAs } from "file-saver";

const Help = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false);
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [selectedStart, setSelectedStart] = useState(null);
    const [selectedEnd, setSelectedEnd] = useState(null);

    const [pagination, setPagination] = useState({
        total: 0,
        perPage: 10,
        currentPage: 1,
        lastPage: 1,
    });

    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [help, setHelp] = useState([]);

    const [modalShow, setModalShow] = useState({
        deleteHelp: false,
    });

    const handleClose = () => {
        setModalShow({ deleteHelp: false });
    };

    const filterHelp = (help || []).filter((i) => {
        const searchstr = `${i.name} ${i.email} ${i.mobile_no}`.toLowerCase();
        return searchstr.includes(search.toLowerCase());
    });

    const columns = [
        {
            name: 'No.',
            selector: (_, index) =>
                (pagination.currentPage - 1) * pagination.perPage + (index + 1),
            width: '80px',
        },
        // {
        //     name: 'Image',
        //     cell: (row) => (
        //         <img
        //             src={row.image || ''}
        //             alt="Image"
        //             className={`${!row.image && 'rounded-circle'}`}
        //             style={{ maxHeight: '50px', height: '100%', padding: '8px 0' }}
        //         />
        //     ),
        //     width: '120px',
        // },
        {
            name: 'Name',
            cell: (row) => row.name || '-',
            width: '12%',
        },
        {
            name: 'Email & Mobile',
            cell: (row) => row.email_mobileNo || '-',
            width: '21%',
        },
        {
            name: 'Message',
            cell: (row) => (
                <div
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,   // 👈 only 2 lines
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal", // allow wrapping
                    }}
                >
                    {row.message || "-"}
                </div>
            ),
            width: '15%',
        },
        {
            name: 'Created Date',
            cell: (row) => CreatedDate(row.createdAt) || '-',
            width: '15%',
        },
        {
            name: 'Action',
            cell: (row) => (
                <div className="d-flex align-items-center">
                    <button
                        type="button"
                        className="btn btn-sm btn-neutral text-nowrap me-3 border"
                        // onClick={() =>
                        //     window.open(
                        //         "https://mail.google.com/mail/?view=cm&fs=1&to=support@example.com&su=Support&body=Hello",
                        //         "_blank"
                        //     )
                        // }
                    >
                        <FaEnvelope />
                    </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-neutral text-nowrap me-3 border"
                        onClick={() => navigate(`/admin/help-details/${row?.id}`)}
                    >
                        <FaEye />
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm btn-neutral text-nowrap border"
                        onClick={() => {
                            setModalShow({ ...modalShow, deleteHelp: true });
                            setDeleteId(row?.id);
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
            width: '130px',
        },
    ];

    const fetchHelp = async () => {
        setLoader(true);
        try {
            const res = await Axios.get(
                `${apiendpoints.help}?page=${pagination.currentPage}&perPage=${pagination.perPage}`,
                authorizationHeaders()
            );

            if (res.data?.status) {
                setHelp(res.data?.data?.data || []);
                setPagination(res.data?.data?.pagination || pagination);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        fetchHelp();
    }, [pagination.currentPage, pagination.perPage]);

    const handleDelete = async () => {
        setIsDeleteLoading(true);
        try {
            const res = await Axios.delete(
                apiendpoints.deleteHelp.replace(':id', deleteId),
                authorizationHeaders()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                handleClose();
                fetchHelp();
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Delete-Help-Error++', err);
        } finally {
            setIsDeleteLoading(false);
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
            let url = `${apiendpoints.help}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&page=${pagination.currentPage}&perPage=${pagination.perPage}`;

            const res = await Axios.get(url, authorizationHeaders()); // simple header call

            if (res.data?.status) {
                setHelp(res.data?.data?.data || []);
                setPagination(res.data?.data?.pagination || pagination);
            } else {
                toast.error(res.data?.message || "Failed to fetch data");
            }
        } catch (err) {
            toast.error("Failed to fetch data");
        }
    };

    // ✅ Export CSV function (calls API)
    const handleExportCSV = async () => {
        try {
            // Step 1: Get total count first
            const firstRes = await Axios.get(
                `${apiendpoints.help}?page=1&perPage=${pagination.perPage}`,
                authorizationHeaders()
            );

            if (!firstRes.data?.status) {
                toast.error(firstRes.data?.message);
                return;
            }

            const total = firstRes.data?.data?.pagination?.total || 0;
            if (!total) {
                toast.error("No data available to export!");
                return;
            }

            // Step 2: Fetch all data using total count
            const res = await Axios.get(
                `${apiendpoints.help}?page=1&perPage=${total}`,
                authorizationHeaders()
            );

            if (res.data?.status) {
                const allUsers = res.data?.data?.data || [];

                // ✅ Format for CSV (matching your API fields)
                const csvData = allUsers.map(user => ({
                    Name: user.name || "-",
                    Email: user.email || "-",
                    Mobile: user.mobile_no || "-",   // fixed → your table uses `mobile_no`
                    Message: user.message || "-",
                    CreatedDate: CreatedDate(user.createdAt) || "-"
                }));

                // ✅ Convert to CSV & download
                const csv = Papa.unparse(csvData);
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                saveAs(blob, "help-support.csv");

                toast.success("Help & Support exported successfully!");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            toast.error("Failed to export data");
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
                                    <h3 className="mb-0 page-title">Help & Support </h3>
                                    <div className='d-flex gap-3 flex-column align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <div className="dropdown">
                                                <button
                                                    className="add-btn d-flex gap-2 align-items-center"
                                                    type="button"
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
                                            <label htmlFor="dt-search-0" className="search-label">
                                                Search:
                                            </label>
                                            <input
                                                type="search"
                                                className="form-control form-control-sm search"
                                                id="dt-search-0"
                                                name="search"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {error ? (
                                    <div
                                        className="text-center text-dark my-5"
                                        style={{ fontSize: '22px', fontWeight: '700' }}
                                    >
                                        Data Not Found
                                    </div>
                                ) : (
                                    <DataTableComponents
                                        columns={columns}
                                        currentPageData={filterHelp} // ✅ use API response
                                        loader={loader}
                                        filterDataLength={pagination.total} // ✅ real total from API
                                        perPage={pagination.perPage}
                                        handleRowsPerPageChange={(newPerPage) =>
                                            setPagination((prev) => ({
                                                ...prev,
                                                perPage: newPerPage,
                                                currentPage: 1,
                                            }))
                                        }
                                        handlePageChange={(newPage) =>
                                            setPagination((prev) => ({ ...prev, currentPage: newPage }))
                                        }
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Delete
                show={modalShow.deleteHelp}
                handleClose={handleClose}
                isDeleteLoading={isDeleteLoading}
                handleDelete={handleDelete}
                role={'Help and Support'}
            />

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

        </>
    );
};

export default Help;
