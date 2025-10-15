import { add } from "date-fns";

export const apiendpoints = {
    // Authentication 
    login: "/auth/logIn",

    logout: "/logout",

    //admin
    dashboard: "/auth/dashboard",

    // register user 
    registerUser: "/user/list",
    deleteRegisterUser: "/user/delete/:id",
    viewRegisterUser: "/user/detail/:id",
    updateStatus: "/user/updateStatus/:id",
    totalOrder: "/order/listOrder/:id",

    // blog 
    blog: "blogs/list",
    addBlog: "/blogs/add",
    deleteBlog: "/blogs/delete/:id",
    viewBlog: "/blogs/detail/:id",
    editblog: "/blogs/edit/:id",

    // FAQ 
    faq: "/faq/list",
    addFaq: "/faq/add",
    deletefaq: "/faq/delete/:id",
    viewfaq: "/faq/detail/:id",
    editfaq: "/faq/edit/:id",

    // Help & support 
    help: "/contact-us/list",
    deleteHelp: "/contact-us/delete/:id",
    detailsHelp: "/contact-us/detail/:id",

    // policy 
    policy: "/policy/list",
    addPolicy: "/policy/add",
    deletePolicy: "/policy/delete/:id",
    detailsPolicy: "/policy/detail/:id",
    editPolicy: "/policy/edit/:id",

    // category 
    category: "/category/list",
    categorystatus: "/category/updateStatus/:id",
    detailsCategory: "/category/detail/:id",

    // sub category 
    subCategory: "/subcategory/list",
    adSubCategory: "/subcategory/add",
    deteleSubcategory: "/subcategory/delete/:id",
    detailsSubCategory: "/subcategory/detail/:id",
    editSubCategory: "/subcategory/edit/:id",

    // products 
    products: "/products/list",
    addProducts: "/products/add",
    deleteProducts: "/products/delete/:id",
    editProducts: "/products/edit/:id",
    detailsProducts: "/products/detail/:id",
    addCSV: "/products/addCsv",
    addProductMedia: "/products/add-media",
    deleteProductMedia: "/products/deleteMedia",


    // Slider 
    slider: "/slider/list",
    addSlider: "/slider/add",
    deleteSlider: "slider/delete/:id",


    // Metals 
    metal: "/metals/list",
    addMetal: "/metals/add",
    detailsmetal: "/metals/detail/:id",
    deleteMetal: "/metals/delete/:id",
    editmetal: "/metals/edit/:id",

    // StoneShape
    StoneShape: "/stoneShape/list",
    addStoneShape: "/stoneShape/add",
    deleteStoneShape: "/stoneShape/delete/:id",
    detailsStoneShape: "/stoneShape/detail/:id",
    editStoneShape: "/stoneShape/edit/:id",

    // goldPurity
    goldPurity: "/goldPurity/list",
    addgoldPurity: "/goldPurity/add",
    deltegoldPurity: "/goldPurity/delete/:id",
    detailsgoldpurity: "/goldPurity/detail/:id",
    editgoldPurity: "/goldPurity/edit/:id",

    // Order 
    order: "/order/list",
    orderStatus: "/order/status",
    detailOrder: "/order/detail/:id",

    // offerbar
    offerBar: "/offerbar/list",
    addOfferbar: "/offerbar/add",
    detailOfferbar: "/offerbar/detail/:id",
    deleteOfferbar: "/offerbar/delete/:id",
    editOfferbar: "/offerbar/edit/:id",

    // ComplaintQuery
    complaintQuery: "/complaint/list",
    deleteComplaintQuery: "/complaint/delete/:id",
    detailsComplaintQuery: "/complaint/detail/:id",


    // media 
    media: "/media/list",
    addMedia: "/media/add",
    deleteMedia: "/media/delete/:id",
    viewMedia: "/media/detail/:id",
    editMedia: "/media/edit/:id",

    // Certificate
    certificate: "/certificate/list",
    addCertificate: "/certificate/add",
    deleteCertificate: "/certificate/delete/:id",
    viewCertificate: "/certificate/detail/:id",
    editCertificate: "/certificate/edit/:id",


    // festival
    festival: "/festival/list",
    AddFestival: "/festival/add",
    deleteFestival: "/festival/delete/:id",

    // settings 
    settings:"settings/"
}