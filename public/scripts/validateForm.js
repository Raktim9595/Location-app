(() => {
    'use strict'

    const forms = document.querySelectorAll(".validated-form");

    Array.from(forms).forEach((form) => {
        form.addEventListener("submit", (ev) => {
            if (!form.checkValidity()) {
                ev.preventDefault();
                ev.stopPropagation();
            };
            form.classList.add("was-validated");
        }, false)
    })
})();