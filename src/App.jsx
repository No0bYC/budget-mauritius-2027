import { useState } from 'react';
import {
  Check, AlertTriangle, Info, ArrowLeft, RotateCcw, Sparkles,
  ShoppingBag, Car, Home, Users, PiggyBank, Briefcase, Building2,
  Globe, TrendingUp, ShieldCheck, ChevronDown,
} from 'lucide-react';

const COLORS = {
  page: '#EFEAE0', card: '#FFFCF7', border: '#E4DCC9', ink: '#1C1B1A', inkSoft: '#5B5750',
  lagoon: '#0E7C7B', posBg: '#E6F2EA', posText: '#1F6F4A', negBg: '#FBEAE5', negText: '#9C3322',
  neuBg: '#E9EEEE', neuText: '#3C6B6A', oppBg: '#FBF1DC', oppBorder: '#E8C77E', oppAccent: '#92660E',
  flag: ['#E12C32', '#1B2C5C', '#F4C430', '#1E8449'],
};

// ─── ANALYTICS ──────────────────────────────────────────────────────────────
// Collez ici l'URL de votre Apps Script après déploiement (étape 3 du guide)
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzuXCM6Oki1LmCJCC3oxyhEsMhe8XiOG2yh8BktnaP6LQWQ9I3tmPzAnam5bo9NdE4/exec';
// ────────────────────────────────────────────────────────────────────────────

const isRetraiteCtx = (p) => p.situations.includes('retraite') || p.age === 'senior';
const isActifCtx = (p) => p.situations.includes('salarie') || p.situations.includes('independant');
const isEntrepreneur = (p) => p.situations.includes('independant');
const isExpatrie = (p) => p.situations.includes('expatrie') || p.mauricien === 'non';
const isInvestisseur = (p) => p.situations.includes('investisseur');
const sect = (s) => (p) => isEntrepreneur(p) && p.details.independant === s;
const expatDetail = (d) => (p) => p.situations.includes('expatrie') && p.details.expatrie === d;
const investDetail = (d) => (p) => isInvestisseur(p) && p.details.investisseur === d;
const revenuAu = (...vals) => (p) => vals.includes(p.revenu);

const DETAIL_QUESTIONS = {
  independant: {
    question: 'Dans quel secteur ?',
    options: [
      { value: 'tourisme', label: 'Tourisme' },
      { value: 'tech', label: 'Tech / Digital' },
      { value: 'manufacturing', label: 'Manufacturing' },
      { value: 'autre', label: 'Autre secteur' },
    ],
  },
  investisseur: {
    question: "Quel type d'investissement ?",
    options: [
      { value: 'golden_visa', label: 'Golden Visa / résidence' },
      { value: 'immobilier_sez', label: "Immobilier ou SEZ Côte d'Or" },
      { value: 'obligations', label: "Obligations d'État" },
      { value: 'capital_local', label: 'Capital dans une entreprise locale' },
      { value: 'actions_dividendes', label: "Actions ou dividendes d'une société mauricienne" },
    ],
  },
  expatrie: {
    question: 'Quel est votre statut ?',
    options: [
      { value: 'permis_pro', label: 'Permis professionnel (salarié·e)' },
      { value: 'permis_investisseur', label: 'Permis investisseur' },
      { value: 'conjoint', label: "Conjoint·e d'un·e Mauricien·ne" },
      { value: 'retraite_etranger', label: 'Retraité·e installé·e à Maurice' },
    ],
  },
};

const REVENU_OPTIONS = [
  { value: 'moins14', label: 'Moins de Rs 14 000' },
  { value: '14a50', label: 'Rs 14 000 à Rs 50 000' },
  { value: '50a100', label: 'Rs 50 000 à Rs 100 000' },
  { value: 'plus100', label: 'Plus de Rs 100 000' },
  { value: 'na', label: 'Je préfère ne pas répondre' },
];
const REVENU_LABELS = REVENU_OPTIONS.reduce((acc, o) => { acc[o.value] = o.label; return acc; }, {});

const MEASURES = [
  // AU QUOTIDIEN
  { id: 'sucre', section: 'quotidien', direction: 'negative', when: 'dès oct. 2026',
    title: 'Hausse de la taxe sur les produits sucrés',
    text: "La taxe sur le sucre passe de 12 à 15 cents par gramme et s'étend aux bonbons, confitures, biscuits et chewing-gums.",
    officialText: "Le budget 2026-2027 porte la taxe d'accise sur le sucre ajouté de 12 à 15 cents par gramme. Cette taxe est étendue à de nouvelles catégories de produits — bonbons, confitures, biscuits et chewing-gums — qui en étaient jusqu'ici exemptés.",
    source: { ref: '§5(a)(b)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'plastique', section: 'quotidien', direction: 'negative', when: 'dès oct. 2026',
    title: "La taxe sur les bouteilles plastique s'élargit",
    text: "Jusqu'ici réservée aux boissons, cette taxe s'applique désormais à tous les produits vendus en bouteille plastique.",
    officialText: "La taxe sur les contenants en plastique, jusqu'ici limitée aux boissons, est étendue à l'ensemble des produits commercialisés en bouteille plastique. Cette mesure vise à réduire l'utilisation du plastique à usage unique dans la distribution.",
    source: { ref: '§4', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'sel', section: 'quotidien', direction: 'positive', when: null,
    title: 'Le sel devient exonéré de TVA',
    text: 'Le sel de cuisine, local ou importé, ne sera plus soumis à la TVA.',
    officialText: "Le budget supprime la TVA applicable au sel de cuisine, qu'il soit d'origine locale ou importé. Cette denrée alimentaire de base rejoint ainsi la liste des produits exonérés de taxe sur la valeur ajoutée.",
    source: { ref: '§6(i)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'colis', section: 'quotidien', direction: 'negative', when: 'dès sept. 2026',
    title: "Nouveau frais sur les colis de l'étranger",
    text: "Un frais de Rs 150 s'appliquera à chaque colis reçu par la poste ou un service de courrier international.",
    officialText: "Un frais de Rs 150 sera prélevé sur chaque colis international reçu par voie postale ou par un service de messagerie privé. Cette mesure entre en vigueur à partir de septembre 2026.",
    source: { ref: '§7', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'bus', section: 'quotidien', direction: 'positive', when: null,
    title: 'Réduction progressive de l\'âge maximal des bus',
    text: "L'âge limite autorisé pour un bus en circulation passera de 21 à 16 ans, sur cinq ans.",
    officialText: "L'âge maximal autorisé pour les bus en circulation sera progressivement réduit de 21 à 16 ans, sur une période de cinq ans. Cette mesure vise à moderniser le parc de transport en commun à Maurice.",
    source: { ref: '§16(a)', organisme: 'National Land Transport Authority (NLTA)' },
    condition: () => true },

  { id: 'sport', section: 'quotidien', direction: 'positive', when: null,
    title: 'Accès gratuit à certaines infrastructures sportives',
    text: "Plusieurs infrastructures sportives régionales deviendront gratuites pour encourager la pratique sportive.",
    officialText: "Plusieurs infrastructures sportives régionales seront rendues accessibles gratuitement au public. Cette disposition s'inscrit dans la politique de promotion de la pratique sportive et du bien-être de la population.",
    source: { ref: '§25', organisme: 'Ministère de la Jeunesse et des Sports' },
    condition: () => true },

  { id: 'bruit', section: 'quotidien', direction: 'neutral', when: null,
    title: 'Les amendes pour nuisance sonore doublent',
    text: "L'amende pour nuisance sonore passe de Rs 10 000 à Rs 20 000.",
    officialText: "L'amende prévue pour infraction à la législation sur les nuisances sonores est doublée, passant de Rs 10 000 à Rs 20 000. Cette révision à la hausse vise à renforcer l'effectivité de la réglementation en vigueur.",
    source: { ref: '§20', organisme: 'Police de Maurice' },
    condition: () => true },

  { id: 'alcool', section: 'quotidien', direction: 'negative', when: 'dès le 20 juin 2026',
    title: 'Hausse sur les spiritueux uniquement',
    text: 'Le rhum, le whisky et autres spiritueux augmentent d\'environ 10%. La bière et le vin restent inchangés.',
    officialText: "Les droits d'accise applicables aux spiritueux — rhum, whisky et autres boissons distillées — augmentent d'environ 10% à compter du 20 juin 2026. Les droits sur la bière et le vin ne sont pas modifiés par ce budget.",
    source: { ref: '§3.1', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'tabac', section: 'quotidien', direction: 'negative', when: 'dès le 20 juin 2026',
    title: 'Hausse du prix du tabac',
    text: 'Les cigarettes, cigares et cigarillos augmentent d\'environ 10%.',
    officialText: "Les droits d'accise sur les produits du tabac — cigarettes, cigares et cigarillos — augmentent d'environ 10% à compter du 20 juin 2026. Cette mesure s'inscrit dans la politique de santé publique visant à décourager la consommation de tabac.",
    source: { ref: '§3.2', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'data_gratuit', section: 'quotidien', direction: 'positive', when: "jusqu'en juin 2027",
    title: 'La data gratuite pour les 18-25 ans est prolongée',
    text: "Le forfait data mensuel gratuit destiné aux citoyens mauriciens de 18-25 ans est reconduit jusqu'en juin 2027.",
    officialText: "Le programme de données mobiles gratuites destiné aux citoyens mauriciens âgés de 18 à 25 ans est prolongé jusqu'en juin 2027. Ce forfait mensuel est reconduit dans le cadre de la politique d'inclusion numérique du gouvernement.",
    source: { ref: '§21', organisme: 'Ministère des Technologies de l\'Information et de la Communication' },
    condition: (p) => p.age === 'jeune' && p.mauricien === 'oui' },

  // CONTRÔLES & DÉCLARATIONS
  { id: 'acces_mra_civil', section: 'transparence', direction: 'neutral', when: null,
    title: 'Le fisc obtient un accès direct à l\'état civil',
    text: "La MRA pourra consulter électroniquement la base de données de l'état civil et de la population.",
    officialText: "La MRA est habilitée à accéder électroniquement à la base de données de l'état civil et de la population. Cette mesure vise à faciliter la vérification des informations personnelles dans le cadre des procédures fiscales.",
    source: { ref: '§9.2.3(c)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: () => true },

  { id: 'declaration_devises', section: 'transparence', direction: 'neutral', when: null,
    title: 'Déclaration obligatoire pour les grosses sommes en voyage',
    text: "Au-delà de Rs 500 000 en espèces, pierres précieuses ou bijoux, une déclaration est obligatoire à la douane. Toute fausse déclaration expose à une amende pouvant atteindre Rs 5 millions.",
    officialText: "Toute personne voyageant à l'international avec plus de Rs 500 000 en espèces, pierres précieuses ou bijoux est tenue d'en faire la déclaration aux douanes. Toute fausse déclaration ou omission est passible d'une amende pouvant atteindre Rs 5 millions.",
    source: { ref: '§9.4(f)', organisme: 'MRA — Douanes de Maurice' },
    condition: () => true },

  { id: 'crypto_reporting', section: 'transparence', direction: 'neutral', when: null,
    title: 'Partage international des données sur les cryptomonnaies',
    text: "La MRA collectera les informations sur vos actifs crypto pour les transmettre aux autorités fiscales étrangères.",
    officialText: "Dans le cadre des standards internationaux de l'OCDE, la MRA est chargée de collecter les informations relatives aux actifs en cryptomonnaies détenus à Maurice. Ces données seront transmises aux autorités fiscales étrangères dans le cadre des accords d'échange automatique d'informations.",
    source: { ref: '§9.2.3(d)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: (p) => p.crypto },

  { id: 'utilities_mra', section: 'transparence', direction: 'neutral', when: null,
    title: 'Vos factures d\'eau et d\'électricité partagées avec le fisc',
    text: 'Si vos paiements annuels dépassent Rs 100 000, la CWA et le CEB devront déclarer le montant total à la MRA.',
    officialText: "La CWA et le CEB sont tenus de déclarer à la MRA les montants annuels facturés aux clients dont les paiements dépassent Rs 100 000 sur l'année. Cette mesure renforce les capacités de recoupement d'informations de l'administration fiscale.",
    source: { ref: '§9.2.3(a)', organisme: 'MRA / CWA / CEB' },
    condition: () => true },

  { id: 'citoyennete_protection', section: 'transparence', direction: 'positive', when: null,
    title: 'Meilleure protection de la citoyenneté mauricienne',
    text: "Le ministre de l'Intérieur ne pourra plus retirer la citoyenneté mauricienne sans en donner les raisons.",
    officialText: "Le budget introduit une obligation de motivation pour le ministre de l'Intérieur en cas de retrait de la citoyenneté mauricienne. Cette mesure renforce les garanties procédurales offertes aux citoyens face à une décision administrative de cette nature.",
    source: { ref: '§53', organisme: "Ministère de l'Intérieur" },
    condition: (p) => p.mauricien === 'oui' },

  // VOITURE
  { id: 'plaque_perso', section: 'voiture', direction: 'negative', when: null,
    title: 'Nouveau frais annuel pour les plaques personnalisées',
    text: "Un frais annuel s'appliquera aux plaques personnalisées ou anciennes, entre Rs 2 000 et Rs 25 000 selon le type.",
    officialText: "Un frais annuel est instauré pour les détenteurs de plaques d'immatriculation personnalisées ou de plaques anciennes. Le montant varie selon la catégorie, de Rs 2 000 à Rs 25 000 par an.",
    source: { ref: '§3.3.1', organisme: 'Mauritius Revenue Authority (MRA) / National Land Transport Authority (NLTA)' },
    condition: (p) => p.voiture },

  { id: 'verif_vehicule', section: 'voiture', direction: 'positive', when: null,
    title: "Vérification en ligne avant l'achat d'un véhicule d'occasion",
    text: "Un service en ligne permettra de vérifier si un véhicule fait l'objet d'une dette ou d'un gage avant achat.",
    officialText: "Un service de vérification en ligne permettra à tout acheteur potentiel de consulter si un véhicule fait l'objet d'un gage, d'une hypothèque ou d'une dette enregistrée. Ce service sera mis en place par le Registrar-General's Department en coordination avec la NLTA.",
    source: { ref: '§17(a)', organisme: "Registrar-General's Department / National Land Transport Authority (NLTA)" },
    condition: (p) => p.voiture,
    opportunity: true,
    actionTip: "Ce service en ligne permet de consulter l'historique de charges d'un véhicule d'occasion avant toute transaction. Il est mis à disposition par le Registrar-General's Department et la NLTA — une démarche à effectuer avant la signature d'un acte de vente." },

  { id: 'amendes_permis', section: 'voiture', direction: 'negative', when: null,
    title: 'Le renouvellement du permis conditionné au paiement des amendes',
    text: "Le renouvellement de votre Motor Vehicle Licence sera bloqué tant que vos amendes routières ne sont pas réglées.",
    officialText: "Le renouvellement annuel du Motor Vehicle Licence sera conditionné au règlement préalable de toutes les amendes routières impayées. Cette mesure vise à améliorer le taux de recouvrement des sanctions routières en vigueur.",
    source: { ref: '§3.3.3', organisme: 'National Land Transport Authority (NLTA)' },
    condition: (p) => p.voiture },

  // LOGEMENT
  { id: 'quartz', section: 'logement', direction: 'positive', when: 'dès le 20 juin 2026',
    title: 'Baisse du coût des plans de travail en quartz',
    text: "La taxe douanière de 15% sur les plans de travail en quartz est supprimée.",
    officialText: "La taxe douanière de 15% applicable aux plans de travail en quartz est supprimée à compter du 20 juin 2026. Cette exonération de droits de douane a pour effet de réduire le coût d'importation de ce matériau sur le marché local.",
    source: { ref: '§2(a)', organisme: 'MRA — Douanes de Maurice' },
    condition: (p) => p.proprietaire,
    opportunity: true,
    actionTip: "La suppression de la taxe douanière peut se traduire par une réduction du prix des plans de travail en quartz chez les revendeurs et fabricants. L'impact réel sur les prix de vente dépend de la répercussion par les distributeurs." },

  { id: 'recherche_cadastrale', section: 'logement', direction: 'negative', when: null,
    title: 'Hausse des frais de recherche au cadastre',
    text: "Les frais de recherche immobilière passent de Rs 200 à Rs 300 par jour.",
    officialText: "Les frais journaliers de recherche auprès du Registrar-General's Department passent de Rs 200 à Rs 300 par jour. Cette révision tarifaire s'applique aux démarches de vérification et de recherche de titres de propriété.",
    source: { ref: '§8.3', organisme: "Registrar-General's Department" },
    condition: (p) => p.proprietaire },

  // FAMILLE
  { id: 'conge_menstruel', section: 'famille', direction: 'positive', when: null,
    title: 'Nouveau congé menstruel payé',
    text: "Un jour de congé payé par mois sera accordé aux femmes souffrant de douleurs menstruelles sévères, public et privé.",
    officialText: "Un congé mensuel payé d'une journée est institué pour les employées souffrant de douleurs menstruelles sévères, dans les secteurs public et privé. Cette disposition est intégrée à la législation du travail en vigueur à Maurice.",
    source: { ref: '§22', organisme: 'Ministère du Travail, des Relations Industrielles, de l\'Emploi et de la Formation' },
    condition: () => true },

  { id: 'allocation_enfant_age', section: 'famille', direction: 'positive', when: null,
    title: "L'allocation enfant prolongée d'un an",
    text: "L'âge limite pour percevoir l'allocation enfant au secondaire passe de 20 à 21 ans.",
    officialText: "L'âge limite d'éligibilité à l'allocation enfant, pour les jeunes poursuivant des études au secondaire, est relevé de 20 à 21 ans. Cette extension permet à un plus grand nombre de familles de continuer à percevoir cette prestation.",
    source: { ref: '§58(b)', organisme: 'National Pensions Fund (NPF)' },
    condition: (p) => p.enfants },

  { id: 'allocation_enfant_mitd', section: 'famille', direction: 'positive', when: null,
    title: "L'allocation enfant étendue aux formations techniques",
    text: "Les enfants inscrits au MITD ou dans un Polytechnic deviennent éligibles à l'allocation.",
    officialText: "L'allocation enfant est désormais accessible aux enfants inscrits dans les établissements MITD ou les Polytechnics, qui en étaient jusqu'ici exclus. Cette mesure élargit le champ d'application de la prestation familiale à de nouvelles filières de formation.",
    source: { ref: '§58(c)', organisme: 'National Pensions Fund (NPF)' },
    condition: (p) => p.enfants },

  // RETRAITE
  { id: 'sap_remplace_brp', section: 'retraite', direction: 'neutral', when: 'dès janv. 2027',
    title: 'La pension de base remplacée par la State Age Pension',
    text: "Dès janvier 2027, la SAP remplace la BRP — Rs 16 555 à 65 ans contre Rs 15 555 actuellement.",
    officialText: "La State Age Pension (SAP) remplace la Basic Retirement Pension (BRP) à compter du 1er janvier 2027. Le montant de base à 65 ans est fixé à Rs 16 555, contre Rs 15 555 pour la BRP actuelle. Un test de ressources s'applique au-delà de Rs 14 000 de revenus mensuels additionnels.",
    source: { ref: '§27.1–27.10', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: isRetraiteCtx },

  { id: 'sap_age_flexible', section: 'retraite', direction: 'neutral', when: null,
    title: "Flexibilité sur l'âge de départ à la retraite",
    text: "Vous choisissez quand commencer entre 60 et 70 ans. La prendre plus tôt la réduit ; la différer l'augmente de 9% par an.",
    officialText: "Le budget introduit une flexibilité dans l'âge de demande de la pension entre 60 et 70 ans. La pension est réduite en cas de demande avant 65 ans, et augmente de 9% pour chaque année de report après 65 ans, à vie.",
    source: { ref: '§27.5', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: isRetraiteCtx,
    opportunity: true,
    actionTip: "Ce mécanisme permet d'ajuster l'âge de demande de pension entre 60 et 70 ans. Chaque année de report après 65 ans augmente le montant de 9% à vie, selon les dispositions du budget. Les implications personnelles de ce choix méritent une analyse avec un conseiller agréé ou l'organisme compétent." },

  { id: 'sap_test_safe', section: 'retraite', direction: 'positive', when: null,
    title: 'Votre pension ne devrait pas être réduite',
    text: "Votre revenu indiqué ne dépasse pas Rs 14 000 — le nouveau test de ressources ne devrait pas réduire votre pension.",
    officialText: "Le test de ressources de la SAP s'applique uniquement au-delà de Rs 14 000 de revenus mensuels additionnels (hors pension et certaines prestations exclues). En deçà de ce seuil, le montant de la pension n'est pas affecté.",
    source: { ref: '§27.6–27.8', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: (p) => isRetraiteCtx(p) && revenuAu('moins14')(p) },

  { id: 'sap_test_reduit', section: 'retraite', direction: 'negative', when: null,
    title: 'Votre pension pourrait être réduite',
    text: "Au-delà de Rs 14 000 de revenus mensuels additionnels, le montant diminue progressivement, jusqu'à un plancher de Rs 1 000.",
    officialText: "Le test de ressources de la SAP prévoit une réduction de 50 cents par rupee de revenus au-delà de Rs 14 000 mensuels (hors pension et prestations exclues). Le montant minimal de la pension est plafonné à Rs 1 000, quel que soit le niveau de revenus additionnels.",
    source: { ref: '§27.6–27.8', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: (p) => isRetraiteCtx(p) && revenuAu('14a50', '50a100', 'plus100')(p) },

  { id: 'sap_test_inconnu', section: 'retraite', direction: 'neutral', when: null,
    title: 'Un test de ressources s\'applique à la nouvelle pension',
    text: "Au-delà de Rs 14 000 de revenus mensuels en plus de la pension, le montant diminue. En dessous, rien ne change.",
    officialText: "Le test de ressources de la SAP prévoit une réduction de 50 cents par rupee de revenus mensuels au-delà de Rs 14 000 (hors pension et prestations exclues), jusqu'à un plancher de Rs 1 000. En dessous de ce seuil, la pension n'est pas affectée.",
    source: { ref: '§27.6–27.8', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: (p) => isRetraiteCtx(p) && revenuAu(undefined, 'na')(p) },

  { id: 'locatif_compte_sap', section: 'retraite', direction: 'negative', when: null,
    title: 'Les revenus locatifs comptent dans le test de ressources',
    text: "Contrairement aux dividendes, vos revenus de location sont inclus dans le calcul qui peut réduire votre pension SAP.",
    officialText: "Les revenus locatifs sont expressément inclus dans l'assiette de revenus prise en compte pour le calcul du test de ressources de la SAP. Contrairement aux dividendes et aux intérêts, ils ne bénéficient d'aucune exclusion dans ce calcul.",
    source: { ref: '§27.8', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: (p) => isRetraiteCtx(p) && p.locatif },

  { id: 'invalidite_exclue_sap', section: 'retraite', direction: 'positive', when: null,
    title: "L'allocation d'invalidité ne compte pas dans le test de ressources",
    text: "L'allocation d'invalidité ou de soins est explicitement exclue du calcul qui peut réduire la pension SAP.",
    officialText: "L'allocation d'invalidité (Invalidity Allowance) et les allocations de soins (Care Allowance) sont explicitement exclues de l'assiette de revenus retenue pour le test de ressources de la SAP. Elles ne réduisent donc pas le montant de la pension perçue.",
    source: { ref: '§27.8(c)', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: (p) => isRetraiteCtx(p) && p.invalidite },

  { id: 'geriatrie', section: 'retraite', direction: 'positive', when: null,
    title: 'Un programme national de soins gériatriques',
    text: "Un programme gériatrique national est mis en place pour améliorer la prise en charge des personnes âgées.",
    officialText: "Le budget prévoit la mise en place d'un programme national de soins gériatriques destiné à améliorer la qualité et l'accessibilité des soins pour les personnes âgées. Ce programme relève du Ministère de la Santé et du Bien-être.",
    source: { ref: '§13(c)', organisme: 'Ministère de la Santé et du Bien-être' },
    condition: (p) => isRetraiteCtx(p) || expatDetail('retraite_etranger')(p) },

  // TRAVAIL & COTISATIONS
  { id: 'npf_bas', section: 'travail', direction: 'neutral', when: 'dès juil. 2027',
    title: 'Votre cotisation retraite passera à 1,5%',
    text: "Sous Rs 50 000 de salaire, vous cotiserez 1,5% au NPF, et votre employeur 7,5%.",
    officialText: "Le nouveau National Pensions Fund (NPF) remplace le Contribution Sociale Généralisée (CSG) à partir de juillet 2027. Pour les salaires inférieurs à Rs 50 000, la cotisation salariale est fixée à 1,5% et la cotisation patronale à 7,5%.",
    source: { ref: '§27.16(a)', organisme: 'National Pensions Fund (NPF) / Pensions Regulator' },
    condition: (p) => isActifCtx(p) && revenuAu('moins14', '14a50')(p) },

  { id: 'npf_haut', section: 'travail', direction: 'neutral', when: 'dès juil. 2027',
    title: 'Votre cotisation retraite passera à 3%',
    text: "Au-delà de Rs 50 000, vous cotiserez 3% au NPF, et votre employeur 10,5%.",
    officialText: "Le nouveau National Pensions Fund (NPF) remplace le CSG à partir de juillet 2027. Pour les salaires dépassant Rs 50 000, la cotisation salariale est fixée à 3% et la cotisation patronale à 10,5%.",
    source: { ref: '§27.16(a)', organisme: 'National Pensions Fund (NPF) / Pensions Regulator' },
    condition: (p) => isActifCtx(p) && revenuAu('50a100', 'plus100')(p) },

  { id: 'npf_generic', section: 'travail', direction: 'neutral', when: 'dès juil. 2027',
    title: 'Votre cotisation retraite change de système',
    text: "Un nouveau fonds (NPF) remplace le CSG. Sous Rs 50 000 : 1,5% / 7,5% (vous / employeur). Au-delà : 3% / 10,5%.",
    officialText: "Le nouveau National Pensions Fund (NPF) remplace le CSG à partir de juillet 2027. Les taux de cotisation varient selon le niveau de salaire : 1,5% salarié / 7,5% employeur sous Rs 50 000 ; 3% / 10,5% au-delà de Rs 50 000.",
    source: { ref: '§27.16(a)', organisme: 'National Pensions Fund (NPF) / Pensions Regulator' },
    condition: (p) => isActifCtx(p) && revenuAu(undefined, 'na')(p) },

  // ENTREPRISE
  { id: 'nom_entreprise', section: 'entreprise', direction: 'positive', when: null,
    title: 'Délai de réservation de nom allongé à 6 mois',
    text: "La réservation de nom auprès du Registrar of Companies passe de 2 à 6 mois.",
    officialText: "La durée maximale de réservation d'un nom d'entreprise auprès du Registrar of Companies est portée de 2 à 6 mois. Cette extension offre aux créateurs d'entreprise une plus grande flexibilité dans leurs démarches de constitution.",
    source: { ref: '§10(c)', organisme: 'Registrar of Companies' },
    condition: isEntrepreneur },

  { id: 'petit_partenariat', section: 'entreprise', direction: 'positive', when: null,
    title: "Le seuil de 'petite entreprise' relevé à Rs 100M",
    text: "Le seuil de chiffre d'affaires donnant accès aux allègements réservés aux petites structures passe de Rs 50M à Rs 100M.",
    officialText: "Le seuil de chiffre d'affaires définissant une petite entreprise (Small Business) est relevé de Rs 50 millions à Rs 100 millions. Les structures dont le chiffre d'affaires se situe entre ces deux valeurs deviennent potentiellement éligibles aux régimes allégés réservés à cette catégorie.",
    source: { ref: '§10(f)', organisme: 'Registrar of Companies' },
    condition: isEntrepreneur,
    opportunity: true,
    actionTip: "Les entreprises dont le chiffre d'affaires se situe désormais entre Rs 50M et Rs 100M deviennent potentiellement éligibles aux régimes allégés réservés aux petites entreprises. Les critères précis d'éligibilité sont à vérifier auprès du Registrar of Companies." },

  { id: 'tds_marketing', section: 'entreprise', direction: 'negative', when: null,
    title: 'Retenue à la source sur le marketing digital',
    text: "Les prestations de marketing ou de contenu sur les réseaux sociaux seront soumises à une retenue de 5%.",
    officialText: "Une retenue à la source de 5% est instaurée sur les paiements effectués au titre de prestations de marketing digital et de création de contenu sur les réseaux sociaux. Cette retenue s'applique à tout prestataire recevant ces paiements à Maurice.",
    source: { ref: '§9.2.2(b)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: isEntrepreneur },

  { id: 'tds_logiciel', section: 'entreprise', direction: 'negative', when: null,
    title: 'Retenue à la source sur les contrats logiciels importants',
    text: "Au-delà de Rs 300 000 versés à un prestataire logiciel dans un même contrat, une retenue de 1% s'applique.",
    officialText: "Une retenue à la source de 1% est applicable aux paiements dépassant Rs 300 000 dans le cadre d'un même contrat portant sur des licences ou services logiciels. Cette mesure concerne les entreprises et individus versant ce type de rémunération à Maurice.",
    source: { ref: '§9.2.2(a)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: isEntrepreneur },

  { id: 'made_in_moris', section: 'entreprise', direction: 'neutral', when: null,
    title: 'Label Made in Moris : exigence de preuve renforcée',
    text: "Pour bénéficier de la préférence de 40% dans les marchés publics, une preuve de production locale sera désormais requise.",
    officialText: "Pour bénéficier de la préférence de 40% accordée aux entreprises locales dans les marchés publics, une preuve documentaire de production réellement locale sera désormais requise. Cette exigence est administrée par le Procurement Policy Office.",
    source: { ref: '§19(a)', organisme: 'Procurement Policy Office' },
    condition: isEntrepreneur },

  { id: 'hotel_allocation', section: 'entreprise', direction: 'negative', when: null,
    title: "Allègement fiscal réduit sur les investissements hôteliers",
    text: "L'allègement fiscal annuel sur les dépenses en capital des hôtels passe de 30% à 15%.",
    officialText: "L'allocation annuelle en capital accordée aux hôtels au titre des investissements hôteliers est réduite de 30% à 15%. Cette réduction du taux d'amortissement fiscal s'applique aux nouvelles dépenses en capital déclarées par ce secteur.",
    source: { ref: '§1.10', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('tourisme') },

  { id: 'tva_devises', section: 'entreprise', direction: 'negative', when: null,
    title: '50% de la TVA hébergement à remettre en devises',
    text: "Les hôtels et résidences touristiques devront remettre 50% de la TVA collectée en devises étrangères.",
    officialText: "Les établissements hôteliers et résidences touristiques enregistrés à la TVA sont tenus de reverser 50% de la TVA collectée en devises étrangères. Cette obligation vise à renforcer les entrées de devises dans l'économie mauricienne.",
    source: { ref: '§6(f)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('tourisme') },

  { id: 'evenements_intl', section: 'entreprise', direction: 'positive', when: null,
    title: "Exonération de TVA élargie aux événements internationaux",
    text: "Les compétitions sportives internationales et cérémonies de récompenses télé/cinéma sont couvertes pour l'hébergement.",
    officialText: "L'exonération de TVA sur l'hébergement est étendue aux compétitions sportives internationales et aux cérémonies de récompenses télévisuelles ou cinématographiques. Cette exonération ne s'applique pas aux championnats ou ligues organisés par des fédérations sportives régionales ou internationales.",
    source: { ref: '§6(h)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('tourisme'),
    opportunity: true,
    actionTip: "Cette exonération de TVA s'applique à l'hébergement lors de compétitions sportives internationales ou de cérémonies de récompenses télévisuelles ou cinématographiques. Elle ne couvre pas les championnats ou ligues de fédérations sportives. Les conditions précises sont à vérifier auprès de la MRA." },

  { id: 'sez_cote_dor', section: 'entreprise', direction: 'positive', when: null,
    title: "Nouvelle zone économique dédiée à l'IA et au digital",
    text: "À Côte d'Or : propriété étrangère à 100%, tarif électrique préférentiel et exonérations diverses.",
    officialText: "Une zone économique spéciale axée sur les technologies numériques et l'intelligence artificielle est créée à Côte d'Or. Les entreprises qui s'y implantent bénéficient de la propriété étrangère à 100%, d'un tarif électrique préférentiel et d'exonérations fiscales spécifiques définies dans le cadre de l'EDB.",
    source: { ref: '§12.2', organisme: 'Economic Development Board (EDB)' },
    condition: sect('tech'),
    opportunity: true,
    actionTip: "La zone Côte d'Or offre propriété étrangère à 100%, tarifs électriques préférentiels et exonérations fiscales spécifiques aux entreprises technologiques et digitales. Les modalités complètes d'accès et d'éligibilité sont disponibles auprès de l'Economic Development Board (EDB)." },

  { id: 'credit_ia', section: 'entreprise', direction: 'positive', when: "jusqu'en juin 2029",
    title: "Crédit d'impôt étendu à l'intelligence artificielle",
    text: "45% de crédit d'impôt sur 3 ans pour les solutions d'IA, en plus des machines et équipements.",
    officialText: "Le crédit d'impôt sur l'investissement existant, de 45% étalé sur 3 ans, est étendu aux dépenses en solutions d'intelligence artificielle, en plus des machines et équipements déjà éligibles. Ce crédit est prolongé jusqu'au 30 juin 2029.",
    source: { ref: '§1.8', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('tech'),
    opportunity: true,
    actionTip: "Ce crédit d'impôt de 45% sur 3 ans couvre désormais les solutions d'intelligence artificielle, en plus des machines et équipements. Les critères d'éligibilité précis et les modalités de déclaration sont à vérifier auprès de la Mauritius Revenue Authority avant le 30 juin 2029." },

  { id: 'ict_etranger_taxe', section: 'entreprise', direction: 'neutral', when: null,
    title: 'Les fournisseurs étrangers de logiciels désormais taxés à Maurice',
    text: "Cette mesure pourrait se répercuter sur le prix de certains services SaaS étrangers que vous utilisez.",
    officialText: "Les fournisseurs étrangers de services numériques et de logiciels sont désormais soumis à une obligation d'enregistrement à la TVA à Maurice, au-delà d'un certain seuil de prestations réalisées auprès de clients locaux. Cette mesure s'applique aux plateformes et éditeurs établis hors de Maurice.",
    source: { ref: '§1.6', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('tech') },

  { id: 'credit_investissement_manuf', section: 'entreprise', direction: 'positive', when: "jusqu'en juin 2029",
    title: "Crédit d'impôt prolongé sur les machines",
    text: "45% de crédit d'impôt sur 3 ans pour l'achat de machines et équipements.",
    officialText: "Le crédit d'impôt sur l'investissement de 45% étalé sur 3 ans s'applique aux achats de machines et équipements de production. Ce crédit est prolongé jusqu'au 30 juin 2029 pour les entreprises du secteur manufacturier.",
    source: { ref: '§1.8', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('manufacturing'),
    opportunity: true,
    actionTip: "Ce crédit d'impôt de 45% sur 3 ans s'applique aux achats de machines et équipements de production jusqu'en juin 2029. Les critères d'éligibilité et les modalités de déclaration sont à vérifier directement auprès de la Mauritius Revenue Authority." },

  { id: 'expat_solaire', section: 'entreprise', direction: 'positive', when: null,
    title: "Avantage fiscal pour les employés expatriés du secteur solaire",
    text: "4 ans d'exonération d'impôt pour un employé expatrié qualifié dans la fabrication de panneaux solaires.",
    officialText: "Un avantage fiscal de 4 ans d'exonération d'impôt sur le revenu est accordé à tout employé expatrié qualifié recruté dans le secteur de la fabrication de panneaux solaires. Cette mesure vise à encourager le transfert de compétences dans la filière solaire à Maurice.",
    source: { ref: '§1.1(a)', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: sect('manufacturing'),
    opportunity: true,
    actionTip: "Cette exonération fiscale de 4 ans concerne l'impôt sur le revenu d'un employé expatrié qualifié dans la fabrication de panneaux solaires. Les conditions précises d'éligibilité sont à confirmer auprès de la Mauritius Revenue Authority." },

  // EXPATRIÉ / NON-MAURICIEN
  { id: 'eta_digitale', section: 'expatrie', direction: 'neutral', when: null,
    title: "Autorisation de voyage numérique obligatoire",
    text: "Tous les non-citoyens devront demander une Electronic Travel Authorisation en ligne, contre un frais, avant de voyager.",
    officialText: "Une autorisation de voyage électronique (ETA) sera rendue obligatoire pour tout non-citoyen souhaitant se rendre à Maurice. La demande s'effectuera en ligne, contre le paiement d'un frais, avant le départ du pays d'origine.",
    source: { ref: '§46(c)', organisme: 'Passport and Immigration Office (PIO)' },
    condition: isExpatrie },

  { id: 'permis_format', section: 'expatrie', direction: 'positive', when: null,
    title: "Permis de résidence disponible en format numérique",
    text: "Le permis de résidence pourra désormais être délivré sous forme numérique, en carte ou en version papier.",
    officialText: "Le permis de résidence pourra désormais être délivré sous trois formats : numérique, sous forme de carte physique, ou sous forme papier. Cette diversification facilite les démarches administratives des résidents étrangers à Maurice.",
    source: { ref: '§46(d)', organisme: 'Passport and Immigration Office (PIO)' },
    condition: isExpatrie },

  { id: 'fee_tax_residence', section: 'expatrie', direction: 'negative', when: null,
    title: "Hausse du coût du certificat de résidence fiscale",
    text: "Le frais passe de USD 200 à USD 500 pour la plupart des demandeurs individuels.",
    officialText: "Les frais de délivrance du certificat de résidence fiscale sont relevés de USD 200 à USD 500 pour la majorité des demandeurs individuels. Cette révision tarifaire s'applique aux démarches effectuées auprès de la MRA.",
    source: { ref: '§9.2.4', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: isExpatrie },

  { id: 'family_permit_aboli', section: 'expatrie', direction: 'negative', when: null,
    title: "Suppression du permis 'Family Occupation Permit'",
    text: "Les familles devront recourir à d'autres catégories de permis pour faire venir un proche à Maurice.",
    officialText: "La catégorie de permis 'Family Occupation Permit' est supprimée. Les personnes souhaitant rejoindre un membre de leur famille à Maurice devront avoir recours aux autres catégories de permis disponibles selon leur situation.",
    source: { ref: '§37(b)(v)', organisme: 'Economic Development Board (EDB)' },
    condition: isExpatrie },

  { id: 'occupation_permit_pro', section: 'expatrie', direction: 'neutral', when: null,
    title: "Fusion des permis ProPass et Expert Pass",
    text: "Ces deux catégories fusionnent, avec un salaire minimum de Rs 50 000 dans tous les secteurs.",
    officialText: "Les catégories ProPass et Expert Pass sont fusionnées en une nouvelle catégorie unique de permis professionnel. Un salaire minimum de Rs 50 000 par mois est requis pour l'ensemble des secteurs d'activité couverts par ce permis.",
    source: { ref: '§37(b)(ii)', organisme: 'Economic Development Board (EDB)' },
    condition: expatDetail('permis_pro') },

  { id: 'permis_conjoint', section: 'expatrie', direction: 'positive', when: null,
    title: "Démarches simplifiées pour les conjoint·e·s de Mauricien·ne·s",
    text: "Un document officiel étranger attestant du statut marital pourra suffire pour la demande de permis.",
    officialText: "Les conjoints de citoyens mauriciens peuvent désormais présenter un document officiel étranger attestant de leur statut marital pour appuyer leur demande de permis de résidence. Cette simplification des pièces justificatives est mise en œuvre par le Passport and Immigration Office.",
    source: { ref: '§46(a)', organisme: 'Passport and Immigration Office (PIO)' },
    condition: expatDetail('conjoint') },

  { id: 'frais_conjoint', section: 'expatrie', direction: 'negative', when: null,
    title: "Nouveau frais de USD 50 sur la demande de permis",
    text: "Ce frais est désormais étendu aux conjoint·e·s de citoyens mauriciens et à leurs personnes à charge.",
    officialText: "Un frais de USD 50 est instauré pour les demandes de permis déposées par les conjoints de citoyens mauriciens et leurs personnes à charge. Ce frais est aligné sur celui déjà appliqué à d'autres catégories de demandeurs.",
    source: { ref: '§46(b)', organisme: 'Passport and Immigration Office (PIO)' },
    condition: expatDetail('conjoint') },

  { id: 'occupation_permit_investisseur_expat', section: 'expatrie', direction: 'neutral', when: null,
    title: "Seuil d'investissement minimum fixé à USD 100 000",
    text: "Ce seuil s'applique à votre permis investisseur, avec un chiffre d'affaires minimum requis pour le renouvellement.",
    officialText: "Le permis investisseur destiné aux étrangers est soumis à un seuil d'investissement minimum de USD 100 000. Un chiffre d'affaires minimum est également requis pour le renouvellement du permis, selon les conditions définies par l'EDB.",
    source: { ref: '§37(b)(i)', organisme: 'Economic Development Board (EDB)' },
    condition: expatDetail('permis_investisseur') },

  // INVESTISSEUR
  { id: 'bonds_publics', section: 'investisseur', direction: 'positive', when: null,
    title: "Accès direct aux obligations d'État à long terme",
    text: "De nouvelles obligations à 25 et 30 ans sont désormais ouvertes à tous les investisseurs, y compris le grand public.",
    officialText: "De nouvelles séries d'obligations d'État à long terme, d'une durée de 25 et 30 ans, sont introduites et ouvertes à l'ensemble des investisseurs, y compris les particuliers. Ces instruments visent à diversifier les sources de financement de l'État et à offrir de nouveaux supports d'épargne longue durée.",
    source: { ref: '§11.10(a)(b)', organisme: 'Ministère des Finances / Banque de Maurice' },
    condition: isInvestisseur,
    opportunity: true,
    actionTip: "Des obligations d'État à 25 et 30 ans sont désormais ouvertes au grand public. Les modalités de souscription, les taux et les conditions précises sont disponibles auprès de la Banque de Maurice." },

  { id: 'golden_visa_residence', section: 'investisseur', direction: 'positive', when: null,
    title: "Le Golden Visa ouvre droit à la résidence permanente",
    text: "Après un investissement de USD 1 million, vous pourrez demander un permis de résidence permanente à Maurice.",
    officialText: "Le programme Golden Visa, accessible via un investissement minimum de USD 1 million, ouvre désormais droit à une demande de permis de résidence permanente à Maurice. Les modalités de délivrance et les conditions précises sont gérées par l'Economic Development Board.",
    source: { ref: '§12.1', organisme: 'Economic Development Board (EDB)' },
    condition: investDetail('golden_visa'),
    opportunity: true,
    actionTip: "Le programme Golden Visa via un investissement de USD 1 million ouvre désormais droit à une demande de résidence permanente. Les conditions complètes et les démarches sont disponibles auprès de l'Economic Development Board (EDB)." },

  { id: 'golden_visa_fiscal', section: 'investisseur', direction: 'positive', when: null,
    title: "Des revenus étrangers peu imposés s'ils ne sont pas rapatriés",
    text: "Les dépenses locales réglées via une carte étrangère ne sont pas considérées comme un rapatriement de revenus.",
    officialText: "Dans le cadre du régime Golden Visa, les dépenses effectuées localement via une carte bancaire étrangère ne sont pas assimilées à un rapatriement de revenus étrangers à Maurice. Cette disposition a une incidence sur le traitement fiscal des revenus de source étrangère.",
    source: { ref: '§12.1', organisme: 'Economic Development Board (EDB) / Mauritius Revenue Authority (MRA)' },
    condition: investDetail('golden_visa'),
    opportunity: true,
    actionTip: "Cette disposition précise que les dépenses locales effectuées par carte étrangère ne constituent pas un rapatriement de revenus à Maurice. Les implications fiscales personnelles de cette règle méritent d'être examinées avec un conseiller fiscal agréé." },

  { id: 'golden_visa_domestique', section: 'investisseur', direction: 'positive', when: null,
    title: "Traitement accéléré pour les permis du personnel domestique",
    text: "Les demandes pour le personnel de maison accompagnant un Golden Visa seront traitées en 5 jours ouvrables.",
    officialText: "Les demandes de permis de travail pour le personnel domestique accompagnant un titulaire de Golden Visa seront traitées dans un délai de cinq jours ouvrables. Cette procédure accélérée est mise en œuvre par le Passport and Immigration Office.",
    source: { ref: '§12.1', organisme: 'Passport and Immigration Office (PIO) / Economic Development Board (EDB)' },
    condition: investDetail('golden_visa') },

  { id: 'sez_investisseur', section: 'investisseur', direction: 'positive', when: null,
    title: "Fortes incitations pour investir dans la zone Côte d'Or",
    text: "Propriété étrangère à 100%, baux longs renouvelables et loyers réduits pendant 10 ans pour les promoteurs.",
    officialText: "La zone économique spéciale de Côte d'Or offre aux promoteurs des baux longue durée renouvelables, une propriété étrangère à 100% et des loyers préférentiels pendant les dix premières années d'exploitation. Ces conditions sont définies dans le cadre réglementaire de l'EDB.",
    source: { ref: '§12.2', organisme: 'Economic Development Board (EDB)' },
    condition: investDetail('immobilier_sez'),
    opportunity: true,
    actionTip: "La zone Côte d'Or propose des baux longue durée renouvelables, propriété étrangère à 100% et loyers réduits pendant 10 ans. Les détails et procédures d'accès sont disponibles auprès de l'Economic Development Board (EDB)." },

  { id: 'edb_property', section: 'investisseur', direction: 'neutral', when: null,
    title: "Révision en cours des droits sur les programmes EDB",
    text: "Les droits et taxes applicables au transfert de propriétés résidentielles sous ces schémas seront ajustés.",
    officialText: "Une révision des droits et taxes applicables au transfert de propriété résidentielle dans le cadre des programmes EDB est en cours. Les nouveaux barèmes seront précisés dans les textes réglementaires à venir.",
    source: { ref: '§8.4', organisme: "Economic Development Board (EDB) / Registrar-General's Department" },
    condition: investDetail('immobilier_sez') },

  { id: 'credit_investissement_capital_local', section: 'investisseur', direction: 'positive', when: "jusqu'en juin 2029",
    title: "Crédit d'impôt pour l'investissement dans une entreprise locale",
    text: "45% de crédit d'impôt sur 3 ans pour l'achat de machines, équipements ou solutions IA par l'entreprise.",
    officialText: "Les entreprises locales dans lesquelles vous investissez peuvent bénéficier d'un crédit d'impôt de 45% sur 3 ans pour leurs achats de machines, équipements de production ou solutions d'intelligence artificielle. Ce crédit est disponible jusqu'au 30 juin 2029.",
    source: { ref: '§1.8', organisme: 'Mauritius Revenue Authority (MRA)' },
    condition: investDetail('capital_local'),
    opportunity: true,
    actionTip: "Ce crédit d'impôt peut bénéficier aux entreprises locales dans lesquelles vous investissez pour leurs achats de machines, équipements ou solutions IA jusqu'en juin 2029. Les critères d'éligibilité et les modalités sont à vérifier auprès de la MRA." },

  { id: 'dividendes_exclus_sap', section: 'investisseur', direction: 'positive', when: null,
    title: "Les dividendes exclus du test de ressources de la pension",
    text: "Si vous percevez un jour la pension SAP, vos dividendes et intérêts ne seront pas comptés dans le calcul qui pourrait la réduire.",
    officialText: "Les dividendes provenant d'actions de sociétés mauriciennes et les revenus d'intérêts sont explicitement exclus de l'assiette de revenus retenue pour le calcul du test de ressources de la SAP. Contrairement aux revenus d'emploi, de commerce ou de location, ils ne réduisent pas le montant de la pension.",
    source: { ref: '§27.8(c)', organisme: 'Ministère de l\'Intégration Sociale, de la Sécurité Sociale et de la Solidarité Nationale' },
    condition: investDetail('actions_dividendes'),
    opportunity: true,
    actionTip: "Selon le budget, les dividendes et intérêts sont explicitement exclus du calcul du test de ressources de la SAP, contrairement aux revenus d'emploi ou de location. Les implications patrimoniales de cette disposition méritent d'être examinées avec un conseiller financier ou fiscal agréé." },
];

const SECTIONS = [
  { id: 'quotidien', label: 'Au quotidien', icon: ShoppingBag },
  { id: 'transparence', label: 'Contrôles & déclarations', icon: ShieldCheck },
  { id: 'voiture', label: 'Votre voiture', icon: Car },
  { id: 'logement', label: 'Votre logement', icon: Home },
  { id: 'famille', label: 'Famille', icon: Users },
  { id: 'retraite', label: 'Votre retraite', icon: PiggyBank },
  { id: 'travail', label: 'Travail & cotisations', icon: Briefcase },
  { id: 'entreprise', label: 'Votre entreprise', icon: Building2 },
  { id: 'expatrie', label: 'Statut de résident·e étranger·ère', icon: Globe },
  { id: 'investisseur', label: 'Votre investissement', icon: TrendingUp },
];

const AGE_LABELS = { jeune: 'Moins de 26 ans', actif: '26 à 59 ans', senior: '60 ans et plus' };
const SITUATION_LABELS = {
  salarie: 'Salarié·e', independant: 'Entrepreneur·e', retraite: 'Retraité·e',
  etudiant: 'Étudiant·e', expatrie: 'Expatrié·e', investisseur: 'Investisseur·euse',
};
const DETAIL_LABELS = {
  tourisme: 'Tourisme', tech: 'Tech / Digital', manufacturing: 'Manufacturing', autre: 'Autre secteur',
  golden_visa: 'Golden Visa', immobilier_sez: 'Immobilier / SEZ', obligations: "Obligations d'État",
  capital_local: 'Capital local', actions_dividendes: 'Actions / dividendes',
  permis_pro: 'Permis pro', permis_investisseur: 'Permis investisseur',
  conjoint: 'Conjoint·e', retraite_etranger: 'Retraité·e',
};

const DIRECTION_META = {
  positive: { icon: Check, bg: COLORS.posBg, text: COLORS.posText, label: 'Bonne nouvelle' },
  negative: { icon: AlertTriangle, bg: COLORS.negBg, text: COLORS.negText, label: 'À surveiller' },
  neutral: { icon: Info, bg: COLORS.neuBg, text: COLORS.neuText, label: 'À savoir' },
};

function FlagStripe({ height = 8 }) {
  return (
    <div className="flex w-full overflow-hidden rounded-full" style={{ height }} aria-hidden="true">
      {COLORS.flag.map((c, i) => <div key={i} style={{ background: c, flex: 1 }} />)}
    </div>
  );
}

function ProgressBar({ total, current }) {
  const pct = Math.max(4, Math.round((current / total) * 100));
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.inkSoft }}>Étape {current} sur {total}</span>
        <span className="text-xs font-semibold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.lagoon }}>{pct}%</span>
      </div>
      <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#DCD3BC' }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: COLORS.lagoon, transition: 'width 0.3s ease' }} />
      </div>
    </div>
  );
}

function BackButton({ onClick }) {
  return (
    <button onClick={onClick} className="back-btn flex items-center gap-1 mb-4 text-sm font-semibold" style={{ color: COLORS.inkSoft }}>
      <ArrowLeft size={16} /> Retour
    </button>
  );
}

function OptionButton({ label, onClick }) {
  return (
    <button onClick={onClick} className="tap-card w-full text-left rounded-2xl border-2 px-5 py-4 mb-3">
      <span className="text-lg font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>{label}</span>
    </button>
  );
}

function ToggleCard({ label, checked, onClick }) {
  return (
    <button onClick={onClick} aria-pressed={checked} className="tap-card w-full flex items-center justify-between text-left rounded-2xl border-2 px-5 py-4 mb-3"
      style={{ background: checked ? COLORS.posBg : COLORS.card, borderColor: checked ? COLORS.lagoon : COLORS.border }}>
      <span className="text-base font-bold pr-3" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>{label}</span>
      <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 26, height: 26, background: checked ? COLORS.lagoon : 'transparent', border: `2px solid ${checked ? COLORS.lagoon : '#CFC6AE'}` }}>
        {checked && <Check size={15} color="#fff" strokeWidth={3} />}
      </span>
    </button>
  );
}

function DirectionBadge({ direction }) {
  const d = DIRECTION_META[direction];
  const Icon = d.icon;
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: d.bg, color: d.text }}>
      <Icon size={13} strokeWidth={2.5} />{d.label}
    </span>
  );
}

function OpportunityTag() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold" style={{ background: COLORS.oppBg, color: COLORS.oppAccent }}>
      <Sparkles size={11} strokeWidth={2.5} />Opportunité
    </span>
  );
}

function SourceBlock({ source, borderColor, accentColor }) {
  return (
    <div className="flex items-start gap-2 rounded-xl px-3 py-2 mt-3" style={{ background: COLORS.neuBg }}>
      <Info size={13} color={accentColor || COLORS.neuText} style={{ marginTop: 2, flexShrink: 0 }} />
      <div>
        <span className="text-xs font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: accentColor || COLORS.neuText }}>{source.ref}</span>
        <span className="text-xs" style={{ color: COLORS.inkSoft }}> · {source.organisme}</span>
      </div>
    </div>
  );
}

function ItemCard({ item, anchorId }) {
  const [open, setOpen] = useState(false);
  return (
    <div id={anchorId} className="rounded-2xl border mb-3 overflow-hidden"
      style={{ background: COLORS.card, borderColor: open ? COLORS.lagoon : COLORS.border, transition: 'border-color 0.15s ease', scrollMarginTop: 180 }}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-4" aria-expanded={open}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <DirectionBadge direction={item.direction} />
            {item.opportunity && <OpportunityTag />}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {item.when && <span className="text-xs whitespace-nowrap" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.inkSoft }}>{item.when}</span>}
            <ChevronDown size={18} color={COLORS.inkSoft} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
          </div>
        </div>
        <h3 className="text-base font-bold leading-snug mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>{item.title}</h3>
        <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>{item.text}</p>
      </button>
      {open && item.officialText && (
        <div className="px-4 pb-4">
          <div style={{ borderTop: `1px dashed ${COLORS.border}`, paddingTop: 12 }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.lagoon, letterSpacing: '0.06em' }}>
              Tel qu'énoncé dans le budget
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>{item.officialText}</p>
            {item.source && <SourceBlock source={item.source} accentColor={COLORS.neuText} />}
          </div>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border-2 overflow-hidden mb-3" style={{ background: COLORS.oppBg, borderColor: COLORS.oppBorder }}>
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-4" aria-expanded={open}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base font-bold leading-snug" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>{item.title}</h3>
          <ChevronDown size={18} color={COLORS.oppAccent} style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease', flexShrink: 0, marginTop: 2 }} />
        </div>
        <p className="text-sm leading-relaxed mb-3" style={{ color: COLORS.inkSoft }}>{item.text}</p>
        <div className="rounded-xl p-3" style={{ background: '#FFFCF7', border: `1px solid ${COLORS.oppBorder}` }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={13} color={COLORS.oppAccent} strokeWidth={2.5} />
            <span className="text-xs font-bold uppercase tracking-wide" style={{ color: COLORS.oppAccent, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: '0.06em' }}>À noter</span>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>{item.actionTip}</p>
        </div>
      </button>
      {open && item.officialText && (
        <div className="px-4 pb-4">
          <div style={{ borderTop: `1px dashed ${COLORS.oppBorder}`, paddingTop: 12 }}>
            <p className="text-xs font-bold uppercase tracking-wide mb-2" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.oppAccent, letterSpacing: '0.06em' }}>
              Tel qu'énoncé dans le budget
            </p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.ink }}>{item.officialText}</p>
            {item.source && (
              <div className="flex items-start gap-2 rounded-xl px-3 py-2 mt-3" style={{ background: '#FFFFFF', border: `1px solid ${COLORS.oppBorder}` }}>
                <Info size={13} color={COLORS.oppAccent} style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <span className="text-xs font-bold" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.oppAccent }}>{item.source.ref}</span>
                  <span className="text-xs" style={{ color: COLORS.inkSoft }}> · {item.source.organisme}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TornEdge() {
  return (
    <div aria-hidden="true" style={{ height: 14, background: `linear-gradient(45deg, transparent 50%, ${COLORS.card} 50%), linear-gradient(-45deg, transparent 50%, ${COLORS.card} 50%)`, backgroundSize: '18px 18px', backgroundPosition: 'top', backgroundRepeat: 'repeat-x' }} />
  );
}

export default function BudgetImpactApp() {
  const [history, setHistory] = useState(['intro']);
  const [detailQueueIndex, setDetailQueueIndex] = useState(0);
  const [profile, setProfile] = useState({
    mauricien: null, genre: null, age: null, situations: [], details: {}, revenu: null,
    proprietaire: false, voiture: false, enfants: false,
    pretPersonnel: false, locatif: false, crypto: false, invalidite: false,
  });

  const step = history[history.length - 1];
  const go = (next) => setHistory(h => [...h, next]);
  const back = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  const restart = () => {
    setHistory(['intro']); setDetailQueueIndex(0);
    setProfile({ mauricien: null, genre: null, age: null, situations: [], details: {}, revenu: null, proprietaire: false, voiture: false, enfants: false, pretPersonnel: false, locatif: false, crypto: false, invalidite: false });
  };

  const toggleSituation = (v) => setProfile(p => ({
    ...p, situations: p.situations.includes(v) ? p.situations.filter(s => s !== v) : [...p.situations, v],
  }));

  const detailQueue = profile.situations.filter(s => DETAIL_QUESTIONS[s]);
  const currentDetailSituation = detailQueue[detailQueueIndex];

  const confirmSituation = () => { setDetailQueueIndex(0); go(detailQueue.length > 0 ? 'detail' : 'revenu'); };
  const selectDetail = (v) => {
    setProfile(p => ({ ...p, details: { ...p.details, [currentDetailSituation]: v } }));
    if (detailQueueIndex + 1 < detailQueue.length) setDetailQueueIndex(i => i + 1);
    else go('revenu');
  };
  const backFromDetail = () => { if (detailQueueIndex > 0) setDetailQueueIndex(i => i - 1); else back(); };
  const selectRevenu = (v) => { setProfile(p => ({ ...p, revenu: v })); go('extras'); };
  const toggleExtra = (key) => setProfile(p => ({ ...p, [key]: !p[key] }));

  const sendAnalytics = (currentProfile) => {
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL === 'VOTRE_URL_ICI') return;
    const visible = MEASURES.filter(m => m.condition(currentProfile));
    const payload = {
      timestamp: new Date().toISOString(),
      mauricien: currentProfile.mauricien || '',
      genre: currentProfile.genre || 'non_renseigne',
      age: currentProfile.age || '',
      situations: currentProfile.situations.join(','),
      revenu: currentProfile.revenu || '',
      details: Object.values(currentProfile.details).join(','),
      proprietaire: currentProfile.proprietaire ? 1 : 0,
      voiture: currentProfile.voiture ? 1 : 0,
      enfants: currentProfile.enfants ? 1 : 0,
      pret_personnel: currentProfile.pretPersonnel ? 1 : 0,
      locatif: currentProfile.locatif ? 1 : 0,
      crypto: currentProfile.crypto ? 1 : 0,
      invalidite: currentProfile.invalidite ? 1 : 0,
      nb_mesures: visible.length,
      nb_opportunites: visible.filter(m => m.opportunity).length,
    };
    fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {});
  };

  const totalSteps = 6 + detailQueue.length;
  const detailStepNum = 4 + detailQueueIndex + 1;
  const revenuIndex = 5 + detailQueue.length;
  const extrasIndex = totalSteps;

  const visibleMeasures = MEASURES.filter(m => m.condition(profile));
  const counts = visibleMeasures.reduce((acc, m) => { acc[m.direction] = (acc[m.direction] || 0) + 1; return acc; }, {});
  const opportunityItems = visibleMeasures.filter(m => m.opportunity);
  const firstByDirection = {};
  ['positive', 'negative', 'neutral'].forEach(dir => {
    const first = visibleMeasures.find(m => m.direction === dir);
    if (first) firstByDirection[dir] = first.id;
  });

  const scrollToAnchor = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  const GENRE_LABELS = { homme: 'Homme', femme: 'Femme' };
  const profileSummary = [
    profile.mauricien && (profile.mauricien === 'oui' ? 'Mauricien·ne' : 'Non-mauricien·ne'),
    profile.genre && GENRE_LABELS[profile.genre],
    profile.age && AGE_LABELS[profile.age],
    profile.situations.map(s => SITUATION_LABELS[s]).filter(Boolean).join(' + ') || null,
    Object.values(profile.details).map(d => DETAIL_LABELS[d]).filter(Boolean).join(' + ') || null,
    profile.revenu && profile.revenu !== 'na' && REVENU_LABELS[profile.revenu],
  ].filter(Boolean).join(' · ');

  const retraiteFraming = isRetraiteCtx(profile);

  return (
    <div style={{ background: COLORS.page, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }} className="flex justify-center px-4 py-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=IBM+Plex+Mono:wght@500;600&family=Inter:wght@400;500;600&display=swap');
        .tap-card { background: ${COLORS.card}; border-color: ${COLORS.border}; transition: border-color 0.15s ease; cursor: pointer; }
        .tap-card:hover { border-color: ${COLORS.lagoon}; }
        .tap-card:focus-visible { outline: 3px solid ${COLORS.lagoon}; outline-offset: 2px; }
        .primary-btn { transition: filter 0.15s ease, transform 0.05s ease; cursor: pointer; }
        .primary-btn:hover { filter: brightness(0.93); }
        .primary-btn:active { transform: scale(0.98); }
        .primary-btn:disabled { cursor: not-allowed; }
        .primary-btn:focus-visible { outline: 3px solid ${COLORS.ink}; outline-offset: 2px; }
        .back-btn:hover { color: ${COLORS.ink} !important; }
        .badge-btn { transition: filter 0.15s ease; border: none; }
        .badge-btn:not(:disabled):hover { filter: brightness(0.93); }
        .badge-btn:focus-visible { outline: 3px solid ${COLORS.ink}; outline-offset: 2px; }
        .fade-in { animation: fadeIn 0.25s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-6">
          <div style={{ width: 32 }}><FlagStripe height={8} /></div>
          <span className="text-xs uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.inkSoft, letterSpacing: '0.08em' }}>Budget Maurice 2026–2027</span>
        </div>

        {step === 'intro' && (
          <div className="fade-in">
            <h1 className="text-3xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Qu'est-ce que ce budget change pour vous ?</h1>
            <p className="text-base leading-relaxed mb-8" style={{ color: COLORS.inkSoft }}>Le budget 2026-2027 comporte des centaines de mesures. Répondez à quelques questions pour identifier celles qui vous concernent vraiment. Aucune donnée n'est conservée.</p>
            <button onClick={() => go('nationalite')} className="primary-btn w-full text-white font-bold text-lg rounded-2xl py-4" style={{ background: COLORS.lagoon, fontFamily: "'Space Grotesk', sans-serif" }}>Commencer</button>
          </div>
        )}

        {step === 'nationalite' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={1} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Êtes-vous mauricien·ne ?</h2>
            <OptionButton label="Oui" onClick={() => { setProfile(p => ({ ...p, mauricien: 'oui' })); go('genre'); }} />
            <OptionButton label="Non" onClick={() => { setProfile(p => ({ ...p, mauricien: 'non' })); go('genre'); }} />
          </div>
        )}

        {step === 'genre' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={2} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Vous êtes…</h2>
            <OptionButton label="Un homme" onClick={() => { setProfile(p => ({ ...p, genre: 'homme' })); go('age'); }} />
            <OptionButton label="Une femme" onClick={() => { setProfile(p => ({ ...p, genre: 'femme' })); go('age'); }} />
            <OptionButton label="Préfère ne pas répondre" onClick={() => { setProfile(p => ({ ...p, genre: null })); go('age'); }} />
          </div>
        )}

        {step === 'age' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={3} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Quel âge avez-vous ?</h2>
            <OptionButton label="Moins de 26 ans" onClick={() => { setProfile(p => ({ ...p, age: 'jeune' })); go('situation'); }} />
            <OptionButton label="26 à 59 ans" onClick={() => { setProfile(p => ({ ...p, age: 'actif' })); go('situation'); }} />
            <OptionButton label="60 ans et plus" onClick={() => { setProfile(p => ({ ...p, age: 'senior' })); go('situation'); }} />
          </div>
        )}

        {step === 'situation' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={4} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Quelle est votre situation ?</h2>
            <p className="text-sm mb-5" style={{ color: COLORS.inkSoft }}>Plusieurs réponses possibles.</p>
            {[
              { v: 'salarie', l: 'Salarié·e' },
              { v: 'independant', l: "Indépendant·e ou chef d'entreprise" },
              { v: 'retraite', l: 'Retraité·e' },
              { v: 'etudiant', l: 'Étudiant·e' },
              { v: 'expatrie', l: 'Expatrié·e résidant à Maurice' },
              { v: 'investisseur', l: 'Investisseur·euse' },
            ].map(({ v, l }) => (
              <ToggleCard key={v} label={l} checked={profile.situations.includes(v)} onClick={() => toggleSituation(v)} />
            ))}
            <button onClick={confirmSituation} disabled={profile.situations.length === 0}
              className="primary-btn w-full text-white font-bold text-lg rounded-2xl py-4 mt-2"
              style={{ background: COLORS.lagoon, fontFamily: "'Space Grotesk', sans-serif", opacity: profile.situations.length === 0 ? 0.5 : 1 }}>
              Continuer
            </button>
          </div>
        )}

        {step === 'detail' && currentDetailSituation && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={detailStepNum} />
            <BackButton onClick={backFromDetail} />
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>
              {DETAIL_QUESTIONS[currentDetailSituation].question}
            </h2>
            {detailQueue.length > 1 && <p className="text-sm mb-5" style={{ color: COLORS.inkSoft }}>Pour votre profil {SITUATION_LABELS[currentDetailSituation]?.toLowerCase()}.</p>}
            {detailQueue.length === 1 && <div className="mb-4" />}
            {DETAIL_QUESTIONS[currentDetailSituation].options.map(opt => (
              <OptionButton key={opt.value} label={opt.label} onClick={() => selectDetail(opt.value)} />
            ))}
          </div>
        )}

        {step === 'revenu' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={revenuIndex} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>
              {retraiteFraming ? 'Quel était votre dernier salaire mensuel ?' : 'Quel est votre revenu mensuel ?'}
            </h2>
            <p className="text-sm mb-5" style={{ color: COLORS.inkSoft }}>
              {retraiteFraming ? "Ce repère correspond à votre dernier salaire avant la retraite. Il sert uniquement à estimer si le test de ressources sur la pension pourrait s'appliquer." : 'Cette information reste sur votre appareil et sert uniquement à préciser vos résultats.'}
            </p>
            {REVENU_OPTIONS.map(opt => <OptionButton key={opt.value} label={opt.label} onClick={() => selectRevenu(opt.value)} />)}
          </div>
        )}

        {step === 'extras' && (
          <div className="fade-in">
            <ProgressBar total={totalSteps} current={extrasIndex} />
            <BackButton onClick={back} />
            <h2 className="text-2xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Sélectionnez ce qui s'applique à vous</h2>
            <p className="text-sm mb-5" style={{ color: COLORS.inkSoft }}>Facultatif — vous pouvez passer cette étape.</p>
            <ToggleCard label="Propriétaire ou en projet d'achat" checked={profile.proprietaire} onClick={() => toggleExtra('proprietaire')} />
            <ToggleCard label="J'ai une voiture" checked={profile.voiture} onClick={() => toggleExtra('voiture')} />
            <ToggleCard label="J'ai des enfants scolarisés" checked={profile.enfants} onClick={() => toggleExtra('enfants')} />
            <ToggleCard label="J'ai un prêt personnel en cours" checked={profile.pretPersonnel} onClick={() => toggleExtra('pretPersonnel')} />
            <ToggleCard label="Je loue un bien immobilier (revenus locatifs)" checked={profile.locatif} onClick={() => toggleExtra('locatif')} />
            <ToggleCard label="Je détiens des cryptomonnaies" checked={profile.crypto} onClick={() => toggleExtra('crypto')} />
            <ToggleCard label="Je touche une allocation d'invalidité ou de soins" checked={profile.invalidite} onClick={() => toggleExtra('invalidite')} />
            <button onClick={() => { sendAnalytics(profile); go('results'); }} className="primary-btn w-full text-white font-bold text-lg rounded-2xl py-4 mt-2" style={{ background: COLORS.lagoon, fontFamily: "'Space Grotesk', sans-serif" }}>
              Voir mon impact
            </button>
          </div>
        )}

        {step === 'results' && (
          <div className="fade-in">
            <button onClick={restart} className="back-btn flex items-center gap-1 mb-4 text-sm font-semibold" style={{ color: COLORS.inkSoft }}>
              <RotateCcw size={15} /> Recommencer
            </button>

            <div className="rounded-t-3xl border border-b-0 px-5 pt-5 pb-4"
              style={{ background: COLORS.card, borderColor: COLORS.border, position: 'sticky', top: 0, zIndex: 20, boxShadow: '0 8px 16px -10px rgba(28,27,26,0.18)' }}>
              <h2 className="text-xl font-bold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink }}>Votre impact, en clair</h2>
              <p className="text-xs mb-4" style={{ fontFamily: "'IBM Plex Mono', monospace", color: COLORS.inkSoft }}>{profileSummary}</p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { dir: 'positive', label: `${counts.positive || 0} bonnes nouvelles`, bg: COLORS.posBg, text: COLORS.posText },
                  { dir: 'negative', label: `${counts.negative || 0} à surveiller`, bg: COLORS.negBg, text: COLORS.negText },
                  { dir: 'neutral', label: `${counts.neutral || 0} à savoir`, bg: COLORS.neuBg, text: COLORS.neuText },
                ].map(({ dir, label, bg, text }) => (
                  <button key={dir} onClick={() => firstByDirection[dir] && scrollToAnchor(`anchor-${dir}`)}
                    disabled={!firstByDirection[dir]}
                    className="badge-btn rounded-full px-3 py-1 text-xs font-bold cursor-pointer"
                    style={{ background: bg, color: text, opacity: firstByDirection[dir] ? 1 : 0.5 }}>
                    {label}
                  </button>
                ))}
                {opportunityItems.length > 0 && (
                  <button onClick={() => scrollToAnchor('anchor-opportunities')} className="badge-btn rounded-full px-3 py-1 text-xs font-bold cursor-pointer" style={{ background: COLORS.oppBg, color: COLORS.oppAccent }}>
                    {opportunityItems.length} opportunité{opportunityItems.length > 1 ? 's' : ''}
                  </button>
                )}
              </div>
            </div>
            <TornEdge />

            {opportunityItems.length > 0 && (
              <div id="anchor-opportunities" className="mb-6" style={{ scrollMarginTop: 180 }}>
                <div className="flex items-center gap-2 mb-1 mt-2">
                  <Sparkles size={18} color={COLORS.oppAccent} />
                  <h3 className="text-sm font-bold uppercase tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink, letterSpacing: '0.05em' }}>Opportunités à saisir</h3>
                </div>
                <p className="text-xs leading-relaxed mb-4" style={{ color: COLORS.inkSoft }}>
                  Ces mesures ne s'appliquent pas automatiquement. Ces informations sont données à titre indicatif et ne constituent pas un conseil financier, fiscal ou juridique. Consultez un professionnel agréé avant toute décision.
                </p>
                {opportunityItems.map(item => <OpportunityCard key={`opp-${item.id}`} item={item} />)}
              </div>
            )}

            <div className="pt-2">
              {SECTIONS.map(sec => {
                const items = visibleMeasures.filter(m => m.section === sec.id);
                if (items.length === 0) return null;
                const Icon = sec.icon;
                return (
                  <div key={sec.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-3 mt-2">
                      <Icon size={18} color={COLORS.lagoon} />
                      <h3 className="text-sm font-bold uppercase tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif", color: COLORS.ink, letterSpacing: '0.05em' }}>{sec.label}</h3>
                    </div>
                    {items.map(item => (
                      <ItemCard key={item.id} item={item} anchorId={firstByDirection[item.direction] === item.id ? `anchor-${item.direction}` : undefined} />
                    ))}
                  </div>
                );
              })}
            </div>

            <FlagStripe height={6} />
            <p className="text-xs leading-relaxed text-center mt-4 mb-2" style={{ color: COLORS.inkSoft }}>
              Basé sur l'Annexe au Discours du Budget 2026-2027. Simplifié pour la clarté — ne remplace pas un conseil professionnel. Les réponses sont collectées de manière anonyme à des fins statistiques, conformément à la Data Protection Act 2017.
            </p>
          </div>
        )}

        {step !== 'results' && (
          <div className="mt-10 pt-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <p className="text-xs text-center leading-relaxed" style={{ color: COLORS.inkSoft, opacity: 0.7 }}>
              Outil informatif — ne remplace pas un conseil professionnel.<br />
              Réponses anonymisées à des fins statistiques · Data Protection Act 2017.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
