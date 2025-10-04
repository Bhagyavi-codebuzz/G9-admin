import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { authorizationHeaders, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
import left from '../../assets/images/lefticon.png';
import { toast } from 'react-toastify';
import PhoneInput from 'react-phone-input-2';

const RegisterUserDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [loader, setLoader] = useState(false); // ✅ loader state

    const getRegisterUserDetails = async (id) => {
        setLoader(true); // start loader
        try {
            const res = await Axios.get(
                apiendpoints.viewRegisterUser.replace(":id", id),
                authorizationHeaders()
            );

            if (res.data?.status) {
                setFormData(res.data.data);
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
            setLoader(false); // stop loader
        }
    };

    useEffect(() => {
        getRegisterUserDetails(id);
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
                                <div>Register User Detail</div>
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
                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="name" className="form-label">Name :</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={formData?.name || "-"}
                                        readOnly
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="email" className="form-label">Email :</label>
                                    <input
                                        type="text"
                                        id="email"
                                        className="form-control"
                                        value={formData?.email || "-"}
                                        readOnly
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Mobile :</label>
                                    <PhoneInput
                                        country={"in"}
                                        value={formData?.Mobile_number || ""}
                                        inputClass="form-control w-100"
                                        disabled
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label className="form-label">Status :</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formData?.status || "-"}
                                        readOnly
                                    />
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default RegisterUserDetails;
