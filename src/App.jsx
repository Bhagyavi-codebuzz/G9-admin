
import { Route, Routes } from 'react-router'
import './css/Sidebar.css'
import './css/App.css'
import "react-datepicker/dist/react-datepicker.css";
import Login from './pages/login/Login'
import DefaultLayout from './componet/Default-Layout/DefaultLayout'
import Dashboard from './pages/dashboard/Dashboard'
import RegisterUser from './pages/registeruser/RegisterUser'
import RegisterUserDetails from './pages/registeruser/RegisterUserDetails'
import Blog from './pages/blog/Blog'
import AddBlog from './pages/blog/AddBlog'
import BlogDetails from './pages/blog/BlogDetails'
import BlogEdit from './pages/blog/BlogEdit'
import FAQ from './pages/FAQ/FAQ'
import AddFAQ from './pages/FAQ/AddFAQ'
import FAQDetails from './pages/FAQ/FAQDetails'
import FAQEdit from './pages/FAQ/FAQEdit'
import Help from './pages/helpandsupport/Help'
import HelpDetails from './pages/helpandsupport/HelpDetails'
import Policy from './pages/policy/Policy'
import AddPolicy from './pages/policy/AddPolicy'
import PolicyDetails from './pages/policy/PolicyDetails'
import PolicyEdit from './pages/policy/PolicyEdit'
import Category from './pages/category/Category'
import CategoryDetails from './pages/category/CategoryDetails'
import SubCategory from './pages/subcategory/SubCategory'
import AddSubCategory from './pages/subcategory/AddSubCategory'
import SubCategoryDetails from './pages/subcategory/SubCategoryDetails'
import SubCategoryEdit from './pages/subcategory/SubCategoryEdit'
import Products from './pages/products/Products'
import AddProducts from './pages/products/AddProducts'
import ProductsEdit from './pages/products/ProductsEdit'
import Slider from './pages/slider/Slider'
import AddSlider from './pages/slider/AddSlider'
import Metals from './pages/metals/Metals'
import AddMetals from './pages/metals/AddMetals'
import MetalsDetails from './pages/metals/MetalsDetails'
import MetalEdit from './pages/metals/MetalEdit'
import StoneShape from './pages/stoneshape/StoneShape'
import AddStoneShape from './pages/stoneshape/AddStoneShape'
import StoneShapeDetails from './pages/stoneshape/StoneShapeDetails'
import StoneShapeEdit from './pages/stoneshape/StoneShapeEdit'
import GoldPurity from './pages/goldpurity/GoldPurity'
import AddGoldPurity from './pages/goldpurity/AddGoldPurity'
import GoldPurityDetails from './pages/goldpurity/GoldPurityDetails'
import GoldPurityEdit from './pages/goldpurity/GoldPurityEdit'
import ProductsDetails from './pages/products/ProductsDetails'
import UserTotalOrder from './pages/registeruser/UserTotalOrder'
import Order from './pages/order/Order'
import TotalItems from './pages/order/TotalItems'
import OrderDetails from './pages/order/OrderDetails'
import Offerbar from './pages/offerbar/Offerbar';
import AddOfferbar from './pages/offerbar/AddOfferbar';
import OfferbarDetails from './pages/offerbar/OfferbarDetails';
import OfferbarEdit from './pages/offerbar/OfferbarEdit';
import ComplaintQuery from './pages/complaintquery/ComplaintQuery';
import ComplaintQueryDetails from './pages/complaintquery/ComplaintQueryDetails';
import Media from './pages/media/Media';
import AddMedia from './pages/media/AddMedia';
import MediaDetails from './pages/media/MediaDetails';
import MediaEdit from './pages/media/MediaEdit';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Login />} />

        <Route element={<DefaultLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* registeruser */}
          <Route path='/admin/registeruser' element={<RegisterUser />} />
          <Route path='/admin/registerUser-details/:id' element={<RegisterUserDetails />} />
          <Route path='/admin/user-totalorder/:id' element={<UserTotalOrder />} />

          {/* offer bar  */}
          <Route path='/admin/offerbar' element={<Offerbar />} />
          <Route path='/admin/addofferbar' element={<AddOfferbar />} />
          <Route path='/admin/offerbar-details/:id' element={<OfferbarDetails />} />
          <Route path='/admin/offerbar-edit' element={<OfferbarEdit />} />

          {/* Slider */}
          <Route path='/admin/slider' element={<Slider />} />
          <Route path='/admin/addslider' element={<AddSlider />} />

          {/* Order  */}
          <Route path='/admin/order' element={<Order />} />
          <Route path='/admin/totalitem/:id' element={<TotalItems />} />
          <Route path='/admin/order-details/:id' element={<OrderDetails />} />

          {/* Sub category  */}
          <Route path='/admin/subcategory' element={<SubCategory />} />
          <Route path="/admin/addsubcategory" element={<AddSubCategory />} />
          <Route path='/admin/subcategory-details/:id' element={<SubCategoryDetails />} />
          <Route path='/admin/subcategory-edit' element={<SubCategoryEdit />} />

          {/* products  */}
          <Route path='/admin/products' element={<Products />} />
          <Route path='/admin/addproducts' element={<AddProducts />} />
          <Route path='/admin/products-edit' element={<ProductsEdit />} />
          <Route path='/admin/products-details/:id' element={<ProductsDetails />} />

          {/* Metals  */}
          <Route path='/admin/materials/metal' element={<Metals />} />
          <Route path='/admin/materials/addmetal' element={<AddMetals />} />
          <Route path='/admin/materials/metal-details/:id' element={<MetalsDetails />} />
          <Route path='/admin/materials/metal-edit' element={<MetalEdit />} />

          {/* stoneShape  */}
          <Route path='/admin/materials/stoneshape' element={<StoneShape />} />
          <Route path='/admin/materials/addstoneshape' element={<AddStoneShape />} />
          <Route path='/admin/materials/stoneshape-details/:id' element={<StoneShapeDetails />} />
          <Route path='/admin/materials/stoneshape-edit' element={<StoneShapeEdit />} />

          {/* GoldPurity */}
          <Route path='/admin/materials/goldpurity' element={<GoldPurity />} />
          <Route path='/admin/materials/addgoldpurity' element={<AddGoldPurity />} />
          <Route path='/admin/materials/goldpurity-details/:id' element={<GoldPurityDetails />} />
          <Route path='/admin/materials/goldpurity-edit' element={<GoldPurityEdit />} />

          {/* blog */}
          <Route path='/admin/blog' element={<Blog />} />
          <Route path='/admin/addblog' element={<AddBlog />} />
          <Route path='/admin/blog-details/:id' element={<BlogDetails />} />
          <Route path='/admin/blog-edit' element={<BlogEdit />} />

          {/* media  */}
          <Route path='/admin/media' element={<Media/>}/>
          <Route path='/admin/addmedia' element={<AddMedia/>}/>
          <Route path='/admin/media-details/:id' element={<MediaDetails/>}/>
          <Route path='/admin/media-edit' element={<MediaEdit/>}/>

          {/* FAQ  */}
          <Route path='/admin/faq' element={<FAQ />} />
          <Route path='/admin/addfaq' element={<AddFAQ />} />
          <Route path='/admin/faq-details/:id' element={<FAQDetails />} />
          <Route path='/admin/faq-edit' element={<FAQEdit />} />

          {/* help & support  */}
          <Route path='/admin/help' element={<Help />} />
          <Route path='/admin/help-details/:id' element={<HelpDetails />} />

          {/* ComplaintQuery */}
          <Route path='/admin/complaintquery' element={<ComplaintQuery/>}/>
          <Route path='/admin/complaintquery-details/:id' element={<ComplaintQueryDetails/>}/>

          {/* policy  */}
          <Route path='/admin/policy' element={<Policy />} />
          <Route path='/admin/addpolicy' element={<AddPolicy />} />
          <Route path='/admin/policy-details/:id' element={<PolicyDetails />} />
          <Route path='/admin/policy-edit' element={<PolicyEdit />} />

          {/* category  */}
          <Route path='/admin/category' element={<Category />} />
          <Route path='/admin/category-details/:id' element={<CategoryDetails />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
