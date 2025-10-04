import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import DataTableComponents from '../../componet/Data-Table/DataTableComponents';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes'
import Delete from '../../componet/modal/delete/Delete';
import { CreatedDate } from '../../componet/helper/DateTimeUtils';
import AddCSV from '../../componet/modal/addCSV/AddCSV';

const Products = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [loader, setLoader] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [products, setProducts] = useState([]);

    const [modalShow, setModalShow] = useState({
        deleteproducts: false,
        addCSV: false,
    });

    const handleClose = () => {
        setModalShow({
            deleteproducts: false,
        });
    }

    const filterproducts = (products || []).filter((i) => {
        const searchstr = `${i.title} ${i.stockNumber}`.toLowerCase();
        return searchstr.includes(search.toLowerCase());
    });

    const startIndex = (currentPage - 1) * perPage;
    const currentPageData = filterproducts.slice(startIndex, startIndex + perPage);
    // const data = currentPageData.map((itm) => itm?.productMaterials.map((itm) => itm))
    // console.log('currentPageData', data);

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
            width: '60px',
            style: {
                margin: '10px 0'
            }
        },
        {
            name: 'Image',
            cell: (row) => {
                const imageUrl = Array.isArray(row.images) && row.images.length > 0
                    ? row.images[0]
                    : "";

                return (
                    <img
                        src={imageUrl}
                        alt="Image"
                        className={`${(!row.image || row.image.length === 0)}`}
                        style={{
                            maxHeight: "50px",
                            maxWidth: "50px",
                            width: "100%",
                            height: "100%",
                            padding: '8px 0',
                        }}
                    />
                );
            },
            width: "100px",
        },
        {
            name: 'Title',
            cell: (row) => row.title || "-",
            width: "16%",
        },
        {
            name: 'Stock Number',
            cell: (row) => row.stockNumber || "-",
            width: "12%",
        },
        {
            name: 'Selling Price',
            cell: (row) => row.selling_price || "-",
            width: "12%",
        },
        {
            name: 'Status',
            cell: (row) => row.status || "-",
            width: "11%",
        },
        {
            name: 'Created Date',
            cell: (row) => (
                CreatedDate(row.createdAt) || "-"
            ),
            minwidth: "70px",
            width: "15%"
        },
        {
            name: 'Action',
            cell: (row) =>
            (
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/products-details/${row?.id}`);
                        }}
                    >
                        <FaEye />
                    </button>

                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/products-edit`, { state: { products: row } });
                        }}
                    >
                        <FaEdit />
                    </button>

                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon border"
                        onClick={() => {
                            setModalShow({ ...modalShow, deleteproducts: true });
                            setDeleteId(row?.id);
                            console.log(deleteId)
                        }}
                    >
                        <FaTrash />
                    </button>
                </div>
            ),
            width: '160px'
        },
    ];
    const fetchProducts = async () => {
        setLoader(true);

        try {
            const res = await Axios.get(`${apiendpoints.products}`, authorizationHeaders());

            if (res.data?.status) {
                setProducts(res.data?.data || []);
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
        fetchProducts();
    }, [])

    const handleDelete = async () => {
        setIsDeleteLoading(true);

        try {
            const res = await Axios.delete(apiendpoints.deleteProducts.replace(":id", deleteId), authorizationHeaders());

            if (res.data?.status) {
                toast.success(res.data?.message);

                handleClose();
                fetchProducts();

                setProducts((prev) => prev.filter((i) => i.id !== deleteId));
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            console.error("Delete-Products-Error++", err);
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
                                        Products
                                    </h3>


                                    <div className='d-flex gap-3 flex-column align-items-center'>
                                        <div className='d-flex gap-2'>
                                            <button className="add-btn boreder-0" type="button"
                                                onClick={() => setModalShow({ ...modalShow, addCSV: true })}>
                                                + Add CSV
                                            </button>

                                            <button className="add-btn boreder-0" type="button"
                                                onClick={() => navigate("/admin/addproducts")}>
                                                + Add Product
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
                                            filterDataLength={filterproducts.length || 0}
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
            </section >

            {/* Delete-Company Modal */}
            <Delete show={modalShow.deleteproducts} handleClose={handleClose} isDeleteLoading={isDeleteLoading} handleDelete={handleDelete} role={"Products"} />

            {/* after Delete modal */}
            <AddCSV
                show={modalShow.addCSV}
                handleClose={() => setModalShow({ ...modalShow, addCSV: false })}
                fetchProducts={fetchProducts}
            />
        </>
    )
}

export default Products
