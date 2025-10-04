import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import left from '../../assets/images/lefticon.png';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap';
import PhoneInput from 'react-phone-input-2';
import { Editor } from 'primereact/editor';

const ComplaintQueryDetails = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleClose = () => setShow(false);
    const handleOpen = (img) => {
        setSelectedImage(img);
        setShow(true);
    };

    const getcomplaintqueryDetails = async (id) => {
        setLoader(true);
        try {
            const res = await Axios.get(
                apiendpoints.detailsComplaintQuery.replace(":id", id),
                authorizationHeaders()
            );

            if (res.data?.status) {
                let data = res.data.data;

                setFormData(data);
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err?.message === "Network Error") {
                toast.error(err.message);
            } else if (err.response?.status === 404) {
                toast.error(err.response.data.message);
            } else if (err.response?.status === 500) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoader(false);
        }
    };


    useEffect(() => {
        getcomplaintqueryDetails(id);
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
                                <div>Complaint Query Detail</div>
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
                            <form className="form row g-3">


                                {/* name */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="name" className="form-label">Name :</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        autoComplete='off'
                                        value={formData.name || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* email_mobileNo */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="email_mobileNo" className="form-label">Email / Mobile No :</label>
                                    <input
                                        type="text"
                                        id="email_mobileNo"
                                        className="form-control"
                                        value={formData?.email_mobileNo || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* service */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="service" className="form-label">Type :</label>
                                    <input
                                        type="text"
                                        id="service "
                                        className="form-control"
                                        value={formData?.service || "-"}
                                        readOnly
                                    />
                                </div>

                                {/* serviceType */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="serviceType" className="form-label">
                                        Sub Type :
                                    </label>
                                    <input
                                        type="text"
                                        name="serviceType"
                                        id="serviceType"
                                        className="form-control"
                                        autoComplete="off"
                                        value={formData.serviceType || "-"}
                                        readOnly
                                    />
                                </div>


                                {/* Photo Preview Buttons */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 d-flex flex-column">
                                    <label className="form-label">Photos :</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(formData?.images || []).length > 0 ? (
                                            formData.images.map((img, i) => (
                                                <img
                                                    key={i}
                                                    src={img}
                                                    alt={`Preview ${i + 1}`}
                                                    onClick={() => handleOpen(img)}
                                                    className="img-thumbnail"
                                                    style={{
                                                        width: "100px",
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        cursor: "pointer"
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <span className="text-muted">No images available</span>
                                        )}
                                    </div>
                                </div>

                                {/* Video Preview Section */}
                                <div className="col-lg-6 col-md-6 col-12 mb-2 d-flex flex-column">
                                    <label className="form-label">Videos :</label>
                                    <div className="d-flex flex-wrap gap-2">
                                        {(formData?.video || []).length > 0 ? (
                                            formData.video.map((vid, i) => (
                                                <video
                                                    key={i}
                                                    src={vid}
                                                    controls
                                                    className="img-thumbnail"
                                                    style={{
                                                        width: "150px",
                                                        height: "100px",
                                                        objectFit: "cover",
                                                        cursor: "pointer"
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <span className="text-muted">No videos available</span>
                                        )}
                                    </div>
                                </div>

                                {/* message  */}
                                <div className="col-12 mb-2">
                                    <label htmlFor="message" className="form-label">Message :</label>
                                    <Editor
                                        value={formData.message || "-"}
                                        readOnly
                                        style={{ height: '320px' }}
                                    />
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ComplaintQueryDetails
