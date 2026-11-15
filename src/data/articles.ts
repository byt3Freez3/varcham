import { Article } from '@/types';

export const ARTICLE_CATEGORIES = [
  'All',
  'Rituals',
  'Guides',
  'Festivals',
  'Sandalwood & Attars',
] as const;

export const ARTICLES: Article[] = [
  {
    id: 'art-akhand-diya',
    slug: 'how-to-set-up-an-akhand-diya',
    title: 'How to set up an Akhand Diya',
    titleHi: 'अखंड दीपक जलाने की सही विधि',
    topic: 'Rituals',
    readTime: '4 min read',
    date: '04 Nov 2026',
    excerpt:
      'Choosing the right braided cotton wick thickness, pre-soaking in warm ghee, and keeping the chimney vent clear for an unbroken jyoti.',
    image: '/images/prod-brass-akhand.jpg',
    content: [
      'Lighting an Akhand Jyoti — an unbroken sacred lamp kept glowing through the nine nights of Navratri, Diwali, or during a dedicated family sankalp — brings an aura of quiet steadiness to a home. Most fluttering and sudden extinctions occur not due to room drafts, but because a dry cotton wick cannot draw dense, cold ghee fast enough to feed the rising flame.',
      'Always start by soaking a fresh braided cotton wick (Akhand Bati Rui) in slightly warmed pure cow ghee for at least 15 minutes before threading it through the central nozzle of your brass diya. Keep the exposed tip short — roughly 5mm above the brass holder — so the flame remains calm, golden, and smoke-free, preventing soot from clouding the borosilicate glass chimney.',
      'Every twelve hours, lift the glass shield carefully using a dry cotton cloth. Using dedicated brass wick tweezers or scissors, gently snip away only the charred carbon crown without disturbing the living flame beneath, then pour fresh melted ghee around the base while the metal is still warm. Place a sturdy brass thali beneath the lamp base to protect wooden altar surfaces.',
    ],
    relatedProductSlugs: ['brass-aakhand-diya', 'akhand-bati-rui', 'ghee'],
  },
  {
    id: 'art-karwa-chauth',
    slug: 'karwa-chauth-thali-checklist',
    title: 'Karwa Chauth thali checklist',
    titleHi: 'करवा चौथ थाली की संपूर्ण सूची',
    topic: 'Festivals',
    readTime: '3 min read',
    date: '29 Oct 2026',
    excerpt:
      'From the decorated earthen karwa and Chauth Mata panna to roli, unbroken akshat, kacha sutt, and evening arghya preparation.',
    image: '/images/prod-puja-thali.jpg',
    content: [
      'The afternoon katha brings mothers, daughters, and neighbours together in a circle of shared devotion. Setting up your puja thali early in the morning eliminates the last-minute scramble across crowded neighborhood markets for forgotten threads or sacred earthen lids.',
      'A traditional Karwa Chauth thali rests upon five foundational items: an illustrated Chauth Mata panna mounted at eye level, a spouted Clay Karwachauth Kalash filled with clean Gangajal and water, unbroken Akshat Chawal blended with fragrant Roli, a clean length of pure Moli and raw cotton Kacha Sutt, and a steady brass or terracotta diya.',
      'At Varcham, our Karwa Chauth kit gathers every required samagri item in one thoughtfully prepared box — with the distinct freedom to untick any thali or diya you already have in your family collection before checking out.',
    ],
    relatedProductSlugs: ['puja-thali-red', 'clay-karwachauth-kalash', 'panna-big-karwa-chauth'],
  },
  {
    id: 'art-attars-guide',
    slug: 'choosing-an-attar-floral-woody-fresh-musky',
    title: 'Choosing an attar: floral, woody, fresh or musky',
    titleHi: 'पूजा एवं ध्यान के लिए इत्र का चयन',
    topic: 'Sandalwood & Attars',
    readTime: '4 min read',
    date: '22 Oct 2026',
    excerpt:
      'A practical guide to traditional Kannauj steam distillation, understanding scent profiles, and pairing natural notes with morning dhyana or evening sandhya.',
    image: '/images/col-attars.jpg',
    content: [
      'Unlike commercial synthetic sprays packed with alcohol and aerosol carriers, traditional Indian attars are hydro-distilled into a pure sandalwood or botanical carrier oil. Because they are 100% alcohol-free, they can be reverently offered on marble vigrahs, prayer malas, and temple cotton wicks without causing chemical discoloration.',
      'When selecting an attar for your home, match the aromatic profile to the ritual mood. Floral notes such as Ruh Gulab (pure Damask rose) and Madurai Mogra bring lightness and gentle joy, ideal for morning abhishek and welcome aartis. Woody blends such as Mysore Sandalwood and aged Oudh ground the mind, making them perfect companions for seated mantra japa and evening sandhya.',
      'To experience the fragrance fully, dab a single drop onto a clean swatch of raw cotton and place it beside the mandir diya. As the gentle heat of the brass lamp warms the surrounding air, the natural botanical oils release an unhurried, pure aroma across your home for hours.',
    ],
    relatedProductSlugs: ['kesar-chandan-attar', 'oudh-attar', 'ruh-gulab-attar'],
  },
  {
    id: 'art-brass-marble-care',
    slug: 'caring-for-brass-and-marble-puja-articles',
    title: 'Caring for brass and marble puja articles',
    titleHi: 'पीतल और संगमरमर की पूजा सामग्री की देखभाल',
    topic: 'Guides',
    readTime: '5 min read',
    date: '18 Oct 2026',
    excerpt:
      'How to cleanse heirloom brass without toxic chemical polishes and keep pure Makrana white marble spotless from oil and kumkum stains.',
    image: '/images/col-brass-marble.jpg',
    content: [
      'Sacred metal and stone develop a gentle patina over years of worship. However, accumulated oil residue and dark tarnish can dull their sacred brilliance. The key to maintaining heirloom brass and marble lies in gentle, natural cleansers that protect the underlying craftsmanship.',
      'For solid brass diyas and thalis, avoid harsh chemical metal polishes that leave pungent synthetic residues in the mandir. Instead, prepare a traditional paste of tamarind pulp (imli) or fresh lemon juice mixed with fine pitambari or rock salt. Gently rub the metal along its engraved contours using a soft cotton cloth, rinse with lukewarm water, and immediately wipe dry to prevent water spotting.',
      'Makrana white marble requires special care because natural calcite is porous. Never use acidic lemons or vinegar on marble as they cause etching. If roli, kumkum, or mustard oil leaves a mark, gently blot the spot with a mild paste of baking soda and cold water, let it draw out the pigment for ten minutes, then wipe clean with a damp muslin cloth.',
    ],
    relatedProductSlugs: ['brass-aakhand-diya', 'marble-lotus-diya', 'puja-thali-red'],
  },
  {
    id: 'art-griha-pravesh',
    slug: 'griha-pravesh-the-complete-samagri-list',
    title: 'Griha Pravesh: the complete samagri list',
    titleHi: 'गृह प्रवेश: संपूर्ण सामग्री एवं विधि सूची',
    topic: 'Festivals',
    readTime: '5 min read',
    date: '12 Oct 2026',
    excerpt:
      'Threshold Shubh Labh torans, Navgrah samidha, Vastu yantra placement, and fresh cow milk boiling essentials before entering your new home.',
    image: '/images/store-kolkata.jpg',
    content: [
      'Entering a newly built or renovated home is a once-in-a-lifetime milestone. Purohits across tradition recommend organising your dry puja samagri two days prior so that family members can focus on welcoming elders and receiving sacred blessings rather than making frantic market runs on the morning of the havan.',
      'Begin at the main doorway threshold: adorn the doorframe with a traditional mango-leaf toran, Latkan Shubh Labh hangings, and auspicious brass Lakshmi Pagalia pointing inward. Keep sealed Ganga Jal ready for purifying every corner of the dwelling before the fire is kindled.',
      'For the havan itself, ensure you have nine distinct Navgrah Samidha wood bundles, unadulterated Bhimseni kapur, pure cow ghee, black sesame seeds (til), barley (jau), and fragrant Herbaa Havan Samagri. As the sacred fire concludes, carry smouldering guggul dhuna through each room using a pierced brass lobandan to consecrate every threshold.',
    ],
    relatedProductSlugs: ['brass-jali-lobandan-wood-handle', 'navgrah-samidha', 'herbaa-bhimseni-kapur-100gm'],
  },
  {
    id: 'art-bhimseni-kapur',
    slug: 'why-bhimseni-kapur-is-different',
    title: 'Why Bhimseni kapur is different',
    titleHi: 'भीमसेनी कपूर इतना विशेष क्यों है',
    topic: 'Rituals',
    readTime: '3 min read',
    date: '08 Oct 2026',
    excerpt:
      'Understanding crystalline organic camphor vs machine-pressed wax tablets, zero black ash residue, and its soothing ayurvedic aroma.',
    image: '/images/col-samagri.jpg',
    content: [
      'Anyone who has watched a cheap camphor tablet smoke black onto their mandir ceiling has experienced the difference synthetic binders make. Ordinary commercial kapur is machine-pressed from petroleum-derived flakes held together with heavy chemical waxes that produce dark soot and harsh stinging smoke.',
      'In contrast, authentic Bhimseni Kapur (also called Baras or Pachai Karpooram) crystallises naturally from the distillates of Cinnamomum camphora. It has an irregular, rock-like fracture rather than uniform circular tablets, feeling naturally cool and slightly moist to the touch.',
      'When you place a pinch of pure Bhimseni kapur on a brass aarti spoon and light it, it burns with a luminous, calm golden-white flame. Most remarkably, once the fire subsides, it leaves zero black ash or greasy residue behind on the metal plate — evaporating completely into a sweet, lingering medicinal fragrance that purifies the indoor atmosphere.',
    ],
    relatedProductSlugs: ['herbaa-bhimseni-kapur-100gm', 'brass-aakhand-diya', 'kesar-chandan-attar'],
  },
];
