"use client";

import Link from "next/link";
import React, { useState, MouseEvent } from "react";

type MenuItem = {
    icon: string;
    label: string;
    submenu: string[] | null;
};

function CategoryMenu() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleMenu = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const menuItems: MenuItem[] = [
        {
            icon: "10.svg",
            label: "Ayurvedic",
            submenu: ["Breakfast", "Dinner", "Pumking"],
        },
        {
            icon: "10.svg",
            label: "Cosmetics",
            submenu: ["Breakfast", "Dinner", "Pumking"],
        },
        {
            icon: "10.svg",
            label: "Premium products",
            submenu: null,
        },
        {
            icon: "10.svg",
            label: "Siddha",
            submenu: ["Breakfast", "Dinner", "Pumking"],
        },
        {
            icon: "10.svg",
            label: "Other Items",
            submenu: null,
        },
    ];

    return (
        <div>
            <ul className="category-sub-menu" id="category-active-four">
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <Link
                            href="#"
                            className="menu-item"
                            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                                e.preventDefault();
                                if (item.submenu) toggleMenu(index);
                            }}
                        >
                            <img src={`/assets/images/icons/${item.icon}`} alt="icons" />
                            <span>{item.label}</span>
                            {item.submenu && (
                                <i
                                    className={`fa-regular ${openIndex === index ? "fa-minus" : "fa-plus"
                                        }`}
                                />
                            )}
                        </Link>

                        {item.submenu && (
                            <ul
                                className={`submenu mm-collapse ${openIndex === index ? "mm-show" : ""
                                    }`}
                            >
                                {item.submenu.map((subItem, subIdx) => (
                                    <li key={subIdx}>
                                        <Link className="mobile-menu-link" href="/shop">
                                            {subItem}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CategoryMenu;
