export interface DeliveryType {
  _id?:string
  name?:string
  
}


export function deliveryTypeListQuery(top:number=100){
  return `SELECT  TOP ${top} tslt_kod as _id, tslt_kod + ' - ' + tslt_ismi as [name] FROM TESLIM_TURLERI 
  WHERE  (tslt_kod like '%{search}%' or tslt_ismi like '%{search}%')
  ORDER BY tslt_kod`
}