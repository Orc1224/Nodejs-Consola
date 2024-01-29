require('colors');
const { guardarDb, leerDB } = require('./helpers/guardar-archivo');
const {inquirerMenu, pausa, leerInput, listadoTareasBorrar,confirmar,mostarListadoCheckList} = require('./helpers/inquierer');
const Tareas = require('./models/tareas');

const main = async () => {

    let opt = '';
    const tareas = new Tareas();
    const tareasDB = leerDB();

    if(tareasDB) {
        tareas.cargarTareasFromArr(tareasDB)
    }

    do {
        /*** Imprimir el Menu */
        opt = await inquirerMenu();
        
        switch (opt) {
            case '1':
                const desc = await leerInput('Descripcion:');
                tareas.crearTarea(desc);
            break;
            case '2': 
                tareas.listadoCompleto(tareas.listadoArr)
            break;
            case '3':
                tareas.listarPendientesCompletadas()
            break;
            case '4':
                tareas.listarPendientesCompletadas(false)
            break;
            case '5':
                const ids = await mostarListadoCheckList(tareas.listadoArr)
                tareas.toogleCompletadas(ids)
            break;
            case '6':
                const id = await listadoTareasBorrar(tareas.listadoArr)
                if(id !== '0') {
                    const ok = await confirmar('¿Estas seguro de borrar el registro')
                    console.log(ok)
                    if(ok){
                        tareas.borrarTarea(id);
                        console.log('Tarea borrada')
                    }
                }
            break;
        }

        guardarDb(tareas.listadoArr);

        await pausa();
        
    } while (opt !== '0');

    // pausa();

}

main();