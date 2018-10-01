import React from 'react';
import { NetInfo, Alert } from 'react-native';
import GLOBALS from './Globals';
import CONSTANTS from './ConstantsNG';
import Storage from 'react-native-storage';
import { SQLite } from 'expo';
import axios from 'axios';
import Database from './Database';
import moment from 'moment';

export default class SQLiteHelpers extends React.Component {
   
  constructor(props){
      super(props);
      this.state = {
      }
   }

   actualizarEntrevistasSQLiteBack = async () => {
      let idEvaluador = await this.getEvaluadorLogueado();
      let minInterval = 60; // minutos
      let minIntervalToMill = minInterval * 60 * 1000;
      setInterval(() => {
         console.log("------------------------------BACK-----------------------------------");
         console.log("Id: " + idEvaluador + " - Ejecutado a: " + new Date());
         this.getEvaluacionesSQLite(idEvaluador);
      }, minIntervalToMill);
   }

   actualizarEntrevistasSQLiteButton = async () => {
      let idEvaluador = await this.getEvaluadorLogueado();
      console.log("-------------------------------BUTTON----------------------------------");
      console.log("Button Id: " + idEvaluador + " - Ejecutado a: " + new Date());
      this.getEvaluacionesSQLite(idEvaluador);
   }

   requestEvaluacionesEvaluadorPorDia = (arrayEntrevistasEnMovil, idEvaluador) => {
      NetInfo.isConnected.fetch().done(
         (isConnected) => { 
            if (isConnected) {
               instanceAxios.get('/imputado/getAsignados', {
                  params: { idEvaluador: idEvaluador }
               })
               .then(async (res) => {
                  let arrayEntrevistasReq = res.data.imputados;
                  console.log("Size entrevistas asignadas en el día:", arrayEntrevistasReq.length);
                  console.log("3 Size SQLite on REQ Axios: ", arrayEntrevistasEnMovil.length)
                  if (arrayEntrevistasEnMovil.length > 0) {
                     //Arreglo de IDs de evaluaciones para después evaluar si existen en SQLite
                     arrayIDsImputadosSQLite = arrayEntrevistasEnMovil.map((entrevistaSQLite) => {
                        entrevistaSQLite.data = JSON.parse(entrevistaSQLite.data);
                        return entrevistaSQLite.data.imputado.id;
                     })
                     console.log("Array evaluaciones SQLite" + JSON.stringify(arrayIDsImputadosSQLite));
                     arrayEntrevistasReq.map((entrevistaReq) => {
                        // Guardar en SQLite solo las evaluaciones que no existan en dicha base.
                        if (!arrayIDsImputadosSQLite.includes(entrevistaReq.imputado.id)) {
                          console.log("REQ ID imputado: " + entrevistaReq.imputado.id + " No existe, insertar en SQLite")
                          this.saveEvaluacionSQLite(entrevistaReq);
                        }
                     })
                  } else {
                     if (arrayEntrevistasReq.length > 0) {
                        console.log("Guardando todas las evaluaciones");
                        arrayEntrevistasReq.map((entrevistaReq) => {
                          this.saveEvaluacionSQLite(entrevistaReq);
                        })
                     }
                  }
               })
               .catch(async (error) => {
                  console.log("Error update SQLite: " + JSON.stringify(error))
               });
            } //If
         }// Handle NetInfo
      ); // Fetch NetInfo
   } // End function

   getEvaluacionesSQLite = (idEvaluador) => {
      Database.transaction(
         tx => {
            //tx.executeSql('DELETE FROM entrevistasOffline'),
            tx.executeSql('SELECT * FROM entrevistasOffline', [], (_, { rows: { _array }}) => {
               arrayEvaluacionesSQLiteSelect = _array.map((entrevista) => {
                  return entrevista;
               })
               // Aquí porque es asincrona y no se puede resolver con una Promise
               this.finishQuerySQLiteMovil(arrayEvaluacionesSQLiteSelect, idEvaluador)
            });
         },
         (err) => { console.log("Select Failed Message", err); },
         this.update
      );
   };

   finishQuerySQLiteMovil = (arrayEntrevistasEnMovil, idEvaluador) => {
      //console.log("2 Acabo SQLite select: ", arrayEntrevistasEnMovil.length);
      arrayEntrevistasEnMovil.map((evaluacion) => {
        let now = moment(new Date());
        //let now = moment('31-12-2018', 'DD-MM-YYYY');
        let dateAsignacion = moment(evaluacion.fecha_asignacion, 'DD-MM-YYYY');
        let duration = now.diff(dateAsignacion, 'days')
        /**
         * Si la evaluacion en el dispositivo ya tiene mas de 20 días desde du fecha de asignacion
         * se elimina del dispositivo
         */
        if (duration > 20) {
          console.log("Eliminar entrevista!", evaluacion.id_imputado);
          this.deleteEntrevistaByIdImputado(evaluacion.id_imputado);
        }
      })
      this.requestEvaluacionesEvaluadorPorDia(arrayEntrevistasEnMovil, idEvaluador);
   }

   saveEvaluacionSQLite = (objNuevaEvaluacion) => {
     // Para dar formato al json
      let evaluacionAux = objNuevaEvaluacion.evaluacion;
      delete objNuevaEvaluacion.evaluacion;
      var objEvaluacionToSaveSQLite = Object.assign(objNuevaEvaluacion, evaluacionAux);
      //console.log("Object to save id imputado:", JSON.stringify(objEvaluacionToSaveSQLite));
      Database.transaction(
         tx => {
            tx.executeSql('INSERT INTO entrevistasOffline (tipo_captura, carpeta_investigacion, carpeta_judicial, data, id_imputado, fecha_asignacion, lista_para_envio) values (?, ?, ?, ?, ?, ?, ?)',
              [
                'OFFLINE',
                objEvaluacionToSaveSQLite.carpetaInvestigacion,
                objEvaluacionToSaveSQLite.carpetaJudicial,
                JSON.stringify(objEvaluacionToSaveSQLite),
                objEvaluacionToSaveSQLite.imputado.id,
                objEvaluacionToSaveSQLite.fechaAsignacion,
                0
              ]);
         },
         (err) => { console.log("Insert Failed Message", err) },
         this.update
      );
   }

   // Function return a Promise (resolve or reject)
   getEvaluadorLogueado = async () => {
      return getIDEvaluadorPromise = new Promise((resolve, reject) => {
         storage.load({
            key: 'evaluadorLogueado',
         }).then(async (response) => {
            resolve(response.id);
         }).catch(async (err) => {
            console.log("ERROR ASYNC EVALUADOR LOGUEADO: " + err.message);
            reject("Sin evaluador logueado :(");
         })
      });
   }

  deleteEntrevistaByIdImputado = (idImputado) => {
    Database.transaction(
      tx => {
        tx.executeSql('DELETE FROM entrevistasOffline WHERE id_imputado = ?;',  [idImputado])
      },
      (err) => { console.log("Delete Failed Message", err) },
      this.update
    );
  }

}