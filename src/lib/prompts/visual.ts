/** Embedded from ESRS_Heat_Map_Gorsel_Promptu.docx — product runtime, no per-run copy-paste. */
export const VISUAL_PROMPT = `
Aşağıdaki verileri kullanarak, üst yönetim / C-level sunumunda kullanılacak, yüksek çözünürlüklü, tek sayfalık bir PNG heat map görseli hazırla.
 
AMAÇ
Elimdeki ESRS Olgunluk Özeti tablosunu, daha önce oluşturduğumuz yönetici sunumu stilinde, temiz, modern, kurumsal ve okunaklı bir heat map görseline dönüştür. 
 
ÇIKTI FORMATI
- PNG formatında üret
- Yüksek çözünürlükte hazırla
- Sunum kullanımına uygun 16:9 oran kullan
- Yazılar büyük ve uzaktan okunabilir olsun
- Görsel doğrudan PowerPoint slide içine yerleştirilebilecek kalitede olsun
 
TASARIM DİLİ
- Açık gri / çok açık nötr arka plan
- Koyu lacivert başlık rengi
- Temiz, modern, kurumsal görünüm
- Minimal ama güçlü yönetici sunumu estetiği
- Gereksiz ikon, efekt, gölge, 3D görünüm, dekoratif öğe kullanma
- Veri odaklı, net ve premium bir yerleşim kullan
 
GÖRSEL YAPI
Görsel şu bölümlerden oluşsun:
 
1) ÜST BAŞLIK ALANI
- Sol üstte şirket adı + “ESRS Olgunluk Heat Map” başlığı
- Alt satırda küçük bir açıklama: “Konu bazlı görünüm | 0–100 ölçeği”
 
2) ÖZET KARTLARI
Başlığın altında yatay 3 kutu olsun:
- Genel ESRS Skoru
- Olgunluk Seviyesi
- Okuma Mantığı: “Yeşil güçlü | Kırmızı zayıf”
 
3) ANA HEAT MAP ALANI
Satırlar:
E1, E2, E3, E4, E5, S1, S2, S3, S4, G1
 
Sütunlar:
Skor, Policy, Action, Metric, Target
 
4) SOLDA KATEGORİ BLOKLARI
- Environment: E1–E5
- Social: S1–S4
- Governance: G1
Bu kategori blokları solda dikey bant şeklinde gösterilsin.
Kısaltmalar kullanılabilir:
- ENV
- SOC
- GOV
 
5) ALT LEJANT
- Yatay renk skalası olsun
- Sol uç: “Düşük”
- Sağ uç: “Yüksek”
 
RENK MANTIĞI
Heat map renkleri 0–100 skoruna göre çalışsın.
Düşükten yükseğe şu mantıkta geçiş olsun:
- çok düşük: magenta / koyu pembe
- düşük: kırmızı / turuncu
- orta: amber / sarı
- iyi: sarı-yeşil
- yüksek: yeşil-teal
 
OKUNABİLİRLİK KURALLARI
- Yazılar küçük olmayacak
- Hücre içindeki skorlar kalın ve büyük yazılacak
- Sütun başlıkları belirgin olacak
- Satır etiketleri kalın olacak
- Hücre renklerine göre yazı rengi otomatik ayarlansın:
  - koyu zeminde beyaz
  - açık zeminde siyah
- Tüm bilgiler tek bakışta okunabilir olsun
- Üst üste binen metin veya legend olmasın
- Boşluklar dengeli olsun
- Görsel slide üzerinde zoom yapmadan da rahat okunmalı
 
YERLEŞİM KURALLARI
- Heat map alanı görselin ana odağı olsun
- Çok fazla boş alan bırakma
- Ama tasarım sıkışık da görünmesin
- Executive summary kartları ile heat map arasında dengeli boşluk bırak
- Alt legend, heat map’in üstüne binmesin
- Footer küçük ve rahatsız etmeyecek şekilde yer alabilir
 
VERİLER
Şirket Adı: [BURAYA ŞİRKET ADI YAZ]
 
Genel ESRS Skoru: [BURAYA GENEL SKOR YAZ]
Olgunluk Seviyesi: [BURAYA SEVİYE YAZ]
 
Tablo verileri:
E1: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
E2: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
E3: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
E4: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
E5: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
S1: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
S2: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
S3: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
S4: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
G1: Skor=[ ], Policy=[ ], Action=[ ], Metric=[ ], Target=[ ]
 
EK TALİMAT
- Daha önce hazırlanmış görsel dilini koru
- Yeni bir stil deneme, mevcut premium yönetici sunumu stilini aynen sürdür
- Sonucu yalnızca yüksek çözünürlüklü PNG olarak üret
- Eğer yerleşim sıkışırsa önce fontları küçültmek yerine kompozisyonu optimize et
- Ama sunum okunabilirliğinden asla ödün verme
`;
export const VISUAL_PROMPT_ID = "esrs-visual-v1";
