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
import Papa from "papaparse";
import { saveAs } from "file-saver";

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
            width: '100px',
            style: {
                margin: '10px 0'
            }
        },
        // {
        //     name: 'Image',
        //     cell: (row) => {
        //         const imageUrl = Array.isArray(row.images) && row.images.length > 0
        //             ? row.images[0]
        //             : "";

        //         return (
        //             <img
        //                 src={imageUrl}
        //                 alt="Image"
        //                 className={`${(!row.image || row.image.length === 0)}`}
        //                 style={{
        //                     maxHeight: "50px",
        //                     maxWidth: "50px",
        //                     width: "100%",
        //                     height: "100%",
        //                     padding: '8px 0',
        //                 }}
        //             />
        //         );
        //     },
        //     width: "100px",
        // },
        {
            name: 'Stock Number',
            cell: (row) => row.stockNumber || "-",
            width: "14%",
        },
        {
            name: 'Category Name',
            cell: (row) => row.categoryName || "-",
            width: "16%",
        },
        {
            name: 'Sub Category Name',
            cell: (row) => row.subCategoryName || "-",
            width: "16%",
        },
        {
            name: 'Created Date',
            cell: (row) => (
                CreatedDate(row.createdAt) || "-"
            ),
            minwidth: "70px",
            width: "18%"
        },
        {
            name: 'Action',
            center: "true",
            cell: (row) =>
            (
                <div className="d-flex align-items-center">
                    <button type="button" className="btn btn-sm btn-neutral text-nowrap eye-icon me-3 border"
                        onClick={() => {
                            navigate(`/admin/products-details/${row?.id}`, { state: { products: row } });
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

    // ✅ Export all Products to CSV
    const handleExportCSV = async () => {
        try {
            // ✅ Step 1: Fetch all products
            const res = await Axios.get(`${apiendpoints.products}`, authorizationHeaders());

            if (!res.data?.status) {
                toast.error(res.data?.message || "Failed to fetch products");
                return;
            }

            const allProducts = res.data?.data || [];

            if (!Array.isArray(allProducts) || allProducts.length === 0) {
                toast.error("No products available to export!");
                return;
            }

            // ✅ Step 2: Format for CSV
            const csvData = allProducts.map((p) => {
                // 🧩 Parse metals safely
                let metalList = [];
                try {
                    metalList = JSON.parse(p.metals || "[]");
                } catch {
                    metalList = [];
                }

                // 🧩 Flatten nested purity details
                const purityDetails = (p.purity || [])
                    .map(
                        (pur) =>
                            `${pur.name}: Sell=${pur.selling_price}, Profit=${pur.profit}, GST=${pur.gst}, GST Price=${pur.gstPrice}`
                    )
                    .join(" | ");

                // 🧩 Flatten metals
                const metalDetails = metalList.join(", ");

                // 🧩 Flatten product materials
                const productMaterialDetails = p.productMaterials
                    ? Object.entries(p.productMaterials)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(" | ")
                    : "-";

                // 🧩 Flatten media info
                const mediaSummary = (p.media || [])
                    .map(
                        (m) =>
                            `${m.name} (${m.images?.length || 0} imgs, ${m.videos?.length || 0} vids)`
                    )
                    .join(" | ");

                return {
                    ID: p.id || "-",
                    Title: p.title || "-",
                    StockNumber: p.stockNumber || "-",
                    Category: p.categoryName || "-",
                    SubCategory: p.subCategoryName || "-",
                    Status: p.status || "-",
                    EstimatedTime: p.estimatedTime || "-",
                    DiamondCut: p.diamondCut || "-",
                    TopSelling: p.topSelling ? "Yes" : "No",
                    ReadyToShip: p.readyToShip ? "Yes" : "No",
                    Discounted: p.discounted ? "Yes" : "No",
                    NewArrival: p.newArrival ? "Yes" : "No",
                    ShortDescription: p.shortDescription || "-",
                    PurityDetails: purityDetails || "-",
                    ProductMaterials: productMaterialDetails,
                    Metals: metalDetails || "-",
                    Media: mediaSummary || "-",
                    CreatedAt: CreatedDate(p.createdAt) || "-",
                };
            });

            // ✅ Step 3: Convert to CSV & download
            const csv = Papa.unparse(csvData);
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            saveAs(blob, `products_${new Date().toISOString().slice(0, 10)}.csv`);

            toast.success("Products exported successfully!");
        } catch (err) {
            toast.error("Failed to export products");
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
