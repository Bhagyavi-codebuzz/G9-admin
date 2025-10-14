import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import left from '../../assets/images/lefticon.png';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import { Editor } from 'primereact/editor';

const ProductsDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubcategory] = useState([]);
    const [metals, setmetals] = useState([]);
    const [stoneShape, setStoneShape] = useState([]);
    const [goldPurity, setGoldPurity] = useState([]);
    const [activePurityTab, setActivePurityTab] = useState(null);
    const [activeMetalTab, setActiveMetalTab] = useState(null);

    const handleClose = () => setShow(false);
    const handleOpen = (img) => {
        setSelectedImage(img);
        setShow(true);
    };

    const getProductsDetails = async (id) => {
        setLoader(true);
        try {
            const res = await Axios.get(
                apiendpoints.detailsProducts.replace(':id', id),
                authorizationHeaders()
            );

            if (res.data?.status) {
                let data = res.data.data;

                // Parse product materials
                if (data.productMaterials && typeof data.productMaterials === 'string') {
                    try {
                        const parsed = JSON.parse(data.productMaterials);
                        data.productMaterials = Object.entries(parsed).map(([key, value]) => ({
                            name: key,
                            value,
                        }));
                    } catch (err) {
                        data.productMaterials = [];
                    }
                }

                // Parse metals from string to array
                data.metalId = data.metals ? JSON.parse(data.metals) : [];

                // Parse gold purity from purity array using value
                data.goldPurityId = data.purity ? data.purity.map((p) => p.value) : [];

                setFormData(data);
                // Set the first purity value as the default active tab
                if (data.purity && data.purity.length > 0) {
                    setActivePurityTab(data.purity[0].value);
                }
                // Set the first metal as the default active tab if media exists
                if (data.media && data.media.length > 0) {
                    setActiveMetalTab(data.media[0].id);
                }
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            toast.error('Failed to fetch product details');
        } finally {
            setLoader(false);
        }
    };

    useEffect(() => {
        getProductsDetails(id);
    }, [id]);

    const fetchCategory = async () => {
        try {
            const res = await Axios.get(apiendpoints.category, authorizationHeaders());
            if (res.data?.status) {
                setCategory(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Error fetching category:', err);
        }
    };

    const fetchSubCategory = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.subCategory}`, authorizationHeaders());
            if (res.data?.status) {
                setSubcategory(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Error fetching subcategory:', err);
        }
    };

    const fetchMetals = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.metal}`, authorizationHeaders());
            if (res.data?.status) {
                setmetals(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Error fetching metals:', err);
        }
    };

    const fetchStoneShape = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.StoneShape}`, authorizationHeaders());
            if (res.data?.status) {
                setStoneShape(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Error fetching stone shape:', err);
        }
    };

    const fetchgoldPurity = async () => {
        try {
            const res = await Axios.get(`${apiendpoints.goldPurity}`, authorizationHeaders());
            if (res.data?.status) {
                setGoldPurity(res.data?.data || []);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error('Error fetching gold purity:', err);
        }
    };

    useEffect(() => {
        fetchCategory();
        fetchSubCategory();
        fetchMetals();
        fetchStoneShape();
        fetchgoldPurity();
    }, []);

    // Remove duplicates from arrays to prevent key conflicts
    const uniqueMetalIds = [...new Set((formData.metalId || []).filter((id) => id != null))];
    const uniqueGoldPurityIds = [...new Set((formData.goldPurityId || []).filter((id) => id != null))];

    return (
        <>
            <section className="categorylist-section product mt-4 mt-lg-4 mt-xl-5">
                <div className="edit-user">
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <h2 className="d-flex mb-0 title">
                                <div className="pe-4" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                                    <img src={left} alt="" style={{ height: '30px' }} />
                                </div>
                                <div>Product Detail</div>
                            </h2>
                        </div>

                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form className="form row g-3 gx-4">
                                <p>1. Basic Product Information</p>

                                {/* Stock Number */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="stockNumber" className="form-label">Stock Number :</label>
                                    <input
                                        type="text"
                                        id="stockNumber"
                                        className="form-control"
                                        value={formData?.stockNumber || '-'}
                                        readOnly
                                    />
                                </div>

                                {/* Title */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="title" className="form-label">Name (Optional) :</label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form-control"
                                        value={formData.title || '-'}
                                        readOnly
                                    />
                                </div>

                                {/* category Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="categoryId" className="form-label">
                                        Select Category :
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        className="form-select"
                                        value={formData.categoryId || ''}
                                        disabled
                                    >
                                        <option value="">-- Select Category --</option>
                                        {category?.map((item) => (
                                            <option key={`category-${item._id}`} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sub-category Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="subCategoryId" className="form-label">
                                        Select Sub Category :
                                    </label>
                                    <select
                                        name="subCategoryId"
                                        id="subCategoryId"
                                        className="form-select"
                                        value={formData.subCategoryId || ''}
                                        disabled
                                    >
                                        <option value="">-- Select Sub Category --</option>
                                        {subcategory?.map((item) => (
                                            <option key={`subcategory-${item.id}`} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <p className='mt-5'>2. Jewellery Specifications</p>

                                {/* Selected Metals */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Selected Metals :</label>
                                    <div className="mt-2">
                                        {uniqueMetalIds.length > 0 ? (
                                            uniqueMetalIds.map((id) => {
                                                const metalName = metals.find((m) => m.id.toString() === id.toString())?.name || id;
                                                return (
                                                    <span key={`metal-${id}`} className="badge bg-primary p-2 fs-6 me-2 mb-2">
                                                        {metalName}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-muted">No metals selected</span>
                                        )}
                                    </div>
                                </div>

                                {/* Selected Gold Purity */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Selected Purity :</label>
                                    <div className="mt-2">
                                        {formData?.purity && formData.purity.length > 0 ? (
                                            formData.purity.map((item, index) => (
                                                <span
                                                    key={`purity-${item.value || index}`}
                                                    className="badge bg-primary p-2 fs-6 me-2 mb-2"
                                                >
                                                    {item.name || `Purity ${item.value}`}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-muted">No purity selected</span>
                                        )}
                                    </div>
                                </div>

                                {/* stoneShape Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="stoneShapeId" className="form-label">
                                        Select Stone Shape :
                                    </label>
                                    <select
                                        name="stoneShapeId"
                                        id="stoneShapeId"
                                        className="form-select"
                                        value={formData.stoneShapeId || ''}
                                        disabled
                                    >
                                        <option value="">-- Select Stone Shape --</option>
                                        {stoneShape?.map((item) => (
                                            <option key={`stoneshape-${item.id}`} value={item.id}>
                                                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Diamond cut Select */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="diamondCut" className="form-label">
                                        Select Diamond Cut :
                                    </label>
                                    <select
                                        name="diamondCut"
                                        id="diamondCut"
                                        className="form-select"
                                        value={formData.diamondCut || ''}
                                        disabled
                                    >
                                        <option value="">-- Select Diamond Cut --</option>
                                        <option value="excellent">Excellent</option>
                                        <option value="verygood">Very Good</option>
                                        <option value="good">Good</option>
                                    </select>
                                </div>

                                <p className='mt-5'>3. Pricing & Stock</p>
                                <div className="col-12 mb-2">
                                    <label htmlFor="price" className="form-label">
                                        Pricing Details:
                                    </label>

                                    {/* Show selected goldPurity with price details */}
                                    {formData.purity?.length > 0 ? (
                                        <div className="mt-2">
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                {formData.purity.map((item) => (
                                                    <span
                                                        key={`purity-${item.value}`}
                                                        className={`badge p-2 fs-6 ${activePurityTab === item.value ? 'bg-success' : 'bg-primary'}`}
                                                        style={{ cursor: 'pointer', minWidth: '50px', textAlign: 'center' }}
                                                        onClick={() => setActivePurityTab(activePurityTab === item.value ? null : item.value)}
                                                    >
                                                        {item.name || `Purity ${item.value}`}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Display details for active purity tab */}
                                            {activePurityTab && formData.purity.find((p) => p.value === activePurityTab) && (
                                                <div className="row">
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">Original Price (Optional) :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            value={formData.purity.find((p) => p.value === activePurityTab)?.original_price || '-'}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">Selling Price :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            value={formData.purity.find((p) => p.value === activePurityTab)?.selling_price || '-'}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">Profit :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            value={formData.purity.find((p) => p.value === activePurityTab)?.profit || '-'}
                                                            readOnly
                                                        />
                                                    </div>
                                                    <div className="col-lg-3 col-md-6 col-12">
                                                        <label className="form-label">GST :</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            value={formData.purity.find((p) => p.value === activePurityTab)?.gst || '-'}
                                                            readOnly
                                                        />
                                                    </div>

                                                    {/* Totals for this active purity */}
                                                    <div className="col-12 mt-3">
                                                        <h5 className='d-flex justify-content-between mb-3'>
                                                            <strong>Profit Amount (Selling Price + Profit Margin): </strong>
                                                            {formData.purity.find((p) => p.value === activePurityTab)?.profitsellingprice || '-'}
                                                        </h5>
                                                        <h5 className='d-flex justify-content-between mb-4'>
                                                            <strong>GST Amount (Profit Amount * GST): </strong>
                                                            {formData.purity.find((p) => p.value === activePurityTab)?.gstAmount || '-'}
                                                        </h5>
                                                        <h5 className='d-flex justify-content-between mb-2'>
                                                            <strong>Total Amount (Profit Amount + GST): </strong>
                                                            {formData.purity.find((p) => p.value === activePurityTab)?.gstPrice || '-'}
                                                        </h5>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted">No pricing details available</span>
                                    )}
                                </div>

                                <p className='mt-5'>4. Product Images & Media</p>

                                {/* Metal-wise Images and Videos */}
                                <div className="col-12 mb-2">
                                    <label className="form-label">Media by Metal:</label>
                                    {formData.media?.length > 0 ? (
                                        <div className="mt-2">
                                            <div className="d-flex flex-wrap gap-2 mb-2">
                                                {formData.media.map((mediaItem) => (
                                                    <span
                                                        key={`metal-tab-${mediaItem.id}`}
                                                        className={`badge p-2 fs-6 ${activeMetalTab === mediaItem.id ? 'bg-success' : 'bg-primary'}`}
                                                        style={{ cursor: 'pointer', minWidth: '60px', textAlign: 'center' }}
                                                        onClick={() => setActiveMetalTab(activeMetalTab === mediaItem.id ? null : mediaItem.id)}
                                                    >
                                                        {mediaItem.name}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Display media for active metal tab */}
                                            {activeMetalTab && formData.media.find((m) => m.id === activeMetalTab) && (
                                                <div className="row">
                                                    {/* Images */}
                                                    <div className="col-lg-6 col-md-6 col-12 mb-2">
                                                        <label className="form-label">Images :</label>
                                                        {formData.media.find((m) => m.id === activeMetalTab)?.images?.length > 0 ? (
                                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                                {formData.media
                                                                    .find((m) => m.id === activeMetalTab)
                                                                    ?.images.map((img, i) => (
                                                                        <img
                                                                            key={`image-${activeMetalTab}-${i}`}
                                                                            src={img}
                                                                            alt={`${formData.media.find((m) => m.id === activeMetalTab)?.name} ${i + 1}`}
                                                                            onClick={() => handleOpen(img)}
                                                                            className="img-thumbnail"
                                                                            style={{
                                                                                width: '80px',
                                                                                height: '80px',
                                                                                objectFit: 'cover',
                                                                                cursor: 'pointer',
                                                                            }}
                                                                        />
                                                                    ))}
                                                            </div>
                                                        ) : (
                                                            <span className="text-muted">No images available</span>
                                                        )}
                                                    </div>

                                                    {/* Video */}
                                                    <div className="col-lg-6 col-md-6 col-12 mb-2">
                                                        <label className="form-label">Video (Optional) :</label>
                                                        {formData.media.find((m) => m.id === activeMetalTab)?.videos?.length > 0 ? (
                                                            <div className="mt-2 position-relative" style={{ width: '320px' }}>
                                                                <video
                                                                    width="320"
                                                                    height="180"
                                                                    controls
                                                                    src={formData.media.find((m) => m.id === activeMetalTab)?.videos[0]}
                                                                    className="rounded border"
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="text-muted">No video available</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted">No media available</span>
                                    )}
                                </div>

                                <p className='mt-5'>5. Product Description & Details</p>

                                {/* Short Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="shortDescription" className="form-label">
                                        Short Description (Optional) :
                                    </label>
                                    <input
                                        type="text"
                                        name="shortDescription"
                                        id="shortDescription"
                                        className="form-control"
                                        value={formData.shortDescription || '-'}
                                        readOnly
                                    />
                                </div>

                                {/* Description */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">
                                        Description (Optional) :
                                    </label>
                                    <Editor
                                        value={formData.description || ''}
                                        readOnly
                                        style={{ height: '320px' }}
                                    />
                                </div>

                                {/* Product Materials */}
                                <div className="col-12 mb-2">
                                    <label className="form-label">Product Materials (Optional) :</label>
                                    {formData?.productMaterials && Object.keys(formData.productMaterials).length > 0 ? (
                                        Object.entries(formData.productMaterials).map(([name, value], index) => (
                                            <div key={`material-${index}`} className="d-flex gap-2 mb-2 align-items-center">
                                                <input
                                                    type="text"
                                                    placeholder="Name"
                                                    className="form-control"
                                                    value={name || '-'}
                                                    readOnly
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Value"
                                                    className="form-control"
                                                    value={value || '-'}
                                                    readOnly
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-muted">No product materials available</div>
                                    )}
                                </div>

                                <p className='mt-5'>6. Product Status & Flags</p>

                                {/* Estimated Time */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="estimatedTime" className="form-label">
                                        Estimated Time :
                                    </label>
                                    <input
                                        type="text"
                                        name="estimatedTime"
                                        id="estimatedTime"
                                        className="form-control"
                                        value={formData.estimatedTime || '-'}
                                        readOnly
                                    />
                                </div>

                                {/* Boolean Fields */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label">Is this product a top seller?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                value="1"
                                                checked={formData.topSelling === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="topSelling"
                                                value="0"
                                                checked={formData.topSelling === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product currently discounted?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                value="1"
                                                checked={formData.discounted === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="discounted"
                                                value="0"
                                                checked={formData.discounted === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label">Is this product ready to ship immediately?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                value="1"
                                                checked={formData.readyToShip === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="readyToShip"
                                                value="0"
                                                checked={formData.readyToShip === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2 radio d-flex justify-content-between align-items-center">
                                    <label className="form-label ms-3">Is this product newArrival?</label>
                                    <div className="d-flex gap-5">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                value="1"
                                                checked={formData.newArrival === 1}
                                                disabled
                                            />
                                            <label className="form-check-label">Yes</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="newArrival"
                                                value="0"
                                                checked={formData.newArrival === 0}
                                                disabled
                                            />
                                            <label className="form-check-label">No</label>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Image Preview</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {selectedImage ? (
                        <img
                            src={selectedImage}
                            alt="Preview"
                            className="img-fluid rounded"
                            style={{ maxHeight: '500px', objectFit: 'contain' }}
                        />
                    ) : (
                        <span className="text-muted">No image selected</span>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ProductsDetails;