export interface Responsibility {
  _id?:string
  name?:string
  
}


export function responsibilityListQuery(top:number=100){
  return `SELECT  TOP ${top} som_kod as _id, som_kod + ' - ' + som_isim as [name] FROM SORUMLULUK_MERKEZLERI 
  WHERE  (som_kod like '%{search}%' or som_isim like '%{search}%')
  ORDER BY som_kod`
}