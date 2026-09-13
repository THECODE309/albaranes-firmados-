/* ============================================================
   STEIL · GESTIÓN INTERNA
   APP.JS · V2 FUNCIONAL
   ============================================================ */

(function () {
    "use strict";

    /* ============================================================
       CONFIGURACIÓN
    ============================================================ */

    const STORAGE_KEY = "steil_albaranes_v2";

    const PAGE_NAMES = {
        dashboard: "Dashboard",
        clientes: "Clientes",
        proveedores: "Proveedores",
        ofertas: "Ofertas",
        pedidos: "Pedidos",
        albaranes: "Albaranes",
        facturas: "Facturas",
        productos: "Productos",
        almacen: "Almacén",
        inventario: "Inventario",
        whatsapp: "WhatsApp",
        emails: "Correos",
        compras: "Compras",
        gastos: "Gastos",
        informes: "Informes",
        configuracion: "Configuración"
    };


    /* ============================================================
       INICIO
    ============================================================ */

    document.addEventListener("DOMContentLoaded", function () {

        iniciarNavegacion();
        iniciarAlbaranes();
        iniciarBuscadorGlobal();
        iniciarMenu();

        actualizarResumenAlbaranes();
        renderAlbaranesRecientes();

    });


    /* ============================================================
       NAVEGACIÓN PRINCIPAL
    ============================================================ */

    function iniciarNavegacion() {

        const navItems = document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {

            item.addEventListener("click", function (event) {

                event.preventDefault();

                const page = item.dataset.page;

                if (!page) {
                    return;
                }

                mostrarPagina(page);

            });

        });

    }


    function mostrarPagina(pageName) {

        const pages = document.querySelectorAll(".page");

        pages.forEach(function (page) {
            page.classList.remove("active");
        });


        const target = document.getElementById("page-" + pageName);

        if (!target) {
            return;
        }

        target.classList.add("active");


        /* -----------------------------------------
           MENÚ
        ----------------------------------------- */

        const navItems = document.querySelectorAll(".nav-item");

        navItems.forEach(function (item) {

            item.classList.remove("active");

            if (item.dataset.page === pageName) {
                item.classList.add("active");
            }

        });


        /* -----------------------------------------
           BREADCRUMB
        ----------------------------------------- */

        const breadcrumb = document.querySelector(".breadcrumb strong");

        if (breadcrumb) {

            breadcrumb.textContent =
                PAGE_NAMES[pageName] || pageName;

        }


        /* -----------------------------------------
           SI ENTRAMOS EN ALBARANES
        ----------------------------------------- */

        if (pageName === "albaranes") {

            actualizarResumenAlbaranes();
            renderAlbaranesRecientes();

        }


        /* -----------------------------------------
           SI ENTRAMOS EN CONSULTA
        ----------------------------------------- */

        if (pageName === "albaranes-consulta") {

            renderConsultaAlbaranes();

        }


        /* -----------------------------------------
           CERRAR SIDEBAR EN MÓVIL
        ----------------------------------------- */

        const sidebar = document.querySelector(".sidebar");

        if (sidebar && window.innerWidth <= 900) {
            sidebar.classList.remove("open");
        }

    }


    /* ============================================================
       ALBARANES
    ============================================================ */

    function iniciarAlbaranes() {

        /* -----------------------------------------
           CONSULTAR
        ----------------------------------------- */

        const optionConsultar =
            document.getElementById("optionConsultar");

        if (optionConsultar) {

            optionConsultar.addEventListener("click", function () {

                mostrarPagina("albaranes-consulta");

            });

        }


        /* -----------------------------------------
           VER TODOS
        ----------------------------------------- */

        const verTodos =
            document.getElementById("verTodosAlbaranes");

if (verTodos) {

    verTodos.addEventListener("click", function () {

        mostrarPagina("albaranes-consulta");

    });

}


        /* -----------------------------------------
           VOLVER
        ----------------------------------------- */

        const volver =
            document.getElementById("btnVolverAlbaranes");

        if (volver) {

            volver.addEventListener("click", function () {

                mostrarPagina("albaranes");

            });

        }


        /* -----------------------------------------
           NUEVO ALBARÁN DESDE CONSULTA
        ----------------------------------------- */

        const nuevoConsulta =
            document.getElementById("btnNuevoAlbaranConsulta");

        if (nuevoConsulta) {

            nuevoConsulta.addEventListener("click", function () {

                mostrarPagina("albaranes");

                setTimeout(function () {
                    abrirNuevoAlbaran();
                }, 100);

            });

        }


        /* -----------------------------------------
           NUEVO ALBARÁN
        ----------------------------------------- */

        const nuevo =
            document.getElementById("btnNuevoAlbaran");

        if (nuevo) {

            nuevo.addEventListener("click", function () {

                abrirNuevoAlbaran();

            });

        }


        /* -----------------------------------------
           ESCANEAR
        ----------------------------------------- */

        const escanear =
            document.getElementById("optionEscanear");

        if (escanear) {

            escanear.addEventListener("click", function () {

                abrirEscaner();

            });

        }


        /* -----------------------------------------
           BUSCAR
        ----------------------------------------- */

        const buscar =
            document.getElementById("btnBuscarAlbaranes");

        if (buscar) {

            buscar.addEventListener("click", function () {

                renderConsultaAlbaranes();

            });

        }


        /* -----------------------------------------
           LIMPIAR
        ----------------------------------------- */

        const limpiar =
            document.getElementById("btnLimpiarConsulta");

        if (limpiar) {

            limpiar.addEventListener("click", function () {

                const buscarInput =
                    document.getElementById("consultaBuscar");

                const desde =
                    document.getElementById("consultaFechaDesde");

                const hasta =
                    document.getElementById("consultaFechaHasta");

                const estado =
                    document.getElementById("consultaEstado");


                if (buscarInput) {
                    buscarInput.value = "";
                }

                if (desde) {
                    desde.value = "";
                }

                if (hasta) {
                    hasta.value = "";
                }

                if (estado) {
                    estado.value = "Todos";
                }


                renderConsultaAlbaranes();

            });

        }


        /* -----------------------------------------
           ENTER EN BUSCADOR
        ----------------------------------------- */

        const consultaBuscar =
            document.getElementById("consultaBuscar");

        if (consultaBuscar) {

            consultaBuscar.addEventListener("keydown", function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    renderConsultaAlbaranes();

                }

            });

        }

    }



    /* ============================================================
       STORAGE
    ============================================================ */

    function obtenerAlbaranes() {

        try {

            const data =
                localStorage.getItem(STORAGE_KEY);

            if (!data) {
                return [];
            }

            const parsed = JSON.parse(data);

            if (!Array.isArray(parsed)) {
                return [];
            }

            return parsed;

        } catch (error) {

            console.error(
                "Error leyendo albaranes:",
                error
            );

            return [];

        }

    }


    function guardarAlbaranes(albaranes) {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(albaranes)
            );

        } catch (error) {

            console.error(
                "Error guardando albaranes:",
                error
            );

        }

    }


    /* ============================================================
       NUEVO ALBARÁN
    ============================================================ */

    function abrirNuevoAlbaran() {

        abrirModalAlbaran();

    }


    function abrirModalAlbaran(datosIniciales) {

        const datos =
            datosIniciales || {};


        cerrarModal();


        const modal =
            document.createElement("div");

        modal.id = "steilAlbaranModal";

        modal.innerHTML = `

            <div class="steil-modal-overlay">

                <div class="steil-modal">

                    <div class="steil-modal-header">

                        <div>
                            <span class="steil-modal-kicker">
                                GESTIÓN DE ALBARANES
                            </span>

                            <h2>
                                Nuevo albarán
                            </h2>
                        </div>

                        <button
                            type="button"
                            class="steil-modal-close"
                            id="steilCerrarModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    <div class="steil-modal-body">

                        <div class="steil-form-grid">

                            <div class="steil-form-group">

                                <label>
                                    Nº ALBARÁN
                                </label>

                                <input
                                    type="text"
                                    id="steilNumeroAlbaran"
                                    placeholder="Ej. ALB-2026-0149"
                                    value="${escapeHtml(datos.numero || "")}"
                                >

                            </div>


                            <div class="steil-form-group">

                                <label>
                                    FECHA
                                </label>

                                <input
                                    type="date"
                                    id="steilFechaAlbaran"
                                    value="${escapeHtml(
                                        datos.fecha ||
                                        obtenerFechaHoy()
                                    )}"
                                >

                            </div>


                            <div
                                class="steil-form-group"
                                style="grid-column:1/-1;"
                            >

                                <label>
                                    CLIENTE
                                </label>

                                <input
                                    type="text"
                                    id="steilClienteAlbaran"
                                    placeholder="Nombre del cliente"
                                    value="${escapeHtml(datos.cliente || "")}"
                                >

                            </div>


                            <div class="steil-form-group">

                                <label>
                                    ESTADO
                                </label>

                                <select
                                    id="steilEstadoAlbaran"
                                >

                                    <option value="Pendiente">
                                        Pendiente
                                    </option>

                                    <option value="Firmado">
                                        Firmado
                                    </option>

                                </select>

                            </div>


                            <div
                                class="steil-form-group"
                                style="grid-column:1/-1;"
                            >

                                <label>
                                    OBSERVACIONES
                                </label>

                                <textarea
                                    id="steilObservacionesAlbaran"
                                    rows="4"
                                    placeholder="Observaciones..."
                                >${escapeHtml(
                                    datos.observaciones || ""
                                )}</textarea>

                            </div>

                        </div>

                    </div>


                    <div class="steil-modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            id="steilCancelarAlbaran"
                        >
                            Cancelar
                        </button>

                        <button
                            type="button"
                            class="btn btn-primary"
                            id="steilGuardarAlbaran"
                        >
                            <i class="fa-solid fa-check"></i>
                            Guardar albarán
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        /* -----------------------------------------
           ESTADO
        ----------------------------------------- */

        const estado =
            document.getElementById(
                "steilEstadoAlbaran"
            );

        if (estado && datos.estado) {
            estado.value = datos.estado;
        }


        /* -----------------------------------------
           CERRAR
        ----------------------------------------- */

        document
            .getElementById("steilCerrarModal")
            ?.addEventListener(
                "click",
                cerrarModal
            );


        document
            .getElementById("steilCancelarAlbaran")
            ?.addEventListener(
                "click",
                cerrarModal
            );


        /* -----------------------------------------
           GUARDAR
        ----------------------------------------- */

        document
            .getElementById("steilGuardarAlbaran")
            ?.addEventListener(
                "click",
                guardarNuevoAlbaran
            );


        /* -----------------------------------------
           ESC
        ----------------------------------------- */

        document.addEventListener(
            "keydown",
            manejarEscapeModal,
            { once: true }
        );


        setTimeout(function () {

            const numero =
                document.getElementById(
                    "steilNumeroAlbaran"
                );

            if (numero) {
                numero.focus();
            }

        }, 50);

    }


    function guardarNuevoAlbaran() {

        const numero =
            document.getElementById(
                "steilNumeroAlbaran"
            )?.value.trim();


        const fecha =
            document.getElementById(
                "steilFechaAlbaran"
            )?.value;


        const cliente =
            document.getElementById(
                "steilClienteAlbaran"
            )?.value.trim();


        const estado =
            document.getElementById(
                "steilEstadoAlbaran"
            )?.value;


        const observaciones =
            document.getElementById(
                "steilObservacionesAlbaran"
            )?.value.trim();


        if (!numero) {

            mostrarAviso(
                "Introduce el número de albarán."
            );

            return;

        }


        if (!fecha) {

            mostrarAviso(
                "Selecciona la fecha."
            );

            return;

        }


        if (!cliente) {

            mostrarAviso(
                "Introduce el cliente."
            );

            return;

        }


        const albaranes =
            obtenerAlbaranes();


        const existe =
            albaranes.some(function (albaran) {

                return String(albaran.numero)
                    .toLowerCase() ===
                    numero.toLowerCase();

            });


        if (existe) {

            mostrarAviso(
                "Ya existe un albarán con ese número."
            );

            return;

        }


        const nuevo = {

            id:
                "alb_" +
                Date.now() +
                "_" +
                Math.random()
                    .toString(36)
                    .slice(2, 8),

            numero: numero,

            fecha: fecha,

            cliente: cliente,

            estado:
                estado ||
                "Pendiente",

            observaciones:
                observaciones || "",

            creado:
                new Date().toISOString()

        };


        albaranes.unshift(nuevo);


        guardarAlbaranes(albaranes);


        cerrarModal();


        actualizarResumenAlbaranes();
        renderAlbaranesRecientes();


        mostrarAviso(
            "Albarán guardado correctamente.",
            "success"
        );

    }


    /* ============================================================
       ESCÁNER
    ============================================================ */

    function abrirEscaner() {

        const input =
            document.createElement("input");

        input.type = "file";

        input.accept =
            "image/*";

        input.capture =
            "environment";


        input.style.display =
            "none";


        document.body.appendChild(input);


        input.addEventListener(
            "change",
            function () {

                const archivo =
                    input.files &&
                    input.files[0];


                if (!archivo) {

                    input.remove();

                    return;

                }


                input.remove();


                abrirModalAlbaran({

                    fecha:
                        obtenerFechaHoy(),

                    observaciones:
                        "Documento escaneado: " +
                        archivo.name

                });

            }
        );


        input.click();

    }


    /* ============================================================
       RESUMEN ALBARANES
    ============================================================ */

    function actualizarResumenAlbaranes() {

        const albaranes =
            obtenerAlbaranes();


        const total =
            albaranes.length;


        const pendientes =
            albaranes.filter(function (item) {

                return item.estado ===
                    "Pendiente";

            }).length;


        const firmados =
            albaranes.filter(function (item) {

                return item.estado ===
                    "Firmado";

            }).length;


        const hoy =
            new Date();


        const mes =
            hoy.getMonth();


        const ano =
            hoy.getFullYear();


        const esteMes =
            albaranes.filter(function (item) {

                if (!item.fecha) {
                    return false;
                }

                const fecha =
                    new Date(
                        item.fecha +
                        "T00:00:00"
                    );

                return (
                    fecha.getMonth() === mes &&
                    fecha.getFullYear() === ano
                );

            }).length;


        ponerTexto(
            "totalAlbaranes",
            total
        );


        ponerTexto(
            "albaranesPendientes",
            pendientes
        );


        ponerTexto(
            "albaranesFirmados",
            firmados
        );


        ponerTexto(
            "albaranesMes",
            esteMes
        );

    }


    /* ============================================================
       ÚLTIMOS ALBARANES
    ============================================================ */

    function renderAlbaranesRecientes() {

        const tbody =
            document.getElementById(
                "albaranesTableBody"
            );


        if (!tbody) {
            return;
        }


        const albaranes =
            obtenerAlbaranes()
                .sort(
                    ordenarPorFechaDesc
                )
                .slice(0, 10);


        if (!albaranes.length) {

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
                .map(crearFilaAlbaran)
                .join("");


        activarAccionesFilas(tbody);

    }


    /* ============================================================
       CONSULTA
    ============================================================ */

    function renderConsultaAlbaranes() {

        const tbody =
            document.getElementById(
                "consultaAlbaranesTableBody"
            );


        if (!tbody) {
            return;
        }


        const albaranes =
            obtenerAlbaranes();


        const texto =
            document.getElementById(
                "consultaBuscar"
            )?.value
            .trim()
            .toLowerCase() || "";


        const fechaDesde =
            document.getElementById(
                "consultaFechaDesde"
            )?.value || "";


        const fechaHasta =
            document.getElementById(
                "consultaFechaHasta"
            )?.value || "";


        const estado =
            document.getElementById(
                "consultaEstado"
            )?.value || "Todos";


        const filtrados =
            albaranes
                .filter(function (item) {

                    /* BUSCADOR */

                    if (texto) {

                        const numero =
                            String(
                                item.numero || ""
                            ).toLowerCase();

                        const cliente =
                            String(
                                item.cliente || ""
                            ).toLowerCase();

                        if (
                            !numero.includes(texto) &&
                            !cliente.includes(texto)
                        ) {

                            return false;

                        }

                    }


                    /* FECHA DESDE */

                    if (
                        fechaDesde &&
                        item.fecha < fechaDesde
                    ) {

                        return false;

                    }


                    /* FECHA HASTA */

                    if (
                        fechaHasta &&
                        item.fecha > fechaHasta
                    ) {

                        return false;

                    }


                    /* ESTADO */

                    if (
                        estado !== "Todos" &&
                        item.estado !== estado
                    ) {

                        return false;

                    }


                    return true;

                })
                .sort(
                    ordenarPorFechaDesc
                );


        /* -----------------------------------------
           CONTADOR
        ----------------------------------------- */

        const contador =
            document.getElementById(
                "consultaContador"
            );


        if (contador) {

            contador.textContent =
                filtrados.length +
                (
                    filtrados.length === 1
                        ? " albarán"
                        : " albaranes"
                );

        }


        /* -----------------------------------------
           TEXTO
        ----------------------------------------- */

        const textoResultados =
            document.getElementById(
                "consultaResultadosTexto"
            );


        if (textoResultados) {

            if (
                texto ||
                fechaDesde ||
                fechaHasta ||
                estado !== "Todos"
            ) {

                textoResultados.textContent =
                    "Resultados según los filtros aplicados";

            } else {

                textoResultados.textContent =
                    "Mostrando todos los albaranes";

            }

        }


        /* -----------------------------------------
           TABLA
        ----------------------------------------- */

        if (!filtrados.length) {

            tbody.innerHTML = `

                <tr class="empty-table-row">

                    <td colspan="5">

                        <div class="empty-table">

                            <i class="fa-solid fa-magnifying-glass"></i>

                            <strong>
                                No hay albaranes
                            </strong>

                            <span>
                                No se han encontrado albaranes con los filtros seleccionados.
                            </span>

                        </div>

                    </td>

                </tr>

            `;

            return;

        }


        tbody.innerHTML =
            filtrados
                .map(crearFilaAlbaran)
                .join("");


        activarAccionesFilas(tbody);

    }


    /* ============================================================
       FILA DE ALBARÁN
    ============================================================ */

    function crearFilaAlbaran(item) {

        const estado =
            item.estado || "Pendiente";


        const claseEstado =
            estado === "Firmado"
                ? "signed"
                : "pending";


        return `

            <tr data-albaran-id="${escapeHtml(item.id)}">

                <td>

                    <strong>
                        ${escapeHtml(item.numero)}
                    </strong>

                </td>


                <td>
                    ${formatearFecha(item.fecha)}
                </td>


                <td>
                    ${escapeHtml(item.cliente)}
                </td>


                <td>

                    <span
                        class="albaran-status ${claseEstado}"
                    >
                        ${escapeHtml(estado)}
                    </span>

                </td>


                <td>

                    <div
                        class="albaran-row-actions"
                    >

                        <button
                            type="button"
                            class="steil-row-button"
                            data-action="view"
                            data-id="${escapeHtml(item.id)}"
                            title="Ver albarán"
                        >
                            <i class="fa-regular fa-eye"></i>
                        </button>


                        <button
                            type="button"
                            class="steil-row-button"
                            data-action="edit"
                            data-id="${escapeHtml(item.id)}"
                            title="Editar albarán"
                        >
                            <i class="fa-regular fa-pen-to-square"></i>
                        </button>


                        <button
                            type="button"
                            class="steil-row-button danger"
                            data-action="delete"
                            data-id="${escapeHtml(item.id)}"
                            title="Eliminar albarán"
                        >
                            <i class="fa-regular fa-trash-can"></i>
                        </button>

                    </div>

                </td>

            </tr>

        `;

    }


    /* ============================================================
       ACCIONES DE FILA
    ============================================================ */

    function activarAccionesFilas(container) {

        const botones =
            container.querySelectorAll(
                "[data-action]"
            );


        botones.forEach(function (boton) {

            boton.addEventListener(
                "click",
                function () {

                    const action =
                        boton.dataset.action;

                    const id =
                        boton.dataset.id;


                    const albaranes =
                        obtenerAlbaranes();


                    const item =
                        albaranes.find(
                            function (albaran) {
                                return albaran.id === id;
                            }
                        );


                    if (!item) {
                        return;
                    }


                    if (action === "view") {

                        verAlbaran(item);

                    }


                    if (action === "edit") {

                        editarAlbaran(item);

                    }


                    if (action === "delete") {

                        eliminarAlbaran(item);

                    }

                }
            );

        });

    }


    /* ============================================================
       VER ALBARÁN
    ============================================================ */

    function verAlbaran(item) {

        cerrarModal();


        const modal =
            document.createElement("div");


        modal.id =
            "steilAlbaranModal";


        modal.innerHTML = `

            <div class="steil-modal-overlay">

                <div class="steil-modal">

                    <div class="steil-modal-header">

                        <div>

                            <span class="steil-modal-kicker">
                                ALBARÁN
                            </span>

                            <h2>
                                ${escapeHtml(item.numero)}
                            </h2>

                        </div>


                        <button
                            type="button"
                            class="steil-modal-close"
                            id="steilCerrarModal"
                        >
                            <i class="fa-solid fa-xmark"></i>
                        </button>

                    </div>


                    <div class="steil-modal-body">

                        <div class="steil-detail-grid">

                            <div>
                                <span>
                                    Nº ALBARÁN
                                </span>

                                <strong>
                                    ${escapeHtml(item.numero)}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    FECHA
                                </span>

                                <strong>
                                    ${formatearFecha(item.fecha)}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    CLIENTE
                                </span>

                                <strong>
                                    ${escapeHtml(item.cliente)}
                                </strong>
                            </div>


                            <div>
                                <span>
                                    ESTADO
                                </span>

                                <strong>
                                    ${escapeHtml(item.estado || "Pendiente")}
                                </strong>
                            </div>

                        </div>


                        <div class="steil-detail-observaciones">

                            <span>
                                OBSERVACIONES
                            </span>

                            <p>
                                ${
                                    escapeHtml(
                                        item.observaciones ||
                                        "Sin observaciones."
                                    )
                                }
                            </p>

                        </div>

                    </div>


                    <div class="steil-modal-footer">

                        <button
                            type="button"
                            class="btn btn-secondary"
                            id="steilCerrarDetalle"
                        >
                            Cerrar
                        </button>


                        <button
                            type="button"
                            class="btn btn-primary"
                            id="steilEditarDesdeDetalle"
                        >
                            <i class="fa-regular fa-pen-to-square"></i>
                            Editar
                        </button>

                    </div>

                </div>

            </div>

        `;


        document.body.appendChild(modal);


        document
            .getElementById(
                "steilCerrarModal"
            )
            ?.addEventListener(
                "click",
                cerrarModal
            );


        document
            .getElementById(
                "steilCerrarDetalle"
            )
            ?.addEventListener(
                "click",
                cerrarModal
            );


        document
            .getElementById(
                "steilEditarDesdeDetalle"
            )
            ?.addEventListener(
                "click",
                function () {

                    editarAlbaran(item);

                }
            );

    }


    /* ============================================================
       EDITAR
    ============================================================ */

    function editarAlbaran(item) {

        abrirModalAlbaran(item);


        const guardar =
            document.getElementById(
                "steilGuardarAlbaran"
            );


        if (!guardar) {
            return;
        }


        guardar.innerHTML = `

            <i class="fa-solid fa-check"></i>
            Guardar cambios

        `;


        guardar.onclick =
            function () {

                const numero =
                    document.getElementById(
                        "steilNumeroAlbaran"
                    )?.value.trim();


                const fecha =
                    document.getElementById(
                        "steilFechaAlbaran"
                    )?.value;


                const cliente =
                    document.getElementById(
                        "steilClienteAlbaran"
                    )?.value.trim();


                const estado =
                    document.getElementById(
                        "steilEstadoAlbaran"
                    )?.value;


                const observaciones =
                    document.getElementById(
                        "steilObservacionesAlbaran"
                    )?.value.trim();


                if (!numero || !fecha || !cliente) {

                    mostrarAviso(
                        "Completa los campos obligatorios."
                    );

                    return;

                }


                const albaranes =
                    obtenerAlbaranes();


                const indice =
                    albaranes.findIndex(
                        function (albaran) {
                            return albaran.id === item.id;
                        }
                    );


                if (indice === -1) {
                    return;
                }


                const duplicado =
                    albaranes.some(
                        function (albaran) {

                            return (
                                albaran.id !== item.id &&
                                String(albaran.numero)
                                    .toLowerCase() ===
                                numero.toLowerCase()
                            );

                        }
                    );


                if (duplicado) {

                    mostrarAviso(
                        "Ya existe otro albarán con ese número."
                    );

                    return;

                }


                albaranes[indice] = {

                    ...albaranes[indice],

                    numero: numero,

                    fecha: fecha,

                    cliente: cliente,

                    estado:
                        estado ||
                        "Pendiente",

                    observaciones:
                        observaciones || ""

                };


                guardarAlbaranes(albaranes);


                cerrarModal();


                actualizarResumenAlbaranes();
                renderAlbaranesRecientes();
                renderConsultaAlbaranes();


                mostrarAviso(
                    "Albarán actualizado correctamente.",
                    "success"
                );

            };

    }


    /* ============================================================
       ELIMINAR
    ============================================================ */

    function eliminarAlbaran(item) {

        const confirmar =
            window.confirm(
                "¿Quieres eliminar el albarán " +
                item.numero +
                "?"
            );


        if (!confirmar) {
            return;
        }


        const albaranes =
            obtenerAlbaranes()
                .filter(function (albaran) {

                    return albaran.id !== item.id;

                });


        guardarAlbaranes(albaranes);


        actualizarResumenAlbaranes();
        renderAlbaranesRecientes();
        renderConsultaAlbaranes();


        mostrarAviso(
            "Albarán eliminado.",
            "success"
        );

    }


    /* ============================================================
       BUSCADOR GLOBAL
    ============================================================ */

    function iniciarBuscadorGlobal() {

        const input =
            document.getElementById(
                "globalSearch"
            );


        if (!input) {
            return;
        }


        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key !== "Enter") {
                    return;
                }


                const texto =
                    input.value.trim();


                if (!texto) {
                    return;
                }


                /* Buscar albaranes */

                const albaranes =
                    obtenerAlbaranes();


                const coincidencias =
                    albaranes.filter(
                        function (item) {

                            return (

                                String(
                                    item.numero || ""
                                )
                                .toLowerCase()
                                .includes(
                                    texto.toLowerCase()
                                )

                                ||

                                String(
                                    item.cliente || ""
                                )
                                .toLowerCase()
                                .includes(
                                    texto.toLowerCase()
                                )

                            );

                        }
                    );


                if (coincidencias.length) {

                    const consulta =
                        document.getElementById(
                            "consultaBuscar"
                        );


                    if (consulta) {
                        consulta.value = texto;
                    }


                    function mostrarPagina();


                    return;

                }


                mostrarAviso(
                    "No se han encontrado resultados para: " +
                    texto
                );

            }
        );


        /* CTRL + K */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.key.toLowerCase() === "k"
                ) {

                    event.preventDefault();

                    input.focus();

                    input.select();

                }

            }
        );

    }


    /* ============================================================
       MENÚ
    ============================================================ */

    function iniciarMenu() {

        const menuToggle =
            document.getElementById(
                "menuToggle"
            );


        const sidebar =
            document.querySelector(
                ".sidebar"
            );


        if (!menuToggle || !sidebar) {
            return;
        }


        menuToggle.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "open"
                );

            }
        );

    }


    /* ============================================================
       MODAL
    ============================================================ */

    function cerrarModal() {

        const modal =
            document.getElementById(
                "steilAlbaranModal"
            );


        if (modal) {
            modal.remove();
        }

    }


    function manejarEscapeModal(event) {

        if (event.key === "Escape") {
            cerrarModal();
        }

    }


    /* ============================================================
       AVISOS
    ============================================================ */

    function mostrarAviso(
        mensaje,
        tipo
    ) {

        const anterior =
            document.querySelector(
                ".steil-toast"
            );


        if (anterior) {
            anterior.remove();
        }


        const toast =
            document.createElement(
                "div"
            );


        toast.className =
            "steil-toast " +
            (
                tipo === "success"
                    ? "success"
                    : ""
            );


        toast.innerHTML = `

            <i class="fa-solid ${
                tipo === "success"
                    ? "fa-circle-check"
                    : "fa-circle-info"
            }"></i>

            <span>
                ${escapeHtml(mensaje)}
            </span>

        `;


        document.body.appendChild(
            toast
        );


        setTimeout(
            function () {

                toast.classList.add(
                    "hide"
                );


                setTimeout(
                    function () {

                        toast.remove();

                    },
                    250
                );

            },
            2800
        );

    }


    /* ============================================================
       UTILIDADES
    ============================================================ */

    function ponerTexto(
        id,
        valor
    ) {

        const elemento =
            document.getElementById(id);


        if (elemento) {
            elemento.textContent = valor;
        }

    }


    function obtenerFechaHoy() {

        const fecha =
            new Date();


        const ano =
            fecha.getFullYear();


        const mes =
            String(
                fecha.getMonth() + 1
            ).padStart(2, "0");


        const dia =
            String(
                fecha.getDate()
            ).padStart(2, "0");


        return (
            ano +
            "-" +
            mes +
            "-" +
            dia
        );

    }


    function formatearFecha(fecha) {

        if (!fecha) {
            return "—";
        }


        const partes =
            String(fecha).split("-");


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


    function ordenarPorFechaDesc(
        a,
        b
    ) {

        const fechaA =
            String(
                a.fecha || ""
            );


        const fechaB =
            String(
                b.fecha || ""
            );


        if (fechaA === fechaB) {

            return String(
                b.creado || ""
            ).localeCompare(
                String(
                    a.creado || ""
                )
            );

        }


        return fechaB.localeCompare(
            fechaA
        );

    }


    function escapeHtml(valor) {

        return String(
            valor ?? ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* ============================================================
       ESTILOS FUNCIONALES DEL APP.JS
       No sustituye css/style.css
    ============================================================ */

    const style =
        document.createElement(
            "style"
        );


    style.textContent = `

        /* MODAL */

        .steil-modal-overlay {

            position:fixed;
            inset:0;
            z-index:99999;

            display:flex;
            align-items:center;
            justify-content:center;

            padding:20px;

            background:rgba(
                20,
                28,
                32,
                .48
            );

            backdrop-filter:blur(2px);

        }


        .steil-modal {

            width:min(
                620px,
                100%
            );

            max-height:90vh;

            overflow:auto;

            background:#fff;

            border-radius:12px;

            box-shadow:
                0 25px 70px
                rgba(
                    0,
                    0,
                    0,
                    .22
                );

        }


        .steil-modal-header {

            display:flex;

            align-items:center;

            justify-content:space-between;

            padding:22px 24px;

            border-bottom:
                1px solid #e4e8ea;

        }


        .steil-modal-kicker {

            display:block;

            margin-bottom:5px;

            font-size:9px;

            font-weight:800;

            letter-spacing:1px;

            color:#176d79;

        }


        .steil-modal-header h2 {

            margin:0;

            font-size:22px;

            color:#26343a;

        }


        .steil-modal-close {

            width:36px;

            height:36px;

            border:0;

            border-radius:7px;

            background:#f2f4f5;

            color:#52616a;

            cursor:pointer;

        }


        .steil-modal-close:hover {

            background:#e8ecee;

        }


        .steil-modal-body {

            padding:24px;

        }


        .steil-form-grid {

            display:grid;

            grid-template-columns:
                1fr
                1fr;

            gap:16px;

        }


        .steil-form-group {

            display:flex;

            flex-direction:column;

        }


        .steil-form-group label {

            margin-bottom:7px;

            font-size:9px;

            font-weight:800;

            letter-spacing:.5px;

            color:#52616a;

        }


        .steil-form-group input,
        .steil-form-group select,
        .steil-form-group textarea {

            width:100%;

            box-sizing:border-box;

            border:
                1px solid #d8dfe2;

            border-radius:7px;

            padding:
                10px 11px;

            font-family:inherit;

            font-size:12px;

            color:#35434b;

            background:#fff;

            outline:none;

        }


        .steil-form-group input:focus,
        .steil-form-group select:focus,
        .steil-form-group textarea:focus {

            border-color:#176d79;

            box-shadow:
                0 0 0 2px
                rgba(
                    23,
                    109,
                    121,
                    .08
                );

        }


        .steil-modal-footer {

            display:flex;

            justify-content:flex-end;

            gap:10px;

            padding:18px 24px;

            border-top:
                1px solid #e4e8ea;

        }


        /* ESTADO */

        .albaran-status {

            display:inline-flex;

            align-items:center;

            padding:
                5px 9px;

            border-radius:20px;

            font-size:9px;

            font-weight:800;

        }


        .albaran-status.pending {

            background:#fff4dd;

            color:#996900;

        }


        .albaran-status.signed {

            background:#e6f5ee;

            color:#237451;

        }


        /* ACCIONES */

        .albaran-row-actions {

            display:flex;

            gap:5px;

        }


        .steil-row-button {

            width:30px;

            height:30px;

            border:
                1px solid #dce2e4;

            border-radius:6px;

            background:#fff;

            color:#52616a;

            cursor:pointer;

        }


        .steil-row-button:hover {

            background:#f2f5f6;

            color:#176d79;

        }


        .steil-row-button.danger:hover {

            color:#b33a3a;

        }


        /* DETALLE */

        .steil-detail-grid {

            display:grid;

            grid-template-columns:
                1fr
                1fr;

            gap:20px;

        }


        .steil-detail-grid > div {

            display:flex;

            flex-direction:column;

            gap:5px;

        }


        .steil-detail-grid span,
        .steil-detail-observaciones span {

            font-size:9px;

            font-weight:800;

            letter-spacing:.5px;

            color:#7a878d;

        }


        .steil-detail-grid strong {

            font-size:13px;

            color:#26343a;

        }


        .steil-detail-observaciones {

            margin-top:24px;

            padding-top:18px;

            border-top:
                1px solid #e5e9ea;

        }


        .steil-detail-observaciones p {

            margin:
                8px 0 0;

            color:#52616a;

            font-size:12px;

            line-height:1.6;

        }


        /* TOAST */

        .steil-toast {

            position:fixed;

            right:24px;

            bottom:24px;

            z-index:100000;

            display:flex;

            align-items:center;

            gap:10px;

            max-width:420px;

            padding:
                13px 16px;

            border-radius:9px;

            background:#26343a;

            color:#fff;

            box-shadow:
                0 10px 35px
                rgba(
                    0,
                    0,
                    0,
                    .18
                );

            font-size:11px;

            opacity:1;

            transform:
                translateY(0);

            transition:
                opacity .25s ease,
                transform .25s ease;

        }


        .steil-toast.success {

            background:#176d79;

        }


        .steil-toast.hide {

            opacity:0;

            transform:
                translateY(10px);

        }


        /* MÓVIL */

        @media (
            max-width:700px
        ) {

            .steil-form-grid,
            .steil-detail-grid {

                grid-template-columns:
                    1fr;

            }

            .steil-form-group {

                grid-column:
                    auto !important;

            }

            .steil-modal {

                max-height:
                    94vh;

            }

            .steil-modal-header,
            .steil-modal-body,
            .steil-modal-footer {

                padding:
                    16px;

            }

        }

    `;


    document.head.appendChild(
        style
    );


})();
