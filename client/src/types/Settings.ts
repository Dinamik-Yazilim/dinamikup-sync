import { Connector } from "./Connector";

export interface Settings {
    connector:Connector
    mainApp?:string
    mainDb?:string
    firmDb?:string
}