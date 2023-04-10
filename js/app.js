/**
 * Ejecutar el código una vez que todo ha sido cargado
 */
document.addEventListener('DOMContentLoaded', function() {

    const email = {
        email: '',
        cc: '',
        asunto: '',
        mensaje: ''
    }

    const inputEmail = document.querySelector('#email');
    const inputAsunto = document.querySelector('#asunto');
    const inputMensaje = document.querySelector('#mensaje');
    const inputCC = document.querySelector('#cc');
    const formulario = document.querySelector('#formulario');
    const btnSubmit = document.querySelector('#formulario button[type="submit"]');
    const btnReset = document.querySelector('#formulario button[type="reset"]');
    const spinner = document.querySelector('#spinner');

    /**
     * Asignar eventos
     * El evento "blur" se dispara cuando salimos del input.
     * El evento input verifica todo en "tiempo real"
     */
    inputEmail.addEventListener('input', validar);
    inputAsunto.addEventListener('input', validar);
    inputMensaje.addEventListener('input', validar);
    inputCC.addEventListener('input', validar);

    formulario.addEventListener('submit', enviarEmail);

    btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        resetFormulario();
    });

    /**
     * Simula el envío del email. Añade el spinner y lo oculta después de 3 segundos
     * @param {object} e Evento
     */
    function enviarEmail(e) {
        e.preventDefault();

        spinner.classList.add('flex');
        spinner.classList.remove('hidden');

        setTimeout(() => {
            spinner.classList.remove('flex');
            spinner.classList.add('hidden');

            resetFormulario();

            // Alerta éxito de envio del correo
            const alertaExito = document.createElement('P');
            alertaExito.classList.add('bg-green-500', 'text-white', 'p-2', 'text-center', 'rounded-lg', 'mt-10', 'font-bold', 'text-sm', 'uppercase');
            alertaExito.textContent = 'Mensaje enviado correctamente';

            formulario.appendChild(alertaExito);

            // Ocultar la alerta de éxito después de 3 segundos
            setTimeout(() => {
                alertaExito.remove();
            }, 3000);

        }, 3000);
    }

    /**
     * Valida que el usuario haya escrito en los input
     * @param {object} e Evento
     * @returns void
     */
    function validar(e) {
        /**
         * Debemos eliminar todos los espacios que tenga al inicio o final.
         * e.target tiene toda la información del elemento en el cual está sucediendo el
         * evento. Con e.target.parentElement accedemos al elemento padre del input.
         */
        if ( e.target.value.trim() === '' && e.target.id !== 'cc' ) {
            mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return; // Detiene la ejecución del código si algún campo está vacío
        }

        /**
         * Verifica que el id sea "cc", si el value de este es diferente de un string vacío
         * validará el email ingresado. Si es un email no válido, mostrará una alerta.
         */
        if ( e.target.id === 'cc' && e.target.value !== '' && !validarEmail(e.target.value) ) {
            mostrarAlerta('El email no es válido', e.target.parentElement);
            email[e.target.name] = e.target.value;
            comprobarEmail();
            return;
        }

        if ( e.target.id === 'email' && !validarEmail(e.target.value) ) {
            mostrarAlerta(`El email no es válido`, e.target.parentElement);
            email[e.target.name] = '';
            comprobarEmail();
            return;
        }

        limpiarAlerta(e.target.parentElement);

        // Asignar los valores al objeto "email"
        email[e.target.name] = e.target.value.trim().toLowerCase();

        comprobarEmail();
    }

    /**
     * Muestra una alerta con la descripción del error
     * @param {string} mensaje Descripción del error
     * @param {object} referencia El elemento div en el cual será insertado
     */
    function mostrarAlerta(mensaje, referencia) {
        limpiarAlerta(referencia);

        const error = document.createElement('P');
        error.textContent = mensaje;
        error.classList.add('bg-red-600', 'text-white', 'p-2', 'text-center');

        referencia.appendChild(error);
    }

    /**
     * Elimina la alerta de error del HTML
     * @param {object} referencia Elemento div del cual se eliminará la alerta
     */
    function limpiarAlerta(referencia) {
        // Comprobar si ya exite una alerta
        const alerta = referencia.querySelector('.bg-red-600');

        // Eliminar la alerta si ya existe
        if (alerta) {
            alerta.remove();
        }
    }

    /**
     * Verifica que el email del usuario sea válido
     * @param {string} email Email del usuario
     * @returns {boolean} True si es válido, false si no lo es
     */
    function validarEmail(email) {
        const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
        const resultado = regex.test(email);

        return resultado;
    }

    /**
     * Verifica que en el objeto "email" todos los keys estén llenos.
     * Si todo está en orden, habilita el botón de enviar.
     * @returns void Detiene la ejecución si hay algún campo vacio
     */
    function comprobarEmail() {
        // Si algún campo obligatorio está vacío, deshabilita el botón
        if ( email.email === '' || email.asunto === '' || email.mensaje === '' ) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            
            return;
        }

        // Si cc no está vacío pero tiene un email no válido, deshabilita el botón
        if ( email.cc !== '' && !validarEmail(email.cc) ) {
            btnSubmit.classList.add('opacity-50');
            btnSubmit.disabled = true;
            
            return;
        }

        // Si todo está correcto se le quita la clase opacity y se habilita el botón
        btnSubmit.classList.remove('opacity-50');
        btnSubmit.disabled = false;
    }

    /**
     * Resetea el formulario, limpia el objeto "email" y deshabilita el
     * botón de enviar
     */
    function resetFormulario() {
        // Reiniciar el objeto
        email.email = '';
        email.asunto = '';
        email.mensaje = '';

        formulario.reset();
        comprobarEmail();
    }
});