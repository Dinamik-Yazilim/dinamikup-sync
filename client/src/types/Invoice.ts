import { text } from 'stream/consumers'
import { Firm } from './Firm'
import { Item } from './Item'
import { Party } from './Party'

export interface Invoice {
  _id?: string
  firm?: Firm
  ioType?: number | 0 | 1
  profileId?: string | any | 'TEMELFATURA' | 'TICARIFATURA' | 'EARSIVFATURA' | 'IHRACAT' | 'YOLCUBERABERFATURA'
  invoiceTypeCode?: string | any | 'SAITS' | 'IADE' | 'TEVKIFAT' | 'ISTISNA' | 'OZELMATRAH' | 'IHRACKAYITLI'
  issueDate?: string
  issueTime?: string
  uuid?: string
  ID?: string
  lineCountNumeric?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  exchangeRate?: ExchangeRate
  taxTotal?: TaxTotal
  withholdingTaxTotal?: TaxTotal[]
  legalMonetaryTotal?: LegalMonetaryTotal
  accountingSupplierParty?: Party
  accountingCustomerParty?: Party
  note?: string[]
  draft?: boolean
}

export interface LegalMonetaryTotal {
  lineExtensionAmount?: number
  taxExclusiveAmount?: number
  taxInclusiveAmount?: number
  allowanceTotalAmount?: number
  chargeTotalAmount?: number
  payableAmount?: number
}
export interface InvoiceLine {
  _id?: string
  invoice?: string
  ioType?: number
  issueDate?: string
  issueTime?: string
  ID?: string
  note?: string[]
  item?: Item
  invoicedQuantity?: number
  unitCode?: string
  price?: number
  lineExtensionAmount?: number
  currency?: string | 'USD' | 'TRY' | 'EUR' | 'RUB' | 'GBP' | undefined
  taxTotal?: TaxTotal
  withholdingTaxTotal?: TaxTotal[]
}

export interface TaxTotal {
  currency?: string
  taxAmount?: number
  taxSubtotal?: TaxSubtotal[]
}

export interface TaxSubtotal {
  taxableAmount?: number
  taxAmount?: number
  percent?: number
  calculationSequenceNumeric?: number
  taxCategory?: {
    taxExemptionReasonCode?: string
    taxExemptionReason?: string
    taxScheme?: {
      name?: string
      taxTypeCode?: string
    }
  }
}

export interface ExchangeRate {
  sourceCurrencyCode?: string
  targetCurrencyCode?: string
  calculationRate?: number
  date?: string
}

export function invoiceTypeName(ioType: number, t: any) {
  if (ioType == 0) {
    return t('Outgoing Invoice')
  } else {
    return t('Incoming Invoice')
  }
}

export function getProfileIdList(t: any) {
  return [
    { _id: 'TEMELFATURA', name: t('TEMELFATURA') },
    { _id: 'TICARIFATURA', name: t('TICARIFATURA') },
    { _id: 'EARSIVFATURA', name: t('EARSIVFATURA') },
    { _id: 'IHRACAT', name: t('IHRACAT') },
    { _id: 'YOLCUBERABERFATURA', name: t('YOLCUBERABERFATURA') },
  ]
}

export function getInvoiceTypeCodeList(t: any) {
  return [
    { _id: 'SATIS', name: t('SATIS') },
    { _id: 'IADE', name: t('IADE') },
    { _id: 'TEVKIFAT', name: t('TEVKIFAT') },
    { _id: 'ISTISNA', name: t('ISTISNA') },
    { _id: 'OZELMATRAH', name: t('OZELMATRAH') },
    { _id: 'IHRACKAYITLI', name: t('IHRACKAYITLI') },
  ]
}

export function showWithholdingTax(val?: number) {
  if (val != undefined && val > 0) {
    if (val > 1) val = val / 100
    switch (val) {
      case 0.1: return '1/10'
      case 0.2: return '2/10'
      case 0.3: return '3/10'
      case 0.4: return '4/10'
      case 0.5: return '5/10'
      case 0.6: return '6/10'
      case 0.7: return '7/10'
      case 0.8: return '8/10'
      case 0.9: return '9/10'
      case 1: return '10/10'
      default: return 'Unknown Rate'
    }
  } else {
    return ''
  }
}

// export const withholdingTaxRateList = [
//   { _id: '0', name: '0/10' },
//   { _id: '0.1', name: '1/10' },
//   { _id: '0.2', name: '2/10' },
//   { _id: '0.3', name: '3/10' },
//   { _id: '0.4', name: '4/10' },
//   { _id: '0.5', name: '5/10' },
//   { _id: '0.6', name: '6/10' },
//   { _id: '0.7', name: '7/10' },
//   { _id: '0.8', name: '8/10' },
//   { _id: '0.9', name: '9/10' },
//   { _id: '0.10', name: '10/10' },
// ]

export const UNIT_CODES: any = {
  "NIU": "Adet",
  "GRM": "g",
  "KGM": "kg",
  "MTR": "m",
  "CMT": "cm",
  "MMT": "mm",
  "LTR": "l",
  "MLT": "ml",
  "MTK": "m²",
  "DMK": "dm²",
  "CMK": "cm²",
  "MMK": "mm²",
  "MTQ": "m³",
  "C62": "Adet(Unit)",
  "CTM": "Karat",
  "SET": "Set",
  "EA": "Each",
  "PR": "Çift",
  "D30": "Brüt Kalori",
  "D40": "Bin Litre",
  "GT": "Gross Ton",
  "CEN": "Yüz Adet",
  "3I": "Kg-Adet",
  "H87": "Parça",
  "HUR": "Saat",
  "DAY": "Gün",
  "MIN": "Dakika",
  "SEC": "Saniye",
  "NAR": "Number of articles",
  "PK": "Paket",
  "BX": "Kutu",
  "CT": "Karton",
  "T3": "Bin Adet",
  "GWH": "Gigawatt Saat",
  "MWH": "Megawatt Saat",
  "KWH": "Kilowatt Saat",
  "KWT": "Kilowatt"
}

export function getUnitCodeList(t: any) {
  return Object.keys(UNIT_CODES).map(key => ({ _id: key, name: t(UNIT_CODES[key]) }))
}

export function getUnitName(unitCode: string) {
  return UNIT_CODES[unitCode] || unitCode
}

export const TAX_TYPE_CODES: any = {
  "0003": "GV Stopajı",
  "0011": "KV Stopajı",
  "0015": "KDV",
  "0021": "BMV",
  "0022": "SMV",
  "0061": "Kaynak Kullanımı Destekleme Fonu Kesintisi",
  "0071": "Petrol Ve Doğalgaz Ürünlerine İlişkin Özel Tüketim Vergisi",
  "0073": "Kolalı Gazoz, Alkollü İçecekler Ve Tütün Mamullerine İlişkin Özel Tüketim Vergisi",
  "0074": "Dayanıklı Tüketim Ve Diğer Mallara İlişkin Özel Tüketim Vergisi",
  "0075": "Alkollü İçeceklere İlişkin Özel Tüketim Vergisi",
  "0076": "Tütün Mamullerine İlişkin Özel Tüketim Vergisi",
  "0077": "Kolalı Gazozlara İlişkin Özel Tüketim Vergisi",
  "1047": "Damga Vergisi",
  "1048": "5035 Sayılı Kanuna Göre Damga Vergisi",
  "4071": "Elektrik Ve Havagazı Tüketim Vergisi",
  "4080": "ÖİV",
  "4081": "5035 SKG ÖİV",
  "4171": "Petrol Ve Doğalgaz Ürünlerine İlişkin ÖTV Tevkifatı",
  "8001": "Borsa Tescil Ücreti",
  "8002": "Enerji Fonu",
  "8004": "TRT Payı",
  "8005": "Elektrik Tüketim Vergisi",
  "8006": "Telsiz Kullanım Ücreti",
  "8007": "Telsiz Ruhsat Ücreti",
  "8008": "Çevre Temizlik Vergisi",
  "9021": "4961 Banka Sigorta Muameleleri Vergisi",
  "9040": "Mera Fonu",
  "9077": "Motorlu Taşıt Araçlarına İlişkin Özel Tüketim Vergisi (Tescile Tabi Olanlar)",
  "9944": "Belediyelere Ödenen Hal Rüsumu"
}

export function getTaxTypeName(taxTypeCode?: string) {
  if (taxTypeCode) {
    if (TAX_TYPE_CODES[taxTypeCode]) {
      return TAX_TYPE_CODES[taxTypeCode] || ''
    } else {
      return 'UNKNOWN'
    }
  } else {
    return 'UNKNOWN'
  }
}

export const WITHHOLDING_TAX_TYPE_CODES = {
  "601": {
    "name": "Yapim İşleri İle Bu İşlerle Birlikte İfa Edilen Mühendislik mimarlik ve Etüt-Proje Hizmetleri",
    "rate": 40
  },
  "602": {
    "name": "Etüt, Plan-Proje, Danişmanlik, Denetim ve Benzeri Hizmetler",
    "rate": 90
  },
  "603": {
    "name": "Makine, Teçhizat, Demirbaş ve Taşitlara Ait Tadil, Bakim ve Onarim Hizmetleri",
    "rate": 70
  },
  "604": {
    "name": "Yemek Servis Hizmeti",
    "rate": 50
  },
  "605": {
    "name": "Organizasyon Hizmeti",
    "rate": 50
  },
  "606": {
    "name": "İşgücü Temin Hizmetleri",
    "rate": 90
  },
  "607": {
    "name": "Özel Güvenlik Hizmeti",
    "rate": 90
  },
  "608": {
    "name": "Yapi Denetim Hizmetleri",
    "rate": 90
  },
  "609": {
    "name": "Fason Olarak Yaptirilan Tekstil ve Konfeksiyon İşleri, Çanta ve Ayakkabi Dikim İşleri ve Bu İşlere Aracilik Hizmetleri",
    "rate": 70
  },
  "610": {
    "name": "Turistik Mağazalara Verilen Müşteri Bulma / Götürme Hizmetleri",
    "rate": 90
  },
  "611": {
    "name": "Spor Kulüplerinin Yayin, Reklâm ve İsim Hakki Gelirlerine Konu İşlemleri",
    "rate": 90
  },
  "612": {
    "name": "Temizlik Hizmeti",
    "rate": 90
  },
  "613": {
    "name": "Çevre ve Bahçe Bakim Hizmetleri",
    "rate": 90
  },
  "614": {
    "name": "Servis Taşimaciliği Hizmeti",
    "rate": 50
  },
  "615": {
    "name": "Her Türlü Baski ve Basim Hizmetleri",
    "rate": 70
  },
  "616": {
    "name": "Diğer Hizmetler",
    "rate": 50
  },
  "617": {
    "name": "Hurda Metalden Elde Edilen Külçe Teslimleri",
    "rate": 70
  },
  "618": {
    "name": "Hurda Metalden Elde Edilenler Dişindaki Bakir, Çinko ve Alüminyum Külçe Teslimleri",
    "rate": 70
  },
  "619": {
    "name": "Bakir, Çinko ve Alüminyum Ürünlerinin Teslimi",
    "rate": 70
  },
  "620": {
    "name": "İstisnadan Vazgeçenlerin Hurda ve Atik Teslimi",
    "rate": 70
  },
  "621": {
    "name": "Metal, Plastik, Lastik, Kauçuk, Kâğit ve Cam Hurda ve Atiklardan Elde Edilen Hammadde Teslimi",
    "rate": 90
  },
  "622": {
    "name": "Pamuk, Tiftik, Yün ve Yapaği İle Ham Post ve Deri Teslimleri",
    "rate": 90
  },
  "623": {
    "name": "Ağaç ve Orman Ürünleri Teslimi",
    "rate": 50
  },
  "624": {
    "name": "Yük Taşimaciliği Hizmeti",
    "rate": 20
  },
  "625": {
    "name": "Ticari Reklam Hizmetleri",
    "rate": 30
  },
  "626": {
    "name": "Diğer Teslimler",
    "rate": 20
  }
}