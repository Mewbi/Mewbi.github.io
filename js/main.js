function contact(type){
    var modal = new bootstrap.Modal(document.getElementById("contact"));
    var text;
    if (type === "mail") {
        text = "felipefernandesgsc@gmail.com";
    }else if (type === "discord") {
        text = "Mewbi#5028";
    }
    var contact_text = document.querySelector("#contact-text");
    contact_text.innerHTML = text;
    modal.show();
} 