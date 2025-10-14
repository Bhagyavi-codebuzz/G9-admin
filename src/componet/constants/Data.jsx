import { BlogIcon, CategoryIcon, ComplaintQueryIcon, DashboardIcon, FAQIcon, HelpIcon, LogOutIcon, MaterialIcon, MediaIcon, OfferBarIcon, OrderIcon, PolicyIcon, ProductIcon, SliderIcon, SubcategoryIcon, UserlistIcon } from "../../assets/IconsList";


export const SidebarData = [
    {
        label: "Dashboard",
        icon: <DashboardIcon />,
        route: "/admin/dashboard",
    },
    {
        label: "Register Users",
        icon: <UserlistIcon />,
        route: "/admin/registeruser",
    },
    {
        label: "Offer Bar",
        icon: <OfferBarIcon />,
        route: "/admin/offerbar",
    },
    {
        label: "Festival Offer",
        icon: <SliderIcon />,
        route: "/admin/festival",
    },
    {
        label: "Banners",
        icon: <SliderIcon />,
        route: "/admin/slider",
    },
    {
        label: "Orders",
        icon: <OrderIcon />,
        route: "/admin/order",
    },
    {
        label: "Sub Category",
        icon: <CategoryIcon />,
        route: "/admin/subcategory",
    },
    {
        label: "Products",
        icon: <ProductIcon />,
        route: "/admin/products",
    },
    {
        label: "Materials",
        icon: <MaterialIcon />,
        children: [   // 👈 dropdown items
            {
                label: "Metals",
                route: "/admin/materials/metal",
            },
            {
                label: "Stone Shape",
                route: "/admin/materials/stoneshape",
            },
            {
                label: "Gold Purity",
                route: "/admin/materials/goldpurity",
            },
        ],
    },
    // {
    //     label: "Category",
    //     icon: <CategoryIcon />,
    //     route: "/admin/category",
    // },
    {
        label: "Certificate",
        icon: <BlogIcon />,
        route: "/admin/certificate",
    },
    {
        label: "Blogs",
        icon: <BlogIcon />,
        route: "/admin/blog",
    },
    {
        label: "Media",
        icon: <MediaIcon />,
        route: "/admin/media",
    },
    {
        label: "FAQ's",
        icon: <FAQIcon />,
        route: "/admin/faq",
    },
    {
        label: "Settings",
        icon: <FAQIcon />,
        route: "/admin/settings",
    },
    {
        label: "Help & Support",
        icon: <HelpIcon />,
        route: "/admin/help",
    },
    {
        label: "Complaint Query",
        icon: <ComplaintQueryIcon />,
        route: "/admin/complaintquery",
    },
    {
        label: "Policies",
        icon: <PolicyIcon />,
        route: "/admin/policy",
    },
    {
        label: "Logout",
        icon: <LogOutIcon />,
        onClick: "logout"
    },
]

export const DashboardContent = [
    {
        title: 'Total Register Users',
        icon: <UserlistIcon />,
        apiCount: "totalUser",
        route: "/admin/registeruser"
    },
    {
        title: "Total Offer Bar",
        icon: <OfferBarIcon />,
        apiCount: "totalOfferbar",
        route: "/admin/offerbar",
    },
    {
        title: "Total Banners",
        icon: <SliderIcon />,
        apiCount: "totalSlider",
        route: "/admin/slider",
    },
    {
        title: 'Total Orders',
        icon: <OrderIcon />,
        apiCount: "totalOrders",
        route: "/admin/order"
    },

    // {
    //     title: 'Total Categorys',
    //     icon: <CategoryIcon />,
    //     apiCount: "totalCategory",
    //     route: "/admin/dashborad"
    // },
    {
        title: 'Total Sub Category',
        icon: <CategoryIcon />,
        apiCount: "totalSubcategory",
        route: "/admin/subcategory"
    },
    {
        title: 'Total Products',
        icon: <DashboardIcon />,
        apiCount: "totalProducts",
        route: "/admin/products"
    },
    {
        title: "Total Media",
        icon: <MediaIcon />,
        apiCount: "totalmedia",
        route: "/admin/media",
    },
    {
        title: 'Total Blogs',
        icon: <BlogIcon />,
        apiCount: "totalBlogs",
        route: "/admin/blog",
    },

    {
        title: "Total FAQ's",
        icon: <FAQIcon />,
        apiCount: "totalFaqs",
        route: "/admin/faq",
    },
    {
        title: "Total Help & Support",
        icon: <HelpIcon />,
        apiCount: "totalcontactUs",
        route: "/admin/help",
    },
    {
        title: "Complaint Query",
        icon: <ComplaintQueryIcon />,
        apiCount: "totalComplaintQuery",
        route: "/admin/complaintquery",
    },
    {
        title: "Total Policies",
        icon: <PolicyIcon />,
        apiCount: "totalpolicy",
        route: "/admin/policy",
    },

]