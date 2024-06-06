function toggleRowDetails(rowId) {
    var content = document.getElementById("content-" + rowId);
    if (content.style.display === "none" || content.style.display === "") {
        content.style.display = "table-row";
    } else {
        content.style.display = "none";
    }
}
function formatDate(dateString) {
    var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    var date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}