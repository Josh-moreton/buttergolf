export interface MenuItem {
    title: string
    path?: string
    submenu?: MenuItem[]
}

export const menuData: MenuItem[] = [
    {
        title: "Browse",
        path: "/listings",
    },
    {
        title: "Shop",
        submenu: [
            {
                title: "Drivers",
                path: "/category/drivers",
            },
            {
                title: "Irons",
                path: "/category/irons",
            },
            {
                title: "Putters",
                path: "/category/putters",
            },
            {
                title: "Bags",
                path: "/category/bags",
            },
            {
                title: "All Categories",
                path: "/listings",
            },
        ],
    },
    {
        title: "Sell",
        path: "/sell",
    },
    {
        title: "About",
        path: "/about",
    },
]
