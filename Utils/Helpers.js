import GLOBALS from './Globals';
import CONSTANTS from './ConstantsNG';
import Storage from 'react-native-storage';
import { SQLite } from 'expo';
import axios from 'axios';
const db = SQLite.openDatabase('db.db');

const ActualizarEntrevistasSQLite = () => {
    console.log("Hello helper");
    let minInterval = 0.1;
    let minIntervalToMill = minInterval * 60 * 1000;
    getIDEvaluadorPromise.then((idEvaluadorPromise) => {
        setInterval(function () {
            console.log("-----------------------------------------------------------------");
            console.log("Id: " + idEvaluadorPromise + " - Ejecutado a: " + new Date());
            this.getEvaluacionesSQLitePromise(idEvaluadorPromise);
        }, 10000);
    });
}

testFunction = (arrayEntrevistasEnMovil, idEvaluador) => {
    instanceAxios.get('/imputado/getAsignados', {
            params: {
                idEvaluador: idEvaluador
            }
        })
        .then((res) => {
            // Transactions to SQLite!
            console.log("3 Size SQLite on REQ Axios: ", arrayEntrevistasEnMovil.length)
            arrayEntrevistasEnMovil.map((entrevistaSQLite) => {
                console.log("ID imputado: ", entrevistaSQLite.id_imputado)
            })
            if (arrayEntrevistasEnMovil.length == 0) {
            console.log("If arrayEntrevistasEnMovil")
            db.transaction(
                tx => {
                    tx.executeSql('insert into entrevistasOffline (tipo_captura, carpeta, data, id_imputado, fecha_asignacion, lista_para_envio) values (?, ?, ?, ?, ?, ?)', 
                    [
                        'OFFLINE', 
                        (res.data.imputados[0].carpetaJudicial != null) ? res.data.imputados[0].carpetaJudicial : res.data.imputados[0].carpetaInvestigacion, 
                        JSON.stringify(res.data.imputados[0].evaluacion),
                        res.data.imputados[0].idImputado,
                        res.data.imputados[0].fechaAsignacion,
                        0
                    ]);
                },
                (err) => { console.log("Insert Failed Message", err) },
                this.update
            );
            }
        })
        .catch(async (error) => {
            console.log("Error update SQLite: " + JSON.stringify(error))
        });
}

getEvaluacionesSQLitePromise = (idEvaluador) => {
    
    console.log("Ejecutando promise getEvaluacionesSQLitePromise")
    db.transaction(
        tx => {
            //tx.executeSql('delete from entrevistasOffline;'),
            tx.executeSql('select * from entrevistasOffline', [], (_, { rows: { _array } }) => {
                console.log("1 Number of rows: " + _array.length)
                arrayEvaluacionesSQLiteSelect = _array.map((entrevista) => {
                    return entrevista;
                })
                this.acaboSelectSQLite(arrayEvaluacionesSQLiteSelect, idEvaluador)
            });
        },
        (err) => { console.log("Select Failed Message", err) },
        this.update
    );
};

acaboSelectSQLite = (arrayCompleto, idEvaluador) => {
    console.log("2 Acabo SQLite select: ", arrayCompleto.length)
    this.testFunction(arrayCompleto, idEvaluador);
}

let getIDEvaluadorPromise = new Promise((resolve, reject) => {
    storage.load({
        key: 'evaluadorLogueado',
    }).then(async (response) => {
        resolve(response.id);
    }).catch(async (err) => {
        console.warn("ERROR ASYNC EVALUADOR LOGUEADO: " + err.message);
        resolve(0);
    })
});


export default ActualizarEntrevistasSQLite;