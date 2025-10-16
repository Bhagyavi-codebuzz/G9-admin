import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import { InputSwitch } from 'primereact/inputswitch';


const Category = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [category, setCategory] = useState([]);

    const [modalShow, setModalShow] = useState({
        deletecategory: false,
    });

    const handleClose = () => {
        setModalShow({
            deletecategory: false,
        });
    }

    const filtercategory = (category || []).filter((i) => {
        const searchstr = `${i.name}`.toLowerCase();
        return searchstr.includes(search.toLowerCase());
    });

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filtercategory.slice(startIndex, startIndex + perPage);

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
            width: '180px',
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
        //                 maxHeight: "50px",
        //                 maxWidth: "50px",
        //                 width: "100%",
        //                 height: "100%",
        //                 padding: '8px 0',
        //             }}
        //         />
        //     ),
        //     width: "180px",
        // },
        {
            name: 'Name',
            cell: (row) => row.name || "-",
            width: "26%",
        },
        {
            name: 'Status',
            cell: (row) => (
                <div className="">
                    <InputSwitch
                        checked={row.status === true || row.status === "Active" || row.status === 1}
                        onChange={() => handleStatusToggle(row.id, row.status)}
                    />
                </div>
            ),
            width: "25%",
        },
        {
            name: 'Created Date',
            cell: (row) => (
                CreatedDate(row.createdAt) || "-"
            ),
            minwidth: "80px",
            width: "24%"
        },
        {
            name: 'Action',
            center: "true",
            cell: (row) =>
            (
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/category-details/${row?.id}`);
                        }}
                    >
                        <FaEye />
                    </button>

                    {/* <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/blog-edit`, { state: { blog: row } });
                        }}
                    >
                        <FaEdit />
                    </button> */}

                    {/* <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon border"
                        onClick={() => {
                            setModalShow({ ...modalShow, deletecategory: true });
                            setDeleteId(row?.id);
                            
                        }}
                    >
                        <FaTrash />
                    </button> */}
                </div>
            ),
            width: '130px'
        },
    ];

    const handleStatusToggle = async (id, currentStatus) => {
        // normalize current status into boolean
        const isActive = currentStatus === true || currentStatus === "Active" || currentStatus === 1;
        const newStatus = !isActive;  // flip it



        try {
            const res = await Axios.post(
                apiendpoints.categorystatus.replace(":id", id),
                {},  // no payload
                authorizationHeaders()
            );

            if (res.data?.status) {
                toast.success("Status updated successfully");
                // ✅ optimistic UI update
                setCategory((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status: newStatus } : item
                    )
                );
            } else {
                toast.error(res.data?.message || "Failed to update status");

                // ❌ revert if API fails
                setCategory((prev) =>
                    prev.map((item) =>
                        item.id === id ? { ...item, status: isActive } : item
                    )
                );
            }
        } catch (err) {
            toast.error("Failed to update status");

            // ❌ revert if error
            setCategory((prev) =>
                prev.map((item) =>
                    item.id === id ? { ...item, status: isActive } : item
                )
            );
        }
    };


    const fetchCategory = async () => {
        setLoader(true);

        try {
            const res = await Axios.get(`${apiendpoints.category}`, authorizationHeaders());

            if (res.data?.status) {
                setCategory(res.data?.data || []);
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
        fetchCategory();
    }, [])
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h3 className="mb-0 page-title">
                                        Category List
                                    </h3>
                                    {/* <button className="add-btn boreder-0" type="button"
                                        onClick={() => navigate("/admin/addcategory")}>
                                        + Add Category
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
                                            Data Not Found
                                        </div>
                                    ) : (
                                        <DataTableComponents
                                            columns={columns}
                                            currentPageData={currentPageData}
                                            loader={loader}
                                            filterDataLength={filtercategory.length || 0}


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

            {/* Delete-Company Modal */}
            {/* <Delete show={modalShow.deletecategory} handleClose={handleClose} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} role={"Category"} /> */}
        </>
    )
}

export default Category
