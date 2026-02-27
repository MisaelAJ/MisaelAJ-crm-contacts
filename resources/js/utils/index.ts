export const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
    });
};
