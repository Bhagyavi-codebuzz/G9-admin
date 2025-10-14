import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';

const initialState = {
    name: "",
    description: ''

}

const PolicyEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editpolicy, setEditPolicy] = useState(location.state?.policy || {});
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            name: editpolicy?.name,
            description: editpolicy?.description
        });



    }, [editpolicy]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append("name", formData.name);
            form.append("description", formData.description);

            const res = await Axios.post(apiendpoints.editPolicy.replace(":id", editpolicy.id),
                form,
                authorizationHeaders()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/policy");
            } else {
                toast.error(res.data?.message);
            }
        } catch (err) {
            if (err.response?.status === 400) {
                toast.error(err.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value.trimStart(),
        }));
    };
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
                                    Policies Edit
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
                            <form className="row g-3"
                                onSubmit={handleSubmit}>

                                <div className=" col-12 mb-2">
                                    <label htmlFor="name" className="form-label">
                                        Name :
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        className="form-control"
                                        placeholder="Enter Name"
                                        autoComplete='off'
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-12 mb-2">
                                    <label htmlFor="description" className="form-label">
                                        Description :
                                    </label>
                                    <Editor value={formData.description}
                                        onTextChange={(e) => setFormData({ ...formData, description: e.htmlValue })} style={{ height: '320px' }} />
                                </div>

                                <div className="text-end">
                                    <button
                                        type="submit"
                                        className={`submit-btn ${loading ? 'btn-loading' : ''}`}
                                        disabled={loading}
                                    >
                                        {loading && loaders.small}
                                        {loading ?
                                            'Updating...'
                                            :
                                            'Update'
                                        }
                                    </button>
                                </div>

                            </form>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default PolicyEdit
