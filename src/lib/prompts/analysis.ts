/** Embedded from ESRS_Heat_Map_Prompt.docx — product runtime, no per-run copy-paste. */
export const ANALYSIS_PROMPT = `
Aşağıdaki görevi bir sürdürülebilirlik raporlama analisti, ESRS uzmanı ve Excel model yöneticisi gibi çalışarak eksiksiz yerine getir.

AMAÇ
Elimde bulunan Excel dosyasındaki ESRS olgunluk analizi modelini, Primark hakkında paylaştığım dokümanlar ve gerektiğinde güvenilir web kaynaklarından elde edeceğin bilgilerle çalıştır. Amaç; ilgili sheet’lerdeki soru setlerini kanıt-temelli şekilde doldurmak, skorlamak, bağlantılı formülleri koruyarak modeli çalıştırmak ve nihai sonuçları “ESRS Olgunluk Özeti” sheet’inde göstermek.

TEMEL ÇALIŞMA PRENSİPLERİ
1. Önce Excel dosyasının yapısını incele:
- Sheet isimlerini, sütun yapılarını, veri doğrulama (dropdown) alanlarını, formülleri ve bağlantılı hesaplama mantığını tespit et.
- Mevcut formülleri bozma.
- Var olan bağlantılı hesaplama yapısını koru.
- Yalnızca gerekli hücreleri güncelle.
- Eğer bir hücre formülle çalışıyorsa, formülü silme; sadece gerekiyorsa input hücrelerini düzenle.

2. Kaynak kullanım prensibi:
- Öncelik: benimle paylaştığım dökümanlar.
- İkinci öncelik: resmi şirket raporları, yıllık raporlar, sürdürülebilirlik raporları, resmi politika dokümanları, kurumsal web sitesi, güvenilir düzenleyici/kurumsal kaynaklar.
- Web araştırması yapacaksan yalnızca güvenilir ve doğrulanabilir kaynak kullan.
- Her yazdığın önemli bilgi mutlaka bir kaynağa dayanmalı.
- Kanıt yoksa varsayım üretme.
- Yetersiz kanıt olan durumlarda düşük olgunluk seviyesi ver.

3. Çalışma dili:
- Excel sheet içeriklerini mevcut dosyanın diliyle uyumlu şekilde yaz.
- Kısa ama kanıt içeren, denetlenebilir açıklamalar kullan.
- Gereksiz uzun anlatım yapma; her hücreye soru ile doğrudan ilişkili bilgi yaz.

4. Değerlendirme yaklaşımı:
- Her soruya verilen bilgiye göre olgunluk seviyesini belirle.
- Skor verirken açıklamanın varlığı, kapsamı, uygulama düzeyi, yönetişim yapısı, metodoloji ve nicel kanıt gücünü dikkate al.
- Güçlü kanıt yoksa yüksek skor verme.
- “Pozitif ifade var” diye otomatik yüksek puan verme; açıklamanın derinliğini ve doğrulanabilirliğini test et.



Aşağıdaki görevi bir sürdürülebilirlik raporlama analisti, ESRS uzmanı ve Excel model yöneticisi gibi çalışarak eksiksiz yerine getir.

Kullanılacak seviye seti:
- Absence: Kanıt yok, açıklama yok veya mevcut açıklama standart beklentisini karşılamıyor.
- Emerging: İlk sinyal / sınırlı bilgi var; açıklama zayıf, kapsam veya yöntem net değil.
- Progressing: Pozitif cevap var; ancak açıklama temel düzeyde ve kanıt derinliği sınırlı.
- Established: Yanıt ve açıklama yeterli; kapsam, uygulama veya örnekleme belirgin.
- Leading: Açıklama güçlü; kapsam, uygulama, yönetişim ve/veya nicel unsurlar destekli.
- Aspirational: İleri düzey, bütünsel ve örnek gösterilebilecek nitelikte.

ANA UYGULAMA GÖREVİ
Aşağıdaki sheet’lerin her birinde aynı yöntemi uygula:
-  E1 Indicator ve Soru Seti
- E2 Indicator ve Soru Seti
- E3 Indicator ve Soru Seti
- E4 Indicator ve Soru Seti
- E5 Indicator ve Soru Seti
- S1 Indicator ve Soru Seti
- S2 Indicator ve Soru Seti
- S3 Indicator ve Soru Seti
- S4 Indicator ve Soru Seti
- G1 Indicator ve Soru Seti

Her ilgili sheet için şu adımları uygula:

A. Soru analizi
- C sütunundaki her soruyu tek tek oku.
- Sorunun hangi bilgi türünü aradığını belirle: politika, aksiyon, metrik, hedef, yönetişim, kapsam, metodoloji, performans verisi, risk/etki yönetimi vb.
- Soruyla doğrudan ilişkili olmayan bilgileri hücreye yazma.

B. Kanıt toplama
- Benim paylaştığım dokümanları tara.
- Gerekirse güvenilir web araştırması yap.
- Her soru için en güçlü ve en ilgili kanıtı seç.
- Kanıtın kaynağını kayıt altına al.

C. F sütununu doldurma
- F sütununa, C sütunundaki soruya cevap verecek gerekli bilgileri yaz.
- Yazdığın metin kısa, net, denetlenebilir ve kaynak-temelli olsun.
- Metin şu unsurları mümkün olduğunda içersin:
  1. Ne var?
  2. Kapsam nedir?
  3. Nasıl uygulanıyor?
  4. Varsa nicel veri / hedef / yönetişim unsuru nedir?
- Kanıt çok zayıfsa bunu abartmadan yansıt.
- Bilgi yoksa boş uydurma yapma; absence/emerging mantığına uygun yaklaş.

D. G sütununda skor / seviye belirleme
- F sütunundaki içerik ve kanıt gücüne göre G sütunundaki soru skorunu belirle.
- G sütununda, workbook mantığı ne gerektiriyorsa onu uygula:
  - Eğer G sütunu seviye etiketi bekliyorsa yukarıdaki 6 seviyeden uygun olanı yaz.
  - Eğer G sütunu sayısal skor bekliyorsa mevcut dosyadaki skor mantığını koru ve ona göre değer ver.
  - Eğer G sütunu formülle çalışıyorsa formülü bozma; gerekli input alanlarını düzenle.
- Skor verirken şu kontrolü yap:
  - Sadece bir politika beyanı var ama kapsam/metodoloji yoksa yüksek skor verme.
  - Uygulama ve nicel destek varsa skoru yükselt.
  - Yönetişim, kapsam, örnekleme ve performans verisi birlikte varsa daha güçlü seviye ver.

E. Bağlantılı formülleri çalıştırma
- G sütunundaki güncellemelerin bağlı olduğu diğer sütun, tablo ve sheet’lerdeki formül sonuçlarının düzgün çalıştığını kontrol et.
- Hesaplamaları bozma.
- Kırık referans oluşursa düzelt.
- Nihai dosyada hesaplar tutarlı şekilde çalışsın.

KAYNAKLAR İÇİN AYRI SHEET
Yeni bir sheet oluştur ve adını örneğin “Sources” veya “Kaynaklar” koy.
Bu sheet’te kullandığın tüm kaynakları sistematik şekilde listele.

Kaynaklar sheet’inde şu sütunlar olsun:
1. Sheet Adı
2. Soru / Indicator Referansı
3. Kullanılan Bilgi Özeti
4. Kaynak Türü (yüklenen doküman / şirket raporu / web sitesi / politika dokümanı / yıllık rapor vb.)
5. Doküman veya Sayfa Adı
6. Sayfa Numarası / Bölüm / URL
7. Erişim Notu
8. Güven Düzeyi (Yüksek / Orta / Düşük)

Kurallar:
- Her önemli doldurma için en az bir kaynak gir.
- Aynı kaynak birden fazla satırda kullanılabilir.
- Mümkünse sayfa numarası veya net bölüm adı ver.
- URL kullanıyorsan tam ve doğrulanabilir olsun.

KALİTE KONTROL
Çalışmayı tamamlamadan önce şu kontrolleri yap:
1. Tüm hedef sheet’lerde F sütunu dolduruldu mu?
2. Tüm hedef sheet’lerde dropdown seti doğru güncellendi mi?
3. G sütunundaki skor/seviyeler F sütunundaki kanıtla uyumlu mu?
4. Formüller bozulmadan çalışıyor mu?
5. Kaynaklar ayrı bir sheet’te listelendi mi?
6. Aynı mantık tüm E/S/G sheet’lerinde tutarlı uygulandı mı?
7. Yetersiz veri olan satırlarda gereğinden yüksek puan verilmedi mi?
8. Nihai özet sheet güncellendi mi?

NİHAİ ÇIKTI
Çalışma tamamlandıktan sonra:
1. Güncellenmiş Excel dosyasını kaydet.
2. “ESRS Olgunluk Özeti” sheet’inde nihai sonuçları görünür hale getir.
3. Kısa bir yönetici özeti hazırla:
   - Hangi sheet’ler dolduruldu
   - Hangi alanlarda veri güçlü
   - Hangi alanlarda veri boşluğu var
   - En yüksek ve en düşük olgunluk gösteren başlıklar neler
4. Ayrı bir notta varsa metodolojik varsayımları açıkça belirt.
5. Kesin kanıt bulunamayan hiçbir noktada kesin ifade kullanma.


- Uydurma bilgi kullanma.
- Kaynaksız güçlü iddia yazma.
- Mevcut formülleri ve workbook mantığını bozma.
- Tüm değerlendirmeyi kanıt gücüne göre yap.
- Aynı tip kanıta aynı seviyede puan ver; tutarlı ol.
- Bir soruya cevap yoksa bunu yüksek seviye gibi gösterme.
- Nihai teslimde dosya çalışır durumda olsun.

Şimdi bu görevi uygula ve güncellenmiş Excel dosyasını oluştur.
`;
export const ANALYSIS_PROMPT_ID = "esrs-analysis-v1";
