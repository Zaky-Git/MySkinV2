const getImageUrl = (imagePath) => {
    return `${import.meta.env.VITE_API_BASE_URL}/${imagePath}`;
};

export default getImageUrl;
