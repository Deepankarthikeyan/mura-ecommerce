"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/components/header/UserContext";
import { isAdmin } from "@/lib/dashboardPaths";

interface MenuChild {
  title: string;
  href: string;
  disabled?: boolean;
}

interface MenuItem {
  title: string;
  icon: string;
  children?: MenuChild[];
  href?: string;
  adminOnly?: boolean;
}

const menuItems: MenuItem[] = [
  {
    title: "Inventory",
    icon: "fa-light fa-boxes-stacked",
    children: [{ title: "Inventory", href: "/staff-dashboard/inventory" }],
  },
  {
    title: "Storefront",
    icon: "fa-light fa-store",
    children: [{ title: "Homepage & branding", href: "/staff-dashboard/storefront" }],
  },
  {
    title: "Orders",
    icon: "fa-light fa-bag-shopping",
    children: [{ title: "Orders", href: "/staff-dashboard/orders" }],
  },
  {
    title: "Reports and analytics",
    icon: "fa-light fa-chart-mixed",
    adminOnly: true,
    children: [
      { title: "Sales Report", href: "/staff-dashboard/reports-analytics/sales" },
      { title: "Product Report", href: "/staff-dashboard/reports-analytics/products" },
      {
        title: "Customer Report",
        href: "/staff-dashboard/reports-analytics/customers",
        disabled: true,
      },
      { title: "Order Report", href: "/staff-dashboard/reports-analytics/orders" },
      {
        title: "Website Performance",
        href: "/staff-dashboard/reports-analytics/website-performance",
        disabled: true,
      },
    ],
  },
  {
    title: "SEO",
    icon: "fa-light fa-magnifying-glass-chart",
    children: [{ title: "Settings", href: "/staff-dashboard/seo" }],
  },
  {
    title: "Discounts and Coupons",
    icon: "fa-light fa-percent",
    children: [
      { title: "Discounts and Coupons", href: "/staff-dashboard/discounts-coupons" },
    ],
  },
  {
    title: "User Profile",
    icon: "fa-light fa-user",
    children: [
      { title: "Profile Setting", href: "/staff-dashboard/profile-setting" },
    ],
  },
];

const SidebarMenu = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const pathname = usePathname();
  const { user } = useUser();

  const visibleMenuItems = useMemo(
    () => menuItems.filter((item) => !item.adminOnly || isAdmin(user?.userType)),
    [user?.userType]
  );

  useEffect(() => {
    const activeIndex = visibleMenuItems.findIndex((item) => {
      return item.children?.some((child) => {
        if (child.disabled) return false;
        return (
          pathname === child.href ||
          pathname.startsWith(`${child.href}/`) ||
          (child.title === "Main Demo" && pathname === "/index")
        );
      });
    });

    if (activeIndex !== -1) {
      setOpenIndex(activeIndex);
    }
  }, [pathname, visibleMenuItems]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <ul className="rts-side-nav-area-left menu-active-parent">
      {visibleMenuItems.map((item, index) => {
        const hasSubmenu = !!item.children?.length;
        const isOpen = openIndex === index;

        return (
          <li className="single-menu-item" key={item.title}>
            {hasSubmenu ? (
              <Link
                href="#"
                className={`with-plus ${isOpen ? "active" : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleToggle(index);
                }}
              >
                <i className={`${item.icon} icon`} aria-hidden="true" />
                <p>{item.title}</p>
              </Link>
            ) : (
              <Link href={item.href || "#"}>
                <i className={`${item.icon} icon`} aria-hidden="true" />
                <p>{item.title}</p>
              </Link>
            )}

            {hasSubmenu && (
              <ul className={`submenu mm-collapse parent-nav ${isOpen ? "mm-show" : ""}`}>
                {item.children!.map((sub, subIndex) => {
                  const isActive =
                    !sub.disabled &&
                    (pathname === sub.href ||
                      (sub.title === "Main Demo" && pathname === "/index"));

                  if (sub.disabled) {
                    return (
                      <li key={subIndex}>
                        <span
                          className="mobile-menu-link"
                          aria-disabled="true"
                          title="Coming soon"
                          style={{
                            opacity: 0.45,
                            cursor: "not-allowed",
                            pointerEvents: "none",
                            userSelect: "none",
                          }}
                        >
                          {sub.title}
                        </span>
                      </li>
                    );
                  }

                  return (
                    <li key={subIndex}>
                      <Link
                        href={sub.href}
                        className={`mobile-menu-link ${isActive ? "active" : ""}`}
                      >
                        {sub.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarMenu;
