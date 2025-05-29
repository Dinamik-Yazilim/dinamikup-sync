export interface PaymentPlan {
  _id?:string
  name?:string
  
}


export function paymentPlanListQuery(top:number=100){
  return `SELECT _id, [name] FROM (
            SELECT '0' as _id, 'Peşin' as [name]
            union all
            SELECT CAST(odp_no as VARCHAR(10)) as _id, LOWER(LTRIM(RTRIM(odp_kodu + ' ' + odp_adi))) as [name]  FROM ODEME_PLANLARI 
            ) X
             WHERE  ([name] like '%{search}%')
             ORDER BY [name]
            `
}