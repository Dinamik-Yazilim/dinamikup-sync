const { getList, executeSql, getListDb, executeSqlDb } = require('../../lib/mikro/mikroHelper')

exports.mikroV16SatisAktar = function (orgDoc, storeDoc, fisData) {
  return new Promise(async (resolve, reject) => {
    try {
      if (fisData.status != 1) return resolve()
      // if (!fisData.batchNo) return resolve()
      // if (!fisData.stanNo) return resolve()
      const posComputerDoc = await db.storePosComputers.findOne({
        organization: orgDoc._id,
        db: storeDoc.db,
        store: storeDoc._id,
        integrationCode: fisData.stationId,
      })
      if (!posComputerDoc) return reject(`POS Bilgisayari tanimlanmamis. stationId:${fisData.stationId}`)
      if (!posComputerDoc.cashAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} nakit kasa tanimlanmamis`)
      if (!posComputerDoc.bankAccountId) reject(`POS Bilgisayari:${posComputerDoc.name} banka hesabi tanimlanmamis`)

      const tarih = util.yyyyMMdd(fisData.endDate)
      // const depoNo = util.pad(storeDoc.warehouseId, 3)

      let seriNo = posComputerDoc.salesDocNoSerial || ''
      const iade = fisData.type == 3 ? true : false

      let query = `
        DECLARE @Tarih DATETIME='${fisData.endDate.substring(0, 10)}'
        DECLARE @EvrakSeri VARCHAR(50)='${seriNo}';
        DECLARE @EvrakSira INT=0;
        DECLARE @BelgeNo VARCHAR(50)='${seriNo}-${fisData.batchNo || 0}${util.pad(fisData.stanNo || 0, 4)}';
        DECLARE @GirisDepoNo INT = ${iade ? storeDoc.warehouseId : 0};
        DECLARE @CikisDepoNo INT = ${iade ? 0 : storeDoc.warehouseId};
        DECLARE @CariKod VARCHAR(25) = '${storeDoc.defaultFirmId}';

        DECLARE @CHA_TIP INT = ${iade ? 0 : 1};
        DECLARE @CHA_CINS INT = 4;
        DECLARE @CHA_IADE INT = ${iade ? 1 : 0};
        DECLARE @CHA_EVRAKTIP INT = ${iade ? 0 : 63};

        DECLARE @STH_TIP INT = ${iade ? 0 : 1};
        DECLARE @STH_CINS INT = ${iade ? 0 : 1};
        DECLARE @STH_IADE INT = ${iade ? 1 : 0};
        DECLARE @STH_EVRAKTIP INT = ${iade ? 3 : 4};

        DECLARE @CariVergiNo VARCHAR(15)='';
        
        DECLARE @MikroVersionNo nVARCHAR(10)='17.03d'
        DECLARE @MikroUserNo INT = 99;
        DECLARE @SatirNo INT = -1;
        DECLARE @VergiPntr INT = 0;
        DECLARE @VergiYuzde FLOAT = 0;
        DECLARE @VergiMatrah0 FLOAT=0;
        DECLARE @VergiMatrah1 FLOAT=0;
        DECLARE @VergiMatrah2 FLOAT=0;
        DECLARE @VergiMatrah3 FLOAT=0;
        DECLARE @VergiMatrah4 FLOAT=0;
        DECLARE @VergiMatrah5 FLOAT=0;
        DECLARE @VergiMatrah6 FLOAT=0;

        DECLARE @Vergi0 FLOAT=0;
        DECLARE @Vergi1 FLOAT=0;
        DECLARE @Vergi2 FLOAT=0;
        DECLARE @Vergi3 FLOAT=0;
        DECLARE @Vergi4 FLOAT=0;
        DECLARE @Vergi5 FLOAT=0;
        DECLARE @Vergi6 FLOAT=0; 
        DECLARE @OdemeOran FLOAT=0;
        IF EXISTS(SELECT TOP 1 * FROM DEPOLAR) BEGIN
          SELECT TOP 1 @MikroVersionNo=dep_VersionNo FROM DEPOLAR ORDER BY dep_no DESC
        END
      `
      // let cariKod = storeDoc.defaultFirmId
      let cariKod = ''
      if (fisData.musteri) {
        query += `
          DECLARE @CariHesapPattern VARCHAR(25)='${storeDoc.newFirm && storeDoc.newFirm.codePattern || '120.____'}';
          DECLARE @CariMuhKodu VARCHAR(255)='${storeDoc.newFirm && storeDoc.newFirm.accountingCode || '120'}';
          DECLARE @CariName VARCHAR(255)='${fisData.musteri.name.replaceAll("'", "''")}';
          DECLARE @CariUnvan1 VARCHAR(127)=SUBSTRING(@CariName,1,127);
          DECLARE @CariUnvan2 VARCHAR(127)=SUBSTRING(@CariName,128,127);
          DECLARE @CariId VARCHAR(50)='${fisData.musteri.id}';
          DECLARE @CariEmail VARCHAR(255)='${storeDoc.newFirm && storeDoc.newFirm.email || '120'}';
          DECLARE @CariVergiDairesi VARCHAR(50)='${fisData.musteri.taxOffice}';
          DECLARE @CariCepTel VARCHAR(20)=SUBSTRING('${fisData.musteri.phones && fisData.musteri.phones.length > 0 ? fisData.musteri.phones[0].phone : ''}',1,20);
          DECLARE @Adres VARCHAR(255)=SUBSTRING('${fisData.musteri.addresses && fisData.musteri.addresses.length > 0 ? fisData.musteri.addresses[0].address : ''}',1,255);
          DECLARE @AdresCadde VARCHAR(50)=SUBSTRING(@Adres,1,50);
          DECLARE @AdresMahalle VARCHAR(50)=SUBSTRING(@Adres,51,50);
          DECLARE @AdresSokak VARCHAR(50)=SUBSTRING(@Adres,101,50);
          DECLARE @AdresSemt VARCHAR(25)=SUBSTRING(@Adres,151,25);
          DECLARE @CariEInvoice INT = ${fisData.musteri.eInvoice ? 1 : 0};
          DECLARE @CariEInvoiceAlias VARCHAR(120)=SUBSTRING('',1,120);
          DECLARE @CariEWayBill INT = ${fisData.musteri.eWaybill ? 1 : 0};
          DECLARE @CariEWayBillAlias VARCHAR(120)=SUBSTRING('',1,120);

          DECLARE @MaxCariKod VARCHAR(25)='';
          DECLARE @YeniCariKod VARCHAR(25);
          DECLARE @NextCariKodInt BIGINT=1;

          SET @CariVergiNo = '${fisData.musteri.taxNumber || '11111111111'}';

          SELECT @YeniCariKod = cari_kod FROM CARI_HESAPLAR WHERE (cari_Guid=@CariId or cari_ExternalProgramId=@CariId );
          IF @YeniCariKod IS NULL BEGIN

            SELECT @MaxCariKod= REPLACE(RTRIM(MAX(cari_kod)),' ','.') FROM CARI_HESAPLAR WHERE  cari_kod like @CariHesapPattern 
            and ISNUMERIC(REPLACE(REPLACE(cari_kod,' ',''),'.',''))=1;

            IF NOT @MaxCariKod IS NULL BEGIN
              SELECT TOP 1 @MaxCariKod=Item FROM SplitToItems(@MaxCariKod,'.') ORDER BY ItemNumber DESC
            END ELSE BEGIN
              SET @MaxCariKod=REPLACE(STR('',LEN(@CariHesapPattern)-LEN(REPLACE(@CariHesapPattern,'_',''))),' ','0');
              PRINT @MaxCariKod;
            END
            SET @NextCariKodInt=CAST(@MaxCariKod as bigint)+1

            SET @YeniCariKod=REPLACE(@CariHesapPattern,'_','') + REPLACE(STR(@NextCariKodInt,LEN(@MaxCariKod)),' ', '0')
            


            INSERT INTO CARI_HESAPLAR(cari_Guid, cari_DBCno, cari_SpecRECno, cari_iptal, cari_fileid, cari_hidden, cari_kilitli, cari_degisti, cari_checksum, cari_create_user,
              cari_create_date, cari_lastup_user, cari_lastup_date, cari_special1, cari_special2, cari_special3, cari_MainProgramNo, cari_VersionNo, cari_MenuNo, cari_MikroSpecial1, 
              cari_MikroSpecial2, cari_MikroSpecial3, cari_ExternalProgramType, cari_ExternalProgramId, cari_Hash, cari_kod, cari_unvan1, cari_unvan2, cari_hareket_tipi, cari_baglanti_tipi, 
              cari_stok_alim_cinsi, cari_stok_satim_cinsi, cari_muh_kod, cari_muh_kod1, cari_muh_kod2, cari_doviz_cinsi, cari_doviz_cinsi1, cari_doviz_cinsi2, cari_vade_fark_yuz, cari_vade_fark_yuz1,
              cari_vade_fark_yuz2, cari_KurHesapSekli, cari_vdaire_adi, cari_vdaire_no, cari_sicil_no, cari_VergiKimlikNo, cari_satis_fk, cari_odeme_cinsi, cari_odeme_gunu, cari_odemeplan_no, 
              cari_opsiyon_gun, cari_cariodemetercihi, cari_fatura_adres_no, cari_sevk_adres_no, cari_banka_tcmb_kod1, cari_banka_tcmb_subekod1, cari_banka_tcmb_ilkod1, cari_banka_hesapno1,
              cari_banka_swiftkodu1, cari_banka_tcmb_kod2, cari_banka_tcmb_subekod2, cari_banka_tcmb_ilkod2, cari_banka_hesapno2, cari_banka_swiftkodu2, cari_banka_tcmb_kod3, cari_banka_tcmb_subekod3,
              cari_banka_tcmb_ilkod3, cari_banka_hesapno3, cari_banka_swiftkodu3, cari_banka_tcmb_kod4, cari_banka_tcmb_subekod4, cari_banka_tcmb_ilkod4, cari_banka_hesapno4, cari_banka_swiftkodu4,
              cari_banka_tcmb_kod5, cari_banka_tcmb_subekod5, cari_banka_tcmb_ilkod5, cari_banka_hesapno5, cari_banka_swiftkodu5, cari_banka_tcmb_kod6, cari_banka_tcmb_subekod6, cari_banka_tcmb_ilkod6,
              cari_banka_hesapno6, cari_banka_swiftkodu6, cari_banka_tcmb_kod7, cari_banka_tcmb_subekod7, cari_banka_tcmb_ilkod7, cari_banka_hesapno7, cari_banka_swiftkodu7, cari_banka_tcmb_kod8, 
              cari_banka_tcmb_subekod8, cari_banka_tcmb_ilkod8, cari_banka_hesapno8, cari_banka_swiftkodu8, cari_banka_tcmb_kod9, cari_banka_tcmb_subekod9, cari_banka_tcmb_ilkod9, cari_banka_hesapno9, 
              cari_banka_swiftkodu9, cari_banka_tcmb_kod10, cari_banka_tcmb_subekod10, cari_banka_tcmb_ilkod10, cari_banka_hesapno10, cari_banka_swiftkodu10, cari_EftHesapNum, cari_Ana_cari_kodu, 
              cari_satis_isk_kod, cari_sektor_kodu, cari_bolge_kodu, cari_grup_kodu, cari_temsilci_kodu, cari_muhartikeli, cari_firma_acik_kapal, cari_BUV_tabi_fl, cari_cari_kilitli_flg, 
              cari_etiket_bas_fl, cari_Detay_incele_flg, cari_efatura_fl, cari_POS_ongpesyuzde, cari_POS_ongtaksayi, cari_POS_ongIskOran, cari_kaydagiristarihi, cari_KabEdFCekTutar, cari_hal_caritip, 
              cari_HalKomYuzdesi, cari_TeslimSuresi, cari_wwwadresi, cari_EMail, cari_CepTel, cari_VarsayilanGirisDepo, cari_VarsayilanCikisDepo, cari_Portal_Enabled, cari_Portal_PW, 
              cari_BagliOrtaklisa_Firma, cari_kampanyakodu, cari_b_bakiye_degerlendirilmesin_fl, cari_a_bakiye_degerlendirilmesin_fl, cari_b_irsbakiye_degerlendirilmesin_fl, 
              cari_a_irsbakiye_degerlendirilmesin_fl, cari_b_sipbakiye_degerlendirilmesin_fl, cari_a_sipbakiye_degerlendirilmesin_fl, cari_KrediRiskTakibiVar_flg, cari_ufrs_fark_muh_kod, 
              cari_ufrs_fark_muh_kod1, cari_ufrs_fark_muh_kod2, cari_odeme_sekli, cari_TeminatMekAlacakMuhKodu, cari_TeminatMekAlacakMuhKodu1, cari_TeminatMekAlacakMuhKodu2, cari_TeminatMekBorcMuhKodu, 
              cari_TeminatMekBorcMuhKodu1, cari_TeminatMekBorcMuhKodu2, cari_VerilenDepozitoTeminatMuhKodu, cari_VerilenDepozitoTeminatMuhKodu1, cari_VerilenDepozitoTeminatMuhKodu2, 
              cari_AlinanDepozitoTeminatMuhKodu, cari_AlinanDepozitoTeminatMuhKodu1, cari_AlinanDepozitoTeminatMuhKodu2, cari_def_efatura_cinsi, cari_otv_tevkifatina_tabii_fl, cari_KEP_adresi, 
              cari_efatura_baslangic_tarihi, cari_mutabakat_mail_adresi, cari_mersis_no, cari_istasyon_cari_kodu, cari_gonderionayi_sms, cari_gonderionayi_email, cari_eirsaliye_fl, 
              cari_eirsaliye_baslangic_tarihi, cari_vergidairekodu, cari_CRM_sistemine_aktar_fl, cari_efatura_xslt_dosya, cari_pasaport_no, cari_kisi_kimlik_bilgisi_aciklama_turu, 
              cari_kisi_kimlik_bilgisi_diger_aciklama, cari_uts_kurum_no, cari_kamu_kurumu_fl, cari_earsiv_xslt_dosya, cari_Perakende_fl, cari_yeni_dogan_mi, cari_eirsaliye_xslt_dosya, 
              cari_def_eirsaliye_cinsi, cari_ozel_butceli_kurum_carisi, cari_nakakincelenmesi, cari_vergimukellefidegil_mi, cari_tasiyicifirma_cari_kodu, cari_nacekodu_1, cari_nacekodu_2, 
              cari_nacekodu_3, cari_sirket_turu, cari_baba_adi, cari_faal_terk, cari_siparis_avans_muh_kod, cari_siparis_avans_muh_kod1, cari_siparis_avans_muh_kod2)
            VALUES(NEWID()	/*cari_Guid*/, 
            0 /*cari_DBCno*/, 0 /*cari_SpecRECno*/, 0 /*cari_iptal*/, 31 /*cari_fileid*/, 0 /*cari_hidden*/, 0 /*cari_kilitli*/, 0 /*cari_degisti*/, 0 /*cari_checksum*/, 
            @MikroUserNo /*cari_create_user*/, GETDATE(), @MikroUserNo /*cari_lastup_user*/, @MikroUserNo, '' /*cari_special1*/, '' /*cari_special2*/, '' /*cari_special3*/, 
            46 /*cari_MainProgramNo*/, @MikroVersionNo /*cari_VersionNo*/, '41110' /*cari_MenuNo*/, '' /*cari_MikroSpecial1*/, '' /*cari_MikroSpecial2*/, '' /*cari_MikroSpecial3*/, 
            0 /*cari_ExternalProgramType*/, @CariId /*cari_ExternalProgramId*/, 0 /*cari_Hash*/, @YeniCariKod /*cari_kod*/, @CariUnvan1 /*cari_unvan1*/, @CariUnvan2 /*cari_unvan2*/,
            0 /*cari_hareket_tipi*/, 0 /*cari_baglanti_tipi*/, 0 /*cari_stok_alim_cinsi*/, 0 /*cari_stok_satim_cinsi*/,@CariMuhKodu /*cari_muh_kod*/, '' /*cari_muh_kod1*/, '' /*cari_muh_kod2*/,
            0 /*cari_doviz_cinsi*/, 255 /*cari_doviz_cinsi1*/, 255 /*cari_doviz_cinsi2*/, 25 /*cari_vade_fark_yuz*/, 0 /*cari_vade_fark_yuz1*/, 0 /*cari_vade_fark_yuz2*/, 1 /*cari_KurHesapSekli*/,
            @CariVergiDairesi /*cari_vdaire_adi*/, @CariVergiNo /*cari_vdaire_no*/, '' /*cari_sicil_no*/, '' /*cari_VergiKimlikNo*/, 1 /*cari_satis_fk*/, 0 /*cari_odeme_cinsi*/,
            0 /*cari_odeme_gunu*/, 0 /*cari_odemeplan_no*/, 0 /*cari_opsiyon_gun*/, 0 /*cari_cariodemetercihi*/, 1 /*cari_fatura_adres_no*/, 1 /*cari_sevk_adres_no*/,
            '' /*cari_banka_tcmb_kod1*/, '' /*cari_banka_tcmb_subekod1*/, '' /*cari_banka_tcmb_ilkod1*/, '' /*cari_banka_hesapno1*/, '' /*cari_banka_swiftkodu1*/, 
            '' /*cari_banka_tcmb_kod2*/, '' /*cari_banka_tcmb_subekod2*/, '' /*cari_banka_tcmb_ilkod2*/, '' /*cari_banka_hesapno2*/, '' /*cari_banka_swiftkodu2*/, 
            '' /*cari_banka_tcmb_kod3*/, '' /*cari_banka_tcmb_subekod3*/, '' /*cari_banka_tcmb_ilkod3*/, '' /*cari_banka_hesapno3*/, '' /*cari_banka_swiftkodu3*/,
            '' /*cari_banka_tcmb_kod4*/, '' /*cari_banka_tcmb_subekod4*/, '' /*cari_banka_tcmb_ilkod4*/, '' /*cari_banka_hesapno4*/, '' /*cari_banka_swiftkodu4*/, 
            '' /*cari_banka_tcmb_kod5*/, '' /*cari_banka_tcmb_subekod5*/, '' /*cari_banka_tcmb_ilkod5*/, '' /*cari_banka_hesapno5*/, '' /*cari_banka_swiftkodu5*/,
            '' /*cari_banka_tcmb_kod6*/, '' /*cari_banka_tcmb_subekod6*/, '' /*cari_banka_tcmb_ilkod6*/, '' /*cari_banka_hesapno6*/, '' /*cari_banka_swiftkodu6*/, 
            '' /*cari_banka_tcmb_kod7*/, '' /*cari_banka_tcmb_subekod7*/, '' /*cari_banka_tcmb_ilkod7*/, '' /*cari_banka_hesapno7*/, '' /*cari_banka_swiftkodu7*/, 
            '' /*cari_banka_tcmb_kod8*/, '' /*cari_banka_tcmb_subekod8*/, '' /*cari_banka_tcmb_ilkod8*/, '' /*cari_banka_hesapno8*/, '' /*cari_banka_swiftkodu8*/,
            '' /*cari_banka_tcmb_kod9*/, '' /*cari_banka_tcmb_subekod9*/, '' /*cari_banka_tcmb_ilkod9*/, '' /*cari_banka_hesapno9*/, '' /*cari_banka_swiftkodu9*/, 
            '' /*cari_banka_tcmb_kod10*/, '' /*cari_banka_tcmb_subekod10*/, '' /*cari_banka_tcmb_ilkod10*/, '' /*cari_banka_hesapno10*/, '' /*cari_banka_swiftkodu10*/,
            1  /*cari_EftHesapNum*/, '' /*cari_Ana_cari_kodu*/, '' /*cari_satis_isk_kod*/, '' /*cari_sektor_kodu*/, '' /*cari_bolge_kodu*/, '' /*cari_grup_kodu*/,
            '' /*cari_temsilci_kodu*/, '' /*cari_muhartikeli*/, 0 /*cari_firma_acik_kapal*/, 0 /*cari_BUV_tabi_fl*/, 0 /*cari_cari_kilitli_flg*/, 0 /*cari_etiket_bas_fl*/, 
            0 /*cari_Detay_incele_flg*/, @CariEInvoice /*cari_efatura_fl*/, 0 /*cari_POS_ongpesyuzde*/, 0 /*cari_POS_ongtaksayi*/, 0 /*cari_POS_ongIskOran*/,
            '1899-12-30 00:00:00.000' /*cari_kaydagiristarihi*/, 0 /*cari_KabEdFCekTutar*/, 0 /*cari_hal_caritip*/, 0 /*cari_HalKomYuzdesi*/, 0 /*cari_TeslimSuresi*/, 
            '' /*cari_wwwadresi*/, @CariEmail /*cari_EMail*/, @CariCepTel /*cari_CepTel*/, 0 /*cari_VarsayilanGirisDepo*/, 0 /*cari_VarsayilanCikisDepo*/, 
            0 /*cari_Portal_Enabled*/, '' /*cari_Portal_PW*/, 0 /*cari_BagliOrtaklisa_Firma*/, '' /*cari_kampanyakodu*/, 0 /*cari_b_bakiye_degerlendirilmesin_fl*/, 
            0 /*cari_a_bakiye_degerlendirilmesin_fl*/, 0 /*cari_b_irsbakiye_degerlendirilmesin_fl*/, 0 /*cari_a_irsbakiye_degerlendirilmesin_fl*/, 
            0 /*cari_b_sipbakiye_degerlendirilmesin_fl*/, 0 /*cari_a_sipbakiye_degerlendirilmesin_fl*/, 0 /*cari_KrediRiskTakibiVar_flg*/, 
            '' /*cari_ufrs_fark_muh_kod*/, '' /*cari_ufrs_fark_muh_kod1*/, '' /*cari_ufrs_fark_muh_kod2*/, 0 /*cari_odeme_sekli*/, '910' /*cari_TeminatMekAlacakMuhKodu*/,
            '' /*cari_TeminatMekAlacakMuhKodu1*/, '' /*cari_TeminatMekAlacakMuhKodu2*/, '912' /*cari_TeminatMekBorcMuhKodu*/, '' /*cari_TeminatMekBorcMuhKodu1*/, 
            '' /*cari_TeminatMekBorcMuhKodu2*/, '226' /*cari_VerilenDepozitoTeminatMuhKodu*/, '' /*cari_VerilenDepozitoTeminatMuhKodu1*/, '' /*cari_VerilenDepozitoTeminatMuhKodu2*/, 
            '326' /*cari_AlinanDepozitoTeminatMuhKodu*/, '' /*cari_AlinanDepozitoTeminatMuhKodu1*/, '' /*cari_AlinanDepozitoTeminatMuhKodu2*/, 
            0 /*cari_def_efatura_cinsi*/, 0 /*cari_otv_tevkifatina_tabii_fl*/, '' /*cari_KEP_adresi*/, '1899-12-31 00:00:00.000' /*cari_efatura_baslangic_tarihi*/, 
            '' /*cari_mutabakat_mail_adresi*/, '' /*cari_mersis_no*/, '' /*cari_istasyon_cari_kodu*/, 0 /*cari_gonderionayi_sms*/, 0 /*cari_gonderionayi_email*/,
            @CariEWayBill /*cari_eirsaliye_fl*/, '1899-12-31 00:00:00.000' /*cari_eirsaliye_baslangic_tarihi*/, '' /*cari_vergidairekodu*/, 0 /*cari_CRM_sistemine_aktar_fl*/, 
            '' /*cari_efatura_xslt_dosya*/, '' /*cari_pasaport_no*/, 0 /*cari_kisi_kimlik_bilgisi_aciklama_turu*/, '' /*cari_kisi_kimlik_bilgisi_diger_aciklama*/,
            '' /*cari_uts_kurum_no*/, 0 /*cari_kamu_kurumu_fl*/, '' /*cari_earsiv_xslt_dosya*/, 0 /*cari_Perakende_fl*/, 0 /*cari_yeni_dogan_mi*/, '' /*cari_eirsaliye_xslt_dosya*/, 
            0 /*cari_def_eirsaliye_cinsi*/, '' /*cari_ozel_butceli_kurum_carisi*/, 0 /*cari_nakakincelenmesi*/, 0 /*cari_vergimukellefidegil_mi*/, '' /*cari_tasiyicifirma_cari_kodu*/, 
            '' /*cari_nacekodu_1*/, '' /*cari_nacekodu_2*/, '' /*cari_nacekodu_3*/, 0 /*cari_sirket_turu*/, '' /*cari_baba_adi*/, 0 /*cari_faal_terk*/, 
            '' /*cari_siparis_avans_muh_kod*/, '' /*cari_siparis_avans_muh_kod1*/, '' /*cari_siparis_avans_muh_kod2*/);

            INSERT INTO CARI_HESAP_ADRESLERI(adr_Guid, adr_DBCno, adr_SpecRECno, adr_iptal, adr_fileid, adr_hidden, adr_kilitli, adr_degisti, adr_checksum, adr_create_user, adr_create_date, 
            adr_lastup_user, adr_lastup_date, adr_special1, adr_special2, adr_special3, adr_MainProgramNo, adr_VersionNo, adr_MenuNo, adr_MikroSpecial1, adr_MikroSpecial2, adr_MikroSpecial3, 
            adr_ExternalProgramType, adr_ExternalProgramId, adr_Hash, adr_cari_kod, adr_adres_no, adr_aprint_fl, adr_cadde, adr_mahalle, adr_sokak, adr_Semt, adr_Apt_No, adr_Daire_No, adr_posta_kodu, 
            adr_ilce, adr_il, adr_ulke, adr_Adres_kodu, adr_tel_ulke_kodu, adr_tel_bolge_kodu, adr_tel_no1, adr_tel_no2, adr_tel_faxno, adr_tel_modem, adr_yon_kodu, adr_uzaklik_kodu, adr_temsilci_kodu, 
            adr_ozel_not, adr_ziyaretperyodu, adr_ziyaretgunu, adr_gps_enlem, adr_gps_boylam, adr_ziyarethaftasi, adr_ziygunu2_1, adr_ziygunu2_2, adr_ziygunu2_3, adr_ziygunu2_4, adr_ziygunu2_5, 
            adr_ziygunu2_6, adr_ziygunu2_7, adr_efatura_alias, adr_eirsaliye_alias)
            VALUES(NEWID() /*adr_Guid*/, 0, 0, 0, 0, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), '', '', '',
            46 /*adr_MainProgramNo*/, @MikroVersionNo /*adr_VersionNo*/, 0 /*adr_MenuNo*/, '' /*adr_MikroSpecial1*/, '' /*adr_MikroSpecial2*/, '' /*adr_MikroSpecial3*/,
            0 /*adr_ExternalProgramType*/,  @CariId /*adr_ExternalProgramId*/, 0 /*adr_Hash*/, @YeniCariKod /*adr_cari_kod*/, 1 /*adr_adres_no*/, 0 /*adr_aprint_fl*/, 
            @AdresCadde /*adr_cadde*/, @AdresMahalle /*adr_mahalle*/, @AdresSokak /*adr_sokak*/, @AdresSemt /*adr_Semt*/, '' /*adr_Apt_No*/, '' /*adr_Daire_No*/, 
            0 /*adr_posta_kodu*/, '' /*adr_ilce*/, '' /*adr_il*/, 'TÜRKİYE' /*adr_ulke*/, '' /*adr_Adres_kodu*/, '' /*adr_tel_ulke_kodu*/, '' /*adr_tel_bolge_kodu*/, 
            '' /*adr_tel_no1*/, '' /*adr_tel_no2*/, '' /*adr_tel_faxno*/, '' /*adr_tel_modem*/, '' /*adr_yon_kodu*/, 0 /*adr_uzaklik_kodu*/, '' /*adr_temsilci_kodu*/,
            '' /*adr_ozel_not*/, 0 /*adr_ziyaretperyodu*/, 0 /*adr_ziyaretgunu*/, 0 /*adr_gps_enlem*/, 0 /*adr_gps_boylam*/, 0 /*adr_ziyarethaftasi*/, 0 /*adr_ziygunu2_1*/, 
            0 /*adr_ziygunu2_2*/, 0 /*adr_ziygunu2_3*/, 0 /*adr_ziygunu2_4*/, 0 /*adr_ziygunu2_5*/, 0 /*adr_ziygunu2_6*/, 0 /*adr_ziygunu2_7*/,
            @CariEInvoiceAlias /*adr_efatura_alias*/, @CariEWayBillAlias /*adr_eirsaliye_alias*/);

          END
          SET @CariKod=@YeniCariKod;  
        `
      }
      query += `
        IF NOT EXISTS(SELECT * FROM S_${tarih}_${depoNo} WHERE sth_yetkili_uid='${fisData.id}' ) BEGIN
      `
      let satisToplam = 0
      fisData.sales.forEach((e, rowIndex) => {
        if (e.status) {
          let netTutar = e.returnUnitPrice * e.quantity
          let tutar = netTutar / (1 + e.departmentValue / 100)
          let vergi = netTutar - tutar
          satisToplam += netTutar
          query += `
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=${e.departmentValue};
          SELECT @VergiPntr=CASE WHEN fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN ${tutar} ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN ${tutar} ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN ${vergi} ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN ${vergi} ELSE 0 END;
        
          INSERT INTO S_${tarih}_${depoNo} (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, 
          sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, 
          sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), '', '', '', 
          0, 0, @Tarih, @STH_TIP /*sth_tip*/, @STH_CINS /*sth_cins*/, @STH_IADE /*sth_normal_iade*/,@STH_EVRAKTIP /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '${fisData.batchNo || 0}' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '${e.stockCode}' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, @STH_CARI_KODU /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, ${e.quantity} /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          ${tutar} /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          ${vergi} /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '${e.barcode}' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          @GirisDepoNo /*sth_giris_depo_no*/, @CikisDepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '${posComputerDoc.responsibilityId || storeDoc.responsibilityId}' /*sth_cari_srm_merkezi*/, 
          '${posComputerDoc.responsibilityId || storeDoc.responsibilityId}' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '${posComputerDoc.projectId || storeDoc.projectId}' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '${fisData.id}' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/);
        `
        }
      })
      query += `SET @SatirNo=-1;`
      let odemeToplam = 0
      let nakitToplam = 0
      let krediToplam = 0
      let digerToplam = 0
      fisData.payments.forEach(e => {
        if (e.status) {
          if (e.change == false) {
            odemeToplam += e.amount
          } else {
            odemeToplam -= e.amount
          }
          if (e.type == 1) {
            if (e.change == false) {
              nakitToplam += e.amount
            } else {
              nakitToplam -= e.amount
            }
          } else if (e.type == 2) {
            krediToplam += e.amount
          } else {
            digerToplam += e.amount
          }
        }
      })


      // if (nakitToplam > 0) {
      //   query += `SET @SatirNo=@SatirNo+1;\n`
      //   query += odemeInsert(fisData, tarih, depoNo, nakitToplam, odemeToplam)
      // }
      // if (krediToplam > 0) {
      //   query += `SET @SatirNo=@SatirNo+1;\n`
      //   query += odemeInsert(fisData, tarih, depoNo, krediToplam, odemeToplam)
      // }
      // if (digerToplam > 0) {
      //   query += `SET @SatirNo=@SatirNo+1;\n`
      //   query += odemeInsert(fisData, tarih, depoNo, digerToplam, odemeToplam)
      // }

      query += `SET @SatirNo=@SatirNo+1;\n`
      query += odemeV16Insert(fisData, tarih, depoNo, odemeToplam, odemeToplam)

      query += `END`

      // fs.writeFileSync(path.join(__dirname,'logs', 'workdataInsert_query.sql'), query, 'utf8')
      executeSqlDb(orgDoc, storeDoc.db + '_WORKDATA', query)
        .then(resolve)
        .catch(reject)
    } catch (error) {
      reject(error)
    }
  })
}
