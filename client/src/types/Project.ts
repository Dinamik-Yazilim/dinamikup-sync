export interface Project {
  _id?:string
  name?:string
  
}

export function projectListQuery(top:number=100){
  return `SELECT  TOP ${top} pro_kodu as _id, pro_kodu + ' - ' + pro_adi as [name] FROM PROJELER 
  WHERE  (pro_kodu like '%{search}%' or pro_adi like '%{search}%')
  ORDER BY pro_kodu`
}