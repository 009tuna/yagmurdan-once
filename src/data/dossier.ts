export type SceneKey =
  | "hero"
  | "problem"
  | "front"
  | "forecast"
  | "sites"
  | "ground"
  | "flow"
  | "capacity"
  | "support"
  | "architecture"
  | "field"
  | "allocate"
  | "rain"
  | "reroute"
  | "compare"
  | "end";

export interface UnderpassSite {
  id: string;
  name: string;
  shortName: string;
  grid: readonly [number, number];
  basis: string;
  riskPct: number;
  assignment: string;
  tier: "direct" | "buffer" | "watch";
  xaiDrivers: readonly string[];
  fixedPumpNote: string;
}

export const UNDERPASS_SITES: readonly UnderpassSite[] = [
  {
    id: "N01",
    name: "Akay Alt Geçidi",
    shortName: "Akay",
    grid: [19, 9],
    basis: "Geçmiş su baskını ve tahliye kaydı (ABB AKOM, 2023)",
    riskPct: 92,
    assignment: "P1 (Doğrudan)",
    tier: "direct",
    xaiDrivers: [
      "Beklenen pik yağış: 30 mm/saat (255 m³/saat yüzey debisi)",
      "Sabit istasyon kapasitesi (180 m³/saat) üzerinde +75 m³/saat açık",
      "Tekrarlayan baskın geçmişi ve ana Çankaya geçiş yükü",
    ],
    fixedPumpNote: "Sabit istasyon mevcut; pik debide mobil destek gerektirir.",
  },
  {
    id: "N04",
    name: "Mevlana Blv. · Taurus AVM önü",
    shortName: "Taurus",
    grid: [12, 14],
    basis: "Algılama projesi ve müdahale kaydı",
    riskPct: 86,
    assignment: "P2 (Doğrudan)",
    tier: "direct",
    xaiDrivers: [
      "Geniş geçirimsiz bulvar havzası ve hızlı yüzey akışı",
      "116 sensörlü erken uyarı aksında yüksek geçmiş olay sıklığı",
      "3 Haziran 2023 AKOM raporunda doğrudan müdahale kaydı",
    ],
    fixedPumpNote: "Kapasite aşımı beklentisiyle P2 doğrudan ön yerleşim.",
  },
  {
    id: "N03",
    name: "Çetin Emeç · Ceyhun Atuf Kansu Cd.",
    shortName: "Ceyhun Atuf Kansu",
    grid: [15, 12],
    basis: "Algılama projesi ve müdahale kaydı",
    riskPct: 82,
    assignment: "P3 (Doğrudan)",
    tier: "direct",
    xaiDrivers: [
      "İki ana arter kesişiminde düşük kotlu çukur geometrisi",
      "16.40 yol çalışması nedeniyle alternatif kavşak rotasına yönlendirildi",
      "Yüksek trafik önemi ve acil ulaşım bağlantısı",
    ],
    fixedPumpNote: "Koordinatör onayıyla alternatif rotadan P3 çıkışı.",
  },
  {
    id: "N05",
    name: "Bilkent Blv. · ODTÜ A8 Kapısı",
    shortName: "Bilkent",
    grid: [6, 15],
    basis: "Algılama projesi (Olcay / AA, 2023)",
    riskPct: 78,
    assignment: "P4 (Doğrudan)",
    tier: "direct",
    xaiDrivers: [
      "Batı yağış kolu üstünde eğim toplamalı geçiş noktası",
      "10 / 20 / 35 cm kademeli alarm eşiklerinden önce müdahale hedefi",
      "Ulaşım süresinin yağış trafiğinde uzaması nedeniyle erken çıkış",
    ],
    fixedPumpNote: "Batı koridorunda P4 erken konuşlandırma.",
  },
  {
    id: "N02",
    name: "Çetin Emeç · Polis Evi önü",
    shortName: "Polis Evi",
    grid: [17, 14],
    basis: "Algılama projesi ve 2018 baskın kaydı",
    riskPct: 65,
    assignment: "P5 Tampon kapsamı",
    tier: "buffer",
    xaiDrivers: [
      "2018 baskın kaydı bulunan orta-yüksek riskli alt geçit",
      "P5 ara tampon noktasına 5 dk sürüş mesafesinde",
      "Sabit pompa telemetrisine göre yağış anında dinamik sevk adayı",
    ],
    fixedPumpNote: "P5 Çetin Emeç tampon bölgesinden kapsanıyor.",
  },
  {
    id: "N09",
    name: "Muhsin Yazıcıoğlu Alt Geçidi",
    shortName: "M. Yazıcıoğlu",
    grid: [10, 11],
    basis: "Ana ulaşım aksı",
    riskPct: 60,
    assignment: "P5 Tampon kapsamı",
    tier: "buffer",
    xaiDrivers: [
      "Ensemble üyelerinde orta olasılıklı akış koridoru",
      "P5 ara bekleme noktasından çift yönlü erişim",
      "Boşa bekleme maliyetini azaltan iki aşamalı kapsama",
    ],
    fixedPumpNote: "P5 Çetin Emeç tampon bölgesinden kapsanıyor.",
  },
  {
    id: "N11",
    name: "Küçükesat Köprülü Kavşağı",
    shortName: "Küçükesat",
    grid: [24, 11],
    basis: "Çankaya ulaşım yapısı",
    riskPct: 55,
    assignment: "P6 Tampon kapsamı",
    tier: "buffer",
    xaiDrivers: [
      "17.02 itibarıyla doğuya dönen radar hücresinin merkezinde",
      "Merkezi Çankaya–Akay tamponundan (P6) 5 dk içinde sevk edilir",
      "Çalışan P1 Akay pompasını sökmeden ek koruma sağlar",
    ],
    fixedPumpNote: "17.02 doğu kaymasında P6 rezerv sevki hedefi.",
  },
  {
    id: "N07",
    name: "Yavuz Sultan Selim Alt Geçidi",
    shortName: "Y. Sultan Selim",
    grid: [22, 7],
    basis: "Algılama projesi",
    riskPct: 48,
    assignment: "P6 Tampon kapsamı",
    tier: "buffer",
    xaiDrivers: [
      "Doğu koridorundaki komşu ulaşım yapısı",
      "P6 tampon bekleme noktasının kapsama çemberinde",
      "Kuyu seviye sinyaliyle erken tetiklenebilir",
    ],
    fixedPumpNote: "P6 Merkezi Çankaya–Akay tamponundan kapsanıyor.",
  },
  {
    id: "N12",
    name: "Tandoğan Alt Geçidi",
    shortName: "Tandoğan",
    grid: [16, 5],
    basis: "Algılama projesi",
    riskPct: 43,
    assignment: "İzleme / Tampon",
    tier: "watch",
    xaiDrivers: [
      "Ana tahmin koridorunun kuzey kenarında",
      "Kuru kalma olasılığı yüksek olduğu için doğrudan filo bağlanmadı",
    ],
    fixedPumpNote: "Sabit istasyon ve seviye sensörü izlemede.",
  },
  {
    id: "N06",
    name: "Konutkent Köprülü Kavşağı",
    shortName: "Konutkent",
    grid: [4, 12],
    basis: "Algılama projesi",
    riskPct: 35,
    assignment: "İzleme",
    tier: "watch",
    xaiDrivers: [
      "Mevcut fırtına hücresinin batı sınırının dışında",
      "Sabit pompa kapasitesi beklenen debiyi karşılıyor",
    ],
    fixedPumpNote: "Ek mobil ekip gerektirmiyor.",
  },
  {
    id: "N08",
    name: "Sultan Alparslan Alt Geçidi (ODTÜ A1)",
    shortName: "ODTÜ A1",
    grid: [8, 8],
    basis: "Ana ulaşım aksı",
    riskPct: 25,
    assignment: "İzleme",
    tier: "watch",
    xaiDrivers: [
      "Düşük havza toplama alanı ve düşük pik yağış olasılığı",
      "Sabit drenaj hattı yeterli marja sahip",
    ],
    fixedPumpNote: "İzleme modunda.",
  },
  {
    id: "N10",
    name: "Şehit Ertuğ Güler Alt Geçidi",
    shortName: "Ş. Ertuğ Güler",
    grid: [24, 16],
    basis: "Belediye isimlendirme kaydı",
    riskPct: 18,
    assignment: "İzleme",
    tier: "watch",
    xaiDrivers: [
      "Yanlış alarm eşiği (%20) altında kaldığı için ekip harcanmadı",
      "Hava yönü ekstrem saparsa yeniden skorlanır",
    ],
    fixedPumpNote: "Eşik altı izleme.",
  },
];

export const VOICE_PATHS: Record<SceneKey, string> = {
  hero: "/voices/hero.mp3",
  problem: "/voices/hero.mp3",
  front: "/voices/front.mp3",
  forecast: "/voices/forecast.mp3",
  sites: "/voices/sites.mp3",
  ground: "/voices/ground.mp3",
  flow: "/voices/flow.mp3",
  capacity: "/voices/capacity.mp3",
  support: "/voices/support.mp3",
  architecture: "/voices/capacity.mp3",
  field: "/voices/field.mp3",
  allocate: "/voices/allocate.mp3",
  rain: "/voices/rain.mp3",
  reroute: "/voices/reroute.mp3",
  compare: "/voices/compare.mp3",
  end: "/voices/end.mp3",
};

export const VOICE_TRANSCRIPTS: Record<SceneKey, string> = {
  hero: "Ankara, Çankaya. Saat on altı otuz. Yarım saat sonra sağanak bekleniyor. Elinde altı mobil pompa var. İlk ekibi nereye gönderirsin?",
  problem:
    "Ani sağanaklarda ekipler ihbar beklerse yağışlı trafikte yol uzar; ezbere sabit liste kullanılırsa yüzlerce ekip kuru kalan noktalarda boşa bekler.",
  front:
    "Henüz kimse su baskını ihbarında bulunmadı. Ekipleri şimdi çıkarırsan, alt geçide yol açıkken ulaşabilirler. Ama yağışın tam nereye düşeceği hâlâ belirsiz.",
  forecast:
    "Tahminlerde yağışın geçebileceği birkaç koridor var. Koridor biraz kaydığında, aynı sağanak başka bir alt geçide su taşıyabilir.",
  sites:
    "Saat on altı otuz üç. On iki aday noktadan dördü öne çıkıyor. Hangisine ne kadar destek gerektiğini görmek için, Akay Alt Geçidi'ne inelim.",
  ground:
    "Yukarıdan bakınca bir köprü ve iki yol görüyorsun. Kesitte ise daha önemli bir ayrıntı var. Çevreden gelen su, yolun en alçak yerinde toplanıyor.",
  flow: "Bu örnekte on bin metrekarelik bir alanın yağışını hesaba katıyoruz. Yüzeyden alt geçide ulaşması beklenen su, en yoğun anda saatte iki yüz elli beş metreküpe çıkıyor.",
  capacity:
    "Akay'daki sabit istasyonun saatte yüz seksen metreküp tahliye edebildiğini varsayalım. Çalışan bir pompa var, ama beklenen akış bunun üzerinde. Saatte yetmiş beş metreküplük açık kalıyor.",
  support:
    "Saatte yüz metreküp tahliye edebilen bir mobil pompa, örnekte bu açığı kapatabiliyor. Ekip, su yükselmeden üst kotta yerini alıyor.",
  architecture:
    "Sistem yeni sensör ağını ön koşul kılmaz; açık veriyle başlar, Wilo DDI ve mevcut SCADA verisi bağlandıkça doğruluğu artar.",
  field:
    "Ekibin alt geçide varması yetmiyor. Hortumu sermek ve suyu güvenli bir yere basmak için de zaman gerek. Plan bu hazırlığı hesaba katıyor.",
  allocate:
    "Dört pompa doğrudan riskli noktalara, iki pompa ara bekleme noktalarına öneriliyor. Koordinatör yol çalışmasını görünce bir rotayı düzeltiyor ve planı onaylıyor.",
  rain: "Saat beş. Yağmur başladı. Dört pompa yerinde. Diğer iki ekip için beklemek de planın parçası.",
  reroute:
    "Saat on yedi sıfır iki. Yağış doğuya kaydı. Akay'daki pompa çalışmayı sürdürüyor. Sistem, ara noktada hazır bekleyen ekibe yeni bir rota öneriyor.",
  compare:
    "İhbarı bekleyen ekip için örnek hesap kırk beş dakika. Önceden yerleşen ekipte beş, ara noktadan çıkan ekipte on beş dakika. Bunlar senaryonun varsayımları.",
  end: "Peki, sahada gerçekten kaç dakika kazanılır? Pilotun hedefi, tahliyeye başlama süresini en az yarıya indirmek. Bunu sınamak için geçmiş bir Ankara sağanağı aynı altı pompayla yeniden oynatılacak.",
};

export interface ProblemRow {
  criterion: string;
  reactive: string;
  fixedList: string;
  smartSystem: string;
}

export const PROBLEM_MATRIX: readonly ProblemRow[] = [
  {
    criterion: "Hareket Zamanı",
    reactive: "Su bastıktan ve ihbar geldikten sonra (gecikmeli).",
    fixedList: "Yağış öncesi genel uyarı ile kitlesel çıkış.",
    smartSystem: "Yağış öncesi hedefli yerleşim ve yağış sırasında canlı uyum.",
  },
  {
    criterion: "Nokta Seçimi",
    reactive: "Gelen şikâyet sırasına göre anlık tepki.",
    fixedList: "Her yağışta değişmeyen sabit nokta listesi.",
    smartSystem: "Her fırtınanın yönüne ve şiddetine özel dinamik risk önceliği.",
  },
  {
    criterion: "Sabit Pompa İlişkisi",
    reactive: "Sabit pompa bozulup yol dolunca fark edilir.",
    fixedList: "Mobil sevk kararından ayrı ve kopuk izlenir.",
    smartSystem: "Sabit pompa sağlığı ve kapasitesiyle entegre ortak karar.",
  },
  {
    criterion: "Fırtına Yön Değiştirirse",
    reactive: "Trafik kilitlendiği için ekipler yolda kalır.",
    fixedList: "Kuru kalan yerlerdeki ekipler saatlerce atıl bekler.",
    smartSystem: "Tampon bölgelerdeki yedek ekipler kısa mesafeden kaydırılır.",
  },
  {
    criterion: "Kaynak Verimliliği",
    reactive: "Yüksek hasar ve uzun süreli yol kapanması.",
    fixedList: "Yüksek yakıt, mesai ve gereksiz ekip-saat maliyeti.",
    smartSystem: "Sınırlı filoyla yüksek kapsama ve düşük bekleme maliyeti.",
  },
];

export interface DataLevel {
  id: "seviye-0" | "seviye-1" | "seviye-2";
  label: string;
  badge: string;
  newHardware: string;
  sources: string;
  contribution: string;
  notes: readonly string[];
}

export const DATA_LEVELS: readonly DataLevel[] = [
  {
    id: "seviye-0",
    label: "Seviye 0 · Açık Veri",
    badge: "Sıfır yeni donanım",
    newHardware: "Yok",
    sources:
      "Open-Meteo Forecast & Ensemble, MGM Meteouyarı & Radar, Copernicus DEM GLO-30, OpenStreetMap (tunnel=yes, layer=-1), geçmiş olay arşivi.",
    contribution: "Yağışa özel olasılıksal risk haritası ve ilk konuşlandırma planı.",
    notes: [
      "Yeni sensör yatırımı olmadan ilk günden çalışır.",
      "Rasyonel yöntem fiziksel skoru (Q = C · i · A) soğuk başlangıç katmanını kurar.",
    ],
  },
  {
    id: "seviye-1",
    label: "Seviye 1 · Mevcut İstasyon & Wilo DDI",
    badge: "Ek sensör gerekmez",
    newHardware: "Yok (yalnızca veri paylaşımı)",
    sources:
      "SCADA verisi (ASKİ SCADA, İSKİ Reliance) ve Wilo Rexa SUPRA / SOLID-Q DDI (Ethernet, ModBus TCP, OPC UA akım, titreşim, tıkanma sinyali).",
    contribution: "Sabit ve mobil pompaların ortak kararı, vatandaş ihbarından önce erken kuyu alarmı.",
    notes: [
      "Sağlıklı ve kapasitesi yeterli istasyona boşuna mobil ekip göndermez.",
      "Tıkanma veya akım anormalliği varsa mobil pompa önceliğini otomatik yukarı taşır.",
    ],
  },
  {
    id: "seviye-2",
    label: "Seviye 2 · Seçici Sensör",
    badge: "Yalnızca kör noktalar",
    newHardware: "Var (seçilen kritik alt geçitlerde)",
    sources:
      "Eski ve telemetrisi olmayan kritik istasyonlara eklenen seviye ve akım sensörleri (ör. 10 / 20 / 35 cm kademeli eşikler).",
    contribution: "Kör noktaları kapatır; sensörsüz istasyonlarda istatistiksel arıza olasılığı korunur.",
    notes: [
      "Tüm kenti donatmak yerine yalnızca en yüksek etkili alt geçitlere odaklanır.",
      "Wilo Padus PRO (ör. M08L/T060-540/P azami 140,5 m³/saat) sınıfı mobil pompayı kapasite açığına göre eşleştirir.",
    ],
  },
];

export const FEATURE_GROUPS = [
  {
    group: "Dinamik Meteoroloji ve Zemin",
    refresh: "Saatlik (canlı)",
    features: [
      "Önümüzdeki 6 saatte en yüksek saatlik yağış (mm/saat)",
      "6 saatlik toplam yağış (mm)",
      "Ensemble üyelerinin kritik eşiği (ör. 20 mm/saat) aşma oranı",
      "Önceki 72 saatin yağışı ve üst toprak nemi (m³/m³)",
    ],
    contribution: "Yağış şiddetini, yön belirsizliğini ve zemin doygunluğunu ölçer.",
  },
  {
    group: "Statik Topoğrafya ve Kent Dokusu",
    refresh: "Statik / Yılda bir",
    features: [
      "Havza alanı (m²) ve çukur derinliği (m)",
      "Ortalama eğim (derece) ve alt geçit etiketi",
      "Geçirimsiz bina/yol oranı (%)",
      "En yakın dere yatağına uzaklık (m)",
    ],
    contribution: "Suyun hangi noktada ne hızla toplanacağını belirler.",
  },
  {
    group: "Sabit Altyapı ve Wilo Pompa Durumu",
    refresh: "Yarı statik / Canlı",
    features: [
      "Yağmur suyu kanal çapı (mm)",
      "Sabit pompa istasyonu varlığı ve kapasitesi (m³/s)",
      "Canlı çalışma, akım, titreşim ve tıkanma sinyali (Wilo Rexa SOLID-Q)",
    ],
    contribution: "Sağlıklı sabit pompayı eler; tıkanma veya kapasite açığı olanı öne çeker.",
  },
  {
    group: "Tarihsel ve Operasyonel Bağlam",
    refresh: "Olay sonrası / Statik",
    features: [
      "Son 10 yıldaki geçmiş su baskını sayısı",
      "Yolun trafik önemi skoru (0–1)",
      "En yakın hastane, okul veya itfaiyeye uzaklık (m)",
      "Belediyeden alınan mazgal tıkanması ihbarları (%41 açıklayıcılık fırsatı · Agonafir vd., 2022)",
    ],
    contribution: "Eşit riskli noktalarda kentsel etkisi ağır olana öncelik verir.",
  },
] as const;

export const LOW_DATA_PLAN_B = [
  "Etiket gerektirmeyen rasyonel yöntem fiziksel skoru (Q = C · i · A) ile başlamak.",
  "Haber ve ESWD kaynaklı 20–50 doğrulanmış olayla nokta bazlı kritik eşikleri sığ kalibrasyonla ayarlamak (Tian vd., 2019).",
  "Kayıtsız günleri 'su basmadı' saymayıp LightGBM + Pozitif-Etiketsiz (PU) öğrenme uygulamak.",
  "Her yağış sonrası sahadan dönen 'su vardı / yoktu' bildirimini otomatik yeni etiket yaparak modeli güncellemek.",
] as const;

export const JURY_PITCH_CHAPTERS = [
  {
    id: "problem",
    time: "0:00 – 0:40",
    title: "Problem ve Sabit Liste Açığı",
    summary: "İhbar gecikmesi vs ezbere sabit liste israfı; saha ölçeği (2.518 ihbar, ~12 milyar TL).",
  },
  {
    id: "kesit",
    time: "0:40 – 1:25",
    title: "Sabit + Mobil İş Birliği & 3 Seviyeli Veri",
    summary: "Akay alt geçidi örneği, Wilo Rexa DDI ve Padus PRO uyumu, ek sensör gerektirmeyen mimari.",
  },
  {
    id: "mimari",
    time: "1:25 – 2:10",
    title: "16 Girdili PU Öğrenme, Ensemble ve XAI",
    summary: "Tek eşikli kuraldan farkı; açıklanabilir risk yüzdesi ve belirsizlik dağılımı.",
  },
  {
    id: "filo",
    time: "2:10 – 2:45",
    title: "Ankara–Çankaya 12 Nokta / 6 Pompa Senaryosu",
    summary: "4 doğrudan + 2 tampon yerleşim, 45 dk'dan ≥ %50 müdahale süresi azaltımı.",
  },
  {
    id: "pilot",
    time: "2:45 – 3:00",
    title: "AKOM Ekranı, Yanlış Alarm Eşiği & 3 Haziran Testi",
    summary: "Taggart maliyet eşiği, 3 Haziran 2023 geri oynatımı ve 4734 md. 22/d doğrudan temin.",
  },
] as const;

export const KPI_TARGETS = [
  { metric: "Ortalama müdahale süresinde azalma" },
  { metric: "Kritik noktaların zamanında kapsanması (Top-K yakalama)" },
  { metric: "Gereksiz ekip bekleme süresinde azalma" },
  { metric: "Kaçırılan su baskını sayısında (False Negative) azalma" },
  { metric: "Su baskını kaynaklı alt geçit kapanma süresinde azalma" },
  { metric: "Yanlış alarm kaynaklı gereksiz sevklerde (False Positive) azalma" },
  { metric: "Risk değerlendirme ve konuşlandırma atama süresi" },
  {
    metric: "Tahliye edilen yağmur suyunun geri kazanımı",
    note: "Pompalanan suyun kanalizasyon yerine depolama, sulama veya yeşil alana yönlendirilen payı (m³)",
    isNew: true,
  },
] as const;

export const GOVERNANCE_ROLES = [
  {
    role: "Ana Kullanıcı",
    actor: "AKOM Nöbetçi Koordinatörü",
    expectation: "Az tıklama, net gerekçe, olasılık yüzdesi ve alternatif rota takası",
    proof: "Geçmiş yağış gününün geriye dönük simülasyonu",
  },
  {
    role: "Saha Kullanıcısı",
    actor: "İtfaiye ve Su İdaresi (ASKİ) Ekip Şefleri",
    expectation: "Tek ekranlık görev kartı, trafik kısıtlı rota ve tahmini varış süresi",
    proof: "Mobil görev kartı ve yağış sonrası 'su var / yok' geri bildirimi",
  },
  {
    role: "Bütçe ve Satın Alma",
    actor: "Büyükşehir Gen. Sek. Yrd. / İhale Birimi",
    expectation: "Azalan hasar, görünür sonuç, mevzuata uygun pilot bütçesi",
    proof: "Pilot için doğrudan temin (4734 s. K. md. 22/d · 2026 büyükşehir limiti 1.021.827 TL KDV hariç)",
  },
  {
    role: "Teknik Onay",
    actor: "Bilgi İşlem Dairesi",
    expectation: "KVKK uyumu, veri güvenliği, kurum içi yerel barındırma",
    proof: "Kişisel veri işlemeyen mimari (sadece anonim olay/mahalle/saat & altyapı telemetrisi)",
  },
  {
    role: "İş Ortağı",
    actor: "Wilo",
    expectation: "Pompa donanımını dijital karar hizmeti ve bakım paketiyle büyütmek",
    proof: "Rexa SUPRA / SOLID-Q DDI + Padus PRO mobil filo + konuşlandırma yazılımı",
  },
] as const;

export const CHAPTER_INDEX = [
  { href: "#giris", label: "Açılış · 16.30 Çankaya" },
  { href: "#problem", label: "Problem Tanımı" },
  { href: "#karsilastirma", label: "Proje Özeti ve Karşılaştırma" },
  { href: "#hava", label: "I · Gökyüzü ve 3B Radar" },
  { href: "#kesit", label: "II · Akay Kesiti ve Wilo DDI" },
  { href: "#mimari", label: "3 Seviyeli Veri ve Donanım Uyumu" },
  { href: "#yapay-zeka", label: "16 Girdili Yapay Zekâ ve XAI" },
  { href: "#filo", label: "III · Sahadaki Ekipler (16.40 – 17.02)" },
  { href: "#sure", label: "IV · Kronometre ve Yanlış Alarm" },
  { href: "#pilot", label: "Pilot Testi ve Kurumsal Yapı" },
] as const;

export const REFERENCES_LIST = [
  "ABB, AKOM (3 Haziran 2023) — Sel ve Su Baskınları Raporu (s. 42–44, Akay Alt Geçidi, Taurus AVM ve Ceyhun Atuf Kansu müdahaleleri).",
  "Olcay, Ö. / Anadolu Ajansı (8 Aralık 2023) — Ankara'da 15 alt geçide 116 sensör ve 116 kamera ile kademeli alarm sistemi (10/20/35 cm).",
  "Reliance SCADA (2013) — İSKİ İstanbul alt geçitleri uzaktan izleme ve alarm sistemi.",
  "ASKİ — SCADA uzaktan izleme ve pompa istasyonu yönetimi.",
  "Wilo — Wilo-Rexa SOLID-Q with Nexos Intelligence (tıkanma algılama ve DDI dijital arayüz).",
  "Wilo — Wilo-Rexa SUPRA ürün ve DDI (Ethernet, ModBus TCP, OPC UA) bilgileri.",
  "Wilo — Wilo-Padus PRO portatif dalgıç drenaj pompası teknik verileri (M08L/T060-540/P: 140,5 m³/saat).",
  "Rawls, C. G. ve Turnquist, M. A. (2010) — Pre-positioning of emergency supplies for disaster response. Transportation Research Part B, 44(4), 521–534.",
  "Federal Highway Administration (FHWA) — Hydraulic Design Series No. 4 (HDS-4), rasyonel yöntem (Q = C · i · A).",
  "Agonafir vd. (2022) — NOAA deposu: New York 311 sokak su baskını şikâyetleri üzerine makine öğrenmesi (%41 mazgal tıkanması payı).",
  "Tian vd. (2019) — TU Delft: Vatandaş bildirimlerinden karar ağacı modelleriyle kritik yağış eşikleri (Rotterdam).",
  "Open-Meteo — Ensemble Weather API belgeleri (CC BY 4.0).",
  "MGM — Meteouyarı resmî meteorolojik uyarı sistemi.",
  "Copernicus Data Space — Copernicus DEM (GLO-30 / EEA-10).",
  "OpenStreetMap Wiki — Key:tunnel ve alt geçit etiketleme kuralları.",
  "NHESS (2025) — tr-news-scraper ile Türk haberlerinden doğal tehlike envanteri (13.940 olay, 9.609 sel).",
  "Türkiye Afet Müdahale Planı (TAMP), Cumhurbaşkanı Kararı, RG 15.09.2022.",
  "Harbiye Hukuk (2025) — 2009 İstanbul sel zararında kurumların paylaşımlı sorumluluğu (Danıştay 8. Daire).",
  "4734 sayılı Kamu İhale Kanunu md. 22/d — 2026 yılı doğrudan temin parasal limiti (1.021.827 TL KDV hariç).",
  "Taggart vd. (2022, akt. arXiv:2502.08891) — Maliyet/kayıp oranına dayalı uyarı eşiği kuralı.",
  "Roulston, M. S. ve Smith, L. A. (2004) — The boy who cried wolf revisited: cost-loss scenarios.",
  "Zhang vd. (2024) — Sel uyarısında yanlış alarm ve kaçırma dengesi, HESS, 28, 5229.",
  "Nefes (14 Ekim 2026) — İstanbul Valiliği sağanak yağış bilançosu (2.518 ihbar, 1.277 su baskını, 47 mahsur kalma).",
  "Foreks (15 Ekim 2026) — İBB AKOM kriz masası ve 8.564 personel koordinasyonu.",
  "Gazete Oksijen (Ekim 2026) — Türkiye Sigorta Birliği sel hasarı bilançosu (10.130 ihbar, ~12 milyar TL).",
] as const;
