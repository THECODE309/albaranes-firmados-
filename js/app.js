/* =========================================================
   STEIL · GESTIÓN INTERNA
   JAVASCRIPT PRINCIPAL
   MÓDULO ALBARANES
   ========================================================= */


/* =========================================================
   ELEMENTOS GENERALES
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
   ALMACENAMIENTO
   ========================================================= */

const ALBARANES_STORAGE_KEY =
    "steil_albaranes";

let albaranes = [];

let fotografiaActual = "";

let albaranEditandoId = null;


/* =========================================================
   NAVEGACIÓN
   ========================================================= */

navItems.forEach(item => {

    item.addEventListener("click", function(event) {

        event.preventDefault();

        const pageName =
            this.dataset.page;

        if (!pageName) return;

        openPage(pageName);

    });

});


function openPage(pageName) {

    navItems.forEach(item => {

        item.classList.remove("active");

    });


    const selectedNav =
        document.querySelector(
            `.nav-item[data-page="${pageName}"]`
        );


    if (selectedNav) {

        selectedNav.classList.add("active");

    }


    pages.forEach(page => {

        page.classList.remove("active");

    });


    const selectedPage =
        document.getElementById(
            `page-${pageName}`
        );


    if (selectedPage) {

        selectedPage.classList.add("active");

    }


    if (breadcrumbCurrent) {

        if (pageName === "albaranes-consulta") {

            breadcrumbCurrent.textContent =
                "Consultar albaranes";

        } else if (selectedNav) {

            const text =
                selectedNav.querySelector("span");

            if (text) {

                breadcrumbCurrent.textContent =
                    text.textContent;

            }

        }

    }


    if (sidebar) {

        sidebar.classList.remove("open");

    }


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
   BÚSQUEDA GLOBAL
   ========================================================= */

if (globalSearch) {

    globalSearch.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Enter") return;

            const search =
                this.value.trim();

            if (!search) return;

            const texto =
                search.toLowerCase();

            if (
                texto.includes("albaran") ||
                texto.includes("albarán")
            ) {

                abrirConsultaAlbaranes();

            } else {

                console.log(
                    "Búsqueda global:",
                    search
                );

            }

        }
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
   CARGAR ALBARANES
   ========================================================= */

function cargarAlbaranes() {

    try {

        const datos =
            localStorage.getItem(
                ALBARANES_STORAGE_KEY
            );


        if (datos) {

            albaranes =
                JSON.parse(datos);

        } else {

            albaranes = [];

        }

    } catch (error) {

        console.error(
            "Error cargando albaranes:",
            error
        );

        albaranes = [];

    }

}


/* =========================================================
   GUARDAR ALBARANES
   ========================================================= */

function guardarAlbaranes() {

    try {

        localStorage.setItem(
            ALBARANES_STORAGE_KEY,
            JSON.stringify(albaranes)
        );

        return true;

    } catch (error) {

        console.error(
            "Error guardando albaranes:",
            error
        );

        alert(
            "No se ha podido guardar la información."
        );

        return false;

    }

}


/* =========================================================
   FORMATEAR FECHA
   ========================================================= */

function formatearFecha(fecha) {

    if (!fecha) return "-";

    const partes =
        fecha.split("-");

    if (partes.length !== 3) {

        return fecha;

    }

    return (
        partes[2] +
        "/" +
        partes[1] +
        "/" +
        partes[0]
    );

}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(texto) {

    if (!texto) return "";

    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   ESTADO
   ========================================================= */

function estadoHTML(estado) {

    if (estado === "Firmado") {

        return `
            <span style="
                display:inline-block;
                padding:5px 9px;
                border-radius:20px;
                background:#e8f4ec;
                color:#2e7546;
                font-size:9px;
                font-weight:700;
            ">
                Firmado
            </span>
        `;

    }


    return `
        <span style="
            display:inline-block;
            padding:5px 9px;
            border-radius:20px;
            background:#fff4df;
            color:#9a6816;
            font-size:9px;
            font-weight:700;
        ">
            Pendiente
        </span>
    `;

}


/* =========================================================
   ABRIR FORMULARIO NUEVO
   ========================================================= */

function abrirFormularioAlbaran() {

    cerrarModalAlbaran();

    albaranEditandoId = null;

    fotografiaActual = "";

    const modal =
        document.createElement("div");

    modal.id =
        "modalAlbaran";


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(10,20,25,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            z-index:9999;
        ">

            <div style="
                width:100%;
                max-width:720px;
                max-height:92vh;
                overflow:auto;
                background:#fff;
                border-radius:14px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">

                <div style="
                    display:flex;
                    align-items:center;
                    justify-content:space-between;
                    padding:20px 24px;
                    border-bottom:1px solid #e5e9eb;
                ">

                    <div>

                        <div style="
                            font-size:9px;
                            letter-spacing:1.2px;
                            font-weight:700;
                            color:#176d79;
                            margin-bottom:5px;
                        ">
                            GESTIÓN DE ALBARANES
                        </div>

                        <h2 style="
                            margin:0;
                            font-size:20px;
                            color:#14222b;
                        ">
                            Nuevo albarán
                        </h2>

                    </div>

                    <button
                        type="button"
                        id="cerrarModalAlbaran"
                        style="
                            width:34px;
                            height:34px;
                            border:0;
                            border-radius:50%;
                            background:#f2f4f5;
                            color:#52616a;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >
                        ×
                    </button>

                </div>


                <form
                    id="formAlbaran"
                    style="padding:24px;"
                >

                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:16px;
                    ">

                        <div>

                            <label style="
                                display:block;
                                font-size:11px;
                                font-weight:700;
                                color:#35434b;
                                margin-bottom:7px;
                            ">
                                Nº DE ALBARÁN *
                            </label>

                            <input
                                type="text"
                                id="numeroAlbaran"
                                required
                                placeholder="Ej. ALB-2026-00125"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:11px 12px;
                                    border:1px solid #d8dfe2;
                                    border-radius:7px;
                                    font-size:12px;
                                "
                            >

                        </div>


                        <div>

                            <label style="
                                display:block;
                                font-size:11px;
                                font-weight:700;
                                color:#35434b;
                                margin-bottom:7px;
                            ">
                                FECHA *
                            </label>

                            <input
                                type="date"
                                id="fechaAlbaran"
                                required
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:11px 12px;
                                    border:1px solid #d8dfe2;
                                    border-radius:7px;
                                    font-size:12px;
                                "
                            >

                        </div>

                    </div>


                    <div style="margin-top:16px;">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            color:#35434b;
                            margin-bottom:7px;
                        ">
                            CLIENTE *
                        </label>

                        <input
                            type="text"
                            id="clienteAlbaran"
                            required
                            placeholder="Nombre del cliente"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:11px 12px;
                                border:1px solid #d8dfe2;
                                border-radius:7px;
                                font-size:12px;
                            "
                        >

                    </div>


                    <div style="margin-top:18px;">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            color:#35434b;
                            margin-bottom:8px;
                        ">
                            FOTOGRAFÍA DEL ALBARÁN
                        </label>

                        <label
                            for="fotoAlbaran"
                            style="
                                display:flex;
                                flex-direction:column;
                                align-items:center;
                                justify-content:center;
                                min-height:150px;
                                border:2px dashed #cbd8dc;
                                border-radius:10px;
                                background:#f8fafb;
                                cursor:pointer;
                                text-align:center;
                                padding:20px;
                                box-sizing:border-box;
                            "
                        >

                            <i
                                class="fa-solid fa-camera"
                                style="
                                    font-size:28px;
                                    color:#176d79;
                                    margin-bottom:10px;
                                "
                            ></i>

                            <strong style="
                                font-size:12px;
                                color:#26343c;
                                margin-bottom:5px;
                            ">
                                Hacer o seleccionar fotografía
                            </strong>

                            <span style="
                                font-size:10px;
                                color:#7a878e;
                            ">
                                Pulsa aquí para añadir la imagen
                            </span>

                        </label>


                        <input
                            type="file"
                            id="fotoAlbaran"
                            accept="image/*"
                            capture="environment"
                            style="display:none;"
                        >


                        <div
                            id="previewFotoAlbaran"
                            style="
                                margin-top:12px;
                                display:none;
                            "
                        ></div>

                    </div>


                    <div style="margin-top:18px;">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            color:#35434b;
                            margin-bottom:8px;
                        ">
                            ESTADO
                        </label>


                        <div style="
                            display:flex;
                            gap:10px;
                        ">


                            <label style="
                                flex:1;
                                cursor:pointer;
                            ">

                                <input
                                    type="radio"
                                    name="estadoAlbaran"
                                    value="Pendiente"
                                    checked
                                    style="display:none;"
                                >

                                <span
                                    class="estado-option"
                                    style="
                                        display:block;
                                        padding:11px;
                                        text-align:center;
                                        border:1px solid #d8dfe2;
                                        border-radius:7px;
                                        font-size:11px;
                                        font-weight:600;
                                    "
                                >
                                    Pendiente
                                </span>

                            </label>


                            <label style="
                                flex:1;
                                cursor:pointer;
                            ">

                                <input
                                    type="radio"
                                    name="estadoAlbaran"
                                    value="Firmado"
                                    style="display:none;"
                                >

                                <span
                                    class="estado-option"
                                    style="
                                        display:block;
                                        padding:11px;
                                        text-align:center;
                                        border:1px solid #d8dfe2;
                                        border-radius:7px;
                                        font-size:11px;
                                        font-weight:600;
                                    "
                                >
                                    Firmado
                                </span>

                            </label>


                        </div>

                    </div>


                    <div style="margin-top:18px;">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            color:#35434b;
                            margin-bottom:7px;
                        ">
                            OBSERVACIONES
                        </label>

                        <textarea
                            id="observacionesAlbaran"
                            rows="3"
                            placeholder="Observaciones adicionales..."
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:11px 12px;
                                border:1px solid #d8dfe2;
                                border-radius:7px;
                                font-size:12px;
                                resize:vertical;
                            "
                        ></textarea>

                    </div>


                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                        margin-top:24px;
                        padding-top:18px;
                        border-top:1px solid #e5e9eb;
                    ">

                        <button
                            type="button"
                            id="cancelarAlbaran"
                            style="
                                border:1px solid #d5dde0;
                                background:#fff;
                                color:#52616a;
                                padding:10px 18px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            style="
                                border:0;
                                background:#176d79;
                                color:#fff;
                                padding:10px 20px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-floppy-disk"></i>

                            Guardar albarán

                        </button>

                    </div>

                </form>

            </div>

        </div>

    `;


    document.body.appendChild(modal);


    ponerFechaHoy();


    configurarFormularioAlbaran();

}


/* =========================================================
   FECHA DE HOY
   ========================================================= */

function ponerFechaHoy() {

    const input =
        document.getElementById(
            "fechaAlbaran"
        );

    if (!input) return;


    const hoy =
        new Date();


    const year =
        hoy.getFullYear();


    const month =
        String(
            hoy.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            hoy.getDate()
        ).padStart(2, "0");


    input.value =
        `${year}-${month}-${day}`;

}


/* =========================================================
   CONFIGURAR FORMULARIO
   ========================================================= */

function configurarFormularioAlbaran() {

    const cerrar =
        document.getElementById(
            "cerrarModalAlbaran"
        );


    const cancelar =
        document.getElementById(
            "cancelarAlbaran"
        );


    const foto =
        document.getElementById(
            "fotoAlbaran"
        );


    const formulario =
        document.getElementById(
            "formAlbaran"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarModalAlbaran
        );

    }


    if (cancelar) {

        cancelar.addEventListener(
            "click",
            cerrarModalAlbaran
        );

    }


    if (foto) {

        foto.addEventListener(
            "change",
            procesarFotografia
        );

    }


    document
        .querySelectorAll(
            'input[name="estadoAlbaran"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    actualizarEstadoVisual
                );

            }
        );


    actualizarEstadoVisual();


    if (formulario) {

        formulario.addEventListener(
            "submit",
            guardarNuevoAlbaran
        );

    }

}


/* =========================================================
   CERRAR MODAL
   ========================================================= */

function cerrarModalAlbaran() {

    const modal =
        document.getElementById(
            "modalAlbaran"
        );


    if (modal) {

        modal.remove();

    }

}


/* =========================================================
   FOTOGRAFÍA
   ========================================================= */

function procesarFotografia(event) {

    const file =
        event.target.files[0];


    if (!file) return;


    const reader =
        new FileReader();


    reader.onload = function(e) {

        fotografiaActual =
            e.target.result;


        mostrarPreviewFotografia(
            fotografiaActual
        );

    };


    reader.readAsDataURL(file);

}


/* =========================================================
   PREVIEW FOTOGRAFÍA
   ========================================================= */

function mostrarPreviewFotografia(imagen) {

    const preview =
        document.getElementById(
            "previewFotoAlbaran"
        );


    if (!preview) return;


    preview.style.display =
        "block";


    preview.innerHTML = `

        <div style="
            position:relative;
            border:1px solid #dce3e5;
            border-radius:9px;
            overflow:hidden;
            background:#f5f7f8;
        ">

            <img
                src="${imagen}"
                style="
                    width:100%;
                    max-height:280px;
                    object-fit:contain;
                    display:block;
                "
            >

            <button
                type="button"
                id="eliminarFoto"
                style="
                    position:absolute;
                    top:10px;
                    right:10px;
                    width:30px;
                    height:30px;
                    border:0;
                    border-radius:50%;
                    background:rgba(0,0,0,.65);
                    color:#fff;
                    cursor:pointer;
                    font-size:16px;
                "
            >
                ×
            </button>

        </div>

    `;


    const eliminar =
        document.getElementById(
            "eliminarFoto"
        );


    if (eliminar) {

        eliminar.addEventListener(
            "click",
            function() {

                fotografiaActual =
                    "";

                fotoInputReset();

                preview.innerHTML =
                    "";

                preview.style.display =
                    "none";

            }
        );

    }

}


/* =========================================================
   RESET FOTO
   ========================================================= */

function fotoInputReset() {

    const input =
        document.getElementById(
            "fotoAlbaran"
        );


    if (input) {

        input.value =
            "";

    }

}


/* =========================================================
   ESTADO VISUAL
   ========================================================= */

function actualizarEstadoVisual() {

    const radios =
        document.querySelectorAll(
            'input[name="estadoAlbaran"]'
        );


    radios.forEach(radio => {

        const span =
            radio.parentElement.querySelector(
                ".estado-option"
            );


        if (!span) return;


        if (radio.checked) {

            span.style.background =
                "#e7f2f4";

            span.style.borderColor =
                "#176d79";

            span.style.color =
                "#176d79";

        } else {

            span.style.background =
                "#fff";

            span.style.borderColor =
                "#d8dfe2";

            span.style.color =
                "#52616a";

        }

    });

}


/* =========================================================
   GUARDAR NUEVO ALBARÁN
   ========================================================= */

function guardarNuevoAlbaran(event) {

    event.preventDefault();


    const numero =
        document
            .getElementById(
                "numeroAlbaran"
            )
            .value
            .trim();


    const fecha =
        document
            .getElementById(
                "fechaAlbaran"
            )
            .value;


    const cliente =
        document
            .getElementById(
                "clienteAlbaran"
            )
            .value
            .trim();


    const observaciones =
        document
            .getElementById(
                "observacionesAlbaran"
            )
            .value
            .trim();


    const estadoElement =
        document.querySelector(
            'input[name="estadoAlbaran"]:checked'
        );


    const estado =
        estadoElement
            ? estadoElement.value
            : "Pendiente";


    if (
        !numero ||
        !fecha ||
        !cliente
    ) {

        alert(
            "Completa los campos obligatorios."
        );

        return;

    }


    const nuevoAlbaran = {

        id:
            Date.now().toString(),

        numero:
            numero,

        fecha:
            fecha,

        cliente:
            cliente,

        estado:
            estado,

        observaciones:
            observaciones,

        foto:
            fotografiaActual || "",

        creado:
            new Date().toISOString()

    };


    albaranes.unshift(
        nuevoAlbaran
    );


    if (!guardarAlbaranes()) {

        albaranes.shift();

        return;

    }


    renderizarAlbaranes();

    actualizarResumenAlbaranes();

    renderizarConsultaAlbaranes();


    cerrarModalAlbaran();

    fotografiaActual =
        "";


    alert(
        "Albarán guardado correctamente."
    );

}


/* =========================================================
   RENDER TABLA PRINCIPAL
   ========================================================= */

function renderizarAlbaranes() {

    const tbody =
        document.getElementById(
            "albaranesTableBody"
        );


    if (!tbody) return;


    if (albaranes.length === 0) {

        tbody.innerHTML = `

            <tr class="empty-table-row">

                <td colspan="5">

                    <div class="empty-table">

                        <i class="fa-solid fa-file-circle-plus"></i>

                        <strong>
                            Todavía no hay albaranes
                        </strong>

                        <span>
                            Los albaranes que registres aparecerán aquí.
                        </span>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        albaranes
            .slice(0, 10)
            .map(
                albaran => filaAlbaranHTML(
                    albaran
                )
            )
            .join("");

}


/* =========================================================
   FILA ALBARÁN
   ========================================================= */

function filaAlbaranHTML(albaran) {

    return `

        <tr>

            <td>

                <strong>
                    ${escaparHTML(
                        albaran.numero
                    )}
                </strong>

            </td>


            <td>
                ${formatearFecha(
                    albaran.fecha
                )}
            </td>


            <td>
                ${escaparHTML(
                    albaran.cliente
                )}
            </td>


            <td>
                ${estadoHTML(
                    albaran.estado
                )}
            </td>


            <td>

                <div style="
                    display:flex;
                    gap:6px;
                ">

                    <button
                        type="button"
                        onclick="verAlbaran('${albaran.id}')"
                        title="Ver albarán"
                        style="
                            width:30px;
                            height:30px;
                            border:0;
                            border-radius:6px;
                            background:#edf4f5;
                            color:#176d79;
                            cursor:pointer;
                        "
                    >
                        <i class="fa-solid fa-eye"></i>
                    </button>


                    <button
                        type="button"
                        onclick="eliminarAlbaran('${albaran.id}')"
                        title="Eliminar"
                        style="
                            width:30px;
                            height:30px;
                            border:0;
                            border-radius:6px;
                            background:#f7eeee;
                            color:#a14d4d;
                            cursor:pointer;
                        "
                    >
                        <i class="fa-solid fa-trash"></i>
                    </button>

                </div>

            </td>

        </tr>

    `;

}


/* =========================================================
   RESUMEN
   ========================================================= */

function actualizarResumenAlbaranes() {

    const total =
        albaranes.length;


    const pendientes =
        albaranes.filter(
            item =>
                item.estado === "Pendiente"
        ).length;


    const firmados =
        albaranes.filter(
            item =>
                item.estado === "Firmado"
        ).length;


    const ahora =
        new Date();


    const esteMes =
        albaranes.filter(
            item => {

                if (!item.fecha) {
                    return false;
                }


                const fecha =
                    new Date(
                        item.fecha +
                        "T00:00:00"
                    );


                return (
                    fecha.getMonth() ===
                    ahora.getMonth() &&
                    fecha.getFullYear() ===
                    ahora.getFullYear()
                );

            }
        ).length;


    const totalElement =
        document.getElementById(
            "totalAlbaranes"
        );


    const pendientesElement =
        document.getElementById(
            "albaranesPendientes"
        );


    const firmadosElement =
        document.getElementById(
            "albaranesFirmados"
        );


    const mesElement =
        document.getElementById(
            "albaranesMes"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (pendientesElement) {

        pendientesElement.textContent =
            pendientes;

    }


    if (firmadosElement) {

        firmadosElement.textContent =
            firmados;

    }


    if (mesElement) {

        mesElement.textContent =
            esteMes;

    }

}


/* =========================================================
   CONSULTA
   ========================================================= */

function abrirConsultaAlbaranes() {

    openPage(
        "albaranes-consulta"
    );


    renderizarConsultaAlbaranes();

}


function obtenerAlbaranesFiltrados() {

    const buscar =
        document.getElementById(
            "consultaBuscar"
        );


    const fechaDesde =
        document.getElementById(
            "consultaFechaDesde"
        );


    const fechaHasta =
        document.getElementById(
            "consultaFechaHasta"
        );


    const estado =
        document.getElementById(
            "consultaEstado"
        );


    const texto =
        buscar
            ? buscar.value
                .trim()
                .toLowerCase()
            : "";


    const desde =
        fechaDesde
            ? fechaDesde.value
            : "";


    const hasta =
        fechaHasta
            ? fechaHasta.value
            : "";


    const estadoValor =
        estado
            ? estado.value
            : "Todos";


    return albaranes.filter(
        albaran => {

            const numero =
                String(
                    albaran.numero || ""
                ).toLowerCase();


            const cliente =
                String(
                    albaran.cliente || ""
                ).toLowerCase();


            if (
                texto &&
                !numero.includes(texto) &&
                !cliente.includes(texto)
            ) {

                return false;

            }


            if (
                desde &&
                albaran.fecha < desde
            ) {

                return false;

            }


            if (
                hasta &&
                albaran.fecha > hasta
            ) {

                return false;

            }


            if (
                estadoValor !== "Todos" &&
                albaran.estado !== estadoValor
            ) {

                return false;

            }


            return true;

        }
    );

}


function renderizarConsultaAlbaranes() {

    const tbody =
        document.getElementById(
            "consultaAlbaranesTableBody"
        );


    if (!tbody) return;


    const resultados =
        obtenerAlbaranesFiltrados();


    const contador =
        document.getElementById(
            "consultaContador"
        );


    const texto =
        document.getElementById(
            "consultaResultadosTexto"
        );


    if (contador) {

        contador.textContent =
            `${resultados.length} ${
                resultados.length === 1
                    ? "albarán"
                    : "albaranes"
            }`;

    }


    if (texto) {

        texto.textContent =
            "Resultados según los filtros seleccionados";

    }


    if (resultados.length === 0) {

        tbody.innerHTML = `

            <tr class="empty-table-row">

                <td colspan="5">

                    <div class="empty-table">

                        <i class="fa-solid fa-magnifying-glass"></i>

                        <strong>
                            No se encontraron albaranes
                        </strong>

                        <span>
                            Prueba a cambiar los filtros de búsqueda.
                        </span>

                    </div>

                </td>

            </tr>

        `;

        return;

    }


    tbody.innerHTML =
        resultados
            .map(
                albaran =>
                    filaAlbaranHTML(
                        albaran
                    )
            )
            .join("");

}


/* =========================================================
   LIMPIAR CONSULTA
   ========================================================= */

function limpiarConsultaAlbaranes() {

    const buscar =
        document.getElementById(
            "consultaBuscar"
        );


    const desde =
        document.getElementById(
            "consultaFechaDesde"
        );


    const hasta =
        document.getElementById(
            "consultaFechaHasta"
        );


    const estado =
        document.getElementById(
            "consultaEstado"
        );


    if (buscar) buscar.value = "";

    if (desde) desde.value = "";

    if (hasta) hasta.value = "";

    if (estado) estado.value = "Todos";


    renderizarConsultaAlbaranes();

}


/* =========================================================
   VER FICHA DEL ALBARÁN
   ========================================================= */

function verAlbaran(id) {

    const albaran =
        albaranes.find(
            item =>
                item.id === id
        );


    if (!albaran) return;


    cerrarModalAlbaran();


    const modal =
        document.createElement("div");


    modal.id =
        "modalVerAlbaran";


    const imagen =
        albaran.foto

            ? `

                <div style="
                    position:relative;
                ">

                    <img
                        src="${albaran.foto}"
                        style="
                            width:100%;
                            max-height:430px;
                            object-fit:contain;
                            border-radius:8px;
                            background:#f5f7f8;
                            display:block;
                        "
                    >

                </div>

            `

            : `

                <div style="
                    min-height:200px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    flex-direction:column;
                    background:#f7f9fa;
                    border-radius:8px;
                    color:#7a878e;
                ">

                    <i
                        class="fa-solid fa-image"
                        style="
                            font-size:30px;
                            margin-bottom:10px;
                        "
                    ></i>

                    <span style="
                        font-size:11px;
                    ">
                        Este albarán no tiene fotografía.
                    </span>

                </div>

            `;


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(10,20,25,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            z-index:9999;
        ">


            <div style="
                width:100%;
                max-width:820px;
                max-height:94vh;
                overflow:auto;
                background:#fff;
                border-radius:14px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">


                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:20px 24px;
                    border-bottom:1px solid #e5e9eb;
                ">


                    <div>

                        <div style="
                            font-size:9px;
                            letter-spacing:1.2px;
                            font-weight:700;
                            color:#176d79;
                            margin-bottom:5px;
                        ">
                            FICHA DE ALBARÁN
                        </div>


                        <h2 style="
                            margin:0;
                            font-size:20px;
                            color:#14222b;
                        ">
                            ${escaparHTML(
                                albaran.numero
                            )}
                        </h2>

                    </div>


                    <button
                        type="button"
                        id="cerrarVerAlbaran"
                        style="
                            width:34px;
                            height:34px;
                            border:0;
                            border-radius:50%;
                            background:#f2f4f5;
                            color:#52616a;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >
                        ×
                    </button>

                </div>


                <div style="
                    padding:24px;
                ">


                    <!-- DATOS -->

                    <div style="
                        display:grid;
                        grid-template-columns:
                            1fr 1fr 1fr;
                        gap:12px;
                        margin-bottom:20px;
                    ">


                        <div style="
                            padding:14px;
                            background:#f7f9fa;
                            border-radius:8px;
                        ">

                            <small style="
                                display:block;
                                font-size:8px;
                                color:#7a878e;
                                margin-bottom:6px;
                            ">
                                FECHA
                            </small>

                            <strong style="
                                font-size:11px;
                            ">
                                ${formatearFecha(
                                    albaran.fecha
                                )}
                            </strong>

                        </div>


                        <div style="
                            padding:14px;
                            background:#f7f9fa;
                            border-radius:8px;
                        ">

                            <small style="
                                display:block;
                                font-size:8px;
                                color:#7a878e;
                                margin-bottom:6px;
                            ">
                                CLIENTE
                            </small>

                            <strong style="
                                font-size:11px;
                            ">
                                ${escaparHTML(
                                    albaran.cliente
                                )}
                            </strong>

                        </div>


                        <div style="
                            padding:14px;
                            background:#f7f9fa;
                            border-radius:8px;
                        ">

                            <small style="
                                display:block;
                                font-size:8px;
                                color:#7a878e;
                                margin-bottom:6px;
                            ">
                                ESTADO
                            </small>

                            ${estadoHTML(
                                albaran.estado
                            )}

                        </div>


                    </div>


                    <!-- FOTO -->

                    <div style="
                        margin-bottom:18px;
                    ">

                        <div style="
                            font-size:9px;
                            font-weight:700;
                            color:#52616a;
                            margin-bottom:8px;
                            letter-spacing:.5px;
                        ">
                            FOTOGRAFÍA DEL ALBARÁN
                        </div>

                        ${imagen}

                    </div>


                    <!-- OBSERVACIONES -->

                    ${
                        albaran.observaciones

                            ? `

                                <div style="
                                    padding:14px;
                                    background:#f7f9fa;
                                    border-radius:8px;
                                    margin-bottom:20px;
                                ">

                                    <small style="
                                        display:block;
                                        font-size:8px;
                                        color:#7a878e;
                                        margin-bottom:6px;
                                    ">
                                        OBSERVACIONES
                                    </small>

                                    <div style="
                                        font-size:11px;
                                        color:#35434b;
                                        line-height:1.5;
                                    ">
                                        ${escaparHTML(
                                            albaran.observaciones
                                        )}
                                    </div>

                                </div>

                            `

                            : ""

                    }


                    <!-- ACCIONES -->

                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:9px;
                        padding-top:18px;
                        border-top:1px solid #e5e9eb;
                    ">


                        <button
                            type="button"
                            id="editarAlbaran"
                            style="
                                border:1px solid #d5dde0;
                                background:#fff;
                                color:#176d79;
                                padding:10px 16px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-pen"></i>

                            Editar

                        </button>


                        <button
                            type="button"
                            id="cambiarEstadoAlbaran"
                            style="
                                border:1px solid #d5dde0;
                                background:#fff;
                                color:#52616a;
                                padding:10px 16px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-rotate"></i>

                            ${
                                albaran.estado === "Firmado"
                                    ? "Marcar pendiente"
                                    : "Marcar firmado"
                            }

                        </button>


                        <button
                            type="button"
                            id="cerrarFichaAlbaran"
                            style="
                                border:0;
                                background:#176d79;
                                color:#fff;
                                padding:10px 18px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >
                            Cerrar
                        </button>


                    </div>


                </div>


            </div>


        </div>

    `;


    document.body.appendChild(
        modal
    );


    document
        .getElementById(
            "cerrarVerAlbaran"
        )
        .addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById(
            "cerrarFichaAlbaran"
        )
        .addEventListener(
            "click",
            () => modal.remove()
        );


    document
        .getElementById(
            "editarAlbaran"
        )
        .addEventListener(
            "click",
            function() {

                modal.remove();

                abrirEdicionAlbaran(
                    albaran.id
                );

            }
        );


    document
        .getElementById(
            "cambiarEstadoAlbaran"
        )
        .addEventListener(
            "click",
            function() {

                cambiarEstadoAlbaran(
                    albaran.id
                );

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                modal.firstElementChild
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   EDITAR ALBARÁN
   ========================================================= */

function abrirEdicionAlbaran(id) {

    const albaran =
        albaranes.find(
            item =>
                item.id === id
        );


    if (!albaran) return;


    albaranEditandoId =
        id;


    fotografiaActual =
        albaran.foto || "";


    cerrarModalAlbaran();


    const modal =
        document.createElement("div");


    modal.id =
        "modalAlbaran";


    modal.innerHTML = `

        <div style="
            position:fixed;
            inset:0;
            background:rgba(10,20,25,.55);
            display:flex;
            align-items:center;
            justify-content:center;
            padding:20px;
            z-index:9999;
        ">

            <div style="
                width:100%;
                max-width:720px;
                max-height:92vh;
                overflow:auto;
                background:#fff;
                border-radius:14px;
                box-shadow:0 20px 60px rgba(0,0,0,.25);
            ">


                <div style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    padding:20px 24px;
                    border-bottom:1px solid #e5e9eb;
                ">


                    <div>

                        <div style="
                            font-size:9px;
                            letter-spacing:1.2px;
                            font-weight:700;
                            color:#176d79;
                            margin-bottom:5px;
                        ">
                            GESTIÓN DE ALBARANES
                        </div>


                        <h2 style="
                            margin:0;
                            font-size:20px;
                            color:#14222b;
                        ">
                            Editar albarán
                        </h2>

                    </div>


                    <button
                        type="button"
                        id="cerrarModalAlbaran"
                        style="
                            width:34px;
                            height:34px;
                            border:0;
                            border-radius:50%;
                            background:#f2f4f5;
                            color:#52616a;
                            cursor:pointer;
                            font-size:18px;
                        "
                    >
                        ×
                    </button>


                </div>


                <form
                    id="formAlbaran"
                    style="padding:24px;"
                >


                    <div style="
                        display:grid;
                        grid-template-columns:1fr 1fr;
                        gap:16px;
                    ">


                        <div>

                            <label style="
                                display:block;
                                font-size:11px;
                                font-weight:700;
                                margin-bottom:7px;
                            ">
                                Nº DE ALBARÁN *
                            </label>


                            <input
                                type="text"
                                id="numeroAlbaran"
                                required
                                value="${escaparHTML(
                                    albaran.numero
                                )}"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:11px 12px;
                                    border:1px solid #d8dfe2;
                                    border-radius:7px;
                                    font-size:12px;
                                "
                            >

                        </div>


                        <div>

                            <label style="
                                display:block;
                                font-size:11px;
                                font-weight:700;
                                margin-bottom:7px;
                            ">
                                FECHA *
                            </label>


                            <input
                                type="date"
                                id="fechaAlbaran"
                                required
                                value="${albaran.fecha}"
                                style="
                                    width:100%;
                                    box-sizing:border-box;
                                    padding:11px 12px;
                                    border:1px solid #d8dfe2;
                                    border-radius:7px;
                                    font-size:12px;
                                "
                            >

                        </div>


                    </div>


                    <div style="
                        margin-top:16px;
                    ">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            margin-bottom:7px;
                        ">
                            CLIENTE *
                        </label>


                        <input
                            type="text"
                            id="clienteAlbaran"
                            required
                            value="${escaparHTML(
                                albaran.cliente
                            )}"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:11px 12px;
                                border:1px solid #d8dfe2;
                                border-radius:7px;
                                font-size:12px;
                            "
                        >

                    </div>


                    <div style="
                        margin-top:18px;
                    ">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            margin-bottom:8px;
                        ">
                            FOTOGRAFÍA
                        </label>


                        <label
                            for="fotoAlbaran"
                            style="
                                display:flex;
                                flex-direction:column;
                                align-items:center;
                                justify-content:center;
                                min-height:120px;
                                border:2px dashed #cbd8dc;
                                border-radius:10px;
                                background:#f8fafb;
                                cursor:pointer;
                                text-align:center;
                                padding:20px;
                                box-sizing:border-box;
                            "
                        >

                            <i
                                class="fa-solid fa-camera"
                                style="
                                    font-size:25px;
                                    color:#176d79;
                                    margin-bottom:8px;
                                "
                            ></i>


                            <strong style="
                                font-size:11px;
                            ">
                                Cambiar fotografía
                            </strong>


                            <span style="
                                font-size:9px;
                                color:#7a878e;
                                margin-top:4px;
                            ">
                                Pulsa aquí para seleccionar una nueva
                            </span>

                        </label>


                        <input
                            type="file"
                            id="fotoAlbaran"
                            accept="image/*"
                            capture="environment"
                            style="display:none;"
                        >


                        <div
                            id="previewFotoAlbaran"
                            style="
                                margin-top:12px;
                            "
                        ></div>


                    </div>


                    <div style="
                        margin-top:18px;
                    ">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            margin-bottom:8px;
                        ">
                            ESTADO
                        </label>


                        <div style="
                            display:flex;
                            gap:10px;
                        ">


                            <label style="
                                flex:1;
                                cursor:pointer;
                            ">

                                <input
                                    type="radio"
                                    name="estadoAlbaran"
                                    value="Pendiente"
                                    ${
                                        albaran.estado === "Pendiente"
                                            ? "checked"
                                            : ""
                                    }
                                    style="display:none;"
                                >


                                <span
                                    class="estado-option"
                                    style="
                                        display:block;
                                        padding:11px;
                                        text-align:center;
                                        border:1px solid #d8dfe2;
                                        border-radius:7px;
                                        font-size:11px;
                                        font-weight:600;
                                    "
                                >
                                    Pendiente
                                </span>

                            </label>


                            <label style="
                                flex:1;
                                cursor:pointer;
                            ">

                                <input
                                    type="radio"
                                    name="estadoAlbaran"
                                    value="Firmado"
                                    ${
                                        albaran.estado === "Firmado"
                                            ? "checked"
                                            : ""
                                    }
                                    style="display:none;"
                                >


                                <span
                                    class="estado-option"
                                    style="
                                        display:block;
                                        padding:11px;
                                        text-align:center;
                                        border:1px solid #d8dfe2;
                                        border-radius:7px;
                                        font-size:11px;
                                        font-weight:600;
                                    "
                                >
                                    Firmado
                                </span>

                            </label>


                        </div>


                    </div>


                    <div style="
                        margin-top:18px;
                    ">

                        <label style="
                            display:block;
                            font-size:11px;
                            font-weight:700;
                            margin-bottom:7px;
                        ">
                            OBSERVACIONES
                        </label>


                        <textarea
                            id="observacionesAlbaran"
                            rows="3"
                            style="
                                width:100%;
                                box-sizing:border-box;
                                padding:11px 12px;
                                border:1px solid #d8dfe2;
                                border-radius:7px;
                                font-size:12px;
                                resize:vertical;
                            "
                        >${escaparHTML(
                            albaran.observaciones || ""
                        )}</textarea>

                    </div>


                    <div style="
                        display:flex;
                        justify-content:flex-end;
                        gap:10px;
                        margin-top:24px;
                        padding-top:18px;
                        border-top:1px solid #e5e9eb;
                    ">


                        <button
                            type="button"
                            id="cancelarAlbaran"
                            style="
                                border:1px solid #d5dde0;
                                background:#fff;
                                color:#52616a;
                                padding:10px 18px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:600;
                                cursor:pointer;
                            "
                        >
                            Cancelar
                        </button>


                        <button
                            type="submit"
                            style="
                                border:0;
                                background:#176d79;
                                color:#fff;
                                padding:10px 20px;
                                border-radius:7px;
                                font-size:11px;
                                font-weight:700;
                                cursor:pointer;
                            "
                        >

                            <i class="fa-solid fa-floppy-disk"></i>

                            Guardar cambios

                        </button>


                    </div>


                </form>


            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    if (albaran.foto) {

        mostrarPreviewFotografia(
            albaran.foto
        );

    }


    configurarFormularioEdicion(
        albaran.id
    );

}


/* =========================================================
   CONFIGURAR EDICIÓN
   ========================================================= */

function configurarFormularioEdicion(id) {

    const cerrar =
        document.getElementById(
            "cerrarModalAlbaran"
        );


    const cancelar =
        document.getElementById(
            "cancelarAlbaran"
        );


    const foto =
        document.getElementById(
            "fotoAlbaran"
        );


    const formulario =
        document.getElementById(
            "formAlbaran"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarModalAlbaran
        );

    }


    if (cancelar) {

        cancelar.addEventListener(
            "click",
            cerrarModalAlbaran
        );

    }


    if (foto) {

        foto.addEventListener(
            "change",
            procesarFotografia
        );

    }


    document
        .querySelectorAll(
            'input[name="estadoAlbaran"]'
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    actualizarEstadoVisual
                );

            }
        );


    actualizarEstadoVisual();


    if (formulario) {

        formulario.addEventListener(
            "submit",
            function(event) {

                guardarEdicionAlbaran(
                    event,
                    id
                );

            }
        );

    }

}


/* =========================================================
   GUARDAR EDICIÓN
   ========================================================= */

function guardarEdicionAlbaran(
    event,
    id
) {

    event.preventDefault();


    const indice =
        albaranes.findIndex(
            item =>
                item.id === id
        );


    if (indice === -1) return;


    const numero =
        document
            .getElementById(
                "numeroAlbaran"
            )
            .value
            .trim();


    const fecha =
        document
            .getElementById(
                "fechaAlbaran"
            )
            .value;


    const cliente =
        document
            .getElementById(
                "clienteAlbaran"
            )
            .value
            .trim();


    const observaciones =
        document
            .getElementById(
                "observacionesAlbaran"
            )
            .value
            .trim();


    const estadoElement =
        document.querySelector(
            'input[name="estadoAlbaran"]:checked'
        );


    const estado =
        estadoElement
            ? estadoElement.value
            : "Pendiente";


    if (
        !numero ||
        !fecha ||
        !cliente
    ) {

        alert(
            "Completa los campos obligatorios."
        );

        return;

    }


    const anterior =
        { ...albaranes[indice] };


    albaranes[indice] = {

        ...albaranes[indice],

        numero:
            numero,

        fecha:
            fecha,

        cliente:
            cliente,

        estado:
            estado,

        observaciones:
            observaciones,

        foto:
            fotografiaActual || ""

    };


    if (!guardarAlbaranes()) {

        albaranes[indice] =
            anterior;

        return;

    }


    renderizarAlbaranes();

    actualizarResumenAlbaranes();

    renderizarConsultaAlbaranes();


    cerrarModalAlbaran();


    fotografiaActual =
        "";


    albaranEditandoId =
        null;


    alert(
        "Albarán actualizado correctamente."
    );

}


/* =========================================================
   CAMBIAR ESTADO
   ========================================================= */

function cambiarEstadoAlbaran(id) {

    const indice =
        albaranes.findIndex(
            item =>
                item.id === id
        );


    if (indice === -1) return;


    const albaran =
        albaranes[indice];


    const nuevoEstado =
        albaran.estado === "Firmado"
            ? "Pendiente"
            : "Firmado";


    albaranes[indice] = {

        ...albaran,

        estado:
            nuevoEstado

    };


    guardarAlbaranes();


    renderizarAlbaranes();

    actualizarResumenAlbaranes();

    renderizarConsultaAlbaranes();


    alert(
        `Albarán marcado como ${nuevoEstado}.`
    );

}


/* =========================================================
   ELIMINAR ALBARÁN
   ========================================================= */

function eliminarAlbaran(id) {

    const albaran =
        albaranes.find(
            item =>
                item.id === id
        );


    if (!albaran) return;


    const confirmar =
        confirm(
            `¿Quieres eliminar el albarán ${albaran.numero}?`
        );


    if (!confirmar) return;


    albaranes =
        albaranes.filter(
            item =>
                item.id !== id
        );


    guardarAlbaranes();


    renderizarAlbaranes();

    actualizarResumenAlbaranes();

    renderizarConsultaAlbaranes();

}


/* =========================================================
   BOTONES DEL MÓDULO ALBARANES
   ========================================================= */

function inicializarBotonesAlbaranes() {

    const btnNuevo =
        document.getElementById(
            "btnNuevoAlbaran"
        );


    const optionEscanear =
        document.getElementById(
            "optionEscanear"
        );


    const optionConsultar =
        document.getElementById(
            "optionConsultar"
        );


    const verTodos =
        document.getElementById(
            "verTodosAlbaranes"
        );


    const btnVolver =
        document.getElementById(
            "btnVolverAlbaranes"
        );


    const btnNuevoConsulta =
        document.getElementById(
            "btnNuevoAlbaranConsulta"
        );


    const btnBuscar =
        document.getElementById(
            "btnBuscarAlbaranes"
        );


    const btnLimpiar =
        document.getElementById(
            "btnLimpiarConsulta"
        );


    if (btnNuevo) {

        btnNuevo.addEventListener(
            "click",
            abrirFormularioAlbaran
        );

    }


    if (optionEscanear) {

        optionEscanear.addEventListener(
            "click",
            abrirFormularioAlbaran
        );

    }


    if (optionConsultar) {

        optionConsultar.addEventListener(
            "click",
            abrirConsultaAlbaranes
        );

    }


    if (verTodos) {

        verTodos.addEventListener(
            "click",
            abrirConsultaAlbaranes
        );

    }


    if (btnVolver) {

        btnVolver.addEventListener(
            "click",
            function() {

                openPage(
                    "albaranes"
                );

            }
        );

    }


    if (btnNuevoConsulta) {

        btnNuevoConsulta.addEventListener(
            "click",
            abrirFormularioAlbaran
        );

    }


    if (btnBuscar) {

        btnBuscar.addEventListener(
            "click",
            renderizarConsultaAlbaranes
        );

    }


    if (btnLimpiar) {

        btnLimpiar.addEventListener(
            "click",
            limpiarConsultaAlbaranes
        );

    }


    const campos =
        document.querySelectorAll(
            "#consultaBuscar, #consultaFechaDesde, #consultaFechaHasta"
        );


    campos.forEach(
        campo => {

            campo.addEventListener(
                "keydown",
                function(event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();

                        renderizarConsultaAlbaranes();

                    }

                }
            );

        }
    );


    const estado =
        document.getElementById(
            "consultaEstado"
        );


    if (estado) {

        estado.addEventListener(
            "change",
            renderizarConsultaAlbaranes
        );

    }

}


/* =========================================================
   BOTONES GENERALES
   ========================================================= */

const textButtons =
    document.querySelectorAll(
        ".text-button"
    );


textButtons.forEach(
    button => {

        if (
            button.id ===
            "verTodosAlbaranes"
        ) {

            return;

        }


        button.addEventListener(
            "click",
            function() {

                console.log(
                    "Operación general"
                );

            }
        );

    }
);


/* =========================================================
   NOTIFICACIONES
   ========================================================= */

const notificationButton =
    document.querySelector(
        ".notifications"
    );


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
   INICIO
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        cargarAlbaranes();

        openPage(
            "dashboard"
        );

        renderizarAlbaranes();

        actualizarResumenAlbaranes();

        renderizarConsultaAlbaranes();

        inicializarBotonesAlbaranes();

        console.log(
            "STEIL · Gestión Interna iniciada correctamente."
        );

    }
);
