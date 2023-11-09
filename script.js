// Run after DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach(box => {
        box.addEventListener("click", () => {
            const img = document.createElement("img");
            img.src = "images/close.png";
            box.append(img);
        }, {
            once: true
        })
    })
})
