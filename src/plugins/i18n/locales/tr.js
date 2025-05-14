export default {
  app: {
    name: "Su İçme Hatırlatıcısı",
  },
  navbar: {
    home: "Anasayfa",
    profile: "Profilim",
    settings: "Ayarlar",
  },
  pages: {
    home: {
      title: "Anasayfa",
      complated_target: "Tamamlanan Hedef",
      remaining: "Kalan",
      target: "Hedef",
      drinking_water_msg: "Litre içildi",
      drinking_save_btn_msg: "İçtiğin Suyu Kaydet"
    },
    profile: {
      title: "Profilim",
      description: "Kişisel bilgilerinizi girerek hatırlatıcıyı özelleştirin",
      full_name: "Ad Soyad",
      age: "Yaş",
      height: "Boy (cm)",
      weight: "Kilo (kg)",
      activity_level: "Aktivite Seviyesi",
      activityLevels: {
        low: "Düşük (Hareketsiz yaşam)",
        moderate: "Orta (Hafif egzersiz, haftada 1-3 gün)",
        high: "Yüksek (Orta egzersiz, haftada 3-5 gün)",
        very_high: "Çok Yüksek (Ağır egzersiz, haftada 6-7 gün)",
        extreme: "Ekstrem (Günde çift antrenman)",
      },
      daily_target: "Günlük Su Hedefi (ml)",
      save_settings: "Ayarları Kaydet",
      calculate_water: "Benim için Hesapla",
      dialog: {
        add: "Ekle",
        cancel: "Vazgeç",
      },
      success_message: "Profil Güncellendi.",
      error_message: "Opps Bir Şeyler Ters Gitti",
    },
    settings: {
      title: "Ayarlar",
      notification_switch: "Bildirim almak istiyorum",
      reminder_frequency: "Hatırlatma Sıklığı",
      reminderFrequencies: {
        every_30_mins: "30 Dakikada Bir",
        hourly: "Her saat",
        every_90_mins: "90 Dakikada Bir",
        every_2_hours: "2 Saatte Bir",
        every_3_hours: "3 Saatte Bir",
        every_4_hours: "4 Saatte Bir",
      },
      waking_hour: "Uyanış Saati",
      sleep_hour: "Uyku Saati",
      auto_start: "Uygulamayı Otomatik Başlat",
      save_settings_button: "Ayarları Kaydet",
      success_message: "Ayarlar Güncellendi.",
      error_message: "Opps Bir Şeyler Ters Gitti",
      reset_area: {
        reset_data_btn_text: "Verilerimi Sıfırla",
        reset_data_msg: "Tüm Verilirin Silinecek ve Geri Alınamıyacak!",
        reset_data_dialog_accept_btn: "Onayla",
        reset_data_dialog_decline_btn: "Vazgeç",
      }
    },
  },
};
