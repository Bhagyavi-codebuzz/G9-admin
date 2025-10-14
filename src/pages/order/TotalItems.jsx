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

const TotalItems = () => {
    const location = useLocation();
    const [totalItems, setTotalItems] = useState(location.state?.items || {});
    const { id } = useParams();

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);



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
        //     cell: (row) => {
        //         const firstImage = Array.isArray(row.images) && row.images.length > 0
        //             ? row.images[0]
        //             : UserImage;

        //         return (
        //             <img
        //                 src={firstImage}
        //                 alt="Image"
        //                 className={`${(!row.images || row.images.length === 0)}`}
        //                 style={{
        //                     maxHeight: "80px",
        //                     maxWidth: "80px",
        //                     width: "100%",
        //                     height: "100%",
        //                     padding: '8px 0',
        //                 }}
        //             />
        //         );
        //     },
        //     width: "180px",
        // },

        {
            name: 'Title',
            cell: (row) => row.title || "-",
            width: "19%",
        },
        {
            name: 'Quantity',
            cell: (row) => row.quantity || "-",
            width: "14%",
        },
        {
            name: 'Selling Price',
            cell: (row) => row.selling_price || "-",
            width: "14%",
        },
        {
            name: 'Total Price',
            cell: (row) => row.totalPrice || "-",
            width: "14%",
        },
        {
            name: 'Status',
            cell: (row) => (
                row.status === "Cancelled" ? (
                    // 🔹 Cancelled → show disabled dropdown
                    <select
                        value="Cancelled"
                        disabled
                        style={{
                            padding: "4px 6px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="Cancelled">Cancelled</option>
                    </select>
                ) : (
                    // 🔹 Otherwise show normal dropdown without cancelled option
                    <select
                        value={row.status}
                        onChange={async (e) => {
                            const newStatus = e.target.value;

                            try {
                                const res = await Axios.post(
                                    apiendpoints.orderStatus,
                                    {
                                        orderId: Number(id),
                                        productId: row.productId,
                                        status: newStatus,
                                    },
                                    authorizationHeaders() 
                                );

                                if (res.data?.status) {
                                    toast.success(res.data?.message);

                                    // ✅ update state properly
                                    setTotalItems((prev) =>
                                        prev.map((item) =>
                                            item.productId === row.productId
                                                ? { ...item, status: newStatus }
                                                : item
                                        )
                                    );
                                } else {
                                    toast.error(res.data?.message);
                                }
                            } catch (error) {
                                toast.error("Error updating status");
                            }
                        }}
                        style={{
                            padding: "4px 6px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                        }}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                )
            ),
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

export default TotalItems