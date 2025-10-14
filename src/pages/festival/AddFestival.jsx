import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import left from "../../assets/Images/lefticon.png";
import { Editor } from 'primereact/editor';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';


const initialState = {
    festival: null
}

const AddFestival = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value.trimStart(),
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const form = new FormData();
            form.append("festival", formData.festival);

            const res = await Axios.post(apiendpoints.AddFestival, form, authorizationHeadersImage()); // ✅ use `form` here

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/festival");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }

    }
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
                                    Add Festival Offer
                                </div>
                            </h2>
                        </div>

                        <form className="row g-3 gx-4"
                            onSubmit={handleSubmit}
                        >
                            <div className="col-12 mb-2">
                                <label htmlFor="image" className="form-label">
                                    Image :
                                </label>
                                <input
                                    type="file"
                                    name="festival"
                                    id="festival"
                                    className="form-control"
                                    onChange={handleChange}
                                    required
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                />
                                {formData.festival && (
                                    <div className="mb-2 mt-2">
                                        <img
                                            src={URL.createObjectURL(formData?.festival)}
                                            alt="Image"
                                            className="img-thumbnail img-fluid"
                                            style={{
                                                maxWidth: "150px", maxHeight: "150px"
                                            }}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="text-end">
                                <button
                                    type="submit"
                                    className={`submit-btn ${loading ? 'btn-loading' : ''}`}
                                    disabled={loading}
                                >
                                    {loading && loaders.small}
                                    {loading ?
                                        'Submitting...'
                                        :
                                        'Submit'
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddFestival