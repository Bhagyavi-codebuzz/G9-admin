import { Editor } from 'primereact/editor';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import left from "../../assets/Images/lefticon.png";
import { toast } from 'react-toastify';
import { loaders } from '../../componet/loader/Loader';
import { authorizationHeaders, authorizationHeadersImage, Axios } from '../../componet/helper/Axios';
import { apiendpoints } from '../../componet/constants/apiroutes';

const initialState = {
  name: ""
}

const SubCategoryEdit = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editSubcategory, setEditSubcategory] = useState(location.state?.subCategory || {});
  const [formData, setFormData] = useState(initialState);
  const [loader, setLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryList, setcategoryList] = useState();

  useEffect(() => {
    setFormData({
      name: editSubcategory?.name,
      categoryName: editSubcategory?.categoryName
    });
  }, [editSubcategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("name", formData.name);

      const res = await Axios.post(apiendpoints.editSubCategory.replace(":id", editSubcategory.id),
        form,
        authorizationHeaders()
      );

      if (res.data?.status) {
        toast.success(res.data?.message);
        setFormData(initialState);
        navigate("/admin/subcategory");
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

  const fetchcategorylist = async () => {
    setLoading(true);

    try {
      const res = await Axios.get(`${apiendpoints.category}`, authorizationHeaders());

      if (res.data?.status) {
        setcategoryList(res.data?.data || []);
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
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchcategorylist();
  }, [])
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
                  Sub Category Edit
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

                {/* <div className="col-lg-6 col-md-6  col-12 mb-2">
                  <label htmlFor="categoryName" className="form-label">
                    Category Name :
                  </label>
                  <input
                    type="text"
                    name="categoryName"
                    id="categoryName"
                    className="form-control"
                    placeholder="Enter Category Name"
                    autoComplete='off'
                    value={formData.categoryName}
                    readOnly
                  />
                </div> */}

                {/* Category Name Select */}
                <div className="col-lg-6 col-md-6 col-12 mb-2">
                  <label htmlFor="categoryName" className="form-label">
                    Category Name:
                  </label>
                  <select
                    name="categoryName"
                    id="categoryName"
                    className="form-select"
                    value={formData.categoryName || ""}
                    onChange={handleChange}
                    required
                    disabled
                  >
                    {categoryList?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-lg-6 col-md-6  col-12 mb-2">
                  <label htmlFor="name" className="form-label">
                    Sub Category Name :
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

export default SubCategoryEdit
