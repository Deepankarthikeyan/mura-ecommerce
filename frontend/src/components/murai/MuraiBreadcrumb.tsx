import Link from "next/link";

type Crumb = { label: string; href?: string };

type MuraiBreadcrumbProps = {
  title: string;
  bannerImage: string;
  crumbs: Crumb[];
};

export default function MuraiBreadcrumb({ title, bannerImage, crumbs }: MuraiBreadcrumbProps) {
  return (
    <section className="breadcrumb__section">
      <div className="breadcrumb__bg">
        <img
          className="breadcrumb__bg-image"
          src={bannerImage}
          alt=""
          width={1600}
          height={334}
          decoding="async"
          fetchPriority="high"
        />
        <div className="container">
          <div className="breadcrumb__content">
            <h1 className="breadcrumb__content--title">{title}</h1>
            <ul className="breadcrumb__content--menu">
              {crumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="breadcrumb__content--menu__items">
                  {crumb.href ? <Link href={crumb.href}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
