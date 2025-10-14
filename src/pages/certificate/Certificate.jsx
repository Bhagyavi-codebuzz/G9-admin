import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';

const Certificate = () => {

    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [certificate, setCertificate] = useState([]);

    const [modalShow, setModalShow] = useState({
        deletecertificate: false,
    });

    const handleClose = () => {
        setModalShow({
            deletecertificate: false,
        });
    }

    const filterblog = (certificate || []).filter((i) => {
        const searchstr = `${i.title}`.toLowerCase();
        return searchstr.includes(search.toLowerCase());
    });

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filterblog.slice(startIndex, startIndex + perPage);

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
            width: '70px',
            style: {
                margin: '10px 0'
            }
        },
        {
            name: 'Image',
            cell: (row) => (
                <img
                    src={row.image === null ? UserImage : row.image}
                    alt="Image"
                    className={`${row.image === null && 'rounded-circle'}`}
                    style={{
                        maxHeight: "80px",
                        maxWidth: "80px",
                        width: "100%",
                        height: "100%",
                        padding: '8px 0',
                    }}
                />
            ),
            width: "140px",
        },
        {
            name: 'Title',
            cell: (row) => (
                <div
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,   
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal", 
                    }}
                >
                    {row.title || "-"}
                </div>
            ),
            width: "16%",
        },
        {
            name: 'Sub Title',
            cell: (row) => (
                <div
                    style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,  
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "normal", 
                    }}
                    dangerouslySetInnerHTML={{ __html: row.subTitle || "-" }}
                >
                </div>
            ),
            width: "20%",
        },
        {
            name: 'Created Date',
            cell: (row) => (
                CreatedDate(row.createdAt) || "-"
            ),
            minwidth: "80px",
            width: "17%"
        },
        {
            name: 'Action',
            cell: (row) =>
            (
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/certificate-details/${row?.id}`);
                        }}
                    >
                        <FaEye />
                    </button>

                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/certificate-edit`, { state: { certificate: row } });
                        }}
                    >
                        <FaEdit />
                    </button>

                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon border"
                        onClick={() => {
                            setModalShow({ ...modalShow, deletecertificate: true });
                            setDeleteId(row?.id);
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
            width: '130px'
        },
    ];

    const fetchCertificate = async () => {
        setLoader(true);

        try {
            const res = await Axios.get(`${apiendpoints.certificate}`, authorizationHeaders());

            if (res.data?.status) {
                setCertificate(res.data?.data || []);
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
        fetchCertificate();
    }, [])

    const handleDelete = async () => {
        setIsDeleteLoading(true);

        try {
            const res = await Axios.delete(apiendpoints.deleteCertificate.replace(":id", deleteId), authorizationHeaders());

            if (res.data?.status) {
                toast.success(res.data?.message);

                handleClose();
                fetchCertificate();

                setCertificate((prev) => prev.filter((i) => i.id !== deleteId));
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            console.error("Delete-Certificate-Error++", err);
        } finally {
            setIsDeleteLoading(false);
        }
    }
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card">
                            <div className="card-header">
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <h3 className="mb-0 page-title">
                                        Certificate
                                    </h3>
                                    <button className="add-btn boreder-0" type="button"
                                        onClick={() => navigate("/admin/addcertificate")}>
                                        + Add Certificate
                                    </button>
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
                                            filterDataLength={filterblog.length || 0}


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
            <Delete show={modalShow.deletecertificate} handleClose={handleClose} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} role={"Certificate"} />
        </>
    )
}

export default Certificate