/* =========================================================
   STEIL · GESTIÓN INTERNA
   APP.JS
   ========================================================= */


/* =========================================================
   ELEMENTOS PRINCIPALES
   ========================================================= */

const navItems = document.querySelectorAll(".nav-item");
const pages = document.querySelectorAll(".page");

const breadcrumbCurrent =
    document.querySelector(".breadcrumb strong");

const menuToggle =
    document.getElementById("menuToggle");

const sidebar =
    document.querySelector(".sidebar");

const globalSearch =
    document.getElementById("globalSearch");


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

navItems.forEach(item => {

    item.addEventListener("click", function(event) {

        event.preventDefault();

        const pageName =
            this.dataset.page;

        if (!pageName) {
            return;
        }

        openPage(pageName);

    });

});


function openPage(pageName) {


    /* -----------------------------------------
       QUITAR ACTIVE DEL MENÚ
    ----------------------------------------- */

    navItems.forEach(item => {

        item.classList.remove("active");

    });


    /* -----------------------------------------
       ACTIVAR MENÚ SELECCIONADO
    ----------------------------------------- */

    const selectedNav =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );


    if (selectedNav) {

        selectedNav.classList.add("active");

    }


    /* -----------------------------------------
       OCULTAR TODAS LAS PÁGINAS
    ----------------------------------------- */

    pages.forEach(page => {

        page.classList.remove("active");

    });


    /* -----------------------------------------
       MOSTRAR PÁGINA
    ----------------------------------------- */

    const selectedPage =
        document.getElementById(
            `page-${pageName}`
        );


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    /* -----------------------------------------
       ACTUALIZAR BREADCRUMB
    ----------------------------------------- */

    if (breadcrumbCurrent && selectedNav) {

        const text =
            selectedNav.querySelector("span");


        if (text) {

            breadcrumbCurrent.textContent =
                text.textContent;

        }

    }


    /* -----------------------------------------
       CERRAR SIDEBAR EN MÓVIL
    ----------------------------------------- */

    if (sidebar) {

        sidebar.classList.remove("open");

    }


    /* -----------------------------------------
       VOLVER ARRIBA
    ----------------------------------------- */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================================
   MENÚ MÓVIL
   ========================================================= */

if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        function() {

            sidebar.classList.toggle("open");

        }
    );

}


/* =========================================================
   BUSCADOR GLOBAL
   ========================================================= */

if (globalSearch) {

    globalSearch.addEventListener(
        "keydown",
        function(event) {

            if (event.key === "Enter") {

                const search =
                    this.value.trim();


                if (!search) {

                    return;

                }


                performGlobalSearch(search);

            }

        }
    );

}


function performGlobalSearch(search) {

    console.log(
        "Búsqueda global:",
        search
    );

}


/* =========================================================
   CTRL + K
   ========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            (event.ctrlKey || event.metaKey) &&
            event.key.toLowerCase() === "k"
        ) {

            event.preventDefault();


            if (globalSearch) {

                globalSearch.focus();

                globalSearch.select();

            }

        }

    }
);


/* =========================================================
   BOTÓN VER TODO
   ========================================================= */

const textButtons =
    document.querySelectorAll(".text-button");


textButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            console.log(
                "Ver todas las operaciones"
            );

        }
    );

});


/* =========================================================
   BOTONES PRINCIPALES
   ========================================================= */

const primaryButtons =
    document.querySelectorAll(".btn-primary");


primaryButtons.forEach(button => {

    button.addEventListener(
        "click",
        function() {

            console.log(
                "Nueva operación"
            );

        }
    );

});


/* =========================================================
   NOTIFICACIONES
   ========================================================= */

const notificationButton =
    document.querySelector(".notifications");


if (notificationButton) {

    notificationButton.addEventListener(
        "click",
        function() {

            console.log(
                "Centro de notificaciones"
            );

        }
    );

}


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        openPage("dashboard");

        console.log(
            "STEIL · Gestión Interna iniciada correctamente."
        );

    }
);
