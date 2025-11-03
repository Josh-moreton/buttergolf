export interface MenuItem {
    title: string
    path?: string
    submenu?: MenuItem[]
}

export const menuData: MenuItem[] = [
    {
        title: "Shop All",
        path: "/listings",
    },
    {
        title: "Drivers",
        path: "/category/drivers",
    },
    {
        title: "Fairway Woods",
        path: "/category/fairway-woods",
    },
    {
        title: "Irons",
        path: "/category/irons",
    },
    {
        title: "Wedges",
        path: "/category/wedges",
    },
    {
        title: "Putters",
        path: "/category/putters",
    },
    {
        title: "Hybrids",
        path: "/category/hybrids",
    },
    {
        title: "Shoes",
        path: "/category/shoes",
    },
    {
        title: "Accessories",
        submenu: [
            {
                title: "Bags",
                path: "/category/bags",
            },
            {
                title: "Gloves",
                path: "/category/gloves",
            },
            {
                title: "Balls",
                path: "/category/balls",
            },
            {
                title: "Apparel",
                path: "/category/apparel",
            },
            {
                title: "Training Aids",
                path: "/category/training-aids",
            },
            {
                title: "All Accessories",
                path: "/category/accessories",
            },
        ],
    },
]
