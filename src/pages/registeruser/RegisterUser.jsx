import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { InputSwitch } from 'primereact/inputswitch';
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import DatePicker from "react-datepicker";
import CustomDateButton from '../../componet/CustomDateButton/CustomDateButton';
import CustomDateFilterModal from '../../componet/modal/CustomDateFilter/CustomDateFilterModal';
import { IoChevronDownSharp } from 'react-icons/io5';

const RegisterUser = () => {
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

  const [pagination, setPagination] = useState({
    perPage: 10,
    currentPage: 1,
    lastPage: 1,
  });

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [registerUser, setRegisterUser] = useState([]);

  const [modalShow, setModalShow] = useState({
    deleteRegisterUser: false,
  });

  const handleClose = () => {
    setModalShow({
      deleteRegisterUser: false,
    });
  }

  const filterRegisterUser = (registerUser || []).filter((i) => {
    const searchstr = `${i.name} ${i.email} ${i.Mobile_number}`.toLowerCase();
    return searchstr.includes(search.toLowerCase());
  });

  const startIndex = (currentPage - 1) * perPage;
  const currentPageData = filterRegisterUser.slice(startIndex, startIndex + perPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  };

  // ✅ Export CSV function (calls API)
  const handleExportCSV = async () => {
    try {
      const firstRes = await Axios.get(
        `${apiendpoints.registerUser}?page=1&perPage=${pagination.perPage}`,
        authorizationHeaders()
      );

      if (!firstRes.data?.status) {
        toast.error(firstRes.data?.message || "Failed to fetch export data");
        return;
      }

      const total = firstRes.data?.data?.pagination?.total || 0;
      if (!total) {
        toast.error("No data available to export!");
        return;
      }

      // 🔽 call again with total count (dynamic, not 10000)
      const res = await Axios.get(
        `${apiendpoints.registerUser}?page=1&perPage=${total}`,
        authorizationHeaders()
      );

      if (res.data?.status) {
        const allUsers = res.data?.data?.data || [];

        // Format for CSV
        const csvData = allUsers.map(user => ({
          Name: user.name || "-",
          Email: user.email || "-",
          Mobile: user.Mobile_number || "-",
          RegistrationType: user.registrationType || "-",
          Status:
            user.status === true ||
              user.status === "Active" ||
              user.status === 1
              ? "Active"
              : "Inactive"
        }));

        // Convert to CSV & download
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "register-users.csv");
        toast.success("Register users exported successfully!");
      } else {
        toast.error(res.data?.message || "Failed to fetch export data");
      }
    } catch (err) {
      console.error("Export-CSV-Error++", err);
      toast.error("Failed to export data");
    }
  };


  const columns = [
    {
      name: 'No.',
      selector: (_, index) => (currentPage - 1) * perPage + (index + 1),
      width: '80px',
    },
    {
      name: 'Name',
      cell: (row) => row.name || "-",
      width: "11%",
    },
    {
      name: 'Email',
      cell: (row) => (
        <div className='d-flex flex-column gap-2'>
          <div>{row.email || "-"}</div>
          {/* <div>{row.Mobile_number || "-"}</div> */}
        </div>
      ),
      width: "15%",
    },
    {
      name: 'Mobile',
      cell: (row) => row.Mobile_number || "-",
      width: "12%",
    },
    {
      name: 'Regi. Type',
      cell: (row) => row.registrationType || "-",
      width: "10%",
    },
    {
      name: 'Total Order',
      cell: (row) => (
        row.orderCount > 0 ? (
          <Link
            to={`/admin/user-totalorder/${row.userId}`}
            style={{
              textDecoration: 'underline',
              color: 'black'
            }}
          >
            {row.orderCount}
          </Link>
        ) : (
          <span>{"-"}</span>
        )
      ),
      width: "8%",
    },
    {
      name: 'Created Date',
      cell: (row) => (
        CreatedDate(row.createdAt) || "-"
      ),
      minwidth: "80px",
      width: "15%"
    },
    {
      name: 'Status',
      cell: (row) => (
        <InputSwitch
          checked={row.status === true || row.status === "Active" || row.status === 1}
          onChange={() => handleStatusToggle(row.userId, row.status)}
        />
      ),
      width: "7%",
    },
    {
      name: 'Action',
      cell: (row) => (
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
            onClick={() => {
              navigate(`/admin/registerUser-details/${row?.userId}`);
            }}
          >
            <FaEye />
          </button>

          <button
            type="button"
            className="btn btn-sm btn-neutral text-nowrap eye-icon border"
            onClick={() => {
              setModalShow({ ...modalShow, deleteRegisterUser: true });
              setDeleteId(row?.userId);
            }}
          >
            <FaTrash />
          </button>
        </div>
      ),
      width: '130px'
    },
  ];

  const handleStatusToggle = async (id, currentStatus) => {
    const isActive = currentStatus === true || currentStatus === "Active" || currentStatus === 1;
    const newStatus = !isActive;

    try {
      const res = await Axios.post(
        apiendpoints.updateStatus.replace(":id", id),
        {},
        authorizationHeaders()
      );

      if (res.data?.status) {
        toast.success("Status updated successfully");
        setRegisterUser((prev) =>
          prev.map((item) =>
            item.userId === id ? { ...item, status: newStatus } : item
          )
        );
      } else {
        toast.error(res.data?.message || "Failed to update status");
        setRegisterUser((prev) =>
          prev.map((item) =>
            item.userId === id ? { ...item, status: isActive } : item
          )
        );
      }
    } catch (err) {
      console.error("Status-Toggle-Error++", err);
      toast.error("Failed to update status");
      setRegisterUser((prev) =>
        prev.map((item) =>
          item.userId === id ? { ...item, status: isActive } : item
        )
      );
    }
  };

  const fetchRegisterUser = async () => {
    setLoader(true);
    try {
      const res = await Axios.get(
        `${apiendpoints.registerUser}?page=${pagination.currentPage}&perPage=${pagination.perPage}`,
        authorizationHeaders()
      );

      if (res.data?.status) {
        setRegisterUser(res.data?.data?.data || []);
        setPagination(res.data?.data?.pagination || pagination);
      } else {
        toast.error(res.data?.message);
      }
    } catch (err) {
      if (err?.message === "Network Error") {
        setError(err.message);
      } else if (err.response?.status === 404 || err.response?.status === 500) {
        setError(err.response.data.message);
      }
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (selectedStart && selectedEnd) {
      fetchFilteredData(selectedStart, selectedEnd);
    } else {
      fetchRegisterUser();
    }
  }, [pagination.currentPage, pagination.perPage]);


  const handleDelete = async () => {
    setIsDeleteLoading(true);
    try {
      const res = await Axios.delete(
        apiendpoints.deleteRegisterUser.replace(":id", deleteId),
        authorizationHeaders()
      );

      if (res.data?.status) {
        toast.success(res.data?.message);
        handleClose();
        fetchRegisterUser();
        setRegisterUser((prev) => prev.filter((i) => i.id !== deleteId));
      } else {
        toast.error(res.data?.message);
      }
    } catch (err) {
      console.error("Delete-RegisterUser-Error++", err);
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
      let url = `${apiendpoints.registerUser}?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}&page=${pagination.currentPage}&perPage=${pagination.perPage}`;

      const res = await Axios.get(url, authorizationHeaders()); // simple header call

      if (res.data?.status) {
        setRegisterUser(res.data?.data?.data || []);
        setPagination(res.data?.data?.pagination || pagination);
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
                  <h3 className="mb-0 page-title">Register Users</h3>

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
                    {/* {showCustomDatePicker && (
                      <div className="d-flex gap-2 align-items-center">
                        <DatePicker
                          selected={customStartDate}
                          onChange={(date) => setCustomStartDate(date)}
                          placeholderText="Start Date"
                          dateFormat="yyyy/MM/dd"
                          maxDate={new Date()} // disable future dates
                        />
                        <DatePicker
                          selected={customEndDate}
                          onChange={(date) => setCustomEndDate(date)}
                          placeholderText="End Date"
                          dateFormat="yyyy/MM/dd"
                          minDate={customStartDate} // end date cannot be before start
                          maxDate={new Date()} // disable future dates
                        />

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            if (customStartDate && customEndDate) {
                              const formatDate = (date) => {
                                const d = new Date(date);
                                const month = String(d.getMonth() + 1).padStart(2, "0");
                                const day = String(d.getDate()).padStart(2, "0");
                                const year = d.getFullYear();
                                return `${year}/${month}/${day}`;
                              };
                              fetchFilteredData(formatDate(customStartDate), formatDate(customEndDate));
                            } else {
                              toast.error("Please select both start and end date");
                            }
                          }}
                        >
                          Apply
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            // Clear dates
                            setCustomStartDate(null);
                            setCustomEndDate(null);
                            // Optionally hide the custom date picker
                            setShowCustomDatePicker(false);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )} */}

                  </div>


                </div>
              </div>

              <div className="card-body table-responsive">
                {/* search bar */}
                <div className="row mt-2 mb-2 justify-content-between">
                  <div className="col-md-auto search ms-auto">
                    <div className="dt-search d-flex align-items-center gap-1">
                      <label htmlFor="dt-search-0" className='search-label'>Search:</label>
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

                {error ? (
                  <div className="text-center text-dark my-5" style={{ fontSize: '22px', fontWeight: '700' }}>
                    Data Not Found
                  </div>
                ) : (
                  <DataTableComponents
                    columns={columns}
                    currentPageData={currentPageData}
                    loader={loader}
                    filterDataLength={pagination.total}
                    perPage={pagination.perPage}
                    handleRowsPerPageChange={(newPerPage) =>
                      setPagination((prev) => ({ ...prev, perPage: newPerPage, currentPage: 1 }))
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

      {/* Delete Modal */}
      <Delete
        show={modalShow.deleteRegisterUser}
        handleClose={handleClose}
        isDeleteLoading={isDeleteLoading}
        handleDelete={handleDelete}
        role={"Register User"}
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

          // Reset pagination
          setPagination((prev) => ({ ...prev, currentPage: 1 }));

          // 🔹 Actually fetch filtered data from API
          fetchFilteredData(start, end);
        }}
      />
    </>
  );
};

export default RegisterUser;
