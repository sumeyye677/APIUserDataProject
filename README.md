# Kullanıcı Yönetim Uygulaması

## Web Live Link: https://myapiuser.netlify.app/

Bu proje, JSONPlaceholder API'sinden kullanıcı verilerini çekerek basit bir kullanıcı yönetim arayüzü sunan web uygulamasıdır.

## Özellikler

- **API Entegrasyonu**: JSONPlaceholder API'sinden kullanıcı verilerini çeker
- **Önbellek Sistemi**: Verileri 1 gün süreyle localStorage'da saklar
- **Kullanıcı Yönetimi**: Kullanıcıları görüntüleme ve silme
- **Arama Fonksiyonu**: İsim, email, kullanıcı adı, şehir ve şirket bazında filtreleme
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu

## Dosya Yapısı

```
├── index.html          # Ana HTML dosyası
└── script.js           # JavaScript kodu
```

### İlk Kullanım
- Sayfa açıldığında otomatik olarak API'den kullanıcı verileri çekilir
- Veriler localStorage'a kaydedilir

### Arama
- Üst kısımdaki arama kutusunu kullanarak kullanıcıları filtreleyebilirsiniz
- Arama: isim, email, kullanıcı adı, şehir ve şirket adı üzerinden yapılır

### Kullanıcı Silme
- Her kullanıcı kartının sağ üst köşesindeki "Sil" butonuna tıklayın
- Onay verdiğinizde kullanıcı hem listeden hem de önbellekten silinir

### Veri Yenileme
- "Yenile" butonu ile API'den fresh data çekebilirsiniz
- Bu işlem önbelleği de günceller

### Önbellek Temizleme
- "Temizle" butonu ile localStorage'daki tüm verileri silebilirsiniz

## Teknik Detaylar

### API
- **Endpoint**: `https://jsonplaceholder.typicode.com/users`
- **Method**: GET
- **Format**: JSON

### Önbellek Sistemi
- **Storage**: localStorage
- **Süre**: 24 saat
- **Key**: `ins-api-users`

### Responsive Breakpoints
- **Masaüstü**: 768px üzeri - Grid layout (otomatik sütunlar)
- **Mobil**: 768px altı - Tek sütun layout

## Kod Yapısı

### UserManager Class
Ana sınıf olarak `UserManager` kullanılmıştır:

- `init()` - Uygulamayı başlatır
- `loadUsers()` - Önbellek kontrolü ve veri yükleme
- `fetchUsersFromAPI()` - API'den veri çekme
- `renderUsers()` - Kullanıcı kartlarını render etme
- `deleteUser()` - Kullanıcı silme
- `filterUsers()` - Arama/filtreleme

### CSS
- Vanilla CSS kullanılmıştır
- Mobile-first yaklaşım
- Grid layout sistemi

### Hata Yönetimi
- API hataları kullanıcıya bildirilir
- localStorage hataları sessizce işlenir
- Network problemlerinde önbellekten veri gösterilir

### Performans
- Minimum DOM manipülasyonu
- Event delegation kullanımı
- Tek seferlik stil enjeksiyonu
