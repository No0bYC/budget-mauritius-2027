import { useState } from 'react';
import { Check,AlertTriangle,Info,ArrowLeft,RotateCcw,Sparkles,Filter,
  ShoppingBag,Car,Home,Users,PiggyBank,Briefcase,Building2,Globe,TrendingUp,ShieldCheck,ChevronDown,X,MapPin
} from 'lucide-react';

const C={
  page:'#EFEAE0',card:'#FFFCF7',border:'#E4DCC9',ink:'#1C1B1A',soft:'#5B5750',
  lagoon:'#0E7C7B',posBg:'#E6F2EA',posT:'#1F6F4A',negBg:'#FBEAE5',negT:'#9C3322',
  neuBg:'#E9EEEE',neuT:'#3C6B6A',oppBg:'#FBF1DC',oppBrd:'#E8C77E',oppAcc:'#92660E',
  flag:['#E12C32','#1B2C5C','#F4C430','#1E8449'],
};
const APPS_SCRIPT_URL='https://script.google.com/macros/s/AKfycbyDmhNsKFEgaFGe3iYCgVActYrrEu9GBRd3Rs8KXPP76iydeurjBYOZHB9HkVsOqfFo2w/exec';

const tx=(o,l)=>(typeof o==='string'?o:(o?.[l]||o?.fr||''));
const isRet=p=>p.situations.includes('retraite')||p.age==='senior';
const isAct=p=>p.situations.includes('salarie')||p.situations.includes('independant');
const isEnt=p=>p.situations.includes('independant');
const isExp=p=>p.situations.includes('expatrie')||p.mauricien==='non';
const isInv=p=>p.situations.includes('investisseur');
const sect=s=>p=>isEnt(p)&&p.details.independant===s;
const expD=d=>p=>p.situations.includes('expatrie')&&p.details.expatrie===d;
const invD=d=>p=>isInv(p)&&p.details.investisseur===d;
const revA=(...v)=>p=>v.includes(p.revenu);
const inRegion=r=>p=>p.regions.includes(r);

const UI={
fr:{
  header:'Budget Maurice 2026\u20132027', step:(c,t)=>`\u00c9tape ${c} sur ${t}`,
  intro_title:"Qu'est-ce que ce budget change pour vous\u00a0?",
  intro_sub:"Le budget 2026-2027 comporte des centaines de mesures. R\u00e9pondez \u00e0 quelques questions pour identifier celles qui vous concernent vraiment.",
  start:'Commencer',back:'Retour',restart:'Recommencer',next:'Continuer',
  q_nat:'\u00cates-vous mauricien\u00b7ne\u00a0?',oui:'Oui',non:'Non',
  q_genre:'Vous\u00a0\u00eates\u2026',homme:'Un homme',femme:'Une femme',gnr:'Pr\u00e9f\u00e8re ne pas r\u00e9pondre',
  q_age:'Quel \u00e2ge avez-vous\u00a0?',agej:'Moins de 26 ans',agea:'26 \u00e0 59 ans',ages:'60 ans et plus',
  q_sit:'Quelle est votre situation\u00a0?',multi:'Plusieurs r\u00e9ponses possibles.',
  s_sal:'Salari\u00e9\u00b7e',s_ind:"Ind\u00e9pendant\u00b7e ou chef d'entreprise",s_ret:'Retrait\u00e9\u00b7e',
  s_etu:'\u00c9tudiant\u00b7e',s_exp:'Expatri\u00e9\u00b7e r\u00e9sidant \u00e0 Maurice',s_inv:'Investisseur\u00b7euse',
  q_rev:'Quel est votre revenu mensuel\u00a0?',q_rev_r:'Quel \u00e9tait votre dernier salaire mensuel\u00a0?',
  rev_h:"Cette information reste sur votre appareil et sert uniquement \u00e0 pr\u00e9ciser vos r\u00e9sultats.",
  rev_hr:"Ce rep\u00e8re correspond \u00e0 votre dernier salaire avant la retraite, pour estimer si le test de ressources sur la pension pourrait s'appliquer.",
  q_ext:"S\u00e9lectionnez ce qui s'applique \u00e0 vous",ext_h:'Facultatif \u2014 vous pouvez passer cette \u00e9tape.',
  e_prop:"Propri\u00e9taire ou en projet d'achat",e_voit:"J'ai une voiture",
  e_enf:"J'ai des enfants scolarit\u00e9s",e_pr\u00eat:"J'ai un pr\u00eat personnel en cours",
  e_loc:"Je loue un bien immobilier (revenus locatifs)",e_cry:"Je d\u00e9tiens des cryptomonnaies",
  e_inv2:"Je touche une allocation d'invalidit\u00e9 ou de soins",
  voir:'Voir mon impact',res_t:'Votre impact, en clair',
  b_pos:n=>`${n} bonne${n>1?'s':''} nouvelle${n>1?'s':''}`,
  b_neg:n=>`${n} \u00e0 surveiller`,b_neu:n=>`${n} \u00e0 savoir`,
  b_opp:n=>`${n} opportunit\u00e9${n>1?'s':''}`,
  opp_t:'Opportunit\u00e9s \u00e0 saisir',
  opp_d:"Ces mesures ne s'appliquent pas automatiquement. Ces informations sont donn\u00e9es \u00e0 titre indicatif et ne constituent pas un conseil financier, fiscal ou juridique. Consultez un professionnel agr\u00e9\u00e9 avant toute d\u00e9cision.",
  filt:'Filtrer par section\u00a0:',filt0:'Toutes',
  off:'Tel qu\u2019\u00e9nonc\u00e9 dans le budget',anote:'\u00c0 noter',
  dpos:'Bonne nouvelle',dneg:'\u00c0 surveiller',dneu:'\u00c0 savoir',otag:'Opportunit\u00e9',
  det_f:s=>`Pour votre profil ${s}.`,
  rv0:'Moins de\u00a0Rs\u00a014\u00a0000',rv1:'Rs\u00a014\u00a0000 \u00e0 Rs\u00a050\u00a0000',
  rv2:'Rs\u00a050\u00a0000 \u00e0 Rs\u00a0100\u00a0000',rv3:'Plus de\u00a0Rs\u00a0100\u00a0000',rv4:'Je pr\u00e9f\u00e8re ne pas r\u00e9pondre',
  pm:'Mauricien\u00b7ne',pnm:'Non-mauricien\u00b7ne',ph:'Homme',pf:'Femme',
  ag:{jeune:'Moins de 26 ans',actif:'26 \u00e0 59 ans',senior:'60 ans et plus'},
  sl:{salarie:'Salari\u00e9\u00b7e',independant:'Entrepreneur\u00b7e',retraite:'Retrait\u00e9\u00b7e',etudiant:'\u00c9tudiant\u00b7e',expatrie:'Expatri\u00e9\u00b7e',investisseur:'Investisseur\u00b7euse'},
  dl:{tourisme:'Tourisme',tech:'Tech\u00a0/\u00a0Digital',manufacturing:'Manufacturing',autre:'Autre secteur',golden_visa:'Golden Visa',immobilier_sez:'Immobilier\u00a0/\u00a0SEZ',obligations:"Obligations d'\u00c9tat",capital_local:'Capital local',actions_dividendes:'Actions\u00a0/\u00a0dividendes',permis_pro:'Permis pro',permis_investisseur:'Permis investisseur',conjoint:'Conjoint\u00b7e',retraite_etranger:'Retrait\u00e9\u00b7e'},
  q_region:'Dans quelle(s) r\u00e9gion(s) r\u00e9sidez-vous\u00a0?',r_h:'Facultatif \u2014 permet d\u2019identifier les projets locaux qui vous concernent directement.',r_skip:'Passer cette \u00e9tape',
  disc:"Plateforme ind\u00e9pendante \u00e0 but informatif uniquement. Aucune information ne constitue un conseil financier ou juridique. Conform\u00e9ment \u00e0 la Data Protection Act 2017, les donn\u00e9es collect\u00e9es sont strictement anonymes et \u00e0 des fins non lucratives.",
},
en:{
  header:'Mauritius Budget 2026\u20132027',step:(c,t)=>`Step ${c} of ${t}`,
  intro_title:"How does this budget affect you?",
  intro_sub:"The 2026-2027 budget contains hundreds of measures. Answer a few questions to find the ones that matter to you.",
  start:'Start',back:'Back',restart:'Start over',next:'Continue',
  q_nat:'Are you Mauritian?',oui:'Yes',non:'No',
  q_genre:'You are\u2026',homme:'A man',femme:'A woman',gnr:'Prefer not to say',
  q_age:'How old are you?',agej:'Under 26',agea:'26 to 59',ages:'60 and over',
  q_sit:'What is your current situation?',multi:'Multiple answers possible.',
  s_sal:'Employee',s_ind:'Self-employed or business owner',s_ret:'Retired',
  s_etu:'Student',s_exp:'Expat living in Mauritius',s_inv:'Investor',
  q_rev:'What is your monthly income?',q_rev_r:'What was your last monthly salary?',
  rev_h:"This stays on your device and only helps refine your results.",
  rev_hr:"This refers to your salary before retirement, used to estimate if the pension means test might apply.",
  q_ext:'Select what applies to you',ext_h:'Optional \u2014 you can skip this step.',
  e_prop:'Property owner or planning to buy',e_voit:'I have a car',
  e_enf:'I have school-age children',e_pr\u00eat:'I have an ongoing personal loan',
  e_loc:'I earn rental income',e_cry:'I hold cryptocurrency',
  e_inv2:'I receive a disability or care allowance',
  voir:'See my impact',res_t:'Your impact, clearly',
  b_pos:n=>`${n} good news`,b_neg:n=>`${n} to watch`,b_neu:n=>`${n} to know`,
  b_opp:n=>`${n} opportunit${n>1?'ies':'y'}`,
  opp_t:'Opportunities to seize',
  opp_d:"These measures do not apply automatically. This information is for informational purposes only and does not constitute financial, tax or legal advice. Please consult a qualified professional before any decision.",
  filt:'Filter by section:',filt0:'All',
  off:'As stated in the budget',anote:'To note',
  dpos:'Good news',dneg:'Watch out',dneu:'To know',otag:'Opportunity',
  det_f:s=>`For your ${s} profile.`,
  rv0:'Less than Rs\u00a014,000',rv1:'Rs\u00a014,000 to Rs\u00a050,000',
  rv2:'Rs\u00a050,000 to Rs\u00a0100,000',rv3:'More than Rs\u00a0100,000',rv4:'Prefer not to say',
  pm:'Mauritian',pnm:'Non-Mauritian',ph:'Male',pf:'Female',
  ag:{jeune:'Under 26',actif:'26 to 59',senior:'60 and over'},
  sl:{salarie:'Employee',independant:'Entrepreneur',retraite:'Retired',etudiant:'Student',expatrie:'Expat',investisseur:'Investor'},
  dl:{tourisme:'Tourism',tech:'Tech / Digital',manufacturing:'Manufacturing',autre:'Other sector',golden_visa:'Golden Visa',immobilier_sez:'Real Estate / SEZ',obligations:'Gov. bonds',capital_local:'Local business',actions_dividendes:'Shares / dividends',permis_pro:'Work permit',permis_investisseur:'Investor permit',conjoint:'Mauritian spouse',retraite_etranger:'Retired resident'},
  q_region:'Which region(s) do you live in?',r_h:'Optional \u2014 helps identify local projects relevant to you.',r_skip:'Skip this step',
  disc:"Independent informational platform only. No information constitutes financial or legal advice. In accordance with the Data Protection Act 2017, data collected is strictly anonymous and for non-commercial purposes.",
},
kr:{
  header:'Bidzet Moris 2026\u20132027',step:(c,t)=>`Letap ${c} lor ${t}`,
  intro_title:"Kouma bidzet-la afekte ou\u00a0?",
  intro_sub:"Bidzet 2026-2027 ena santrenn mezir. Reponn kek kestion pou trouv seki konsern ou personalman.",
  start:'Koumans',back:'Retourn',restart:'Rekominse',next:'Kontinye',
  q_nat:'Eski ou Morisien/Morisin\u00a0?',oui:'Wi',non:'Non',
  q_genre:'Ou ete\u2026',homme:'Enn misie',femme:'Enn dam',gnr:'Mo prefer pa dir',
  q_age:'Ki laz ou ena\u00a0?',agej:'Mwin ki 26 an',agea:'26 ziska 59 an',ages:'60 an ek plis',
  q_sit:'Ki ou sitiasion aktyel\u00a0?',multi:'Plizier reponns posib.',
  s_sal:'Salarye',s_ind:'Travayer endepandan / biznes',s_ret:'Retrete',
  s_etu:'Etidian',s_exp:'Expatriye ki reste Moris',s_inv:'Investiser',
  q_rev:'Ki ou reveni mansyel\u00a0?',q_rev_r:'Ki te ou dernie saler avan retrete\u00a0?',
  rev_h:"Sa reste lor ou aparey ek selman pou amelyor ou rezilta.",
  rev_hr:"Sa koresponn ar ou saler avan retrete, pou estim si test resours lor pansion kapav aplike.",
  q_ext:'Seleksion seki aplike pou ou',ext_h:'Faskiltatif \u2014 ou kapav pas sa letap.',
  e_prop:'Proprieter ou pe planie asete',e_voit:'Mo ena enn loto',
  e_enf:'Mo ena zanfan lekol',e_pr\u00eat:'Mo ena enn pre personel',
  e_loc:'Mo gagne reveni lokasion',e_cry:'Mo detient kriptomone',
  e_inv2:'Mo resevwa alosasion invalidite ou swin',
  voir:'Gete linpak lor mwa',res_t:'Ou linpak, kler kler',
  b_pos:n=>`${n} bon nouvell`,b_neg:n=>`${n} pou veye`,b_neu:n=>`${n} pou konner`,
  b_opp:n=>`${n} opurtinite`,
  opp_t:'Opurtinite pou sezi',
  opp_d:"Saki mezir sa pa aplike otomatikman. Sa linformasion pa enn konseil finansye, fiskal ou ziridik. Kontakte enn profesionel kwalifikasie avan ou pran nenpot desizion.",
  filt:'Filtre par seksion\u00a0:',filt0:'Tou',
  off:'Kouma mansione dan bidzet',anote:'Pou note',
  dpos:'Bon nouvell',dneg:'Pou veye',dneu:'Pou konner',otag:'Opurtinite',
  det_f:s=>`Pou ou profil ${s}.`,
  rv0:'Mwin ki Rs\u00a014\u00a0000',rv1:'Rs\u00a014\u00a0000 ar Rs\u00a050\u00a0000',
  rv2:'Rs\u00a050\u00a0000 ar Rs\u00a0100\u00a0000',rv3:'Plis ki Rs\u00a0100\u00a0000',rv4:'Mo prefer pa reponn',
  pm:'Morisien/Morisin',pnm:'Pa Morisien',ph:'Misie',pf:'Dam',
  ag:{jeune:'Mwin ki 26 an',actif:'26-59 an',senior:'60 an ek plis'},
  sl:{salarie:'Salarye',independant:'Antraprenner',retraite:'Retrete',etudiant:'Etidian',expatrie:'Expatriye',investisseur:'Investiser'},
  dl:{tourisme:'Touris',tech:'Teknolozi/Dijital',manufacturing:'Fabrikasion',autre:'Lot sektir',golden_visa:'Golden Visa',immobilier_sez:'Imobilye/SEZ',obligations:'Obligasion leta',capital_local:'Kapital lokal',actions_dividendes:'Aksion/dividann',permis_pro:'Permi travay',permis_investisseur:'Permi investiser',conjoint:'Konjwen Morisien',retraite_etranger:'Retrete rezidan'},
  q_region:'Dan ki rezion\u00a0ou reste\u00a0?',r_h:'Faskiltatif \u2014 ed nou trouv proze lokal ki konsern ou direkteman.',r_skip:'Pas sa letap',
  disc:"Platform endepandan pou informasion selman. Okenn linformasion pa konstitye enn konseil finansye ou ziridik. Konforme ar Data Protection Act 2017, done kolekte anonimman ek pou bi non-lisratif.",
},
};

const DQ={
  independant:{
    q:{fr:'Dans quel secteur ?',en:'In which sector?',kr:'Dan ki sektir ?'},
    opts:[
      {v:'tourisme',l:{fr:'Tourisme',en:'Tourism',kr:'Touris'}},
      {v:'tech',l:{fr:'Tech / Digital',en:'Tech / Digital',kr:'Teknolozi / Dijital'}},
      {v:'manufacturing',l:{fr:'Manufacturing',en:'Manufacturing',kr:'Fabrikasion'}},
      {v:'autre',l:{fr:'Autre secteur',en:'Other sector',kr:'Lot sektir'}},
    ],
  },
  investisseur:{
    q:{fr:"Quel type d'investissement ?",en:'What type of investment?',kr:'Ki kalite linvestisman ?'},
    opts:[
      {v:'golden_visa',l:{fr:'Golden Visa / r\u00e9sidence',en:'Golden Visa / residence',kr:'Golden Visa / rezidans'}},
      {v:'immobilier_sez',l:{fr:"Immobilier ou SEZ C\u00f4te d'Or",en:"Real estate or C\u00f4te d'Or SEZ",kr:"Imobilye ou SEZ Kote d'Or"}},
      {v:'obligations',l:{fr:"Obligations d'\u00c9tat",en:'Government bonds',kr:'Obligasion leta'}},
      {v:'capital_local',l:{fr:'Capital dans une entreprise locale',en:'Stake in a local business',kr:'Kapital dan enn biznes lokal'}},
      {v:'actions_dividendes',l:{fr:'Actions ou dividendes',en:'Shares or dividends',kr:'Aksion ou dividann'}},
    ],
  },
  expatrie:{
    q:{fr:'Quel est votre statut ?',en:'What is your status?',kr:'Ki ou statu ?'},
    opts:[
      {v:'permis_pro',l:{fr:'Permis professionnel (salari\u00e9\u00b7e)',en:'Work permit (employee)',kr:'Permi travay (salarye)'}},
      {v:'permis_investisseur',l:{fr:'Permis investisseur',en:'Investor permit',kr:'Permi investiser'}},
      {v:'conjoint',l:{fr:"Conjoint\u00b7e d'un\u00b7e Mauricien\u00b7ne",en:"Mauritian citizen's spouse",kr:"Konjwen d'enn Morisien"}},
      {v:'retraite_etranger',l:{fr:'Retrait\u00e9\u00b7e install\u00e9\u00b7e \u00e0 Maurice',en:'Retired resident in Mauritius',kr:'Retrete ki reste Moris'}},
    ],
  },
};

const REGIONS=[
  {v:'port_louis',    l:{fr:'Port Louis',          en:'Port Louis',          kr:'Port Louis'},         hint:{fr:'Port Louis, Roche Bois, Plaine Verte\u2026',         en:'Port Louis, Roche Bois, Plaine Verte\u2026',         kr:'Port Louis, Ros Bwa\u2026'}},
  {v:'pamplemousses', l:{fr:'Pamplemousses',        en:'Pamplemousses',       kr:'Pamplemousses'},      hint:{fr:'Triolet, Terre Rouge, Riche Terre, Mapou\u2026',     en:'Triolet, Terre Rouge, Riche Terre, Mapou\u2026',     kr:'Triolet, Ter Rouz, Mapou\u2026'}},
  {v:'riviere_rempart',l:{fr:'Rivi\u00e8re du Rempart',en:'Rivi\u00e8re du Rempart',kr:'Rivye du Rempar'},   hint:{fr:'Rivi\u00e8re du Rempart, Roches Noires, Goodlands\u2026',en:'Rivi\u00e8re du Rempart, Roches Noires\u2026',     kr:'Rivye du Rempar, Ros Nwar\u2026'}},
  {v:'flacq',         l:{fr:'Flacq',                en:'Flacq',               kr:'Flak'},               hint:{fr:'Centre de Flacq, Belle Mare, Trou d\u2019Eau Douce\u2026',en:'Centre de Flacq, Belle Mare, Trou d\u2019Eau Douce\u2026',kr:'Sant de Flak, Belle Mar\u2026'}},
  {v:'grand_port',    l:{fr:'Grand Port',            en:'Grand Port',          kr:'Gran Por'},           hint:{fr:'Mah\u00e9bourg, Rose Belle, Rivi\u00e8re des Cr\u00e9oles\u2026',en:'Mah\u00e9bourg, Rose Belle\u2026',               kr:'Mahebour, Roz Belle\u2026'}},
  {v:'savanne',       l:{fr:'Savanne',               en:'Savanne',             kr:'Savan'},              hint:{fr:'Souillac, Riviere des Anguilles, Chemin Grenier\u2026',en:'Souillac, Riviere des Anguilles\u2026',             kr:'Suliak, Rivye Lezangiy\u2026'}},
  {v:'black_river',   l:{fr:'Black River',           en:'Black River',         kr:'Black River'},        hint:{fr:'Tamarin, Flic en Flac, Albion, Case Noyale\u2026',  en:'Tamarin, Flic en Flac, Albion\u2026',               kr:'Tamarin, Albion\u2026'}},
  {v:'moka',          l:{fr:'Moka',                  en:'Moka',                kr:'Moka'},               hint:{fr:'Moka, C\u00f4te d\u2019Or, Quartier Militaire, St Pierre\u2026',en:'Moka, C\u00f4te d\u2019Or, Quartier Militaire\u2026',kr:'Moka, Kote d\u2019Or\u2026'}},
  {v:'plaines_wilhems',l:{fr:'Plaines Wilhems',     en:'Plaines Wilhems',     kr:'Plenn Wilhem'},       hint:{fr:'Quatre Bornes, Curepipe, Rose Hill, Beau Bassin, Vacoas\u2026',en:'Quatre Bornes, Curepipe, Rose Hill, Vacoas\u2026',kr:'Katr Born, Kirpip, Roz Il\u2026'}},
  {v:'rodrigues',     l:{fr:'Rodrigues',             en:'Rodrigues',           kr:'Rodrigues'},          hint:{fr:'Port Mathurin, La Ferme, Plaine Corail, Baladirou\u2026',en:'Port Mathurin, Plaine Corail\u2026',               kr:'Port Matiris, Plenn Koray\u2026'}},
  {v:'agalega',       l:{fr:'Agal\u00e9ga / \u00celes \u00e9parses',en:'Agalega / Outer Islands',kr:'Agalega / Outer Islands'},hint:{fr:'Agal\u00e9ga, Saint Brandon\u2026',en:'Agalega, St Brandon\u2026',kr:'Agalega, Sen Brandon\u2026'}},
];

const M=[
{id:'sucre',section:'quotidien',direction:'negative',when:'d\u00e8s oct.\u00a02026',
 title:{fr:'Hausse de la taxe sur les produits sucr\u00e9s',en:'Sugar tax increase',kr:'Ogmantasion takis lor prodwi si'},
 text:{fr:'La taxe passe de 12 \u00e0 15\u00a0cents/g, \u00e9tendue aux bonbons, confitures et biscuits.',en:'The sugar tax rises from 12 to 15 cents/g, extended to sweets, jams and biscuits.',kr:'Takis lor pwin list monte depi 12 ar 15 san/gram, elarzir ar bonbon, konfiti ek biski.'},
 officialText:"Le budget porte la taxe d'accise sur le sucre ajout\u00e9 de 12 \u00e0 15\u00a0cents par gramme et l'\u00e9tend aux bonbons, confitures, biscuits et chewing-gums.",
 source:{ref:'\u00a75(a)(b)',organisme:'Mauritius Revenue Authority (MRA)'},condition:()=>true},
{id:'plastique',section:'quotidien',direction:'negative',when:'d\u00e8s oct.\u00a02026',
 title:{fr:'La taxe plastique s\u2019\u00e9largit',en:'Plastic bottle tax extended',kr:'Takis boutey plastik elarzir'},
 text:{fr:"R\u00e9serv\u00e9e aux boissons, elle s'applique d\u00e9sormais \u00e0 tous les produits en bouteille plastique.",en:'Previously limited to beverages, this tax now applies to all products in plastic bottles.',kr:'Sa takis ti zis lor bwason, astere li aplike lor tou prodwi dan boutey plastik.'},
 officialText:"La taxe sur les contenants plastique est \u00e9tendue de l'ensemble des produits commercialis\u00e9s en bouteille plastique.",
 source:{ref:'\u00a74',organisme:'MRA'},condition:()=>true},
{id:'sel',section:'quotidien',direction:'positive',when:null,
 title:{fr:'Le sel devient exon\u00e9r\u00e9 de TVA',en:'Salt becomes VAT-exempt',kr:'Sel exemte TVA'},
 text:{fr:'Le sel de cuisine, local ou import\u00e9, ne sera plus soumis \u00e0 la TVA.',en:'Table salt, local or imported, will no longer be subject to VAT.',kr:'Sel diswa, lokal ou enpote, pa pou bizin peye TVA.'},
 officialText:"Le budget supprime la TVA applicable au sel de cuisine, local ou import\u00e9.",
 source:{ref:'\u00a76(i)',organisme:'MRA'},condition:()=>true},
{id:'colis',section:'quotidien',direction:'negative',when:'d\u00e8s sept.\u00a02026',
 title:{fr:'Nouveau frais sur les colis internationaux',en:'New fee on international parcels',kr:'Nouvo fre lor koli etranze'},
 text:{fr:'Un frais de Rs\u00a0150 s\u2019appliquera \u00e0 chaque colis reu par la poste ou par courrier.',en:'A fee of Rs\u00a0150 will apply to each parcel received by post or courier from abroad.',kr:'Enn fre Rs\u00a0150 pou aplike lor sak koli resevwa par lapost ou kourie etranze.'},
 officialText:"Un frais de Rs\u00a0150 sera pr\u00e9lev\u00e9 sur chaque colis international reu par voie postale ou messagerie priv\u00e9e.",
 source:{ref:'\u00a77',organisme:'MRA'},condition:()=>true},
{id:'bus',section:'quotidien',direction:'positive',when:null,
 title:{fr:"R\u00e9duction de l'\u00e2ge maximal des bus",en:'Maximum bus age gradually reduced',kr:'Redikasion laz maximal bis'},
 text:{fr:"L'\u00e2ge limite des bus en service passera de 21 \u00e0 16\u00a0ans sur cinq ans.",en:'The maximum age for buses will be reduced from 21 to 16 years over five years.',kr:'Laz maximal otorise pou bis pou bese depi 21 ar 16 an, lor 5 an.'},
 officialText:"L'\u00e2ge maximal autoris\u00e9 pour les bus en circulation sera progressivement r\u00e9duit de 21 \u00e0 16\u00a0ans sur cinq ans.",
 source:{ref:'\u00a716(a)',organisme:'National Land Transport Authority (NLTA)'},condition:()=>true},
{id:'sport',section:'quotidien',direction:'positive',when:null,
 title:{fr:'Acc\u00e8s gratuit \u00e0 certaines infrastructures sportives',en:'Free access to some sports facilities',kr:'Grate aksesi ar sertain infrastriktir spor'},
 text:{fr:'Plusieurs infrastructures sportives r\u00e9gionales deviendront gratuites pour encourager la pratique sportive.',en:'Several regional sports facilities will become free to encourage physical activity.',kr:'Plizier infrastriktir spor rezional pou vinn grate pou ankouraz pratik spor.'},
 officialText:"Plusieurs infrastructures sportives r\u00e9gionales seront rendues accessibles gratuitement.",
 source:{ref:'\u00a725',organisme:'Minist\u00e8re de la Jeunesse et des Sports'},condition:()=>true},
{id:'bruit',section:'quotidien',direction:'neutral',when:null,
 title:{fr:'Les amendes pour nuisance sonore doublent',en:'Noise fines doubled',kr:'Amann pou bri doub'},
 text:{fr:"L'amende pour nuisance sonore passe de Rs\u00a010\u00a0000 \u00e0 Rs\u00a020\u00a0000.",en:'The noise nuisance fine rises from Rs\u00a010,000 to Rs\u00a020,000.',kr:'Lamann pou bri monte depi Rs\u00a010\u00a0000 ar Rs\u00a020\u00a0000.'},
 officialText:"L'amende pr\u00e9vue pour infraction \u00e0 la l\u00e9gislation sur les nuisances sonores est doubl\u00e9e, passant de Rs\u00a010\u00a0000 \u00e0 Rs\u00a020\u00a0000.",
 source:{ref:'\u00a720',organisme:'Police de Maurice'},condition:()=>true},
{id:'alcool',section:'quotidien',direction:'negative',when:'d\u00e8s le 20\u00a0juin\u00a02026',
 title:{fr:'Hausse sur les spiritueux uniquement',en:'Spirits increase, beer and wine unchanged',kr:'Ogmantasion lor spiri selman'},
 text:{fr:'Rhum, whisky et spiritueux augmentent d\u2019environ 10\u00a0%. Bi\u00e8re et vin inchang\u00e9s.',en:'Rum, whisky and spirits increase by ~10%. Beer and wine remain unchanged.',kr:'Roum, wiski ek spiri ogmant par ~10%. Labyer ek diven pa sanze.'},
 officialText:"Les droits d'accise sur les spiritueux augmentent d'environ 10\u00a0% \u00e0 compter du 20\u00a0juin 2026. Les droits sur la bi\u00e8re et le vin ne sont pas modifi\u00e9s.",
 source:{ref:'\u00a73.1',organisme:'MRA'},condition:()=>true},
{id:'tabac',section:'quotidien',direction:'negative',when:'d\u00e8s le 20\u00a0juin\u00a02026',
 title:{fr:'Hausse du prix du tabac',en:'Tobacco price increase',kr:'Ogmantasion pri tabak'},
 text:{fr:'Cigarettes, cigares et cigarillos augmentent d\u2019environ 10\u00a0%.',en:'Cigarettes, cigars and cigarillos increase by around 10%.',kr:'Sigarette, sigar ek sigarilo ogmant par ~10%.'},
 officialText:"Les droits d'accise sur les produits du tabac augmentent d'environ 10\u00a0% \u00e0 compter du 20\u00a0juin 2026.",
 source:{ref:'\u00a73.2',organisme:'MRA'},condition:()=>true},
{id:'data_gratuit',section:'quotidien',direction:'positive',when:"jusqu'en juin\u00a02027",
 title:{fr:'La data gratuite 18-25 ans est prolong\u00e9e',en:'Free data for 18-25s extended',kr:'Done grate pou 18-25 an plonje'},
 text:{fr:'Le forfait data mensuel gratuit pour les Mauriciens de 18-25 ans est reconduit jusqu\u2019en juin 2027.',en:'The free monthly data bundle for Mauritian citizens aged 18-25 is renewed until June 2027.',kr:'Forfet done mansyel grate pou Morisien 18-25 an renouvle ziska zin 2027.'},
 officialText:"Le programme de donn\u00e9es mobiles gratuites destin\u00e9 aux citoyens mauriciens \u00e2g\u00e9s de 18 \u00e0 25 ans est prolong\u00e9 jusqu\u2019en juin 2027.",
 source:{ref:'\u00a721',organisme:'Minist\u00e8re des TIC'},condition:p=>p.age==='jeune'&&p.mauricien==='oui'},
{id:'assurance_taxe',section:'quotidien',direction:'negative',when:'d\u00e8s janv.\u00a02027',
 title:{fr:'Nouvelle taxe sur les primes d\u2019assurance',en:'New Insurance Premium Tax',kr:'Nouvo takis lor prim asirans'},
 text:{fr:'Une taxe de 5\u00a0% est introduite sur toutes les primes d\u2019assurance g\u00e9n\u00e9rale (habitation, v\u00e9hicule, sant\u00e9, etc.).',en:'A 5% Insurance Premium Tax is introduced on all general insurance premiums (home, vehicle, health, etc.).',kr:'Enn takis 5% entwodwir lor tou prim asirans zeneral (lakaz, loto, lasante, etc.).'},
 officialText:"Une taxe sur les primes d\u2019assurance (Insurance Premium Tax) de 5\u00a0% est institu\u00e9e sur les primes d\u2019assurance g\u00e9n\u00e9rale.",
 source:{ref:'\u00a7277',organisme:'Mauritius Revenue Authority (MRA)'},condition:()=>true},
{id:'stabilisation_prix',section:'quotidien',direction:'positive',when:'d\u00e8s juil.\u00a02026',
 title:{fr:'Subventions alimentaires de base maintenues et \u00e9largies',en:'Basic food subsidies maintained and expanded',kr:'Subvansion manze baz kontinye ek elarzir'},
 text:{fr:'Les subventions sur les produits essentiels (corned beef, thon, farine, lentilles, macaroni, alimentation infantile\u2026) sont maintenues via le Fonds de stabilisation des prix.',en:'Subsidies on essential products (corned beef, tuna, flour, lentils, macaroni, infant food\u2026) are maintained through the Price Stabilisation Fund.',kr:'Subvansion lor prodwi esansyel (corned beef, ton, farin, lanti, makaroni, manze tibaba\u2026) kontinye via Price Stabilisation Fund.'},
 officialText:"Le Gouvernement maintiendra les subventions sur les produits de premi\u00e8re n\u00e9cessit\u00e9 via le Fonds de stabilisation des prix.",
 source:{ref:'\u00a7115',organisme:'Minist\u00e8re du Commerce'},condition:()=>true},
{id:'acces_mra_civil',section:'transparence',direction:'neutral',when:null,
 title:{fr:'Le fisc acc\u00e8de directement \u00e0 l\u2019\u00e9tat civil',en:'Tax authority gets access to civil records',kr:'Fisk gagne aksesi ar rezis sivil'},
 text:{fr:"La MRA pourra consulter \u00e9lectroniquement la base de donn\u00e9es de l'\u00e9tat civil.",en:'The MRA will be able to electronically consult the civil status database.',kr:'La MRA pou kapav konsilt elektronikman baz done leta sivil.'},
 officialText:"La MRA est habiit\u00e9e \u00e0 acc\u00e9der \u00e9lectroniquement \u00e0 la base de donn\u00e9es de l'\u00e9tat civil et de la population.",
 source:{ref:'\u00a79.2.3(c)',organisme:'MRA'},condition:()=>true},
{id:'declaration_devises',section:'transparence',direction:'neutral',when:null,
 title:{fr:'D\u00e9claration obligatoire des grosses sommes en voyage',en:'Mandatory declaration for large sums when travelling',kr:'Obligasion deklarasion pou gran some an vwayaz'},
 text:{fr:"Au-del\u00e0 de Rs\u00a0500\u00a0000 en esp\u00e8ces, pierres ou bijoux, une d\u00e9claration est obligatoire. Fausse d\u00e9claration\u00a0: amende jusqu\u2019\u00e0 Rs\u00a05\u00a0M.",en:'Over Rs\u00a0500,000 in cash, gems or jewellery, a customs declaration is mandatory. False declaration: fine up to Rs\u00a05\u00a0million.',kr:'Ou lao Rs\u00a0500\u00a0000 an kas, piers ou bijou, deklarasion obligatwar ar ladwann. Fo deklarasion: lamann ziska Rs\u00a05\u00a0M.'},
 officialText:"Toute personne voyageant avec plus de Rs\u00a0500\u00a0000 en esp\u00e8ces, pierres pr\u00e9cieuses ou bijoux est tenue de le d\u00e9clarer aux douanes. Toute fausse d\u00e9claration est passible d'une amende pouvant atteindre Rs\u00a05\u00a0millions.",
 source:{ref:'\u00a79.4(f)',organisme:'MRA \u2014 Douanes de Maurice'},condition:()=>true},
{id:'crypto_reporting',section:'transparence',direction:'neutral',when:null,
 title:{fr:'Partage international des donn\u00e9es crypto',en:'International sharing of crypto data',kr:'Partaz internasional done kriptomone'},
 text:{fr:'La MRA collectera les informations sur vos actifs crypto pour les transmettre aux autorit\u00e9s fiscales \u00e9trang\u00e8res.',en:'The MRA will collect information on your crypto assets to share with foreign tax authorities.',kr:'La MRA pou kolekte linformasion lor ou aktif kriptomone pou partaze ar lorite fiskal etranze.'},
 officialText:"Dans le cadre des standards OCDE, la MRA collecte les informations relatives aux actifs crypto pour les transmettre aux autorit\u00e9s fiscales \u00e9trang\u00e8res.",
 source:{ref:'\u00a79.2.3(d)',organisme:'MRA'},condition:p=>p.crypto},
{id:'utilities_mra',section:'transparence',direction:'neutral',when:null,
 title:{fr:'Vos factures eau/\u00e9lectricit\u00e9 transmises au fisc',en:'Water & electricity bills shared with tax authority',kr:'Fakte dilo ek elektrisite partaze ar fisk'},
 text:{fr:'Si vos paiements annuels d\u00e9passent Rs\u00a0100\u00a0000, la CWA et le CEB le d\u00e9clarent \u00e0 la MRA.',en:'If your annual payments exceed Rs\u00a0100,000, CWA and CEB must declare the total to the MRA.',kr:'Si ou peman anyel depas Rs\u00a0100\u00a0000, CWA ek CEB bizin deklare total ar la MRA.'},
 officialText:"La CWA et le CEB sont tenus de d\u00e9clarer \u00e0 la MRA les montants annuels factur\u00e9s aux clients dont les paiements d\u00e9passent Rs\u00a0100\u00a0000.",
 source:{ref:'\u00a79.2.3(a)',organisme:'MRA / CWA / CEB'},condition:()=>true},
{id:'citoyennete_protection',section:'transparence',direction:'positive',when:null,
 title:{fr:'Meilleure protection de la citoyennet\u00e9 mauricienne',en:'Better protection of Mauritian citizenship',kr:'Plis proteksion pou sitoyanete Morisien'},
 text:{fr:"Le ministre de l'Int\u00e9rieur ne pourra plus retirer la citoyennet\u00e9 sans en donner les raisons.",en:'The Home Minister can no longer revoke Mauritian citizenship without giving reasons.',kr:'Minis Lenteryir pa kapav anile sitoyanete Morisien san explik rezon.'},
 officialText:"Le budget introduit une obligation de motivation pour le ministre de l'Int\u00e9rieur en cas de retrait de la citoyennet\u00e9.",
 source:{ref:'\u00a753',organisme:"Minist\u00e8re de l'Int\u00e9rieur"},condition:p=>p.mauricien==='oui'},
{id:'plaque_perso',section:'voiture',direction:'negative',when:null,
 title:{fr:'Nouveau frais annuel pour les plaques personnalis\u00e9es',en:'New annual fee for personalised plates',kr:'Nouvo fre anyel pou plak persionalize'},
 text:{fr:'Un frais annuel de Rs\u00a02\u00a0000 \u00e0 Rs\u00a025\u00a0000 s\u2019applique selon le type de plaque.',en:'An annual fee of Rs\u00a02,000 to Rs\u00a025,000 applies depending on plate type.',kr:'Enn fre anyel Rs\u00a02\u00a0000-25\u00a0000 aplike selon kalite plak.'},
 officialText:"Un frais annuel est institu\u00e9 pour les plaques d'immatriculation personnalis\u00e9es ou anciennes, variant de Rs\u00a02\u00a0000 \u00e0 Rs\u00a025\u00a0000.",
 source:{ref:'\u00a73.3.1',organisme:'MRA / NLTA'},condition:p=>p.voiture},
{id:'verif_vehicule',section:'voiture',direction:'positive',when:null,
 title:{fr:"V\u00e9rification en ligne avant l'achat d'un v\u00e9hicule d'occasion",en:'Online check before buying a second-hand vehicle',kr:"Verifikasion enlinn avan asete enn loto d'okasion"},
 text:{fr:'Un service en ligne permettra de v\u00e9rifier si un v\u00e9hicule a des dettes ou un gage avant achat.',en:'An online service will let you check whether a vehicle has outstanding debts before buying.',kr:'Enn servis anlinn pou permet ou verifie si enn loto ena enn det ou gaz avan ou asete li.'},
 officialText:"Un service de v\u00e9rification en ligne permettra de consulter si un v\u00e9hicule fait l'objet d'un gage ou d'une dette, via le Registrar-General's Department et la NLTA.",
 source:{ref:'\u00a717(a)',organisme:"Registrar-General's Department / NLTA"},
 condition:p=>p.voiture,opportunity:true,
 actionTip:{fr:"Ce service permet de consulter les charges d'un v\u00e9hicule avant achat. Disponible via le Registrar-General's Department et la NLTA — \u00e0 v\u00e9rifier avant tout acte de vente.",en:"This service lets you check a vehicle's outstanding charges before purchase. Available through the Registrar-General's Department and NLTA.",kr:"Sa servis permet ou verifie sarz enn loto avan lasent. Disponib via Registrar-General's Department ek NLTA."}},
{id:'amendes_permis',section:'voiture',direction:'negative',when:null,
 title:{fr:'Renouvellement du permis bloqu\u00e9 si amendes impay\u00e9es',en:'Licence renewal blocked until fines paid',kr:'Renouvlman permis bloke ziska lamann peye'},
 text:{fr:'Le renouvellement de votre Motor Vehicle Licence sera bloqu\u00e9 tant que vos amendes routières ne sont pas r\u00e9gl\u00e9es.',en:'Renewal of your Motor Vehicle Licence will be blocked until all road fines are settled.',kr:'Renouvlman ou Motor Vehicle Licence pou bloke ziska tou lamann rout regle.'},
 officialText:"Le renouvellement annuel du Motor Vehicle Licence sera conditionn\u00e9 au r\u00e8glement pr\u00e9alable de toutes les amendes routières.",
 source:{ref:'\u00a73.3.3',organisme:'NLTA'},condition:p=>p.voiture},
{id:'vehicle_disability_exemption',section:'voiture',direction:'positive',when:null,
 title:{fr:'Exon\u00e9ration d\u2019accise \u00e0 l\u2019achat d\u2019un v\u00e9hicule pour les aidants',en:'Excise duty exemption on vehicle purchase for carers of disabled persons',kr:'Exzanpsion droit eksiz lor lasat loto pou soignants'},
 text:{fr:"Un parent ou tuteur l\u00e9gal d\u2019une personne handicap\u00e9e de 18\u00a0ans et plus recevant une allocation permanente de soins peut \u00eatre exon\u00e9r\u00e9 de droits d\u2019accise \u00e0 l\u2019achat d\u2019un v\u00e9hicule.",en:'A parent or legal guardian of a person with disability aged 18+ who receives a permanent carer\u2019s allowance may benefit from excise duty exemption on a motor vehicle purchase.',kr:'Enn paran ou tiyer legal enn porsone ki ena andikap 18 an ek plis avek alosasion swin permanan kapav benefisie exzanpsion droit eksiz lor lasat enn loto.'},
 officialText:"L'exon\u00e9ration de droits d'accise sur un v\u00e9hicule \u00e0 moteur sera accord\u00e9e au parent ou tuteur l\u00e9gal d'une personne handicap\u00e9e de 18\u00a0ans et plus b\u00e9n\u00e9ficiant d'une allocation permanente de soins.",
 source:{ref:'\u00a73.3.2 Annexe',organisme:'MRA / NLTA'},
 condition:p=>p.invalidite,opportunity:true,
 actionTip:{fr:"Cette exemption s\u2019applique \u00e0 l\u2019achat d\u2019un v\u00e9hicule par un parent/tuteur d\u2019une personne handicap\u00e9e de 18\u00a0ans et plus avec allocation de soins permanente. D\u00e9marches via la MRA.",en:"This exemption applies to vehicle purchases by parents or legal guardians of a person with disability aged 18+ with a permanent carer's allowance. Process via the MRA.",kr:"Sa exzanpsion konsern lasat enn loto par paran/tiyer enn porsone ki ena andikap 18+ avek alosasion swin permanan. Prosedir via MRA."}},
{id:'quartz',section:'logement',direction:'positive',when:'d\u00e8s le 20\u00a0juin\u00a02026',
 title:{fr:'Baisse du co\u00fbt des plans de travail en quartz',en:'Lower cost for quartz worktops',kr:'Bese pri plan travay kwartz'},
 text:{fr:'La taxe douani\u00e8re de 15\u00a0% sur les plans de travail en quartz est supprim\u00e9e.',en:'The 15% customs tax on quartz worktops is removed.',kr:'Takis ladwann 15% lor plan travay kwartz supprime.'},
 officialText:"La taxe douani\u00e8re de 15\u00a0% applicable aux plans de travail en quartz est supprim\u00e9e \u00e0 compter du 20\u00a0juin 2026.",
 source:{ref:'\u00a72(a)',organisme:'MRA \u2014 Douanes de Maurice'},
 condition:p=>p.proprietaire,opportunity:true,
 actionTip:{fr:"La suppression de la taxe peut r\u00e9duire le prix chez les revendeurs. L'impact d\u00e9pend de la r\u00e9percussion par les distributeurs.",en:"The removal of the duty may result in lower retail prices for quartz worktops. The actual impact depends on distributors.",kr:"Sipresion takis kapav redwir pri plan kwartz. Linpak reel depann lor distibiter."}},
{id:'recherche_cadastrale',section:'logement',direction:'negative',when:null,
 title:{fr:'Hausse des frais de recherche cadastrale',en:'Increase in land registry search fees',kr:'Ogmantasion fre resers kadastr'},
 text:{fr:'Les frais de recherche immobili\u00e8re passent de Rs\u00a0200 \u00e0 Rs\u00a0300 par jour.',en:'Property search fees rise from Rs\u00a0200 to Rs\u00a0300 per day.',kr:'Fre resers imobilye monte depi Rs\u00a0200 ar Rs\u00a0300 par zour.'},
 officialText:"Les frais journaliers de recherche aupr\u00e8s du Registrar-General's Department passent de Rs\u00a0200 \u00e0 Rs\u00a0300 par jour.",
 source:{ref:'\u00a78.3',organisme:"Registrar-General's Department"},condition:p=>p.proprietaire},
{id:'premier_acheteur',section:'logement',direction:'positive',when:null,
 title:{fr:'Exon\u00e9ration premier acheteur relev\u00e9e',en:'First-time buyer exemption raised',kr:'Exzanpsion premye lasant elve'},
 text:{fr:'Le seuil d\u2019exon\u00e9ration des droits d\u2019enregistrement passe de Rs\u00a02,5\u00a0M \u00e0 Rs\u00a03\u00a0M pour les terrains et de Rs\u00a05\u00a0M \u00e0 Rs\u00a06\u00a0M pour les appartements. Les propri\u00e9taires de terres agricoles deviennent \u00e9ligibles.',en:'The stamp duty exemption threshold rises from Rs\u00a02.5M to Rs\u00a03M for land and Rs\u00a05M to Rs\u00a06M for apartments. Agricultural landowners now eligible.',kr:'Sof exzanpsion droit anrezisterman monte depi Rs\u00a02,5M ar Rs\u00a03M pou later ek Rs\u00a05M ar Rs\u00a06M pou appartman.'},
 officialText:"Le seuil d\u2019exon\u00e9ration des droits d\u2019enregistrement pour les primo-acc\u00e9dants est relev\u00e9 de Rs\u00a02,5\u00a0millions \u00e0 Rs\u00a03\u00a0millions pour les terrains et de Rs\u00a05\u00a0millions \u00e0 Rs\u00a06\u00a0millions pour les appartements. Les propri\u00e9taires terriens agricoles deviennent \u00e9ligibles.",
 source:{ref:'\u00a7177\u2013179',organisme:"Registrar-General's Department"},
 condition:p=>p.proprietaire,opportunity:true,
 actionTip:{fr:"Cette exon\u00e9ration s\u2019applique aux premiers achats. Conditions et plafonds \u00e0 confirmer aupr\u00e8s du Registrar-General\u2019s Department.",en:"This exemption applies to first-time purchases. Conditions to confirm with the Registrar-General\'s Department.",kr:"Sa exzanpsion aplike lor premye lasat. Kondisyon pou konfirme avek Registrar-General's Department."}},
{id:'conge_menstruel',section:'famille',direction:'positive',when:null,
 title:{fr:'Nouveau cong\u00e9 menstruel pay\u00e9',en:'New paid menstrual leave',kr:'Nouvo koze mansryel paye'},
 text:{fr:"Un jour de cong\u00e9 pay\u00e9 par mois sera accord\u00e9 aux femmes souffrant de douleurs menstruelles s\u00e9v\u00e8res, public et priv\u00e9.",en:'One paid day per month for women with severe menstrual pain, in public and private sectors.',kr:'Enn zour koze paye par mwa pou dam ki soufer avek diler mansryel severe, dan tou sektir.'},
 officialText:"Un cong\u00e9 mensuel pay\u00e9 d'une journ\u00e9e est institu\u00e9 pour les employ\u00e9es souffrant de douleurs menstruelles s\u00e9v\u00e8res, dans les secteurs public et priv\u00e9.",
 source:{ref:'\u00a722',organisme:'Minist\u00e8re du Travail'},condition:p=>p.genre==='femme'&&isAct(p)},
{id:'allocation_enfant_age',section:'famille',direction:'positive',when:null,
 title:{fr:"L'allocation enfant prolong\u00e9e d'un an",en:'Child allowance extended by one year',kr:'Alosasion zanfan plonje enn an'},
 text:{fr:"L'\u00e2ge limite pour l'allocation enfant au secondaire passe de 20 \u00e0 21\u00a0ans.",en:'The age limit for the child allowance in secondary school rises from 20 to 21.',kr:'Lalimit laz pou alosasion zanfan lor sekonder monte depi 20 ar 21 an.'},
 officialText:"L'\u00e2ge limite d'\u00e9ligibilit\u00e9 \u00e0 l'allocation enfant pour les jeunes en secondaire est relev\u00e9 de 20 \u00e0 21\u00a0ans.",
 source:{ref:'\u00a758(b)',organisme:'National Pensions Fund (NPF)'},condition:p=>p.enfants},
{id:'allocation_enfant_mitd',section:'famille',direction:'positive',when:null,
 title:{fr:"L'allocation enfant \u00e9tendue aux formations techniques",en:'Child allowance extended to technical training',kr:'Alosasion zanfan elarzir ar formasion teknik'},
 text:{fr:'Les enfants inscrits au MITD ou dans un Polytechnic deviennent \u00e9ligibles \u00e0 l\u2019allocation.',en:'Children enrolled at MITD or a Polytechnic are now eligible for the allowance.',kr:'Zanfan anskri lor MITD ou Polytechnic vin elizib pou resevwa alosasion.'},
 officialText:"L'allocation enfant est d\u00e9sormais accessible aux enfants inscrits dans les \u00e9tablissements MITD ou les Polytechnics.",
 source:{ref:'\u00a758(c)',organisme:'NPF'},condition:p=>p.enfants},
{id:'conge_maternite',section:'famille',direction:'positive',when:null,
 title:{fr:'Cong\u00e9 maternit\u00e9 port\u00e9 \u00e0 12\u00a0mois',en:'Maternity leave extended to 12 months',kr:'Koze maternite alonje ar 12 mwa'},
 text:{fr:'Les employ\u00e9es b\u00e9n\u00e9ficieront de 12\u00a0mois de cong\u00e9 maternit\u00e9 dont 6\u00a0mois pay\u00e9s \u00e0 plein salaire et 6\u00a0mois pay\u00e9s \u00e0 demi-salaire.',en:'Employees will benefit from 12 months of maternity leave \u2014 6 months at full pay and 6 months at half pay.',kr:'Anplwaye pou benefisie 12 mwa koze maternite \u2014 6 mwa paye antye ek 6 mwa paye mwatye.'},
 officialText:"La dur\u00e9e du cong\u00e9 de maternit\u00e9 sera port\u00e9e \u00e0 12\u00a0mois, dont 6\u00a0mois \u00e0 plein salaire et 6\u00a0mois \u00e0 demi-salaire, dans les secteurs public et priv\u00e9.",
 source:{ref:'\u00a7344',organisme:'Minist\u00e8re du Travail'},condition:p=>p.genre==='femme'&&isAct(p)},
{id:'conge_paternite',section:'famille',direction:'positive',when:null,
 title:{fr:'Cong\u00e9 paternit\u00e9 port\u00e9 \u00e0 6\u00a0semaines',en:'Paternity leave extended to 6 weeks',kr:'Koze paternite alonje ar 6 semenn'},
 text:{fr:'Le cong\u00e9 paternit\u00e9 passe de 4 \u00e0 6\u00a0semaines dans les secteurs public et priv\u00e9.',en:'Paternity leave is extended from 4 to 6 weeks in both public and private sectors.',kr:'Koze paternite monte depi 4 ar 6 semenn dan sektir piblik ek prive.'},
 officialText:"La dur\u00e9e du cong\u00e9 de paternit\u00e9 est port\u00e9e de 4 \u00e0 6\u00a0semaines dans les secteurs public et priv\u00e9.",
 source:{ref:'\u00a7345',organisme:'Minist\u00e8re du Travail'},condition:p=>p.enfants&&isAct(p)},
{id:'jour_ferie_lundi',section:'famille',direction:'positive',when:null,
 title:{fr:'Jour f\u00e9ri\u00e9 report\u00e9 au lundi si tomb\u00e9 un dimanche',en:'Public holiday moved to Monday if it falls on Sunday',kr:'Zour ferye ranvwaye lindi si li tonbe dimann'},
 text:{fr:'Tout jour f\u00e9ri\u00e9 tombant un dimanche sera automatiquement report\u00e9 au lundi suivant.',en:'Any public holiday falling on a Sunday will automatically be moved to the following Monday.',kr:'Nenpot zour ferye ki tonbe enn dimann pou otomatikman ranvwaye lindi prosenn.'},
 officialText:"Tout jour f\u00e9ri\u00e9 l\u00e9gal tombant un dimanche sera d\u00e9sormais report\u00e9 au lundi qui suit.",
 source:{ref:'\u00a7346',organisme:'Minist\u00e8re du Travail'},condition:isAct},
{id:'srm_threshold',section:'famille',direction:'positive',when:'d\u00e8s juil.\u00a02026',
 title:{fr:'Seuil du Registre Social de Maurice relev\u00e9',en:'Social Register income threshold raised',kr:'Sof reveni SRM leve'},
 text:{fr:'Le seuil de revenu mensuel pour \u00eatre \u00e9ligible au Registre Social de Maurice (SRM) passe \u00e0 Rs\u00a016\u00a0400 pour un m\u00e9nage en juillet 2026, puis Rs\u00a017\u00a0500 en juillet 2027.',en:'The SRM household income eligibility threshold rises to Rs\u00a016,400 per month in July 2026, then Rs\u00a017,500 in July 2027.',kr:'Sof reveni mansyel pou SRM monte ar Rs\u00a016\u00a0400 zin 2026, lerla Rs\u00a017\u00a0500 zin 2027.'},
 officialText:"Le seuil de revenu mensuel pour \u00eatre \u00e9ligible au Registre Social de Maurice sera port\u00e9 \u00e0 Rs\u00a016\u00a0400 \u00e0 compter du 1er\u00a0juillet 2026 et \u00e0 Rs\u00a017\u00a0500 \u00e0 compter du 1er\u00a0juillet 2027 pour un m\u00e9nage.",
 source:{ref:'\u00a7189 / \u00a723 Annexe',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:()=>true},
{id:'sen_budget',section:'famille',direction:'positive',when:null,
 title:{fr:'Budget besoins \u00e9ducatifs sp\u00e9ciaux en hausse',en:'Special Educational Needs budget increased',kr:'Bidze SEN ogmante'},
 text:{fr:'Le budget allou\u00e9 aux \u00e9l\u00e8ves \u00e0 besoins \u00e9ducatifs sp\u00e9ciaux (SEN) augmente de Rs\u00a0562\u00a0M \u00e0 Rs\u00a0619\u00a0M.',en:'The Special Educational Needs budget rises from Rs\u00a0562 million to Rs\u00a0619 million.',kr:'Bidze pou elev avek bezwin edikasyon spesyal (SEN) monte depi Rs\u00a0562M ar Rs\u00a0619M.'},
 officialText:"La dotation budg\u00e9taire en faveur de l'\u00e9ducation inclusive et des \u00e9l\u00e8ves \u00e0 besoins \u00e9ducatifs sp\u00e9ciaux est port\u00e9e de Rs\u00a0562\u00a0millions \u00e0 Rs\u00a0619\u00a0millions.",
 source:{ref:'\u00a7340',organisme:'Minist\u00e8re de l\u2019\u00c9ducation'},condition:p=>p.enfants},
{id:'sap_remplace_brp',section:'retraite',direction:'neutral',when:'d\u00e8s janv.\u00a02027',
 title:{fr:'La BRP remplac\u00e9e par la State Age Pension',en:'Basic pension replaced by State Age Pension',kr:'Pansion baz ranplas par State Age Pension'},
 text:{fr:'D\u00e8s janvier 2027, la SAP remplace la BRP\u00a0\u2014 Rs\u00a016\u00a0555 \u00e0 65\u00a0ans contre Rs\u00a015\u00a0555 aujourd\u2019hui.',en:'From January 2027, the SAP replaces the BRP \u2014 Rs\u00a016,555 at 65 vs Rs\u00a015,555 today.',kr:'Depi zanvie 2027, SAP ranplas BRP \u2014 Rs\u00a016\u00a0555 a 65 an kont Rs\u00a015\u00a0555 azordi.'},
 officialText:"La State Age Pension (SAP) remplace la Basic Retirement Pension (BRP) \u00e0 compter du 1er\u00a0janvier 2027. Le montant de base \u00e0 65\u00a0ans est fix\u00e9 \u00e0 Rs\u00a016\u00a0555.",
 source:{ref:'\u00a727.1\u201327.10',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:isRet},
{id:'sap_age_flexible',section:'retraite',direction:'neutral',when:null,
 title:{fr:"Flexibilit\u00e9 sur l\u2019\u00e2ge de d\u00e9part \u00e0 la retraite",en:'Flexibility on retirement age',kr:'Fleksibilite lor laz retrete'},
 text:{fr:'Vous choisissez quand commencer entre 60 et 70\u00a0ans. La diff\u00e9rer apr\u00e8s 65\u00a0ans l\u2019augmente de 9\u00a0% par an.',en:'You choose when to start between 60 and 70. Deferring after 65 increases it by 9% per year.',kr:'Ou swazir kan koumans ant 60 ek 70 an. Diferir apre 65 an ogmant li par 9% par an.'},
 officialText:"Le budget introduit une flexibilit\u00e9 dans l'\u00e2ge de demande de la pension entre 60 et 70\u00a0ans. La pension augmente de 9\u00a0% pour chaque ann\u00e9e de report apr\u00e8s 65\u00a0ans, \u00e0 vie.",
 source:{ref:'\u00a727.5',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},
 condition:isRet,opportunity:true,
 actionTip:{fr:"Ce m\u00e9canisme permet d'ajuster l'\u00e2ge de demande entre 60 et 70\u00a0ans. Chaque ann\u00e9e de report apr\u00e8s 65\u00a0ans augmente le montant de 9\u00a0% \u00e0 vie. Les implications personnelles m\u00e9ritent l'analyse d'un conseiller agr\u00e9\u00e9.",en:"This mechanism lets you adjust when you claim between 60 and 70. Each year deferred after 65 increases the pension by 9% for life. Personal implications worth examining with a qualified adviser.",kr:"Sa mekanism permet ou swazir ki laz pou demann pansion. Sak an differ apre 65 an ogmant montan par 9% pou toutla vi. Merite examinasion ar enn konseye kwalifikasie."}},
{id:'sap_test_safe',section:'retraite',direction:'positive',when:null,
 title:{fr:'Votre pension ne devrait pas \u00eatre r\u00e9duite',en:'Your pension should not be reduced',kr:'Ou pansion pa bizin redwir'},
 text:{fr:"Votre revenu indiqu\u00e9 ne d\u00e9passe pas Rs\u00a014\u00a0000 \u2014 le test de ressources ne devrait pas affecter votre pension.",en:"Your indicated income doesn't exceed Rs\u00a014,000 \u2014 the means test should not reduce your pension.",kr:'Ou reveni endike pa depas Rs\u00a014\u00a0000 \u2014 nouvo test resours pa bizin afekte ou pansion.'},
 officialText:"Le test de ressources de la SAP s'applique uniquement au-del\u00e0 de Rs\u00a014\u00a0000 de revenus mensuels additionnels.",
 source:{ref:'\u00a727.6\u201327.8',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},
 condition:p=>isRet(p)&&revA('moins14')(p)},
{id:'sap_test_reduit',section:'retraite',direction:'negative',when:null,
 title:{fr:'Votre pension pourrait \u00eatre r\u00e9duite',en:'Your pension may be reduced',kr:'Ou pansion kapav redwir'},
 text:{fr:"Au-del\u00e0 de Rs\u00a014\u00a0000 de revenus mensuels, le montant diminue progressivement jusqu'\u00e0 Rs\u00a01\u00a0000.",en:'Above Rs\u00a014,000 of monthly income, the amount decreases progressively, down to a floor of Rs\u00a01,000.',kr:'Ou lao Rs\u00a014\u00a0000 reveni mansyel, montan diminye progresivman ziska enn planse Rs\u00a01\u00a0000.'},
 officialText:"Le test de ressources de la SAP pr\u00e9voit une r\u00e9duction de 50\u00a0cents par rup\u00e9e de revenus au-del\u00e0 de Rs\u00a014\u00a0000 mensuels. Le plancher est fix\u00e9 \u00e0 Rs\u00a01\u00a0000.",
 source:{ref:'\u00a727.6\u201327.8',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},
 condition:p=>isRet(p)&&revA('14a50','50a100','plus100')(p)},
{id:'sap_test_inconnu',section:'retraite',direction:'neutral',when:null,
 title:{fr:'Un test de ressources s\u2019applique \u00e0 la nouvelle pension',en:'A means test applies to the new pension',kr:'Enn test resours aplike ar nouvo pansion'},
 text:{fr:"Au-del\u00e0 de Rs\u00a014\u00a0000 de revenus mensuels, le montant diminue. En dessous, rien ne change.",en:'Above Rs\u00a014,000 of monthly income the pension decreases. Below this, nothing changes.',kr:'Ou lao Rs\u00a014\u00a0000 reveni mansyel montan redwir. En-deso pa sanze.'},
 officialText:"Le test de ressources de la SAP r\u00e9duit la pension de 50\u00a0cents par rup\u00e9e au-del\u00e0 de Rs\u00a014\u00a0000, avec un plancher de Rs\u00a01\u00a0000.",
 source:{ref:'\u00a727.6\u201327.8',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},
 condition:p=>isRet(p)&&revA(undefined,'na')(p)},
{id:'locatif_compte_sap',section:'retraite',direction:'negative',when:null,
 title:{fr:'Les revenus locatifs comptent dans le test de ressources',en:'Rental income counts in the means test',kr:'Reveni lokasion konte dan test resours'},
 text:{fr:'Contrairement aux dividendes, vos revenus locatifs sont inclus dans le calcul qui peut r\u00e9duire votre SAP.',en:'Unlike dividends, your rental income is included in the calculation that can reduce your SAP.',kr:'Kontrement ar dividann, ou reveni lokasion inkli dan kalkil ki kapav redwir ou SAP.'},
 officialText:"Les revenus locatifs sont inclus dans l'assiette pour le test de ressources de la SAP, contrairement aux dividendes et int\u00e9r\u00eats.",
 source:{ref:'\u00a727.8',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:p=>isRet(p)&&p.locatif},
{id:'invalidite_exclue_sap',section:'retraite',direction:'positive',when:null,
 title:{fr:"L'allocation d'invalidit\u00e9 exclue du test de ressources",en:'Disability allowance excluded from means test',kr:'Alosasion invalidite exkli dan test resours'},
 text:{fr:"L'allocation d'invalidit\u00e9 est explicitement exclue du calcul qui peut r\u00e9duire la pension SAP.",en:'Your disability or care allowance is explicitly excluded from the calculation that can reduce your SAP.',kr:'Ou alosasion invalidite exklikitman exkli dan kalkil ki kapav redwir ou SAP.'},
 officialText:"L'allocation d'invalidit\u00e9 et les allocations de soins sont explicitement exclues de l'assiette pour le test de ressources de la SAP.",
 source:{ref:'\u00a727.8(c)',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:p=>isRet(p)&&p.invalidite},
{id:'geriatrie',section:'retraite',direction:'positive',when:null,
 title:{fr:'Un programme national de soins g\u00e9riatriques',en:'National geriatric care programme',kr:'Progranm nasional swin geriatrik'},
 text:{fr:'Un programme g\u00e9riatrique national est mis en place pour am\u00e9liorer la prise en charge des personnes \u00e2g\u00e9es.',en:'A national geriatric programme is being put in place to improve care for the elderly.',kr:'Enn progranm geriatrik nasional pe met an plas pou amelyor swin pou dimounn aze.'},
 officialText:"Le budget pr\u00e9voit la mise en place d'un programme national de soins g\u00e9riatriques pour am\u00e9liorer la qualit\u00e9 des soins aux personnes \u00e2g\u00e9es.",
 source:{ref:'\u00a713(c)',organisme:'Minist\u00e8re de la Sant\u00e9'},condition:p=>isRet(p)||expD('retraite_etranger')(p)},
{id:'retirement_bond',section:'retraite',direction:'positive',when:null,
 title:{fr:'Nouveau bon d\u2019\u00e9pargne retraite \u00e0 6\u00a0%',en:'New Retirement Savings Bond at 6%',kr:'Nouvo bon lepay retrete ar 6%'},
 text:{fr:'Un bon d\u2019\u00e9pargne con\u00e7u pour pr\u00e9parer la retraite est introduit, offrant un rendement annuel de 6\u00a0%.',en:'A savings bond designed to prepare for retirement is introduced, offering an annual return of 6%.',kr:'Enn bon lepay pou prepare retrete entwodwir, avek enn randman anyel 6%.'},
 officialText:"Un Retirement Savings Bond est introduit avec un rendement annuel de 6\u00a0% pour encourager l\u2019\u00e9pargne en vue de la retraite.",
 source:{ref:'\u00a7185',organisme:'Minist\u00e8re des Finances / Banque de Maurice'},
 condition:()=>true,opportunity:true,
 actionTip:{fr:"Ce bon \u00e0 6\u00a0% est accessible \u00e0 tous. Conditions de souscription \u00e0 v\u00e9rifier aupr\u00e8s de la Banque de Maurice ou des banques commerciales.",en:"This 6% bond is accessible to all. Subscription conditions to check with the Bank of Mauritius or commercial banks.",kr:"Sa bon 6% aksesib pou tou dimounn. Kondisyon soskripsion pou verifye avek Bank of Mauritius ou bann bank komersyal."}},
{id:'carer_allowance',section:'retraite',direction:'positive',when:'d\u00e8s juil.\u00a02026',
 title:{fr:'Allocation soins relev\u00e9e \u00e0 Rs\u00a04\u00a0250',en:"Carer's allowance raised to Rs\u00a04,250",kr:'Alosasion swin monte ar Rs\u00a04\u00a0250'},
 text:{fr:"L'allocation mensuelle vers\u00e9e aux aidants de personnes handicap\u00e9es passe de Rs\u00a03\u00a0500 \u00e0 Rs\u00a04\u00a0250.",en:"The monthly carer's allowance paid to those caring for persons with disabilities rises from Rs\u00a03,500 to Rs\u00a04,250.",kr:'Alosasion mensyel pou dimounn ki pran swin enn porsone ki ena enn andikap monte depi Rs\u00a03\u00a0500 ar Rs\u00a04\u00a0250.'},
 officialText:"L'allocation de soins mensuelle vers\u00e9e aux aidants de personnes en situation de handicap est relev\u00e9e de Rs\u00a03\u00a0500 \u00e0 Rs\u00a04\u00a0250.",
 source:{ref:'\u00a7338',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:p=>p.invalidite},
{id:'visite_domiciliaire',section:'retraite',direction:'positive',when:null,
 title:{fr:'Visites m\u00e9dicales \u00e0 domicile \u00e9tendues aux 85\u00a0ans et plus',en:'Domiciliary medical visits extended to 85+',kr:'Vizit medikal domisil elarzir ar 85 an ek plis'},
 text:{fr:'Les visites m\u00e9dicales \u00e0 domicile sont \u00e9tendues aux personnes de 85\u00a0ans et plus (contre 90\u00a0ans auparavant).',en:'Domiciliary medical visits are extended to persons aged 85 and above (previously 90 and above).',kr:'Vizit medikal domisil elarzir pou dimounn ki ena 85 an ek plis (avan te 90 an).'},
 officialText:"Le programme de visites m\u00e9dicales \u00e0 domicile est \u00e9tendu aux personnes \u00e2g\u00e9es de 85\u00a0ans et plus, contre 90\u00a0ans pr\u00e9c\u00e9demment.",
 source:{ref:'\u00a7342',organisme:'Minist\u00e8re de la Sant\u00e9'},condition:isRet},
{id:'visite_sociale_80',section:'retraite',direction:'positive',when:null,
 title:{fr:'Visites mensuelles d\u2019un travailleur social pour les 80\u00a0ans et plus',en:'Monthly social worker visits for 80+',kr:'Vizit mensyel enn travayer sosyal pou 80 an ek plis'},
 text:{fr:'Les personnes \u00e2g\u00e9es de 80\u00a0ans et plus b\u00e9n\u00e9ficieront d\u2019une visite mensuelle d\u2019un travailleur social \u00e0 domicile.',en:'Persons aged 80 and above will receive a monthly home visit from a social worker.',kr:'Dimounn ki ena 80 an ek plis pou resevwa enn vizit mensyel enn travayer sosyal domisil.'},
 officialText:"Les personnes \u00e2g\u00e9es de 80\u00a0ans et plus b\u00e9n\u00e9ficieront d\u2019une visite mensuelle d\u2019un travailleur social \u00e0 domicile pour assurer leur bien-\u00eatre.",
 source:{ref:'\u00a7343',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},condition:isRet},
{id:'npf_bas',section:'travail',direction:'neutral',when:'d\u00e8s juil.\u00a02027',
 title:{fr:'Votre cotisation retraite passera \u00e0 1,5\u00a0%',en:'Your pension contribution will be 1.5%',kr:'Ou kotizasion retrete pou vinn 1,5%'},
 text:{fr:'Sous Rs\u00a050\u00a0000 de salaire, vous cotiserez 1,5\u00a0% au NPF, et votre employeur 7,5\u00a0%.',en:'Under Rs\u00a050,000 salary, you contribute 1.5% to the NPF, and your employer 7.5%.',kr:'En-deso Rs\u00a050\u00a0000 saler, ou kotize 1,5% lor NPF, ek ou patroun 7,5%.'},
 officialText:"Le NPF remplace le CSG \u00e0 partir de juillet 2027. Pour les salaires inf\u00e9rieurs \u00e0 Rs\u00a050\u00a0000, cotisation salariale 1,5\u00a0% et patronale 7,5\u00a0%.",
 source:{ref:'\u00a727.16(a)',organisme:'NPF / Pensions Regulator'},condition:p=>isAct(p)&&revA('moins14','14a50')(p)},
{id:'npf_haut',section:'travail',direction:'neutral',when:'d\u00e8s juil.\u00a02027',
 title:{fr:'Votre cotisation retraite passera \u00e0 3\u00a0%',en:'Your pension contribution will be 3%',kr:'Ou kotizasion retrete pou vinn 3%'},
 text:{fr:'Au-del\u00e0 de Rs\u00a050\u00a0000, vous cotiserez 3\u00a0% au NPF, et votre employeur 10,5\u00a0%.',en:'Above Rs\u00a050,000 salary, you contribute 3% to the NPF, and your employer 10.5%.',kr:'Ou lao Rs\u00a050\u00a0000 saler, ou kotize 3% lor NPF, ek ou patroun 10,5%.'},
 officialText:"Le NPF remplace le CSG. Pour les salaires sup\u00e9rieurs \u00e0 Rs\u00a050\u00a0000, cotisation salariale 3\u00a0% et patronale 10,5\u00a0%.",
 source:{ref:'\u00a727.16(a)',organisme:'NPF / Pensions Regulator'},condition:p=>isAct(p)&&revA('50a100','plus100')(p)},
{id:'npf_generic',section:'travail',direction:'neutral',when:'d\u00e8s juil.\u00a02027',
 title:{fr:'Votre cotisation retraite change de syst\u00e8me',en:'Your pension contribution system changes',kr:'Ou sistem kotizasion retrete sanze'},
 text:{fr:'Un nouveau fonds (NPF) remplace le CSG. Sous Rs\u00a050\u00a0000\u00a0: 1,5\u00a0%/7,5\u00a0%. Au-del\u00e0\u00a0: 3\u00a0%/10,5\u00a0%.',en:'A new fund (NPF) replaces the CSG. Under Rs\u00a050,000: 1.5%/7.5%. Above: 3%/10.5%.',kr:'Nouvo fon (NPF) ranplas CSG. En-deso Rs\u00a050\u00a0000: 1,5%/7,5%. Ou lao: 3%/10,5%.'},
 officialText:"Le NPF remplace le CSG \u00e0 partir de juillet 2027. Les taux varient selon le niveau de salaire.",
 source:{ref:'\u00a727.16(a)',organisme:'NPF / Pensions Regulator'},condition:p=>isAct(p)&&revA(undefined,'na')(p)},
{id:'impot_haut_revenu',section:'travail',direction:'negative',when:'d\u00e8s juil.\u00a02026',
 title:{fr:'Nouvelles tranches d\u2019imp\u00f4t pour les hauts revenus',en:'New income tax bands for high earners',kr:'Nouvo tran impot pou gran reveni'},
 text:{fr:'Une tranche \u00e0 20\u00a0% est introduite entre Rs\u00a01\u00a0M et Rs\u00a012\u00a0M de revenu annuel, et 35\u00a0% au-del\u00e0, rempla\u00e7ant la contribution Fair Share.',en:'A 20% band applies between Rs\u00a01M and Rs\u00a012M annual income, and 35% above Rs\u00a012M, replacing the Fair Share contribution.',kr:'Enn nouvo tran 20% entwodwir ant Rs\u00a01M ek Rs\u00a012M reveni anyel, ek 35% ou lao Rs\u00a012M, ranplase Fair Share.'},
 officialText:"De nouvelles tranches d\u2019imposition sont introduites\u00a0: 20\u00a0% sur les revenus entre Rs\u00a01\u00a0million et Rs\u00a012\u00a0millions et 35\u00a0% au-del\u00e0 de Rs\u00a012\u00a0millions par an. La contribution Fair Share est supprim\u00e9e.",
 source:{ref:'\u00a7280',organisme:'Mauritius Revenue Authority (MRA)'},condition:revA('plus100')},
{id:'nom_entreprise',section:'entreprise',direction:'positive',when:null,
 title:{fr:'R\u00e9servation de nom de soci\u00e9t\u00e9 allong\u00e9e \u00e0 6\u00a0mois',en:'Company name reservation extended to 6 months',kr:'Rezervasion non konpani alonje ar 6 mwa'},
 text:{fr:'La r\u00e9servation de nom aupr\u00e8s du Registrar of Companies passe de 2 \u00e0 6\u00a0mois.',en:'Name reservation with the Registrar of Companies goes from 2 to 6 months.',kr:'Rezervasion non avek Registrar of Companies monte depi 2 ar 6 mwa.'},
 officialText:"La dur\u00e9e de r\u00e9servation d'un nom aupr\u00e8s du Registrar of Companies est port\u00e9e de 2 \u00e0 6\u00a0mois.",
 source:{ref:'\u00a710(c)',organisme:'Registrar of Companies'},condition:isEnt},
{id:'petit_partenariat',section:'entreprise',direction:'positive',when:null,
 title:{fr:"Seuil \u00ab\u00a0petite entreprise\u00a0\u00bb relev\u00e9 \u00e0 Rs\u00a0100\u00a0M",en:"'Small business' threshold raised to Rs\u00a0100M",kr:"Sof 'tipti biznes' leve ar Rs\u00a0100M"},
 text:{fr:"Le seuil de CA pour les all\u00e8gements petites entreprises passe de Rs\u00a050\u00a0M \u00e0 Rs\u00a0100\u00a0M.",en:'The turnover threshold for small business concessions rises from Rs\u00a050M to Rs\u00a0100M.',kr:'Sof chiffre dafaire pou alez tipti biznes monte depi Rs\u00a050M ar Rs\u00a0100M.'},
 officialText:"Le seuil d\u00e9finissant une petite entreprise est relev\u00e9 de Rs\u00a050\u00a0millions \u00e0 Rs\u00a0100\u00a0millions de chiffre d'affaires.",
 source:{ref:'\u00a710(f)',organisme:'Registrar of Companies'},
 condition:isEnt,opportunity:true,
 actionTip:{fr:"Les structures entre Rs\u00a050M et Rs\u00a0100M de CA peuvent devenir \u00e9ligibles aux all\u00e8gements petites entreprises. Crit\u00e8res \u00e0 v\u00e9rifier aupr\u00e8s du Registrar of Companies.",en:"Businesses with turnover between Rs\u00a050M and Rs\u00a0100M may now qualify for small business concessions. Verify eligibility with the Registrar of Companies.",kr:"Biznes avek CA ant Rs\u00a050M ek Rs\u00a0100M kapav vin elizib pou alez tipti biznes. Verifye avek Registrar of Companies."}},
{id:'startup_holiday',section:'entreprise',direction:'positive',when:null,
 title:{fr:'Exon\u00e9ration fiscale 10\u00a0ans d\u00e8s le premier jour d\u2019activit\u00e9',en:'10-year tax holiday from day one of operations',kr:'Exzanpsion fiskal 10 an depi premye zour aktivite'},
 text:{fr:'Les nouvelles entreprises b\u00e9n\u00e9ficient d\u2019un cong\u00e9 fiscal de 10\u00a0ans d\u00e8s le premier jour d\u2019activit\u00e9 (et non plus d\u00e8s la date d\u2019incorporation).',en:'New companies benefit from a 10-year income tax holiday starting from the first day of operations, not from the date of incorporation.',kr:'Nouvo konpani benefisie enn exzanpsion impot 10 an depi premye zour aktivite (pa plis depi dat enkoporasion).'},
 officialText:"Le cong\u00e9 fiscal de 10\u00a0ans accord\u00e9 via le certificat d\u2019investissement de l\u2019EDB s\u2019applique d\u00e9sormais \u00e0 compter de la date de d\u00e9but des activit\u00e9s de la soci\u00e9t\u00e9 et non de sa date d\u2019incorporation.",
 source:{ref:'\u00a736 / \u00a71.1(d) Annexe',organisme:'Economic Development Board (EDB) / MRA'},
 condition:isEnt,opportunity:true,
 actionTip:{fr:"Ce changement avantage les startups ayant un d\u00e9lai entre incorporation et d\u00e9marrage. Le cong\u00e9 de 10\u00a0ans court d\u00e8s le premier chiffre d\u2019affaires. Conditions via l\u2019EDB.",en:"This benefits companies with a gap between incorporation and actual launch. The 10-year holiday runs from the first day of turnover. Conditions via the EDB.",kr:"Sa avantaz konpani ki ena enn delai ant enkoporasion ek koumansma. 10 an exzanpsion koumans depi premye zour. Kondisyon via EDB."}},
{id:'sme_vehicle_duty',section:'entreprise',direction:'positive',when:null,
 title:{fr:'Exon\u00e9ration douani\u00e8re sur v\u00e9hicules utilitaires pour PME',en:'Customs duty exemption on utility vehicles for SMEs',kr:'Exzanpsion ladwann lor veikil itilitaires pou PME'},
 text:{fr:'Les PME des secteurs transformateurs b\u00e9n\u00e9ficient d\u2019une exon\u00e9ration de droits de douane sur l\u2019importation de v\u00e9hicules utilitaires.',en:'SMEs in transformative sectors benefit from a customs duty exemption on the import of utility vehicles.',kr:'PME dan sektir transformatif benefisie enn exzanpsion ladwann lor importasion veikil itilitaires.'},
 officialText:"Une exon\u00e9ration de droits de douane est accord\u00e9e aux PME des secteurs transformateurs sur les v\u00e9hicules utilitaires import\u00e9s.",
 source:{ref:'\u00a739',organisme:'MRA / Economic Development Board (EDB)'},
 condition:isEnt,opportunity:true,
 actionTip:{fr:"Cette exon\u00e9ration concerne les v\u00e9hicules utilitaires pour les PME dans des secteurs \u00e9ligibles. Crit\u00e8res \u00e0 confirmer aupr\u00e8s de l\u2019EDB.",en:"This exemption covers utility vehicles for SMEs in eligible sectors. Criteria to confirm with the EDB.",kr:"Sa exzanpsion konsern veikil itilitaires pou PME dan sektir elizib. Kritere pou konfirme avek EDB."}},
{id:'tds_marketing',section:'entreprise',direction:'negative',when:null,
 title:{fr:'Retenue \u00e0 la source sur le marketing digital',en:'Withholding tax on digital marketing',kr:'Retansion lasours lor maketing dijital'},
 text:{fr:'Les prestations de marketing digital et de contenu r\u00e9seaux sociaux subissent une retenue de 5\u00a0%.',en:'Digital marketing and social media content services are subject to a 5% withholding tax.',kr:'Servis maketing dijital ek kontan rezo sosyal sibi enn retansion 5% lasours.'},
 officialText:"Une retenue \u00e0 la source de 5\u00a0% est institu\u00e9e sur les paiements de prestations de marketing digital et de cr\u00e9ation de contenu social.",
 source:{ref:'\u00a79.2.2(b)',organisme:'MRA'},condition:isEnt},
{id:'tds_logiciel',section:'entreprise',direction:'negative',when:null,
 title:{fr:'Retenue sur les gros contrats logiciels',en:'Withholding tax on large software contracts',kr:'Retansion lor gro kontra lozisiel'},
 text:{fr:"Au-del\u00e0 de Rs\u00a0300\u00a0000 dans un m\u00eame contrat logiciel, une retenue de 1\u00a0% s'applique.",en:'Payments above Rs\u00a0300,000 in a single software contract attract a 1% withholding tax.',kr:'Peman lao Rs\u00a0300\u00a0000 dan enn menm kontra lozisiel sibi enn retansion 1%.'},
 officialText:"Une retenue \u00e0 la source de 1\u00a0% est applicable aux paiements d\u00e9passant Rs\u00a0300\u00a0000 dans le cadre d'un m\u00eame contrat logiciel.",
 source:{ref:'\u00a79.2.2(a)',organisme:'MRA'},condition:isEnt},
{id:'made_in_moris',section:'entreprise',direction:'neutral',when:null,
 title:{fr:'Made in Moris\u00a0: preuve de production locale requise',en:'Made in Moris: tighter proof of local production',kr:'Made in Moris: plis preve prodikasion lokal exize'},
 text:{fr:"Pour b\u00e9n\u00e9ficier de la pr\u00e9f\u00e9rence de 40\u00a0% sur les march\u00e9s publics, une preuve de production r\u00e9ellement locale sera requise.",en:'To benefit from the 40% public procurement preference, proof of genuinely local production will now be required.',kr:'Pou benefisie preferans 40% lor marshe piblik, enn preve pou exize pou prouv prodikasion relman lokal.'},
 officialText:"Pour b\u00e9n\u00e9ficier de la pr\u00e9f\u00e9rence de 40\u00a0% dans les march\u00e9s publics, une preuve documentaire de production locale sera d\u00e9sormais exig\u00e9e.",
 source:{ref:'\u00a719(a)',organisme:'Procurement Policy Office'},condition:isEnt},
{id:'hotel_allocation',section:'entreprise',direction:'negative',when:null,
 title:{fr:'All\u00e8gement fiscal r\u00e9duit sur les h\u00f4tels',en:'Reduced tax relief on hotel investments',kr:'Aleman fiskal redwi lor linvestisman lotel'},
 text:{fr:"L'all\u00e8gement annuel en capital pour les h\u00f4tels passe de 30\u00a0% \u00e0 15\u00a0%.",en:'The annual capital allowance for hotel investment falls from 30% to 15%.',kr:'Lalosasion kapital anyel pou depans lotel bese depi 30% ar 15%.'},
 officialText:"L'allocation annuelle en capital accord\u00e9e aux h\u00f4tels est r\u00e9duite de 30\u00a0% \u00e0 15\u00a0%.",
 source:{ref:'\u00a71.10',organisme:'MRA'},condition:sect('tourisme')},
{id:'tva_devises',section:'entreprise',direction:'negative',when:null,
 title:{fr:'50\u00a0% de la TVA h\u00f4teli\u00e8re en devises',en:'50% of hotel VAT must be remitted in foreign currency',kr:'50% TVA lotel an deviz etranze'},
 text:{fr:'Les h\u00f4tels devront remettre 50\u00a0% de la TVA collect\u00e9e en devises \u00e9trang\u00e8res.',en:'Hotels and tourist residences must remit 50% of VAT collected in foreign currency.',kr:'Lotel ek rezidans touristik bizin remet 50% TVA kolekte an deviz etranze.'},
 officialText:"Les \u00e9tablissements h\u00f4teliers enregistr\u00e9s \u00e0 la TVA sont tenus de reverser 50\u00a0% de la TVA collect\u00e9e en devises \u00e9trang\u00e8res.",
 source:{ref:'\u00a76(f)',organisme:'MRA'},condition:sect('tourisme')},
{id:'evenements_intl',section:'entreprise',direction:'positive',when:null,
 title:{fr:'Exon\u00e9ration TVA \u00e9largie aux \u00e9v\u00e9nements internationaux',en:'VAT exemption extended to international events',kr:'Exzanpsion TVA elarzir ar evennman internasional'},
 text:{fr:"Les comp\u00e9titions sportives internationales et c\u00e9r\u00e9monies de r\u00e9compenses t\u00e9l\u00e9/cin\u00e9ma sont couvertes pour l'h\u00e9bergement.",en:'International sports competitions and TV/film award ceremonies are now covered for accommodation.',kr:'Konpetisyon spor internasional ek seremoni rekonpans pou eberzmant dezorme kouver.'},
 officialText:"L'exon\u00e9ration de TVA sur l'h\u00e9bergement est \u00e9tendue aux comp\u00e9titions sportives internationales et aux c\u00e9r\u00e9monies de r\u00e9compenses t\u00e9l\u00e9visuelles ou cin\u00e9matographiques.",
 source:{ref:'\u00a76(h)',organisme:'MRA'},condition:sect('tourisme'),opportunity:true,
 actionTip:{fr:"Cette exon\u00e9ration TVA couvre l'h\u00e9bergement lors de comp\u00e9titions sportives internationales ou c\u00e9r\u00e9monies de r\u00e9compenses. Ne couvre pas les championnats de f\u00e9d\u00e9rations. Conditions \u00e0 v\u00e9rifier aupr\u00e8s de la MRA.",en:"This VAT exemption covers accommodation for international sports competitions or award ceremonies. Does not cover sports federation championships. Exact conditions to check with the MRA.",kr:"Exzanpsion TVA lor eberzmant pou konpetisyon spor internasional ou seremoni rekonpans. Pa kouver sanpionnat ferasion. Kondisyon avek MRA."}},
{id:'sez_cote_dor',section:'entreprise',direction:'positive',when:null,
 title:{fr:"Nouvelle zone \u00e9conomique IA et digital \u00e0 C\u00f4te d'Or",en:"New AI and digital economic zone at C\u00f4te d'Or",kr:"Nouvo zone ekonomik IA ek dijital Kote d'Or"},
 text:{fr:"Propri\u00e9t\u00e9 \u00e9trang\u00e8re \u00e0 100\u00a0%, tarif \u00e9lectrique pr\u00e9f\u00e9rentiel et exon\u00e9rations pour les entreprises tech.",en:'100% foreign ownership, preferential electricity tariff and various exemptions for tech companies.',kr:'Propriete etranze 100%, tarif elektrisite preferansyel ek exzanpsion divers pou konpani teknolozik.'},
 officialText:"Une zone SEZ ax\u00e9e sur les technologies num\u00e9riques et l'IA est cr\u00e9\u00e9e \u00e0 C\u00f4te d'Or avec propri\u00e9t\u00e9 \u00e9trang\u00e8re \u00e0 100\u00a0% et tarif \u00e9lectrique pr\u00e9f\u00e9rentiel.",
 source:{ref:'\u00a712.2',organisme:'Economic Development Board (EDB)'},condition:sect('tech'),opportunity:true,
 actionTip:{fr:"La zone C\u00f4te d'Or offre propri\u00e9t\u00e9 \u00e9trang\u00e8re 100\u00a0%, tarifs \u00e9lectriques pr\u00e9f\u00e9rentiels et exon\u00e9rations fiscales. Modalit\u00e9s disponibles aupr\u00e8s de l'EDB.",en:"The C\u00f4te d'Or zone offers 100% foreign ownership, preferential electricity tariffs and tax exemptions. Full details from the EDB.",kr:"Zone Kote d'Or ofrir propriete etranze 100%, tarif elektrisite preferansyel ek exzanpsion fiskal. Detay disponib via EDB."}},
{id:'credit_ia',section:'entreprise',direction:'positive',when:"jusqu'en juin\u00a02029",
 title:{fr:"Cr\u00e9dit d'imp\u00f4t \u00e9tendu \u00e0 l'intelligence artificielle",en:'Tax credit extended to artificial intelligence',kr:'Kredi impot elarzir ar lintelizans artipisyel'},
 text:{fr:"45\u00a0% de cr\u00e9dit d'imp\u00f4t sur 3\u00a0ans incluant d\u00e9sormais les solutions d'IA.",en:'45% investment tax credit over 3 years now includes artificial intelligence solutions.',kr:'Kredi impot 45% lor 3 an inklir dezorme solisyon IA.'},
 officialText:"Le cr\u00e9dit d'imp\u00f4t de 45\u00a0% sur 3\u00a0ans est \u00e9tendu aux solutions d'IA en plus des machines et \u00e9quipements, prolong\u00e9 jusqu'au 30\u00a0juin 2029.",
 source:{ref:'\u00a71.8',organisme:'MRA'},condition:sect('tech'),opportunity:true,
 actionTip:{fr:"Ce cr\u00e9dit d'imp\u00f4t 45\u00a0% sur 3\u00a0ans couvre solutions IA, machines et \u00e9quipements. Crit\u00e8res \u00e0 v\u00e9rifier aupr\u00e8s de la MRA avant juin 2029.",en:"This 45% tax credit over 3 years covers AI solutions, machinery and equipment. Verify eligibility with the MRA before June 2029.",kr:"Sa kredi impot 45% lor 3 an kouver solisyon IA, masin ek ekipman. Kritere elezibilite avek MRA avan zin 2029."}},
{id:'ict_etranger_taxe',section:'entreprise',direction:'neutral',when:null,
 title:{fr:'Les fournisseurs \u00e9trangers de logiciels d\u00e9sormais tax\u00e9s',en:'Foreign software providers now taxed in Mauritius',kr:'Fornisr lozisiel etranze kone taxe Moris'},
 text:{fr:'Cette mesure pourrait affecter le prix de certains services SaaS \u00e9trangers que vous utilisez.',en:'This may affect the price of some foreign SaaS services you use.',kr:'Sa kapav afekte pri sertain servis SaaS etranze ki ou itiliz.'},
 officialText:"Les fournisseurs \u00e9trangers de services num\u00e9riques sont soumis \u00e0 une obligation de TVA \u00e0 Maurice au-del\u00e0 d'un seuil de prestations.",
 source:{ref:'\u00a71.6',organisme:'MRA'},condition:sect('tech')},
{id:'credit_manuf',section:'entreprise',direction:'positive',when:"jusqu'en juin\u00a02029",
 title:{fr:"Cr\u00e9dit d'imp\u00f4t sur les machines",en:'Tax credit on machinery',kr:'Kredi impot lor masinri'},
 text:{fr:"45\u00a0% de cr\u00e9dit d'imp\u00f4t sur 3\u00a0ans pour l'achat de machines et \u00e9quipements.",en:'45% tax credit over 3 years for machinery and equipment purchases.',kr:'Kredi impot 45% lor 3 an pou lasat masin ek ekipman prodikasion.'},
 officialText:"Le cr\u00e9dit d'imp\u00f4t de 45\u00a0% sur 3\u00a0ans s'applique aux achats de machines et \u00e9quipements de production, jusqu'au 30\u00a0juin 2029.",
 source:{ref:'\u00a71.8',organisme:'MRA'},condition:sect('manufacturing'),opportunity:true,
 actionTip:{fr:"Ce cr\u00e9dit d'imp\u00f4t 45\u00a0% sur 3\u00a0ans s'applique aux machines et \u00e9quipements. Crit\u00e8res \u00e0 v\u00e9rifier aupr\u00e8s de la MRA avant juin 2029.",en:"This 45% tax credit covers machinery and equipment. Verify eligibility with the MRA before June 2029.",kr:"Sa kredi impot 45% lor 3 an aplike lor masin ek ekipman. Kritere avek MRA avan zin 2029."}},
{id:'expat_solaire',section:'entreprise',direction:'positive',when:null,
 title:{fr:'Avantage fiscal pour les expatri\u00e9s du solaire',en:'Tax benefit for expat employees in solar manufacturing',kr:'Avantaz fiskal pou expatriye dan fabrikasion soler'},
 text:{fr:"4\u00a0ans d'exon\u00e9ration d'imp\u00f4t pour un employ\u00e9 expatri\u00e9 qualifi\u00e9 dans la fabrication de panneaux solaires.",en:'4-year income tax exemption for a qualified expat employee in solar panel manufacturing.',kr:'4 an exzanpsion impot pou anplwaye expatriye kwalifye dan fabrikasion panel soler.'},
 officialText:"Un avantage fiscal de 4\u00a0ans d'exon\u00e9ration d'imp\u00f4t sur le revenu est accord\u00e9 \u00e0 tout employ\u00e9 expatri\u00e9 qualifi\u00e9 dans la fabrication de panneaux solaires.",
 source:{ref:'\u00a71.1(a)',organisme:'MRA'},condition:sect('manufacturing'),opportunity:true,
 actionTip:{fr:"Cette exon\u00e9ration 4\u00a0ans concerne l'imp\u00f4t d'un expatri\u00e9 qualifi\u00e9 dans le solaire. Conditions \u00e0 confirmer aupr\u00e8s de la MRA.",en:"This 4-year exemption applies to income tax for a qualified expat in solar manufacturing. Conditions to confirm with the MRA.",kr:"Sa exzanpsion 4 an konsern impot pou enn expatriye kwalifye dan soler. Kondisyon avek MRA."}},
{id:'eta_digitale',section:'expatrie',direction:'neutral',when:null,
 title:{fr:'Autorisation de voyage num\u00e9rique obligatoire',en:'Mandatory digital travel authorisation',kr:'Otorizasion vwayaz dijital obligatwar'},
 text:{fr:"Tous les non-citoyens devront demander une Electronic Travel Authorisation en ligne avant de venir \u00e0 Maurice.",en:'All non-citizens must apply for an Electronic Travel Authorisation online before travelling to Mauritius.',kr:'Tou dimounn ki pa sitwayen bizin demann enn Electronic Travel Authorisation enlinn avan vwayaze Moris.'},
 officialText:"Une autorisation de voyage \u00e9lectronique (ETA) sera obligatoire pour tout non-citoyen souhaitant se rendre \u00e0 Maurice.",
 source:{ref:'\u00a746(c)',organisme:'Passport and Immigration Office (PIO)'},condition:isExp},
{id:'permis_format',section:'expatrie',direction:'positive',when:null,
 title:{fr:'Permis de r\u00e9sidence disponible en format num\u00e9rique',en:'Residence permit available in digital format',kr:'Permi rezidans disponib an format dijital'},
 text:{fr:"Le permis de r\u00e9sidence pourra \u00eatre d\u00e9livr\u00e9 en format num\u00e9rique, carte ou papier.",en:'The residence permit can now be issued as digital, card or paper format.',kr:'Permi rezidans kapav dezorme ede an format dijital, kart fizik ou papye.'},
 officialText:"Le permis de r\u00e9sidence peut d\u00e9sormais \u00eatre d\u00e9livr\u00e9 sous trois formats : num\u00e9rique, carte physique ou papier.",
 source:{ref:'\u00a746(d)',organisme:'PIO'},condition:isExp},
{id:'fee_tax_residence',section:'expatrie',direction:'negative',when:null,
 title:{fr:'Hausse du co\u00fbt du certificat de r\u00e9sidence fiscale',en:'Increase in tax residence certificate cost',kr:'Ogmantasion pri sertifika rezidans fiskal'},
 text:{fr:"Le frais passe de USD\u00a0200 \u00e0 USD\u00a0500 pour la plupart des demandeurs.",en:'The fee rises from USD\u00a0200 to USD\u00a0500 for most applicants.',kr:'Fre monte depi USD\u00a0200 ar USD\u00a0500 pou laplipar dimounn ki demann.'},
 officialText:"Les frais de d\u00e9livrance du certificat de r\u00e9sidence fiscale sont relev\u00e9s de USD\u00a0200 \u00e0 USD\u00a0500.",
 source:{ref:'\u00a79.2.4',organisme:'MRA'},condition:isExp},
{id:'family_permit_aboli',section:'expatrie',direction:'negative',when:null,
 title:{fr:"Suppression du 'Family Occupation Permit'",en:"'Family Occupation Permit' abolished",kr:"Permi 'Family Occupation Permit' siprime"},
 text:{fr:"Les familles devront recourir \u00e0 d'autres cat\u00e9gories de permis pour venir \u00e0 Maurice.",en:'Families must now use other permit categories to bring a relative to Mauritius.',kr:'Fami bizin rekourir ar lot kategori permi pou amen enn proshe Moris.'},
 officialText:"La cat\u00e9gorie 'Family Occupation Permit' est supprim\u00e9e.",
 source:{ref:'\u00a737(b)(v)',organisme:'EDB'},condition:isExp},
{id:'occupation_permit_pro',section:'expatrie',direction:'neutral',when:null,
 title:{fr:'ProPass et Expert Pass fusionnent',en:'ProPass and Expert Pass merged',kr:'ProPass ek Expert Pass fisionner'},
 text:{fr:"Ces deux cat\u00e9gories fusionnent, avec un salaire minimum de Rs\u00a050\u00a0000 dans tous les secteurs.",en:'These two categories merge, with a minimum salary of Rs\u00a050,000 across all sectors.',kr:'Saki de kategori fisionner, avek enn minimom saler Rs\u00a050\u00a0000 dan tou sektir.'},
 officialText:"Les cat\u00e9gories ProPass et Expert Pass sont fusionn\u00e9es en une nouvelle cat\u00e9gorie unique avec un salaire minimum de Rs\u00a050\u00a0000.",
 source:{ref:'\u00a737(b)(ii)',organisme:'EDB'},condition:expD('permis_pro')},
{id:'permis_conjoint',section:'expatrie',direction:'positive',when:null,
 title:{fr:"D\u00e9marches simplifi\u00e9es pour les conjoint\u00b7e\u00b7s de Mauricien\u00b7ne\u00b7s",en:'Simplified process for Mauritian spouses',kr:'Prosedir simplifye pou konjwen Morisien'},
 text:{fr:"Un document officiel \u00e9tranger attestant du statut marital pourra suffire pour la demande de permis.",en:"An official foreign document proving marital status may now be sufficient for a permit application.",kr:'Enn dokiman ofisyel etranze ki prouve statu mariyal kapav dezorme sifir pou demann permi.'},
 officialText:"Les conjoints de citoyens mauriciens peuvent pr\u00e9senter un document officiel \u00e9tranger attestant de leur statut marital pour leur demande de permis.",
 source:{ref:'\u00a746(a)',organisme:'PIO'},condition:expD('conjoint')},
{id:'frais_conjoint',section:'expatrie',direction:'negative',when:null,
 title:{fr:'Nouveau frais de USD\u00a050 sur la demande de permis',en:'New USD\u00a050 fee on permit application',kr:'Nouvo fre USD\u00a050 lor demann permi'},
 text:{fr:"Ce frais est \u00e9tendu aux conjoint\u00b7e\u00b7s de citoyens mauriciens et \u00e0 leurs personnes \u00e0 charge.",en:'This fee is now extended to spouses of Mauritian citizens and their dependants.',kr:'Sa fre elarzir dezorme ar konjwen sitwayen Morisien ek zot depandan.'},
 officialText:"Un frais de USD\u00a050 est institu\u00e9 pour les demandes de permis des conjoints de citoyens mauriciens et leurs d\u00e9pendants.",
 source:{ref:'\u00a746(b)',organisme:'PIO'},condition:expD('conjoint')},
{id:'occ_permit_inv_exp',section:'expatrie',direction:'neutral',when:null,
 title:{fr:"Seuil d'investissement minimum fix\u00e9 \u00e0 USD\u00a0100\u00a0000",en:'Minimum investment threshold set at USD\u00a0100,000',kr:'Sof linvestisman minimum USD\u00a0100\u00a0000'},
 text:{fr:"Ce seuil s'applique \u00e0 votre permis investisseur, avec un CA minimum pour le renouvellement.",en:'This threshold applies to your investor permit, with a minimum turnover required for renewal.',kr:'Sa sof aplike ar ou permi investiser, avek enn minimom CA exize pou renouvlman.'},
 officialText:"Le permis investisseur \u00e9tranger est soumis \u00e0 un seuil d'investissement minimum de USD\u00a0100\u00a0000, avec un chiffre d'affaires minimum pour le renouvellement.",
 source:{ref:'\u00a737(b)(i)',organisme:'EDB'},condition:expD('permis_investisseur')},
{id:'bonds_publics',section:'investisseur',direction:'positive',when:null,
 title:{fr:"Acc\u00e8s direct aux obligations d'\u00c9tat \u00e0 long terme",en:'Direct access to long-term government bonds',kr:'Aksesi direkt ar obligasion deta longterm'},
 text:{fr:"De nouvelles obligations \u00e0 25 et 30\u00a0ans sont ouvertes \u00e0 tous les investisseurs, y compris le grand public.",en:'New 25- and 30-year bonds are now open to all investors, including the general public.',kr:'Nouvo obligasion 25 ek 30 an ouver ar tou investiser, inklir gran piblik.'},
 officialText:"De nouvelles s\u00e9ries d'obligations d'\u00c9tat \u00e0 25 et 30\u00a0ans sont ouvertes \u00e0 l'ensemble des investisseurs, y compris les particuliers.",
 source:{ref:'\u00a711.10(a)(b)',organisme:'Minist\u00e8re des Finances / Banque de Maurice'},
 condition:isInv,opportunity:true,
 actionTip:{fr:"Les obligations d'\u00c9tat 25 et 30\u00a0ans sont d\u00e9sormais accessibles au grand public. Modalit\u00e9s de souscription disponibles aupr\u00e8s de la Banque de Maurice.",en:"Government bonds at 25 and 30 years are now accessible to the general public. Subscription conditions available from the Bank of Mauritius.",kr:"Obligasion deta 25 ek 30 an dezorme aksesib pou gran piblik. Modalite disponib avek Banke Moris."}},
{id:'golden_visa_res',section:'investisseur',direction:'positive',when:null,
 title:{fr:'Le Golden Visa ouvre droit \u00e0 la r\u00e9sidence permanente',en:'Golden Visa grants permanent residency rights',kr:'Golden Visa donn droit rezidans permanan'},
 text:{fr:"Apr\u00e8s un investissement de USD\u00a01\u00a0million, vous pourrez demander un permis de r\u00e9sidence permanente.",en:'After an investment of USD\u00a01 million, you may apply for permanent residence in Mauritius.',kr:'Apre enn linvestisman USD\u00a01 milyon, ou kapav demann enn permi rezidans permanan Moris.'},
 officialText:"Le programme Golden Visa, accessible via un investissement minimum de USD\u00a01\u00a0million, ouvre d\u00e9sormais droit \u00e0 une demande de permis de r\u00e9sidence permanente.",
 source:{ref:'\u00a712.1',organisme:'EDB'},condition:invD('golden_visa'),opportunity:true,
 actionTip:{fr:"Le Golden Visa via USD\u00a01M ouvre d\u00e9sormais droit \u00e0 une r\u00e9sidence permanente. Conditions et d\u00e9marches aupr\u00e8s de l'EDB.",en:"The Golden Visa through a USD\u00a01M investment now enables permanent residence. Full conditions and procedures from the EDB.",kr:"Golden Visa via USD\u00a01M donn dezorme droit rezidans permanan. Kondisyon konple ek prosedir via EDB."}},
{id:'golden_visa_fisc',section:'investisseur',direction:'positive',when:null,
 title:{fr:"Revenus \u00e9trangers peu impos\u00e9s s'ils ne sont pas rapatri\u00e9s",en:'Foreign income lightly taxed if not remitted',kr:'Reveni etranze taxe tanse li pa rapatrie'},
 text:{fr:"Les d\u00e9penses locales r\u00e9gl\u00e9es par carte \u00e9trang\u00e8re ne sont pas consid\u00e9r\u00e9es comme un rapatriement de revenus.",en:'Local expenses paid by foreign card are not treated as remittance of foreign income.',kr:'Depans lokal fer avek kart etranze pa konsidere koum rapatriyasion reveni etranze.'},
 officialText:"Dans le cadre du r\u00e9gime Golden Visa, les d\u00e9penses locales via carte \u00e9trang\u00e8re ne sont pas assimil\u00e9es \u00e0 un rapatriement de revenus.",
 source:{ref:'\u00a712.1',organisme:'EDB / MRA'},condition:invD('golden_visa'),opportunity:true,
 actionTip:{fr:"Cette r\u00e8gle pr\u00e9cise que les d\u00e9penses locales par carte \u00e9trang\u00e8re ne constituent pas un rapatriement de revenus. Les implications fiscales personnelles m\u00e9ritent l'avis d'un conseiller agr\u00e9\u00e9.",en:"This rule clarifies that local expenses by foreign card do not constitute income remittance. Personal tax implications worth examining with a qualified tax adviser.",kr:"Sa reg la klarifye ki depans lokal par kart etranze pa konstitye rapatriyasion reveni. Linpak fiskal personel merite examinasion ar enn konseye fiskal kwalifikasie."}},
{id:'golden_visa_dom',section:'investisseur',direction:'positive',when:null,
 title:{fr:'Permis du personnel domestique en 5\u00a0jours',en:'Domestic staff permit in 5 working days',kr:'Permi personel domistik an 5 zour ouvrab'},
 text:{fr:"Les demandes pour le personnel de maison accompagnant un Golden Visa seront trait\u00e9es en 5\u00a0jours ouvrables.",en:'Work permit applications for household staff accompanying a Golden Visa holder will be processed in 5 working days.',kr:'Demann permi travay pou personel domistik akompay enn titler Golden Visa pou trete dan 5 zour ouvrab.'},
 officialText:"Les demandes de permis de travail pour le personnel domestique accompagnant un titulaire de Golden Visa seront trait\u00e9es en 5\u00a0jours ouvrables.",
 source:{ref:'\u00a712.1',organisme:'PIO / EDB'},condition:invD('golden_visa')},
{id:'sez_investisseur',section:'investisseur',direction:'positive',when:null,
 title:{fr:"Fortes incitations pour investir dans la zone C\u00f4te d'Or",en:"Strong incentives in the C\u00f4te d'Or zone",kr:"Fort insantiv pou investi dan zone Kote d'Or"},
 text:{fr:"Propri\u00e9t\u00e9 \u00e9trang\u00e8re 100\u00a0%, baux longs renouvelables et loyers r\u00e9duits pendant 10\u00a0ans.",en:'100% foreign ownership, long renewable leases and reduced rents for 10 years.',kr:'Propriete etranze 100%, lokazion longterm renouvlab ek lwe redwi pandan 10 an.'},
 officialText:"La zone SEZ de C\u00f4te d'Or offre propri\u00e9t\u00e9 \u00e9trang\u00e8re \u00e0 100\u00a0%, baux longue dur\u00e9e renouvelables et loyers pr\u00e9f\u00e9rentiels pendant 10\u00a0ans.",
 source:{ref:'\u00a712.2',organisme:'EDB'},condition:invD('immobilier_sez'),opportunity:true,
 actionTip:{fr:"La zone C\u00f4te d'Or propose baux longue dur\u00e9e renouvelables, propri\u00e9t\u00e9 100\u00a0% \u00e9trang\u00e8re et loyers r\u00e9duits 10\u00a0ans. D\u00e9tails via l'EDB.",en:"The C\u00f4te d'Or zone offers renewable long-term leases, 100% foreign ownership and reduced rents for 10 years. Details from the EDB.",kr:"Zone Kote d'Or ofrir lokazion longterm renouvlab, propriete etranze 100% ek lwe redwi 10 an. Detay via EDB."}},
{id:'edb_property',section:'investisseur',direction:'neutral',when:null,
 title:{fr:"R\u00e9vision en cours des droits sur les programmes EDB",en:"EDB programme property tax rules under review",kr:"Reg fiskal imobilye EDB an kour revizion"},
 text:{fr:"Les droits et taxes sur le transfert de propri\u00e9t\u00e9s r\u00e9sidentielles sous ces sch\u00e9mas seront ajust\u00e9s.",en:'Rights and taxes on residential property transfers under these schemes will be adjusted.',kr:'Drwa ek takis sou transfer imobilye rezidansyel an deso sa sema la pou sanze.'},
 officialText:"Une r\u00e9vision des droits et taxes applicables au transfert de propri\u00e9t\u00e9 dans le cadre des programmes EDB est en cours.",
 source:{ref:'\u00a78.4',organisme:"EDB / Registrar-General's Department"},condition:invD('immobilier_sez')},
{id:'credit_capital_local',section:'investisseur',direction:'positive',when:"jusqu'en juin\u00a02029",
 title:{fr:"Cr\u00e9dit d'imp\u00f4t pour l'investissement dans une entreprise locale",en:'Tax credit for investment in a local business',kr:'Kredi impot lor linvestisman dan biznes lokal'},
 text:{fr:"45\u00a0% de cr\u00e9dit d'imp\u00f4t sur 3\u00a0ans pour les achats de machines, \u00e9quipements ou IA de l'entreprise.",en:"45% tax credit over 3 years for the company's machinery, equipment or AI purchases.",kr:'Kredi impot 45% lor 3 an pou lasat masin, ekipman ou solisyon IA par konpani.'},
 officialText:"Les entreprises locales peuvent b\u00e9n\u00e9ficier d'un cr\u00e9dit d'imp\u00f4t de 45\u00a0% sur 3\u00a0ans pour leurs achats de machines, \u00e9quipements ou solutions d'IA, jusqu'au 30\u00a0juin 2029.",
 source:{ref:'\u00a71.8',organisme:'MRA'},condition:invD('capital_local'),opportunity:true,
 actionTip:{fr:"Ce cr\u00e9dit d'imp\u00f4t peut b\u00e9n\u00e9ficier aux entreprises dans lesquelles vous investissez pour leurs achats de machines, \u00e9quipements ou IA jusqu'en juin 2029. Crit\u00e8res \u00e0 v\u00e9rifier aupr\u00e8s de la MRA.",en:"This tax credit can benefit local businesses you invest in for their machinery, equipment or AI purchases until June 2029. Verify eligibility with the MRA.",kr:"Sa kredi impot kapav benefisie biznes lokal dan lekel ou investi pou lasat masin, ekipman ou IA ziska zin 2029. Kritere avek MRA."}},
{id:'dividendes_exclus',section:'investisseur',direction:'positive',when:null,
 title:{fr:"Les dividendes exclus du test de ressources de la pension",en:'Dividends excluded from pension means test',kr:'Dividann exkli dan test resours pansion'},
 text:{fr:"Vos dividendes et int\u00e9r\u00eats ne seront pas compt\u00e9s dans le calcul qui peut r\u00e9duire la pension SAP.",en:'Your dividends and interest will not count in the calculation that can reduce your SAP.',kr:'Ou dividann ek intere pa pou konte dan kalkil ki kapav redwir ou SAP.'},
 officialText:"Les dividendes et revenus d'int\u00e9r\u00eats sont explicitement exclus de l'assiette pour le test de ressources de la SAP, contrairement aux revenus d'emploi, de commerce ou de location.",
 source:{ref:'\u00a727.8(c)',organisme:'Minist\u00e8re de l\u2019Int\u00e9gration Sociale'},
 condition:invD('actions_dividendes'),opportunity:true,
 actionTip:{fr:"Dividendes et int\u00e9r\u00eats sont exclus du test de ressources SAP, contrairement aux revenus d'emploi ou locatifs. Les implications patrimoniales m\u00e9ritent l'avis d'un conseiller financier agr\u00e9\u00e9.",en:"Under the budget, dividends and interest are excluded from the SAP means test, unlike employment or rental income. Patrimonial implications worth examining with a qualified financial adviser.",kr:"Dan bidzet, dividann ek intere exkli dan test resours SAP, kontrement ar reveni travay ou lokasion. Linpak patrimoniyal merite examinasion ar enn konseye finansye kwalifikasie."}},
// ── Mesures géographiques ─────────────────────────────────────────────────────
{id:'piscine_triolet',section:'local',direction:'positive',when:null,
 title:{fr:'Nouvelle piscine publique \u00e0 Triolet',en:'New public swimming pool in Triolet',kr:'Nouvo pisin piblik Triolet'},
 text:{fr:"Une piscine publique sera construite \u00e0 Triolet pour am\u00e9liorer l'acc\u00e8s aux \u00e9quipements sportifs dans le nord.",en:'A public swimming pool will be built in Triolet to improve access to sports facilities in the north.',kr:'Enn pisin piblik pou konstrir Triolet pou amelyor aksesi ar instalasion spor dan nor.'},
 officialText:"Le Gouvernement pr\u00e9voit la construction de deux nouvelles piscines, dont une \u00e0 Triolet.",
 source:{ref:'\u00a7194',organisme:'Min. Jeunesse et Sports'},condition:inRegion('pamplemousses')},
{id:'piscine_flacq',section:'local',direction:'positive',when:null,
 title:{fr:'Nouvelle piscine publique \u00e0 Flacq',en:'New public swimming pool in Flacq',kr:'Nouvo pisin piblik Flak'},
 text:{fr:"Une piscine publique sera construite \u00e0 Flacq pour am\u00e9liorer l'acc\u00e8s aux \u00e9quipements sportifs dans l'est.",en:'A public swimming pool will be built in Flacq to improve access to sports facilities in the east.',kr:'Enn pisin piblik pou konstrir Flak pou amelyor aksesi ar instalasion spor dan les.'},
 officialText:"Le Gouvernement pr\u00e9voit la construction de deux nouvelles piscines, dont une \u00e0 Flacq.",
 source:{ref:'\u00a7194',organisme:'Min. Jeunesse et Sports'},condition:inRegion('flacq')},
{id:'musee_mahebourg',section:'local',direction:'positive',when:null,
 title:{fr:'R\u00e9habilitation du Mus\u00e9e d\u2019Histoire \u00e0 Mah\u00e9bourg',en:'National History Museum rehabilitation in Mah\u00e9bourg',kr:'Reabilitasion Mize Listwar Nasyonal Mahebour'},
 text:{fr:"Rs\u00a0100\u00a0millions des fonds de loterie nationale seront allou\u00e9s \u00e0 la r\u00e9habilitation compl\u00e8te du Mus\u00e9e d'Histoire Nationale \u00e0 Mah\u00e9bourg.",en:'Rs\u00a0100 million from lottery funds will be allocated to the full rehabilitation of the National History Museum in Mah\u00e9bourg.',kr:'Rs\u00a0100 milyon depi fon loteri nasyonal pou aloke pou reabilitasion konple Mize Listwar Mahebour.'},
 officialText:"Une r\u00e9habilitation compl\u00e8te du Mus\u00e9e d'Histoire Nationale \u00e0 Mah\u00e9bourg sera financ\u00e9e depuis le produit de la loterie nationale pour un montant total de Rs\u00a0100\u00a0millions.",
 source:{ref:'\u00a785(1)',organisme:'Min. Arts et Culture'},condition:inRegion('grand_port')},
{id:'le_morne_cultural',section:'local',direction:'positive',when:null,
 title:{fr:'Rs\u00a0124\u00a0millions pour le site du Patrimoine Le Morne',en:'Rs\u00a0124 million for Le Morne Cultural Landscape',kr:'Rs\u00a0124 milyon pou Le Morne Cultural Landscape'},
 text:{fr:"Rs\u00a0124\u00a0millions sur trois ans seront investis pour valoriser le site du Patrimoine Mondial Le Morne.",en:'Rs\u00a0124 million over three years will be invested to enhance the Le Morne UNESCO World Heritage site.',kr:'Rs\u00a0124 milyon lor trwa an pou amelyor lexperiens lor site Patrimwin Mondyal Le Morne.'},
 officialText:"Un montant de Rs\u00a0124\u00a0millions sur trois exercices financiers est pr\u00e9vu pour la valorisation du paysage culturel Le Morne afin d'am\u00e9liorer l'exp\u00e9rience des visiteurs.",
 source:{ref:'\u00a785(2)',organisme:'Min. Arts et Culture'},condition:inRegion('black_river')},
{id:'m4_motorway',section:'local',direction:'positive',when:null,
 title:{fr:'Rs\u00a02\u00a0milliards pour l\u2019autoroute M4 (Forbach\u2013a\u00e9roport)',en:'Rs\u00a02 billion for M4 motorway (Forbach to airport)',kr:'Rs\u00a02 miliar pou lotowot M4 (Forbach-eroport)'},
 text:{fr:"L'autoroute M4 reliera Forbach \u00e0 l'a\u00e9roport, ouvrant l'acc\u00e8s aux villages du corridor et cr\u00e9ant de nouvelles opportunit\u00e9s \u00e9conomiques.",en:'The M4 motorway will connect Forbach to the airport, opening access to villages along the corridor and creating new economic opportunities.',kr:'Lotowot M4 pou konekte Forbach ar leroport, ouvriran aksesi bann vilaz dan koridor ek kre nouvo opurtinite ekonomik.'},
 officialText:"Rs\u00a02\u00a0milliards sont pr\u00e9vus pour le projet d'autoroute M4 reliant Forbach \u00e0 l'a\u00e9roport, qui ouvrira l'acc\u00e8s aux villages du couloir et cr\u00e9era des opportunit\u00e9s \u00e9conomiques.",
 source:{ref:'\u00a748',organisme:'Min. Travaux Publics'},condition:p=>inRegion('moka')(p)||inRegion('plaines_wilhems')(p)},
{id:'barrage_anguilles',section:'local',direction:'positive',when:'cette ann\u00e9e',
 title:{fr:'Construction du barrage Rivi\u00e8re des Anguilles',en:'Rivi\u00e8re des Anguilles dam construction starts',kr:'Konstriksion baraz Rivye Lezangiy koumanse'},
 text:{fr:"La construction du barrage de la Rivi\u00e8re des Anguilles commencera cette ann\u00e9e, dans le cadre d'un investissement de Rs\u00a06,4\u00a0milliards pour l'eau.",en:"Construction of the Rivi\u00e8re des Anguilles dam will begin this year, part of a Rs\u00a06.4\u00a0billion water infrastructure investment.",kr:'Konstriksion baraz Rivye Lezangiy pou koumanse lane-la, pou Rs\u00a06,4 miliar pou dilo.'},
 officialText:"La construction du barrage de la Rivi\u00e8re des Anguilles est pr\u00e9vue pour d\u00e9marrer plus tard dans l'ann\u00e9e dans le cadre du programme d'am\u00e9lioration du syst\u00e8me de distribution d'eau.",
 source:{ref:'\u00a7125',organisme:'Min. Eau'},condition:inRegion('savanne')},
{id:'hopital_pamplemousses',section:'local',direction:'positive',when:null,
 title:{fr:'Nouveau SSRN Hospital \u00e0 Pamplemousses',en:'New SSRN Hospital in Pamplemousses',kr:'Nouvo Lopital SSRN Pamplemousses'},
 text:{fr:"Un nouveau SSRN Hospital, incluant des \u00e9quipements de recherche, sera construit \u00e0 Pamplemousses.",en:'A new SSRN Hospital, including research facilities, will be built in Pamplemousses.',kr:'Enn nouvo Lopital SSRN, avek fasilite resers, pou konstrir Pamplemousses.'},
 officialText:"La construction du nouveau SSRN Hospital incluant des installations de recherche \u00e0 Pamplemousses est pr\u00e9vue dans le cadre d'un investissement de Rs\u00a01,5\u00a0milliard pour les infrastructures de sant\u00e9.",
 source:{ref:'\u00a7164(1)',organisme:'Min. Sant\u00e9'},condition:inRegion('pamplemousses')},
{id:'rehab_flacq',section:'local',direction:'positive',when:null,
 title:{fr:"L'ancien h\u00f4pital de Flacq converti en centre de r\u00e9habilitation",en:'Former Flacq hospital converted to rehabilitation centre',kr:'Ansien lopital Flak rekonverti an sant reabilitasion'},
 text:{fr:"Une aile de l'ancien h\u00f4pital de Flacq sera transform\u00e9e en centre de r\u00e9habilitation pour les personnes d\u00e9pendantes aux drogues.",en:'A wing of the former Flacq hospital will be converted into a drug rehabilitation centre.',kr:'Enn zel ansien lopital Flak pou transforme an sant reabilitasion pou dimounn depandan droge.'},
 officialText:"Le Minist\u00e8re de la Sant\u00e9 proc\u00e8dera \u00e0 la conversion d'une aile de l'ancien h\u00f4pital de Flacq en centre de r\u00e9habilitation offrant des services th\u00e9rapeutiques et de soutien.",
 source:{ref:'\u00a7222',organisme:'Min. Sant\u00e9'},condition:inRegion('flacq')},
{id:'runway_rodrigues',section:'local',direction:'positive',when:null,
 title:{fr:"Nouvelle piste d\u2019atterrissage \u00e0 Plaine Corail, Rodrigues",en:'New runway at Plaine Corail, Rodrigues',kr:'Nouvo pist aterisaz Plenn Koray, Rodrigues'},
 text:{fr:"La nouvelle piste de Rodrigues am\u00e9liorera les liaisons a\u00e9riennes et renforcera le potentiel touristique de l'\u00eele.",en:"The new runway at Plaine Corail will improve air connections and strengthen Rodrigues' tourism potential.",kr:'Nouvo pist aterisaz Plenn Koray pou amelyor koneksion erien ek ranforse potansyel touristik Rodrigues.'},
 officialText:"La construction de la nouvelle piste d'atterrissage \u00e0 Plaine Corail ainsi que la route d'acc\u00e8s pour acc\u00e9l\u00e9rer les op\u00e9rations du Technopark \u00e0 Baladirou sont pr\u00e9vues pour Rodrigues.",
 source:{ref:'\u00a7253',organisme:'Rodrigues Regional Assembly'},condition:inRegion('rodrigues')},
{id:'budget_rodrigues',section:'local',direction:'positive',when:null,
 title:{fr:'Rs\u00a011,2\u00a0milliards allou\u00e9s \u00e0 Rodrigues',en:'Rs\u00a011.2 billion allocated to Rodrigues',kr:'Rs\u00a011,2 miliar aloke pou Rodrigues'},
 text:{fr:"Le budget total de Rodrigues atteindra Rs\u00a011,2\u00a0milliards\u00a0: Rs\u00a05,5\u00a0milliards en d\u00e9penses courantes et Rs\u00a0825\u00a0millions en investissements.",en:'The total Rodrigues budget will reach Rs\u00a011.2 billion: Rs\u00a05.5 billion in recurrent expenditure and Rs\u00a0825 million in capital investment.',kr:'Total bidze Rodrigues pou ateyn Rs\u00a011,2 miliar: Rs\u00a05,5 miliar depans kouran ek Rs\u00a0825 milyon investisman kapital.'},
 officialText:"Pour l'exercice 2026-2027, le Gouvernement alloue Rs\u00a05,5\u00a0milliards en d\u00e9penses courantes et Rs\u00a0825\u00a0millions en d\u00e9penses en capital pour l'Assembl\u00e9e R\u00e9gionale de Rodrigues. L'ensemble des d\u00e9penses gouvernementales pour Rodrigues atteindra Rs\u00a011,2\u00a0milliards.",
 source:{ref:'\u00a7254',organisme:'Rodrigues Regional Assembly'},condition:inRegion('rodrigues')},
{id:'masterplan_agalega',section:'local',direction:'positive',when:null,
 title:{fr:'Plan directeur complet pour Agal\u00e9ga',en:'Comprehensive master plan for Agalega',kr:'Plan direkter konpre pou Agalega'},
 text:{fr:"Un plan directeur sera finalis\u00e9 pour Agal\u00e9ga, couvrant logement, infrastructure, sant\u00e9, \u00e9ducation, \u00e9nergie renouvelable et \u00e9co-tourisme.",en:'A comprehensive master plan will be finalised for Agalega, covering housing, infrastructure, health, education, renewable energy, food security and eco-tourism.',kr:'Enn plan direkter pou finalize pou Agalega, kouvriran logazman, infrastriktir, lasante, edikasion, enerzi renouvlab ek eko-touris.'},
 officialText:"La finalisation d'un plan directeur complet ax\u00e9 sur le logement, l'infrastructure, les soins de sant\u00e9, l'\u00e9ducation, l'\u00e9nergie renouvelable, la s\u00e9curit\u00e9 alimentaire et l'\u00e9co-tourisme pour Agal\u00e9ga est pr\u00e9vue.",
 source:{ref:'\u00a7255',organisme:'Min. \u00celes ext\u00e9rieures'},condition:inRegion('agalega')},
{id:'port_pl',section:'local',direction:'positive',when:null,
 title:{fr:'Rs\u00a07\u00a0milliards investis dans le port de Port Louis',en:'Rs\u00a07 billion invested in Port Louis harbour',kr:'Rs\u00a07 miliar investi dan por Port Louis'},
 text:{fr:"Le Port de Port Louis b\u00e9n\u00e9ficiera d'une s\u00e9rie de projets strat\u00e9giques d'une valeur totale d'environ Rs\u00a07\u00a0milliards.",en:'Port Louis harbour will benefit from strategic projects totalling around Rs\u00a07 billion, including the container terminal project.',kr:'Por Port Louis pou benefisie proze stratezik total Rs\u00a07 miliar, inkli proze terminal kontenier.'},
 officialText:"La Mauritius Ports Authority et la Cargo Handling Corporation ont entrepris la mise en \u0153uvre d'une s\u00e9rie de projets strat\u00e9giques repr\u00e9sentant un investissement total d'environ Rs\u00a07\u00a0milliards.",
 source:{ref:'\u00a745',organisme:'Mauritius Ports Authority'},condition:inRegion('port_louis')},
];

const SECTIONS=[
  {id:'quotidien',   l:{fr:'Au quotidien',             en:'Daily life',             kr:'Lavi kotidyen'},   icon:ShoppingBag},
  {id:'transparence',l:{fr:'Contr\u00f4les & d\u00e9clarations', en:'Reporting & controls',    kr:'Kontwol & deklarasion'},icon:ShieldCheck},
  {id:'voiture',     l:{fr:'Votre voiture',            en:'Your car',               kr:'Ou loto'},         icon:Car},
  {id:'logement',    l:{fr:'Votre logement',           en:'Housing',                kr:'Ou lakaz'},        icon:Home},
  {id:'famille',     l:{fr:'Famille',                  en:'Family',                 kr:'Fami'},            icon:Users},
  {id:'retraite',    l:{fr:'Votre retraite',           en:'Your retirement',        kr:'Ou retrete'},      icon:PiggyBank},
  {id:'travail',     l:{fr:'Travail & cotisations',    en:'Work & contributions',   kr:'Travay & kotizasion'},icon:Briefcase},
  {id:'entreprise',  l:{fr:'Votre entreprise',         en:'Your business',          kr:'Ou biznes'},       icon:Building2},
  {id:'expatrie',    l:{fr:'R\u00e9sident \u00e9tranger',         en:'Foreign resident',       kr:'Rezidan etranze'}, icon:Globe},
  {id:'investisseur',l:{fr:'Votre investissement',     en:'Your investment',        kr:'Ou linvestisman'}, icon:TrendingUp},
  {id:'local',       l:{fr:'Votre r\u00e9gion',             en:'Your region',            kr:'Ou rezion'},        icon:MapPin},
];
const DM={
  positive:{Icon:Check,  bg:'posBg',fg:'posT'},
  negative:{Icon:AlertTriangle,bg:'negBg',fg:'negT'},
  neutral: {Icon:Info,   bg:'neuBg',fg:'neuT'},
};

// ── Tiny components ───────────────────────────────────────────────────────────
const FlagStripe=({h=8})=><div className="flex w-full overflow-hidden rounded-full" style={{height:h}} aria-hidden>{C.flag.map((c,i)=><div key={i} style={{background:c,flex:1}}/>)}</div>;

const ProgBar=({tot,cur,T})=>{
  const pct=Math.max(4,Math.round((cur/tot)*100));
  return(
    <div className="mb-6">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.soft}}>{T.step(cur,tot)}</span>
        <span className="text-xs font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.lagoon}}>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{background:'#DCD3BC'}} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full" style={{width:`${pct}%`,background:C.lagoon,transition:'width 0.3s ease'}}/>
      </div>
    </div>
  );
};

const LangBtn=({lang,setLang})=>(
  <div className="flex gap-1">
    {['fr','en','kr'].map(l=>(
      <button key={l} onClick={()=>setLang(l)} className="text-xs font-bold rounded-full px-2.5 py-1 transition-colors"
        style={{fontFamily:"'IBM Plex Mono',monospace",background:lang===l?C.lagoon:'transparent',color:lang===l?'#fff':C.soft,border:`1.5px solid ${lang===l?C.lagoon:C.border}`}}>
        {l==='fr'?'FR':l==='en'?'EN':'KR'}
      </button>
    ))}
  </div>
);

const BackBtn=({onClick,T})=>(
  <button onClick={onClick} className="flex items-center gap-1 mb-4 text-sm font-semibold hover:opacity-80 transition-opacity" style={{color:C.soft}}>
    <ArrowLeft size={15}/>{T.back}
  </button>
);

const OptBtn=({label,onClick})=>(
  <button onClick={onClick} className="w-full text-left rounded-2xl border-2 px-5 py-4 mb-3 hover:border-teal-600 transition-colors" style={{background:C.card,borderColor:C.border}}>
    <span className="text-lg font-bold" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{label}</span>
  </button>
);

const TogCard=({label,checked,onClick})=>(
  <button onClick={onClick} aria-pressed={checked} className="w-full flex items-center justify-between text-left rounded-2xl border-2 px-5 py-4 mb-3 transition-colors"
    style={{background:checked?C.posBg:C.card,borderColor:checked?C.lagoon:C.border}}>
    <span className="text-base font-bold pr-3" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{label}</span>
    <span className="flex items-center justify-center rounded-full shrink-0" style={{width:26,height:26,background:checked?C.lagoon:'transparent',border:`2px solid ${checked?C.lagoon:'#CFC6AE'}`}}>
      {checked&&<Check size={15} color="#fff" strokeWidth={3}/>}
    </span>
  </button>
);

const DirBadge=({dir,T})=>{
  const d=DM[dir]; const Icon=d.Icon;
  return <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{background:C[d.bg],color:C[d.fg]}}><Icon size={13} strokeWidth={2.5}/>{dir==='positive'?T.dpos:dir==='negative'?T.dneg:T.dneu}</span>;
};

const OppTag=({T})=>(
  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold" style={{background:C.oppBg,color:C.oppAcc}}><Sparkles size={11} strokeWidth={2.5}/>{T.otag}</span>
);

const ItemCard=({item,anchorId,lang,T})=>{
  const[open,setOpen]=useState(false);
  return(
    <div id={anchorId} className="rounded-2xl border mb-3 overflow-hidden" style={{background:C.card,borderColor:open?C.lagoon:C.border,transition:'border-color 0.15s',scrollMarginTop:190}}>
      <button onClick={()=>setOpen(o=>!o)} className="w-full text-left p-4" aria-expanded={open}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap"><DirBadge dir={item.direction} T={T}/>{item.opportunity&&<OppTag T={T}/>}</div>
          <div className="flex items-center gap-2 shrink-0">
            {item.when&&<span className="text-xs whitespace-nowrap" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.soft}}>{item.when}</span>}
            <ChevronDown size={18} color={C.soft} style={{transform:open?'rotate(180deg)':'none',transition:'transform 0.2s'}}/>
          </div>
        </div>
        <h3 className="text-base font-bold leading-snug mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{tx(item.title,lang)}</h3>
        <p className="text-sm leading-relaxed" style={{color:C.soft}}>{tx(item.text,lang)}</p>
      </button>
      {open&&item.officialText&&(
        <div className="px-4 pb-4">
          <div style={{borderTop:`1px dashed ${C.border}`,paddingTop:12}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.lagoon,letterSpacing:'0.06em'}}>{T.off}</p>
            <p className="text-sm leading-relaxed mb-3" style={{color:C.ink}}>{item.officialText}</p>
            {item.source&&<div className="flex items-start gap-2 rounded-xl px-3 py-2" style={{background:C.neuBg}}>
              <Info size={13} color={C.neuT} style={{marginTop:2,flexShrink:0}}/>
              <span className="text-xs font-bold" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.neuT}}>{item.source.ref}</span>
              <span className="text-xs" style={{color:C.soft}}>\u00b7 {item.source.organisme}</span>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
};

const OppCard=({item,lang,T})=>{
  const[open,setOpen]=useState(false);
  return(
    <div className="rounded-2xl border-2 overflow-hidden mb-3" style={{background:C.oppBg,borderColor:C.oppBrd}}>
      <button onClick={()=>setOpen(o=>!o)} className="w-full text-left p-4" aria-expanded={open}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold leading-snug" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{tx(item.title,lang)}</h3>
          <ChevronDown size={18} color={C.oppAcc} style={{transform:open?'rotate(180deg)':'none',transition:'transform 0.2s',flexShrink:0,marginTop:2}}/>
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{color:C.soft}}>{tx(item.text,lang)}</p>
        <div className="rounded-xl p-3" style={{background:'#FFFCF7',border:`1px solid ${C.oppBrd}`}}>
          <div className="flex items-center gap-1.5 mb-1"><Sparkles size={13} color={C.oppAcc} strokeWidth={2.5}/>
            <span className="text-xs font-bold uppercase tracking-wide" style={{color:C.oppAcc,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:'0.06em'}}>{T.anote}</span>
          </div>
          <p className="text-sm leading-relaxed" style={{color:C.ink}}>{tx(item.actionTip,lang)}</p>
        </div>
      </button>
      {open&&item.officialText&&(
        <div className="px-4 pb-4">
          <div style={{borderTop:`1px dashed ${C.oppBrd}`,paddingTop:12}}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.oppAcc,letterSpacing:'0.06em'}}>{T.off}</p>
            <p className="text-sm leading-relaxed mb-3" style={{color:C.ink}}>{item.officialText}</p>
            {item.source&&<div className="flex items-start gap-2 rounded-xl px-3 py-2" style={{background:'#fff',border:`1px solid ${C.oppBrd}`}}>
              <Info size={13} color={C.oppAcc} style={{marginTop:2,flexShrink:0}}/>
              <span className="text-xs font-bold" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.oppAcc}}>{item.source.ref}</span>
              <span className="text-xs" style={{color:C.soft}}>\u00b7 {item.source.organisme}</span>
            </div>}
          </div>
        </div>
      )}
    </div>
  );
};

const TornEdge=()=><div aria-hidden style={{height:14,background:`linear-gradient(45deg,transparent 50%,${C.card} 50%),linear-gradient(-45deg,transparent 50%,${C.card} 50%)`,backgroundSize:'18px 18px',backgroundPosition:'top',backgroundRepeat:'repeat-x'}}/>;

const Disclaimer=({T})=>(
  <div className="mt-8 pt-4" style={{borderTop:`1px solid ${C.border}`}}>
    <p className="text-xs text-center leading-relaxed" style={{color:C.soft,opacity:.7}}>{T.disc}</p>
  </div>
);

// ── App ───────────────────────────────────────────────────────────────────────
export default function BudgetImpactApp(){
  const[lang,setLang]=useState('fr');
  const T=UI[lang];
  const[hist,setHist]=useState(['intro']);
  const[dqi,setDqi]=useState(0);
  const[secFilt,setSecFilt]=useState([]);
  const[pro,setPro]=useState({
    mauricien:null,genre:null,age:null,situations:[],details:{},revenu:null,regions:[],
    proprietaire:false,voiture:false,enfants:false,pretPersonnel:false,locatif:false,crypto:false,invalidite:false,
  });

  const step=hist[hist.length-1];
  const go=s=>setHist(h=>[...h,s]);
  const back=()=>setHist(h=>h.length>1?h.slice(0,-1):h);
  const restart=()=>{setHist(['intro']);setDqi(0);setSecFilt([]);setPro({mauricien:null,genre:null,age:null,situations:[],details:{},revenu:null,regions:[],proprietaire:false,voiture:false,enfants:false,pretPersonnel:false,locatif:false,crypto:false,invalidite:false});};
  const togSit=v=>setPro(p=>({...p,situations:p.situations.includes(v)?p.situations.filter(s=>s!==v):[...p.situations,v]}));
  const togX=k=>setPro(p=>({...p,[k]:!p[k]}));

  const dq=pro.situations.filter(s=>DQ[s]);
  const curDQ=dq[dqi];
  const confirmSit=()=>{setDqi(0);go(dq.length>0?'detail':'revenu');};
  const selDet=v=>{setPro(p=>({...p,details:{...p.details,[curDQ]:v}}));if(dqi+1<dq.length)setDqi(i=>i+1);else go('revenu');};
  const backDet=()=>{if(dqi>0)setDqi(i=>i-1);else back();};
  const selRev=v=>{setPro(p=>({...p,revenu:v}));go('extras');};

  const totSteps=6+dq.length;
  const detStep=4+dqi+1;
  const revIdx=5+dq.length;
  const extIdx=totSteps;

  const sendAnalytics=p=>{
    if(!APPS_SCRIPT_URL||APPS_SCRIPT_URL==='VOTRE_URL_ICI') return;
    const vis=M.filter(m=>m.condition(p));
    fetch(APPS_SCRIPT_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/json'},body:JSON.stringify({timestamp:new Date().toISOString(),mauricien:p.mauricien||'',genre:p.genre||'nr',age:p.age||'',situations:p.situations.join(','),revenu:p.revenu||'',details:Object.values(p.details).join(','),proprietaire:p.proprietaire?1:0,voiture:p.voiture?1:0,enfants:p.enfants?1:0,pret_personnel:p.pretPersonnel?1:0,locatif:p.locatif?1:0,crypto:p.crypto?1:0,invalidite:p.invalidite?1:0,regions:p.regions.join(','),nb_mesures:vis.length,nb_opps:vis.filter(m=>m.opportunity).length})}).catch(()=>{});
  };

  const vis=M.filter(m=>m.condition(pro));
  const filt=secFilt.length===0?vis:vis.filter(m=>secFilt.includes(m.section));
  const opps=filt.filter(m=>m.opportunity);
  const cnt={pos:filt.filter(m=>m.direction==='positive').length,neg:filt.filter(m=>m.direction==='negative').length,neu:filt.filter(m=>m.direction==='neutral').length};
  const first={};
  ['positive','negative','neutral'].forEach(d=>{const f=filt.find(m=>m.direction===d);if(f)first[d]=f.id;});
  const activeSec=SECTIONS.filter(s=>vis.some(m=>m.section===s.id));
  const scrollTo=id=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});};

  const isRetCtx=isRet(pro);
  const profSum=[
    pro.mauricien&&(pro.mauricien==='oui'?T.pm:T.pnm),
    pro.genre&&(pro.genre==='homme'?T.ph:T.pf),
    pro.age&&T.ag[pro.age],
    pro.situations.map(s=>T.sl[s]).filter(Boolean).join(' + ')||null,
    Object.values(pro.details).map(d=>T.dl[d]).filter(Boolean).join(' + ')||null,
  ].filter(Boolean).join(' \u00b7 ');

  const revOpts=[{v:'moins14',l:T.rv0},{v:'14a50',l:T.rv1},{v:'50a100',l:T.rv2},{v:'plus100',l:T.rv3},{v:'na',l:T.rv4}];

  return(
    <div style={{background:C.page,minHeight:'100vh',fontFamily:"'Inter',system-ui,sans-serif"}} className="flex justify-center px-4 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        button{cursor:pointer;} button:focus-visible{outline:3px solid #0E7C7B;outline-offset:2px;}
        .fi{animation:fi 0.22s ease-out;} @keyframes fi{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
      `}</style>
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <svg viewBox="0 0 205 42" width="175" height="36" role="img" aria-label="My Budget Analysis Mauritius">
            <rect x="0"  y="26" width="8" height="13" rx="1.5" fill="#E12C32"/>
            <rect x="11" y="19" width="8" height="20" rx="1.5" fill="#1B2C5C"/>
            <rect x="22" y="11" width="8" height="28" rx="1.5" fill="#F4C430"/>
            <rect x="33" y="3"  width="8" height="36" rx="1.5" fill="#1E8449"/>
            <line x1="0" y1="40" x2="44" y2="40" stroke="#E4DCC9" strokeWidth="1.2"/>
            <text x="50" y="21" fontSize="12" fontFamily="'Space Grotesk',system-ui,sans-serif" fontWeight="700" fill="#1C1B1A">My Budget Analysis</text>
            <text x="50" y="36" fontSize="8"  fontFamily="'Space Grotesk',system-ui,sans-serif" fontWeight="500" fill="#0E7C7B" letterSpacing="2">Mauritius</text>
          </svg>
          <LangBtn lang={lang} setLang={setLang}/>
        </div>

        {/* INTRO */}
        {step==='intro'&&<div className="fi">
          <h1 className="text-3xl font-bold leading-tight mb-4" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.intro_title}</h1>
          <p className="text-base leading-relaxed mb-8" style={{color:C.soft}}>{T.intro_sub}</p>
          <button onClick={()=>go('nationalite')} className="w-full text-white font-bold text-lg rounded-2xl py-4 hover:opacity-90 transition-opacity" style={{background:C.lagoon,fontFamily:"'Space Grotesk',sans-serif"}}>{T.start}</button>
          <Disclaimer T={T}/>
        </div>}

        {/* NATIONALITE */}
        {step==='nationalite'&&<div className="fi">
          <ProgBar tot={totSteps} cur={1} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-6" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_nat}</h2>
          <OptBtn label={T.oui} onClick={()=>{setPro(p=>({...p,mauricien:'oui'}));go('genre');}}/>
          <OptBtn label={T.non} onClick={()=>{setPro(p=>({...p,mauricien:'non'}));go('genre');}}/>
          <Disclaimer T={T}/>
        </div>}

        {/* GENRE */}
        {step==='genre'&&<div className="fi">
          <ProgBar tot={totSteps} cur={2} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-6" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_genre}</h2>
          <OptBtn label={T.homme} onClick={()=>{setPro(p=>({...p,genre:'homme'}));go('age');}}/>
          <OptBtn label={T.femme} onClick={()=>{setPro(p=>({...p,genre:'femme'}));go('age');}}/>
          <OptBtn label={T.gnr} onClick={()=>{setPro(p=>({...p,genre:null}));go('age');}}/>
          <Disclaimer T={T}/>
        </div>}

        {/* AGE */}
        {step==='age'&&<div className="fi">
          <ProgBar tot={totSteps} cur={3} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-6" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_age}</h2>
          <OptBtn label={T.agej} onClick={()=>{setPro(p=>({...p,age:'jeune'}));go('situation');}}/>
          <OptBtn label={T.agea} onClick={()=>{setPro(p=>({...p,age:'actif'}));go('situation');}}/>
          <OptBtn label={T.ages} onClick={()=>{setPro(p=>({...p,age:'senior'}));go('situation');}}/>
          <Disclaimer T={T}/>
        </div>}

        {/* SITUATION */}
        {step==='situation'&&<div className="fi">
          <ProgBar tot={totSteps} cur={4} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_sit}</h2>
          <p className="text-sm mb-5" style={{color:C.soft}}>{T.multi}</p>
          {[['salarie',T.s_sal],['independant',T.s_ind],['retraite',T.s_ret],['etudiant',T.s_etu],['expatrie',T.s_exp],['investisseur',T.s_inv]].map(([v,l])=>(
            <TogCard key={v} label={l} checked={pro.situations.includes(v)} onClick={()=>togSit(v)}/>
          ))}
          <button onClick={confirmSit} disabled={pro.situations.length===0} className="w-full text-white font-bold text-lg rounded-2xl py-4 mt-2 hover:opacity-90 transition-opacity"
            style={{background:C.lagoon,fontFamily:"'Space Grotesk',sans-serif",opacity:pro.situations.length===0?.45:1}}>
            {T.next}
          </button>
          <Disclaimer T={T}/>
        </div>}

        {/* DETAIL */}
        {step==='detail'&&curDQ&&<div className="fi">
          <ProgBar tot={totSteps} cur={detStep} T={T}/>
          <BackBtn onClick={backDet} T={T}/>
          <h2 className="text-2xl font-bold mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{tx(DQ[curDQ].q,lang)}</h2>
          {dq.length>1&&<p className="text-sm mb-5" style={{color:C.soft}}>{T.det_f(T.sl[curDQ]?.toLowerCase())}</p>}
          {dq.length===1&&<div className="mb-4"/>}
          {DQ[curDQ].opts.map(o=><OptBtn key={o.v} label={tx(o.l,lang)} onClick={()=>selDet(o.v)}/>)}
          <Disclaimer T={T}/>
        </div>}

        {/* REVENU */}
        {step==='revenu'&&<div className="fi">
          <ProgBar tot={totSteps} cur={revIdx} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-2" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{isRetCtx?T.q_rev_r:T.q_rev}</h2>
          <p className="text-sm mb-5" style={{color:C.soft}}>{isRetCtx?T.rev_hr:T.rev_h}</p>
          {revOpts.map(o=><OptBtn key={o.v} label={o.l} onClick={()=>selRev(o.v)}/>)}
          <Disclaimer T={T}/>
        </div>}

        {/* EXTRAS */}
        {step==='extras'&&<div className="fi">
          <ProgBar tot={totSteps} cur={extIdx} T={T}/>
          <BackBtn onClick={back} T={T}/>
          <h2 className="text-2xl font-bold mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_ext}</h2>
          <p className="text-sm mb-5" style={{color:C.soft}}>{T.ext_h}</p>
          <TogCard label={T.e_prop} checked={pro.proprietaire} onClick={()=>togX('proprietaire')}/>
          <TogCard label={T.e_voit} checked={pro.voiture} onClick={()=>togX('voiture')}/>
          <TogCard label={T.e_enf} checked={pro.enfants} onClick={()=>togX('enfants')}/>
          <TogCard label={T.e_pr\u00eat} checked={pro.pretPersonnel} onClick={()=>togX('pretPersonnel')}/>
          <TogCard label={T.e_loc} checked={pro.locatif} onClick={()=>togX('locatif')}/>
          <TogCard label={T.e_cry} checked={pro.crypto} onClick={()=>togX('crypto')}/>
          <TogCard label={T.e_inv2} checked={pro.invalidite} onClick={()=>togX('invalidite')}/>
          <button onClick={()=>go('region')} className="w-full text-white font-bold text-lg rounded-2xl py-4 mt-2 hover:opacity-90 transition-opacity"
            style={{background:C.lagoon,fontFamily:"'Space Grotesk',sans-serif"}}>
            {T.voir}
          </button>
          <Disclaimer T={T}/>
        </div>}

        {/* REGION */}
        {step==='region'&&<div className="fi">
          <BackBtn onClick={back} T={T}/>
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={20} color={C.lagoon}/>
            <h2 className="text-2xl font-bold" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.q_region}</h2>
          </div>
          <p className="text-sm mb-5" style={{color:C.soft}}>{T.r_h}</p>
          {REGIONS.map(r=>{
            const on=pro.regions.includes(r.v);
            return(
              <button key={r.v} onClick={()=>setPro(p=>({...p,regions:on?p.regions.filter(x=>x!==r.v):[...p.regions,r.v]}))}
                className="w-full flex items-start gap-3 text-left rounded-2xl border-2 px-4 py-3 mb-2 transition-colors"
                style={{background:on?C.posBg:C.card,borderColor:on?C.lagoon:C.border}}>
                <span className="flex items-center justify-center rounded-full shrink-0 mt-1" style={{width:22,height:22,background:on?C.lagoon:'transparent',border:`2px solid ${on?C.lagoon:'#CFC6AE'}`}}>
                  {on&&<Check size={13} color="#fff" strokeWidth={3}/>}
                </span>
                <span>
                  <span className="text-sm font-bold block" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{tx(r.l,lang)}</span>
                  <span className="text-xs block" style={{color:C.soft}}>{tx(r.hint,lang)}</span>
                </span>
              </button>
            );
          })}
          <button onClick={()=>{sendAnalytics(pro);go('results');}} className="w-full text-white font-bold text-lg rounded-2xl py-4 mt-3 hover:opacity-90 transition-opacity"
            style={{background:C.lagoon,fontFamily:"'Space Grotesk',sans-serif"}}>
            {T.voir}
          </button>
          <button onClick={()=>{sendAnalytics(pro);go('results');}} className="w-full text-center py-3 hover:opacity-70 transition-opacity"
            style={{color:C.soft,fontSize:'0.875rem',fontWeight:500,background:'none',border:'none'}}>
            {T.r_skip}
          </button>
          <Disclaimer T={T}/>
        </div>}

        {/* RESULTS */}
        {step==='results'&&<div className="fi">
          <button onClick={restart} className="flex items-center gap-1 mb-4 text-sm font-semibold hover:opacity-70 transition-opacity" style={{color:C.soft}}>
            <RotateCcw size={15}/>{T.restart}
          </button>

          {/* sticky wrapper: header + filtres */}
          <div style={{position:'sticky',top:0,zIndex:20}}>
            <div className="rounded-t-3xl border border-b-0 px-5 pt-5 pb-4"
              style={{background:C.card,borderColor:C.border,boxShadow:'0 8px 16px -10px rgba(28,27,26,.18)'}}>
              <h2 className="text-xl font-bold mb-1" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink}}>{T.res_t}</h2>
              <p className="text-xs mb-4" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.soft}}>{profSum}</p>
              <div className="flex gap-2 flex-wrap">
                {[{k:'pos',fn:T.b_pos,bg:C.posBg,fc:C.posT,d:'positive'},{k:'neg',fn:T.b_neg,bg:C.negBg,fc:C.negT,d:'negative'},{k:'neu',fn:T.b_neu,bg:C.neuBg,fc:C.neuT,d:'neutral'}].map(({k,fn,bg,fc,d})=>(
                  <button key={k} onClick={()=>first[d]&&scrollTo(`anc-${d}`)} disabled={!first[d]} className="rounded-full px-3 py-1 text-xs font-bold transition-opacity"
                    style={{background:bg,color:fc,opacity:first[d]?1:.5,border:'none'}}>
                    {fn(cnt[k]||0)}
                  </button>
                ))}
                {opps.length>0&&<button onClick={()=>scrollTo('anc-opp')} className="rounded-full px-3 py-1 text-xs font-bold" style={{background:C.oppBg,color:C.oppAcc,border:'none'}}>{T.b_opp(opps.length)}</button>}
              </div>
            </div>

            {/* Section filters — collés sous le header, fixes au scroll */}
            {activeSec.length>1&&(
              <div className="px-2 py-2" style={{background:C.page,borderBottom:`1px solid ${C.border}`}}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Filter size={15} color={C.soft}/>
                  <span className="text-xs font-semibold" style={{fontFamily:"'IBM Plex Mono',monospace",color:C.soft}}>{T.filt}</span>
                </div>
                <div className="flex gap-2 pb-1" style={{overflowX:'auto',WebkitOverflowScrolling:'touch'}}>
                  <button onClick={()=>setSecFilt([])} className="rounded-full px-3.5 py-1.5 text-sm font-bold whitespace-nowrap shrink-0 transition-colors"
                    style={{background:secFilt.length===0?C.lagoon:C.neuBg,color:secFilt.length===0?'#fff':C.neuT,border:`1.5px solid ${secFilt.length===0?C.lagoon:C.border}`}}>
                    {T.filt0}
                  </button>
                  {activeSec.map(s=>{
                    const on=secFilt.includes(s.id); const Icon=s.icon;
                    return(
                      <button key={s.id} onClick={()=>setSecFilt(prev=>on?prev.filter(x=>x!==s.id):[...prev,s.id])}
                        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-bold whitespace-nowrap shrink-0 transition-colors"
                        style={{background:on?C.lagoon:C.neuBg,color:on?'#fff':C.neuT,border:`1.5px solid ${on?C.lagoon:C.border}`}}>
                        <Icon size={14}/>{tx(s.l,lang)}{on&&<X size={12} strokeWidth={2.5}/>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <TornEdge/>
          </div>

          {/* Opportunities */}
          {opps.length>0&&(
            <div id="anc-opp" className="mb-6" style={{scrollMarginTop:200}}>
              <div className="flex items-center gap-2 mb-1 mt-1"><Sparkles size={18} color={C.oppAcc}/>
                <h3 className="text-sm font-bold uppercase tracking-wide" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink,letterSpacing:'0.05em'}}>{T.opp_t}</h3>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{color:C.soft}}>{T.opp_d}</p>
              {opps.map(item=><OppCard key={`o-${item.id}`} item={item} lang={lang} T={T}/>)}
            </div>
          )}

          {/* Sections */}
          <div className="pt-1">
            {SECTIONS.map(sec=>{
              const items=filt.filter(m=>m.section===sec.id);
              if(items.length===0) return null;
              const Icon=sec.icon;
              return(
                <div key={sec.id} className="mb-6">
                  <div className="flex items-center gap-2 mb-3 mt-2">
                    <Icon size={18} color={C.lagoon}/>
                    <h3 className="text-sm font-bold uppercase tracking-wide" style={{fontFamily:"'Space Grotesk',sans-serif",color:C.ink,letterSpacing:'0.05em'}}>{tx(sec.l,lang)}</h3>
                  </div>
                  {items.map(item=><ItemCard key={item.id} item={item} anchorId={first[item.direction]===item.id?`anc-${item.direction}`:undefined} lang={lang} T={T}/>)}
                </div>
              );
            })}
          </div>
          <FlagStripe h={6}/>
          <p className="text-xs leading-relaxed text-center mt-4 mb-2" style={{color:C.soft}}>{T.disc}</p>
        </div>}

      </div>
    </div>
  );
}
