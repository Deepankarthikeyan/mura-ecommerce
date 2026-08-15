function AnalyticsCard({
    heading,
    percentage,
    value,
    colClass = "col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12",
}: {
    heading: string;
    percentage?: number;
    value: string | number;
    colClass?: string;
}) {
    const showGrowth = typeof percentage === "number";

    return <div className={colClass}>
        <div className="single-over-fiew-card">
            <span className="top-main">{heading}</span>
            <div className="bottom">
                <h2 className="title">{value}</h2>
                {showGrowth ? (
                    <div className="right-primary">
                        <div className="increase">
                            <i className="fa-light fa-arrow-up" />
                            <span>{percentage}%</span>
                        </div>
                        <img src="/assets/images-dashboard/avatar/05.png" alt="ekomart" />
                    </div>
                ) : null}
            </div>
        </div>
    </div>
}

export default AnalyticsCard
