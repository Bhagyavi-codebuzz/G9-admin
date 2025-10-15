import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png"
import { Modal } from 'react-bootstrap';
import { Editor } from 'primereact/editor';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';


const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleOpen = () => setShow(true);

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);

    const fetchOrderdetails = async (id) => {
        setLoader(true);
        try {
            const res = await Axios.get(apiendpoints.detailOrder.replace(":id", id), authorizationHeaders());

            if (res.data?.status) {
                setFormData(res.data.data);
            }
            else {
                toast.error(res.data?.message);
            }

        } catch (err) {
            if (err?.message === "Network Error") {
                toast.error(err.message);
            }
            if (err.response?.status === 404) {
                toast.error(err.response.data.message);
            }
            else if (err.response?.status === 500) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoader(false);
        }
    }

    useEffect(() => {
        fetchOrderdetails(id);
    }, [id]);
    return (
        <>
            <section className="categorylist-section mt-4 mt-lg-4 mt-xl-5">
                <div className="edit-user">
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                            <h2 className="d-flex mb-0 title">
                                <div className='pe-4' style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                                    <img src={left} alt="" style={{ height: '30px' }} />
                                </div>
                                <div>
                                    Order Detail
                                </div>
                            </h2>
                        </div>

                        {/* ✅ Show loader while fetching */}
                        {loader ? (
                            <div className="d-flex justify-content-center align-items-center py-5 w-100">
                                <div className="spinner-border text-black" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <form className="row g-3">
                                {/* <div className="col-lg-6 col-md-6 col-12 mb-2 d-flex flex-column">
                                    <label htmlFor="donatorphoto" className="form-label">
                                        Photo :
                                    </label>
                                    <button type='button' className='submit-btn ' style={{ width: '100%', maxWidth: '157px' }} onClick={handleOpen}>View</button>
                                </div> */}



                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="orderId" className="form-label">
                                        Order Id :
                                    </label>
                                    <input
                                        type="text"
                                        name="orderId"
                                        id="orderId"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData.orderId || "-"}
                                        readOnly
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="status" className="form-label">
                                        Status :
                                    </label>
                                    <input
                                        type="text"
                                        name="status"
                                        id="status"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData.status || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* gstDetails */}
                                <h3>Gst Details</h3>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="name" className="form-label">
                                        Name :
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData?.gstDetails?.name || "-"}
                                        readOnly
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="GstNumber" className="form-label">
                                        Gst Number :
                                    </label>
                                    <input
                                        type="text"
                                        name="GstNumber"
                                        id="GstNumber"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData?.gstDetails?.GstNumber || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* user details  */}
                                <h3>User Details</h3>
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="name" className="form-label">
                                        Name:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData?.user?.name || "-"}
                                        readOnly
                                    />
                                </div>
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="email" className="form-label">
                                        Email:
                                    </label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData?.user?.email || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* addressDetails */}
                                <h3>Address Details</h3>
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="address" className="form-label">
                                        Address :
                                    </label>
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <input
                                                type="text"
                                                name="address_line_1"
                                                id="address_line_1"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.address_line_1 || "-"}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <input
                                                type="text"
                                                name="address_line_1"
                                                id="address_line_1"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.address_line_2 || "-"}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <label htmlFor="city" className="form-label">
                                                City :
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                id="city"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.city || "-"}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <label htmlFor="state" className="form-label">
                                                State :
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                id="state"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.state || "-"}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <label htmlFor="country" className="form-label">
                                                Country :
                                            </label>
                                            <input
                                                type="text"
                                                name="country"
                                                id="country"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.country || "-"}
                                                readOnly
                                            />
                                        </div>
                                        <div className="col-lg-6 col-md-6 col-12 mb-2">
                                            <label htmlFor="postal_code" className="form-label">
                                                Postal Code :
                                            </label>
                                            <input
                                                type="text"
                                                name="postal_code"
                                                id="postal_code"
                                                className="form-control"
                                                autoComplete='off'
                                                value={formData?.address?.postal_code || "-"}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="address_type" className="form-label">
                                        Address Type :
                                    </label>
                                    <input
                                        type="text"
                                        name="address_type"
                                        id="address_type"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData?.address?.address_type || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* Items Details */}
                                <h3 className="mt-4 mb-3">Item Details</h3>

                                {formData?.items && formData.items.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-bordered align-middle text-center">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Images</th>
                                                    <th>Videos</th>
                                                    <th>Product ID</th>
                                                    <th>Title</th>
                                                    <th>Quantity</th>
                                                    <th>Price</th>
                                                    <th>Subtotal</th>
                                                    <th>Status</th>
                                                    <th>Purity Name</th>
                                                    <th>Purity Value</th>
                                                    <th>Profit Original Price</th>
                                                    <th>Profit Selling Price</th>
                                                    <th>GST Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {formData.items.map((item, index) => {
                                                    const media = item.media?.[0];
                                                    const purity = item.purity || {};

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className="d-flex flex-wrap justify-content-center gap-2">
                                                                    {media?.images?.length > 0 ? (
                                                                        media.images.map((img, i) => (
                                                                            <img
                                                                                key={i}
                                                                                src={img}
                                                                                alt={`img-${i}`}
                                                                                style={{
                                                                                    width: "60px",
                                                                                    height: "60px",
                                                                                    objectFit: "cover",
                                                                                    borderRadius: "6px",
                                                                                    border: "1px solid #ddd"
                                                                                }}
                                                                            />
                                                                        ))
                                                                    ) : (
                                                                        <span>-</span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                {media?.videos?.length > 0 ? (
                                                                    <div className="d-flex flex-column align-items-center gap-1">
                                                                        {media.videos.map((vid, i) => (
                                                                            <video
                                                                                key={i}
                                                                                src={vid}
                                                                                controls
                                                                                style={{ width: "80px", height: "60px", borderRadius: "6px" }}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <span>-</span>
                                                                )}
                                                            </td>
                                                            <td>{item.productId || "-"}</td>
                                                            <td>{item.title || "-"}</td>
                                                            <td>{item.quantity || "-"}</td>
                                                            <td>{item.price || "-"}</td>
                                                            <td>{item.subtotal || "-"}</td>
                                                            <td>{item.status || "-"}</td>
                                                            <td>{purity.name || "-"}</td>
                                                            <td>{purity.value || "-"}</td>
                                                            <td>{purity.profitoriginalprice || "-"}</td>
                                                            <td>{purity.profitsellingprice || "-"}</td>
                                                            <td>{item.gstAmount || "-"}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No items found</p>
                                )}

                                {/* paymentDetails */}
                                <h2>Payment Details</h2>
                                <div className='d-flex justify-content-between'>
                                    <strong style={{ fontSize: "20px" }}>Sub Total :</strong>
                                    <div style={{ fontSize: "20px" }}>{formData?.paymentDetails?.subtotal || "-"}</div>
                                </div>
                                <div className='d-flex justify-content-between mt-2'>
                                    <strong style={{ fontSize: "18px" }}>GST :</strong>
                                    <div style={{ fontSize: "18px" }}>{formData?.paymentDetails?.gst || "-"}</div>
                                </div>
                                <div className='d-flex justify-content-between mt-2'>
                                    <strong style={{ fontSize: "20px", color: "black" }}>Total :</strong>
                                    <div style={{ fontSize: "20px" }}>{formData?.paymentDetails?.total || "-"}</div>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default OrderDetails
