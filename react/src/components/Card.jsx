import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Card = ({ icon1, icon2, icon3, title1, title2, sum1, sum2, sum3 }) => {
    const cardItems = [
        {
            title: "Pasien",
            icon: icon1,
            jumlah: sum1,
        },
        {
            title: title1,
            icon: icon2,
            jumlah: sum2,
        },
        {
            title: title2,
            icon: icon3,
            jumlah: sum3,
        },
    ];

    return (
        <div className="card-container text-center">
            {cardItems.map((item, index) => (
                <div
                    className="card-custom lg:h-64 shadow-xl"
                    key={index}
                    style={{ alignItems: "center" }}
                >
                    <div className="card-cover">
                        <FontAwesomeIcon icon={item.icon} />
                    </div>
                    <div className="card--title">
                        <h2 className="card-subtitle text-muted mb-2">
                            {item.jumlah}
                        </h2>
                        <h2>{item.title}</h2>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Card;
