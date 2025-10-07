import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import { CreatedDate } from '../../componet/helper/DateTimeUtils';

const UserTotalOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [totalUser, setTotalUser] = useState([]);

    const filtertotalUser = (totalUser || []).filter((i) => {
        const searchstr = `${i.title}`.toLowerCase();
        return searchstr.includes(search.toLowerCase());
    });

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filtertotalUser.slice(startIndex, startIndex + perPage);

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
            cell: (row) =>
                row.paymentDetails?.total
                    ? `₹${parseFloat(row.paymentDetails.total).toFixed(2)}`
                    : "-",
            width: "12%",
        },
        {
            name: 'Status',
            cell: (row) => row.status || "-",
            width: "12%",
        },
        {
            name: 'Total Order Items',
            cell: (row) => (
                <span
                    onClick={() =>
                        navigate(`/admin/totalitem/${row.id}`, {
                            state: {
                                items: row.items,
                            },
                        })
                    }
                    style={{
                        cursor: "pointer",
                        textDecoration: "underline"
                    }}
                >
                    {row.totalItems || "-"}
                </span>
            ),
            width: "12%",
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
            width: "20%"
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
            width: '130px'
        },
    ];

    const fetchTotalOrder = async (id) => {
        setLoader(true);

        try {
            const res = await Axios.get(apiendpoints.totalOrder.replace(":id", id), authorizationHeadersImage());

            if (res.data?.status) {
                setTotalUser(res.data?.data?.orders || []);
            }
            else {
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
        fetchTotalOrder(id);
    }, [id])
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h3 className="mb-0 page-title">
                                        Total Order
                                    </h3>
                                    {/* <button className="add-btn boreder-0" type="button"
                                        onClick={() => navigate("/admin/addmetal")}>
                                        + Add Metals
                                    </button> */}
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
                                            {error}
                                        </div>
                                    ) : (
                                        <DataTableComponents
                                            columns={columns}
                                            currentPageData={currentPageData}
                                            loader={loader}
                                            filterDataLength={filtertotalUser.length || 0}


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
        </>
    )
}

export default UserTotalOrder