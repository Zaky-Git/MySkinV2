const FAQ = () => {
    let listFaqMelanoma = [
        {
            title: "Apa itu Melanoma",
            description:
                "Melanoma adalah jenis kanker kulit yang paling serius. Melanoma terjadi ketika sel-sel pigmentasi kulit yang disebut melanosit berubah menjadi sel-sel kanker. Melanoma dapat terjadi di kulit mana pun, tetapi melanoma yang terjadi di bagian tubuh yang tidak terpapar sinar matahari seringkali lebih serius.",
        },
        {
            title: "Apa saja gejala melanoma?",
            description:
                "Gejala melanoma dapat meliputi munculnya tahi lalat baru atau perubahan pada tahi lalat yang sudah ada. Ciri-ciri tahi lalat yang mencurigakan termasuk bentuk yang tidak simetris, tepi yang tidak rata, warna yang tidak seragam, diameter lebih besar dari 6 mm, dan perubahan bentuk, ukuran, atau warna.",
        },
        {
            title: "Bagaimana cara mencegah melanoma?",
            description:
                "Pencegahan melanoma meliputi menghindari paparan sinar matahari yang berlebihan, terutama pada jam-jam terik. Gunakan tabir surya dengan SPF tinggi, kenakan pakaian pelindung, dan hindari penggunaan tanning bed. Selain itu, periksa kulit secara rutin untuk mendeteksi perubahan atau tanda-tanda yang mencurigakan.",
        },
        {
            title: "Bagaimana pengobatan untuk melanoma?",
            description:
                "Pengobatan melanoma tergantung pada stadium dan lokasi kanker. Metode pengobatan yang umum termasuk pembedahan untuk mengangkat kanker, terapi radiasi, imunoterapi, dan terapi target. Pada kasus yang lebih lanjut, kombinasi dari beberapa metode pengobatan mungkin diperlukan, segera hubungi dokter.",
        },
    ];

    let listFaqMySkin = [
        {
            title: "Apa itu My Skin",
            description:
                "My Skin adalah sistem deteksi dini melanoma berbasis web yang menggunakan teknologi AI. Hasil analisis dapat diverifikasi oleh Dokter. ",
        },
        {
            title: "Apakah My Skin Berbayar?",
            description:
                "My Skin gratis untuk digunakan oleh khalayak umum, dapat diakses dimana saja dan tidak dipungut biaya sepersen pun",
        },
    ];

    return (
        <div className="mt-8">
            <div className="text-center flex flex-col items-center w-screen">
                <h1 className="poppin-font fw-bolder mt-4 mb-4">
                    Frequently Asked Question
                </h1>
                <div className="poppin-font container-sm mb-4">
                    <h5 className="text-muted">Terkait Melanoma</h5>
                </div>
                <div className="w-[50vw]">
                    <div className="grid-cols-2 grid gap-3 justify-items-center">
                        {listFaqMelanoma.map((item) => (
                            <div
                                key={item.title}
                                className="flex w-full flex-col shadow-md"
                            >
                                <div className="bg-primaryTW p-2 text-whiteTW font-medium rounded-lg w-full">
                                    <div>{item.title}</div>
                                </div>
                                <div className="bg-whiteTW">
                                    <div className="p-4 text-black font-normal">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="poppin-font container-sm mt-12 mb-4">
                    <h5 className="text-muted">Terkait Sistem My Skin</h5>
                </div>
                <div className="w-[50vw] mb-12">
                    <div className="grid-cols-2 grid gap-3 justify-items-center">
                        {listFaqMySkin.map((item) => (
                            <div
                                key={item.title}
                                className="flex w-full flex-col shadow-md"
                            >
                                <div className="bg-primaryTW p-2 text-whiteTW font-medium rounded-lg w-full">
                                    <div>{item.title}</div>
                                </div>
                                <div className="bg-whiteTW">
                                    <div className="p-4 text-black font-normal">
                                        {item.description}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
