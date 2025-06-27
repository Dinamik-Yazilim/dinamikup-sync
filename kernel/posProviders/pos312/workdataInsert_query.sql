
        DECLARE @Tarih DATETIME='2025-06-22'
        DECLARE @EvrakSira INT=00000;
        DECLARE @EvrakSeri VARCHAR(50)='K002';
        DECLARE @DepoNo INT = 1001;
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

        IF NOT EXISTS(SELECT * FROM S_20250622_1001 WHERE integrationCode='05a51a7a-2299-4232-8183-96dc224ebba1') BEGIN
      
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=1;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 272.2772277227723 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 272.2772277227723 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 2.7227722772277048 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 2.7227722772277048 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14013784' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 5 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          272.2772277227723 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          2.7227722772277048 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8692813005116' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 136.36363636363635 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 136.36363636363635 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 13.636363636363654 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 13.636363636363654 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14021519' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          136.36363636363635 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          13.636363636363654 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8680014081060' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=1;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 69.3069306930693 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 69.3069306930693 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 0.6930693069306955 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 0.6930693069306955 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14026623' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          69.3069306930693 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          0.6930693069306955 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '08697432340174' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 134.0909090909091 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 134.0909090909091 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 13.409090909090907 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 13.409090909090907 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '2800000537' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          134.0909090909091 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          13.409090909090907 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8690525500875' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=1;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 79.20792079207921 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 79.20792079207921 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 0.7920792079207928 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 0.7920792079207928 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '2800000533' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          79.20792079207921 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          0.7920792079207928 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8690525041453' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 138.18181818181816 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 138.18181818181816 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 13.818181818181841 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 13.818181818181841 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '1403606' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          138.18181818181816 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          13.818181818181841 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '5000112665338' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 268.1818181818182 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 26.818181818181813 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14026834' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          268.1818181818182 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          26.818181818181813 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8683789551707' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=1;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 56.93069306930693 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 56.93069306930693 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 0.5693069306930667 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 0.5693069306930667 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '18016516' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          56.93069306930693 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          0.5693069306930667 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '68690504186689' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 268.1818181818182 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 268.1818181818182 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 26.818181818181813 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 26.818181818181813 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14026833' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          268.1818181818182 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          26.818181818181813 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8683789551721' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 427.27272727272725 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 427.27272727272725 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 42.72727272727275 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 42.72727272727275 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14021275' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 2 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          427.27272727272725 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          42.72727272727275 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8698720867199' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 213.63636363636363 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 21.363636363636374 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14021274' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          213.63636363636363 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          21.363636363636374 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8698720867205' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 213.63636363636363 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 213.63636363636363 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 21.363636363636374 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 21.363636363636374 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14021272' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          213.63636363636363 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          21.363636363636374 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '8698720867212' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        
          SET @SatirNo=@SatirNo+1;
          SET @VergiYuzde=10;
          SELECT @VergiPntr=CASE WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(0)=@VergiYuzde THEN 0
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(1)=@VergiYuzde THEN 1
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(2)=@VergiYuzde THEN 2
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(3)=@VergiYuzde THEN 3
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(4)=@VergiYuzde THEN 4
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(5)=@VergiYuzde THEN 5
          WHEN MikroDesktop_AGROSS_001.dbo.fn_VergiYuzde(6)=@VergiYuzde THEN 6
          ELSE 0 END;

          SELECT @VergiMatrah0=@VergiMatrah0 + CASE WHEN @VergiPntr=0 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah1=@VergiMatrah1 + CASE WHEN @VergiPntr=1 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah2=@VergiMatrah2 + CASE WHEN @VergiPntr=2 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah3=@VergiMatrah3 + CASE WHEN @VergiPntr=3 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah4=@VergiMatrah4 + CASE WHEN @VergiPntr=4 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah5=@VergiMatrah5 + CASE WHEN @VergiPntr=5 THEN 124.99999999999999 ELSE 0 END;
          SELECT @VergiMatrah6=@VergiMatrah6 + CASE WHEN @VergiPntr=6 THEN 124.99999999999999 ELSE 0 END;

          SELECT @Vergi0=@Vergi0 + CASE WHEN @VergiPntr=0 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi1=@Vergi1 + CASE WHEN @VergiPntr=1 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi2=@Vergi2 + CASE WHEN @VergiPntr=2 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi3=@Vergi3 + CASE WHEN @VergiPntr=3 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi4=@Vergi4 + CASE WHEN @VergiPntr=4 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi5=@Vergi5 + CASE WHEN @VergiPntr=5 THEN 12.500000000000014 ELSE 0 END;
          SELECT @Vergi6=@Vergi6 + CASE WHEN @VergiPntr=6 THEN 12.500000000000014 ELSE 0 END;
        
          INSERT INTO S_20250622_1001 (sth_Guid, sth_DBCno, sth_SpecRECno, sth_iptal, sth_fileid, sth_hidden, sth_kilitli, sth_degisti, sth_checksum, sth_create_user, sth_create_date, sth_lastup_user, sth_lastup_date, sth_special1, sth_special2, sth_special3, sth_firmano, sth_subeno, sth_tarih, sth_tip, sth_cins, sth_normal_iade, sth_evraktip, sth_evrakno_seri, sth_evrakno_sira, sth_satirno, sth_belge_no, sth_belge_tarih, sth_stok_kod, sth_isk_mas1, sth_isk_mas2, sth_isk_mas3, sth_isk_mas4, sth_isk_mas5, sth_isk_mas6, sth_isk_mas7, sth_isk_mas8, sth_isk_mas9, sth_isk_mas10, sth_sat_iskmas1, sth_sat_iskmas2, sth_sat_iskmas3, sth_sat_iskmas4, sth_sat_iskmas5, sth_sat_iskmas6, sth_sat_iskmas7, sth_sat_iskmas8, sth_sat_iskmas9, sth_sat_iskmas10, sth_pos_satis, sth_promosyon_fl, sth_cari_cinsi, sth_cari_kodu, sth_cari_grup_no, sth_isemri_gider_kodu, sth_plasiyer_kodu, sth_har_doviz_cinsi, sth_har_doviz_kuru, sth_alt_doviz_kuru, sth_stok_doviz_cinsi, sth_stok_doviz_kuru, sth_miktar, sth_miktar2, sth_birim_pntr, sth_tutar, sth_iskonto1, sth_iskonto2, sth_iskonto3, sth_iskonto4, sth_iskonto5, sth_iskonto6, sth_masraf1, sth_masraf2, sth_masraf3, sth_masraf4, sth_vergi_pntr, sth_vergi, sth_masraf_vergi_pntr, sth_masraf_vergi, sth_netagirlik, sth_odeme_op, sth_aciklama, sth_sip_uid, sth_fat_uid, sth_giris_depo_no, sth_cikis_depo_no, sth_malkbl_sevk_tarihi, sth_cari_srm_merkezi, sth_stok_srm_merkezi, sth_fis_tarihi, sth_fis_sirano, sth_vergisiz_fl, sth_maliyet_ana, sth_maliyet_alternatif, sth_maliyet_orjinal, sth_adres_no, sth_parti_kodu, sth_lot_no, sth_kons_uid, sth_proje_kodu, sth_exim_kodu, sth_otv_pntr, sth_otv_vergi, sth_brutagirlik, sth_disticaret_turu, sth_otvtutari, sth_otvvergisiz_fl, sth_oiv_pntr, sth_oiv_vergi, sth_oivvergisiz_fl, sth_fiyat_liste_no, sth_oivtutari, sth_Tevkifat_turu, sth_nakliyedeposu, sth_nakliyedurumu, sth_yetkili_uid, sth_taxfree_fl, sth_ilave_edilecek_kdv, sth_ismerkezi_kodu, sth_HareketGrupKodu1, sth_HareketGrupKodu2, sth_HareketGrupKodu3, sth_Olcu1, sth_Olcu2, sth_Olcu3, sth_Olcu4, sth_Olcu5, sth_FormulMiktarNo, sth_FormulMiktar, sth_eirs_senaryo, sth_eirs_tipi, sth_teslim_tarihi, sth_matbu_fl, sth_satis_fiyat_doviz_cinsi, sth_satis_fiyat_doviz_kuru, sth_eticaret_kanal_kodu, sth_bagli_ithalat_kodu,
          sth_tevkifat_sifirlandi_fl, integrationCode)
          VALUES(NEWID(), 0, 0, 0, 1002, 0, 0, 0, 0, @MikroUserNo, GETDATE(), @MikroUserNo, GETDATE(), 
          '', '', '', 0, 0, @Tarih, 1 /*sth_tip*/, 1 /*sth_cins*/, 0 /*sth_normal_iade*/,1 /*sth_evraktip*/, 
          @EvrakSeri, @EvrakSira, @SatirNo, '0' /*sth_belge_no*/, @Tarih /*sth_belge_tarih*/,
          '14021343' /*sth_stok_kod*/, 0 /*sth_isk_mas1*/, 0 /*sth_isk_mas2*/, 0 /*sth_isk_mas3*/, 0 /*sth_isk_mas4*/, 0 /*sth_isk_mas5*/, 0 /*sth_isk_mas6*/,
          0 /*sth_isk_mas7*/, 0 /*sth_isk_mas8*/, 0 /*sth_isk_mas9*/, 0 /*sth_isk_mas10*/, 0 /*sth_sat_iskmas1*/, 0 /*sth_sat_iskmas2*/, 0 /*sth_sat_iskmas3*/,
          0 /*sth_sat_iskmas4*/, 0 /*sth_sat_iskmas5*/, 0 /*sth_sat_iskmas6*/, 0 /*sth_sat_iskmas7*/, 0 /*sth_sat_iskmas8*/, 0 /*sth_sat_iskmas9*/, 0 /*sth_sat_iskmas10*/,
          0 /*sth_pos_satis*/, 0 /*sth_promosyon_fl*/, 0 /*sth_cari_cinsi*/, '' /*sth_cari_kodu*/, 0 /*sth_cari_grup_no*/, 
          '' /*sth_isemri_gider_kodu*/, '' /*sth_plasiyer_kodu*/, 0 /*sth_har_doviz_cinsi*/, 0 /*sth_har_doviz_kuru*/, 0 /*sth_alt_doviz_kuru*/, 
          0 /*sth_stok_doviz_cinsi*/, 0 /*sth_stok_doviz_kuru*/, 1 /*sth_miktar*/, 0 /*sth_miktar2*/, 1 /*sth_birim_pntr*/, 
          124.99999999999999 /*sth_tutar*/, 0 /*sth_iskonto1*/, 0 /*sth_iskonto2*/, 0 /*sth_iskonto3*/, 0 /*sth_iskonto4*/, 0 /*sth_iskonto5*/, 0 /*sth_iskonto6*/, 
          0 /*sth_masraf1*/, 0 /*sth_masraf2*/, 0 /*sth_masraf3*/, 0 /*sth_masraf4*/, @VergiPntr /*sth_vergi_pntr*/, 
          12.500000000000014 /*sth_vergi*/, 0 /*sth_masraf_vergi_pntr*/, 0 /*sth_masraf_vergi*/, 0 /*sth_netagirlik*/, 0 /*sth_odeme_op*/,
          '5000112665055' /*sth_aciklama*/, '00000000-0000-0000-0000-000000000000' /*sth_sip_uid*/, '00000000-0000-0000-0000-000000000000' /*sth_fat_uid*/, 
          0 /*sth_giris_depo_no*/, @DepoNo /*sth_cikis_depo_no*/, @Tarih /*sth_malkbl_sevk_tarihi*/, '1001' /*sth_cari_srm_merkezi*/, 
          '1001' /*sth_stok_srm_merkezi*/, '1899-12-30 00:00:00.000' /*sth_fis_tarihi*/, 0 /*sth_fis_sirano*/, 
          0 /*sth_vergisiz_fl*/, 0 /*sth_maliyet_ana*/, 0 /*sth_maliyet_alternatif*/, 0 /*sth_maliyet_orjinal*/, 0 /*sth_adres_no*/, 
          '' /*sth_parti_kodu*/, 0 /*sth_lot_no*/, '00000000-0000-0000-0000-000000000000' /*sth_kons_uid*/, 
          '' /*sth_proje_kodu*/, '' /*sth_exim_kodu*/, 0 /*sth_otv_pntr*/, 0 /*sth_otv_vergi*/, 
          0 /*sth_brutagirlik*/, 1 /*sth_disticaret_turu*/, 0 /*sth_otvtutari*/, 0 /*sth_otvvergisiz_fl*/, 0 /*sth_oiv_pntr*/, 
          0 /*sth_oiv_vergi*/, 0 /*sth_oivvergisiz_fl*/, 1 /*sth_fiyat_liste_no*/, 0 /*sth_oivtutari*/, 0 /*sth_Tevkifat_turu*/, 
          0 /*sth_nakliyedeposu*/, 0 /*sth_nakliyedurumu*/, '00000000-0000-0000-0000-000000000000' /*sth_yetkili_uid*/, 0 /*sth_taxfree_fl*/, 
          0 /*sth_ilave_edilecek_kdv*/, '' /*sth_ismerkezi_kodu*/, '' /*sth_HareketGrupKodu1*/, '' /*sth_HareketGrupKodu2*/, '' /*sth_HareketGrupKodu3*/, 
          0 /*sth_Olcu1*/, 0 /*sth_Olcu2*/, 0 /*sth_Olcu3*/, 0 /*sth_Olcu4*/, 0 /*sth_Olcu5*/, 0 /*sth_FormulMiktarNo*/, 0 /*sth_FormulMiktar*/, 
          0 /*sth_eirs_senaryo*/, 0 /*sth_eirs_tipi*/, '1899-12-30 00:00:00.000' /*sth_teslim_tarihi*/, 0 /*sth_matbu_fl*/, 0 /*sth_satis_fiyat_doviz_cinsi*/, 
          0 /*sth_satis_fiyat_doviz_kuru*/, '' /*sth_eticaret_kanal_kodu*/, '' /*sth_bagli_ithalat_kodu*/, 0 /*sth_tevkifat_sifirlandi_fl*/,
          '05a51a7a-2299-4232-8183-96dc224ebba1');
        SET @SatirNo=-1;END;