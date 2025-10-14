import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';
const initialState = {
    title: "",
    subTitle: '',
    certificate: null

}

const CertificateEdit = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [editBlog, setEditBlog] = useState(location.state?.certificate || {});
    const [imageShow, setImageShow] = useState(editBlog.image);
    const [formData, setFormData] = useState(initialState);
    const [loader, setLoader] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({
            title: editBlog?.title,
            subTitle: editBlog?.subTitle
        });

        if (editBlog.image) {
            const isFullUrl = editBlog.image.startsWith("http");
            setImageShow(
                isFullUrl ? editBlog.image : `${process.env.REACT_APP_BASE_URL}/uploads/${editBlog.image}`
            );
        }

    }, [editBlog]);


    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            setFormData((prev) => ({
                ...prev,
                [name]: files[0],
            }));
            setImageShow(URL.createObjectURL(files[0])); // 👈 preview new image
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value.trimStart(),
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            form.append("title", formData.title);
            form.append("certificate", formData.certificate);
            form.append("subTitle", formData.subTitle);

            const res = await Axios.post(
                apiendpoints.editCertificate.replace(":id", editBlog.id),
                form,
                authorizationHeadersImage()
            );

            if (res.data?.status) {
                toast.success(res.data?.message);
                setFormData(initialState);
                navigate("/admin/certificate");
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
                                    Certificate Edit
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
                                <div className="col-12 mb-2">
                                    <label htmlFor="image" className="form-label">
                                        Image :
                                    </label>
                                    <input
                                        type="file"
                                        name="certificate"
                                        id="image"
                                        className="form-control"
                                        onChange={handleChange}
                                        accept="image/jpeg,image/jpg,image/png,image/gif"
                                    />
                                    {imageShow && (
                                        <div className="mb-2 mt-2">
                                            <img
                                                src={imageShow}
                                                alt="Image"
                                                className="img-thumbnail img-fluid"
                                                style={{
                                                    maxWidth: "150px", maxHeight: "150px"
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="title" className="form-label">
                                        Title :
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        autoComplete='off'
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="col-lg-6 col-md-6 col-12 mb-2">
                                    <label htmlFor="subTitle" className="form-label">
                                        Sub Title :
                                    </label>
                                    <input
                                        type="text"
                                        name="subTitle"
                                        id="subTitle"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        autoComplete='off'
                                        value={formData.subTitle}
                                        onChange={handleChange}
                                        required
                                    />
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

export default CertificateEdit