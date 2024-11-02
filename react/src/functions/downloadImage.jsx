import getImageUrl from "./getImage";

async function downloadImage(path, setIsDownloading) {
    setIsDownloading(true);
    const imageUrl = getImageUrl(path);

    console.log("Mengunduh gambar dari:", imageUrl);

    fetch(imageUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.blob();
        })
        .then((blob) => {
            console.log("Blob yang diterima:", blob);
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "image.jpg");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setIsDownloading(false);

            console.log("Gambar berhasil diunduh.");
        })
        .catch((error) => {
            console.error("Terjadi masalah saat mengunduh gambar:", error);
            setIsDownloading(false);
        });
}

export default downloadImage;
