// ── Onboarding Screen 1 & 2 translations ─────────────────────────────────────

export type LangCode6 = "en-US" | "es-MX" | "fr" | "pt-BR" | "ht" | "zh-CN";

export const LANG_TILES: { code: LangCode6; label: string }[] = [
  { code: "en-US", label: "English" },
  { code: "es-MX", label: "Español" },
  { code: "fr",    label: "Français" },
  { code: "pt-BR", label: "Português" },
  { code: "ht",    label: "Kreyòl Ayisyen" },
  { code: "zh-CN", label: "中文" },
];

// ── Screen 1 type ─────────────────────────────────────────────────────────────
export type S1 = {
  lang_title: string;
  lang_sub: string;
  privacy_note: string;
  tagline: string;
  what_title: string;
  what_body: string;
  nova_title: string;
  nova_body: string;
  mini_privacy_title: string;
  mini_privacy_body: string;
  mini_beta_title: string;
  mini_beta_body: string;
  mini_built_title: string;
  mini_built_body: string;
  beta_notice: string;
  check1: string;
  check2: string;
  skip_label: string;
  continue_btn: string;
  beginCheckin: string;
  subtitle1: string;
  subtitle2: string;
  companionSubtitle: string;
  feature1: string;
  feature2: string;
  feature3: string;
  feature4: string;
  page_label: string;
  page_sub: string;
  disclaimer: string;
  meetCompanion: string;
  beforeWeBegin: string;
};

// ── Screen 2 type ─────────────────────────────────────────────────────────────
export type S2 = {
  title: string;
  sub: string;
  name_label: string;
  name_ph: string;
  journey_label: string;
  journey_opts: string[];
  provider_label: string;
  yesno: string[];
  provider_modal: string;
  provider_modal_btn: string;
  meds_label: string;
  meds_modal: string;
  meds_modal_btn: string;
  pronouns_label: string;
  pronouns_opts: string[];
  pronouns_note: string;
  mood_label: string;
  mood_opts: string[];
  skip_label: string;
  start_btn: string;
  skip_btn: string;
  skip_hint: string;
  page_label: string;
  page_sub: string;
};

// ── Screen 1 translations ─────────────────────────────────────────────────────

const S1_EN: S1 = {
  lang_title: "Choose your language",
  lang_sub: "Start in the language that feels easiest and safest for you.",
  privacy_note: "This space is for people living with HIV. Everything here is private.",
  tagline: "You are not alone in this.",
  what_title: "What this space is",
  what_body: "A free AI wellness space for people recently diagnosed with HIV. If your mind is racing, you have questions after a visit, or you just need somewhere to land, this is here for you. The first year after diagnosis can feel overwhelming — full of questions, fear, and uncertainty. This space exists to walk beside you through that time, day or night, at your pace.",
  nova_title: "Meet Nova",
  nova_body: "Nova is your AI companion. She is not a doctor or therapist, but she is trained to listen with care, answer questions honestly, and help you find your footing. She knows about HIV treatment, stigma, relationships, and medications — and most importantly she knows how to be present with you when things feel hard. You can talk to her anytime, about anything, without judgment.",
  mini_privacy_title: "Privacy",
  mini_privacy_body: "No names, photos, or identifying information are required.",
  mini_beta_title: "Beta",
  mini_beta_body: "This project is still evolving, and your feedback helps shape it.",
  mini_built_title: "Built with purpose",
  mini_built_body: "Created by a social worker working directly with people living with HIV.",
  beta_notice: "🧪 Beta version · Not a clinical tool · In crisis, call 988 or emergency services.",
  check1: "I understand that Nova is an AI companion and not a doctor, therapist, or medical professional.",
  check2: "I understand that this app does not replace professional medical care or mental health treatment.",
  skip_label: "Do not show this page next time I open the app",
  continue_btn: "Continue",
  beginCheckin: "Begin your check-in",
  subtitle1: "A safe place for people newly diagnosed with HIV.",
  subtitle2: "Ask questions, find resources, or just talk.",
  companionSubtitle: "Your AI companion for the first year after diagnosis.",
  feature1: "Answer HIV questions",
  feature2: "Help you process emotions",
  feature3: "Guide you to resources",
  feature4: "Stay with you when things feel overwhelming",
  page_label: "Page 1 of 3",
  page_sub: "Language + welcome",
  disclaimer: "Beta version. This tool is still evolving and is not a clinical service. If you are in crisis, call 988 or emergency services.",
  meetCompanion: "Meet {{name}}",
  beforeWeBegin: "Before we begin",
};

const S1_ES: S1 = {
  lang_title: "Elige tu idioma",
  lang_sub: "Empieza en el idioma que te resulte más fácil y seguro.",
  privacy_note: "Este espacio es para personas que viven con VIH. Todo aquí es privado.",
  tagline: "No estás solo/a en esto.",
  what_title: "Qué es este espacio",
  what_body: "Un espacio gratuito de bienestar con IA para personas recientemente diagnosticadas con VIH. Si tu mente está acelerada, tienes preguntas después de una visita médica, o simplemente necesitas un lugar donde estar, esto está aquí para ti.",
  nova_title: "Conoce a Nova",
  nova_body: "Nova es tu compañera de IA. No es médica ni terapeuta, pero está entrenada para escuchar con cuidado, responder preguntas honestamente y ayudarte a encontrar tu equilibrio.",
  mini_privacy_title: "Privacidad",
  mini_privacy_body: "No se requieren nombres, fotos ni información de identificación.",
  mini_beta_title: "Beta",
  mini_beta_body: "Este proyecto sigue evolucionando, y tus comentarios ayudan a darle forma.",
  mini_built_title: "Construido con propósito",
  mini_built_body: "Creado por una trabajadora social que trabaja directamente con personas que viven con VIH.",
  beta_notice: "🧪 Versión beta · No es una herramienta clínica · En crisis, llama al 988 o servicios de emergencia.",
  check1: "Entiendo que Nova es una compañera de IA y no una doctora, terapeuta ni profesional médica.",
  check2: "Entiendo que esta aplicación no reemplaza la atención médica profesional ni el tratamiento de salud mental.",
  skip_label: "No mostrar esta página la próxima vez que abra la aplicación",
  continue_btn: "Continuar",
  beginCheckin: "Comenzar tu registro",
  subtitle1: "Un lugar seguro para personas recién diagnosticadas con VIH.",
  subtitle2: "Haz preguntas, encuentra recursos o simplemente habla.",
  companionSubtitle: "Tu compañera de IA en el primer año tras el diagnóstico.",
  feature1: "Responder preguntas sobre el VIH",
  feature2: "Ayudarte a procesar emociones",
  feature3: "Orientarte hacia recursos",
  feature4: "Estar contigo cuando todo se sienta abrumador",
  page_label: "Página 1 de 3",
  page_sub: "Idioma + bienvenida",
  disclaimer: "Versión beta. Esta herramienta aún está evolucionando y no es un servicio clínico. Si estás en crisis, llama al 988 o a los servicios de emergencia.",
  meetCompanion: "Conoce a {{name}}",
  beforeWeBegin: "Antes de comenzar",
};

const S1_FR: S1 = {
  lang_title: "Choisissez votre langue",
  lang_sub: "Commencez dans la langue qui vous semble la plus facile et la plus sûre.",
  privacy_note: "Cet espace est pour les personnes vivant avec le VIH. Tout ici est privé.",
  tagline: "Vous n'êtes pas seul(e) dans tout cela.",
  what_title: "Ce qu'est cet espace",
  what_body: "Un espace gratuit de bien-être IA pour les personnes récemment diagnostiquées avec le VIH. Que votre esprit soit agité, que vous ayez des questions après une visite, ou que vous ayez besoin d'un endroit où poser, cet espace est là pour vous.",
  nova_title: "Rencontrez Nova",
  nova_body: "Nova est votre compagnon(ne) IA. Elle n'est pas médecin ni thérapeute, mais elle est formée pour écouter avec soin, répondre aux questions honnêtement et vous aider à trouver votre équilibre.",
  mini_privacy_title: "Confidentialité",
  mini_privacy_body: "Aucun nom, photo ni information d'identification n'est requis.",
  mini_beta_title: "Bêta",
  mini_beta_body: "Ce projet est en constante évolution, et vos retours contribuent à le façonner.",
  mini_built_title: "Construit avec intention",
  mini_built_body: "Créé par une travailleuse sociale travaillant directement avec des personnes vivant avec le VIH.",
  beta_notice: "🧪 Version bêta · Pas un outil clinique · En crise, appelez le 3114 ou les services d'urgence.",
  check1: "Je comprends que Nova est une compagnonne IA et non une médecin, thérapeute ou professionnelle médicale.",
  check2: "Je comprends que cette application ne remplace pas les soins médicaux professionnels ni le traitement de santé mentale.",
  skip_label: "Ne plus afficher cette page à l'ouverture de l'application",
  continue_btn: "Continuer",
  beginCheckin: "Commencer votre bilan",
  subtitle1: "Un endroit sûr pour les personnes récemment diagnostiquées avec le VIH.",
  subtitle2: "Posez des questions, trouvez des ressources ou parlez simplement.",
  companionSubtitle: "Votre compagne IA pour la première année après le diagnostic.",
  feature1: "Répondre aux questions sur le VIH",
  feature2: "Vous aider à traiter vos émotions",
  feature3: "Vous orienter vers des ressources",
  feature4: "Être là pour vous quand les choses semblent difficiles",
  page_label: "Page 1 sur 3",
  page_sub: "Langue + bienvenue",
  disclaimer: "Version bêta. Cet outil est en cours d'évolution et n'est pas un service clinique. Si vous êtes en crise, appelez le 3114 ou les services d'urgence.",
  meetCompanion: "Rencontrez {{name}}",
  beforeWeBegin: "Avant de commencer",
};

const S1_PT: S1 = {
  lang_title: "Escolha seu idioma",
  lang_sub: "Comece no idioma que parece mais fácil e seguro para você.",
  privacy_note: "Este espaço é para pessoas vivendo com HIV. Tudo aqui é privado.",
  tagline: "Você não está sozinho/a nisso.",
  what_title: "O que é este espaço",
  what_body: "Um espaço gratuito de bem-estar com IA para pessoas recentemente diagnosticadas com HIV. Se sua mente está acelerada, você tem perguntas após uma consulta, ou simplesmente precisa de um lugar para pousar, este espaço está aqui para você.",
  nova_title: "Conheça Nova",
  nova_body: "Nova é sua companheira de IA. Ela não é médica nem terapeuta, mas é treinada para ouvir com cuidado, responder perguntas honestamente e ajudá-lo/a a encontrar seu equilíbrio.",
  mini_privacy_title: "Privacidade",
  mini_privacy_body: "Não são necessários nomes, fotos ou informações de identificação.",
  mini_beta_title: "Beta",
  mini_beta_body: "Este projeto está em constante evolução, e seu feedback ajuda a moldá-lo.",
  mini_built_title: "Construído com propósito",
  mini_built_body: "Criado por uma assistente social que trabalha diretamente com pessoas vivendo com HIV.",
  beta_notice: "🧪 Versão beta · Não é uma ferramenta clínica · Em crise, ligue para 188 ou serviços de emergência.",
  check1: "Entendo que Nova é uma companheira de IA e não uma médica, terapeuta ou profissional de saúde.",
  check2: "Entendo que este aplicativo não substitui cuidados médicos profissionais ou tratamento de saúde mental.",
  skip_label: "Não mostrar esta página na próxima vez que abrir o aplicativo",
  continue_btn: "Continuar",
  beginCheckin: "Iniciar seu check-in",
  subtitle1: "Um lugar seguro para pessoas recém-diagnosticadas com HIV.",
  subtitle2: "Faça perguntas, encontre recursos ou apenas converse.",
  companionSubtitle: "Sua companheira de IA no primeiro ano após o diagnóstico.",
  feature1: "Responder perguntas sobre HIV",
  feature2: "Ajudar a processar emoções",
  feature3: "Orientar para recursos",
  feature4: "Estar com você quando as coisas parecerem difíceis",
  page_label: "Página 1 de 3",
  page_sub: "Idioma + boas-vindas",
  disclaimer: "Versão beta. Esta ferramenta ainda está evoluindo e não é um serviço clínico. Se você estiver em crise, ligue para 188 ou para os serviços de emergência.",
  meetCompanion: "Conheça {{name}}",
  beforeWeBegin: "Antes de começar",
};

const S1_HT: S1 = {
  lang_title: "Chwazi lang ou",
  lang_sub: "Kòmanse nan lang ki pi fasil e ki pi an sekirite pou ou.",
  privacy_note: "Espas sa a se pou moun k ap viv ak VIH. Tout bagay la prive.",
  tagline: "Ou pa pou kont ou nan sa a.",
  what_title: "Sa espas sa a ye",
  what_body: "Yon espas byennèt IA gratis pou moun ki fèk dyagnostike ak VIH. Si panse ou ap kouri, ou gen kesyon apre yon vizit, oswa ou jis bezwen yon kote pou poze, espas sa a la pou ou.",
  nova_title: "Rankontre Nova",
  nova_body: "Nova se konpayon IA ou. Li pa yon doktè oswa terapis, men li fòme pou koute ak swen, repon kesyon onètman, epi ede ou jwenn ekilibre ou.",
  mini_privacy_title: "Konfidansyalite",
  mini_privacy_body: "Pa gen non, foto, oswa enfòmasyon idantifikasyon ki obligatwa.",
  mini_beta_title: "Bèta",
  mini_beta_body: "Pwojè sa a ap evolye toujou, e kòmantè ou ede fòme li.",
  mini_built_title: "Bati ak rezon",
  mini_built_body: "Kreye pa yon travayè sosyal ki travay dirèkteman ak moun k ap viv ak VIH.",
  beta_notice: "🧪 Vèsyon bèta · Pa yon zouti klinik · Nan kriz, rele 988 oswa sèvis ijans.",
  check1: "Mwen konprann ke Nova se yon konpayon IA e pa yon doktè, terapis, oswa pwofesyonèl medikal.",
  check2: "Mwen konprann ke aplikasyon sa a pa ranplase swen medikal pwofesyonèl oswa tretman sante mantal.",
  skip_label: "Pa montre paj sa a pwochen fwa mwen ouvri aplikasyon an",
  continue_btn: "Kontinye",
  beginCheckin: "Kòmanse tchèk ou",
  subtitle1: "Yon kote an sekirite pou moun ki fèk dyagnostike ak VIH.",
  subtitle2: "Poze kesyon, jwenn resous oswa jis pale.",
  companionSubtitle: "Konpayon IA ou pou premye ane apre dyagnostik la.",
  feature1: "Repon kesyon sou VIH",
  feature2: "Ede ou trete emosyon ou",
  feature3: "Gide ou vè resous",
  feature4: "Rete avèk ou lè bagay yo sanble difisil",
  page_label: "Paj 1 sou 3",
  page_sub: "Lang + Byenveni",
  disclaimer: "Vèsyon bèta. Zouti sa a ap evolye toujou e se pa yon sèvis klinik. Si ou nan kriz, rele 988 oswa sèvis ijans.",
  meetCompanion: "Rankontre {{name}}",
  beforeWeBegin: "Anvan nou kòmanse",
};

const S1_ZH: S1 = {
  lang_title: "选择您的语言",
  lang_sub: "从您觉得最容易、最安全的语言开始。",
  privacy_note: "这个空间是为艾滋病毒感染者设立的。这里的一切都是私密的。",
  tagline: "在这件事上，您并不孤单。",
  what_title: "这个空间是什么",
  what_body: "这是一个为近期被诊断为艾滋病毒的人提供的免费AI健康空间。如果您思绪纷乱，在就诊后有疑问，或者只是需要一个落脚之处，这里为您而设。",
  nova_title: "认识Nova",
  nova_body: "Nova是您的AI伴侣。她不是医生或治疗师，但她经过训练，能够用心倾听、诚实地回答问题，并帮助您找到方向。",
  mini_privacy_title: "隐私",
  mini_privacy_body: "无需提供姓名、照片或识别信息。",
  mini_beta_title: "测试版",
  mini_beta_body: "这个项目仍在不断发展中，您的反馈有助于塑造它。",
  mini_built_title: "有目的地构建",
  mini_built_body: "由一位直接与艾滋病毒感染者合作的社会工作者创建。",
  beta_notice: "🧪 测试版 · 非临床工具 · 如遇危机，请拨打988或紧急服务。",
  check1: "我了解Nova是一个AI伴侣，而不是医生、治疗师或医疗专业人员。",
  check2: "我了解此应用程序不能取代专业医疗护理或心理健康治疗。",
  skip_label: "下次打开应用时不再显示此页面",
  continue_btn: "继续",
  beginCheckin: "开始您的签到",
  subtitle1: "为近期被诊断为艾滋病毒的人提供的安全空间。",
  subtitle2: "提问、查找资源或只是倾诉。",
  companionSubtitle: "您在诊断后第一年的AI伴侣。",
  feature1: "回答艾滋病毒问题",
  feature2: "帮助您处理情绪",
  feature3: "引导您找到资源",
  feature4: "当事情感到难以承受时陪伴您",
  page_label: "第1页，共3页",
  page_sub: "语言 + 欢迎",
  disclaimer: "测试版本。此工具仍在持续改进中，不是临床服务。如果您处于危机中，请拨打988或紧急服务。",
  meetCompanion: "认识{{name}}",
  beforeWeBegin: "在我们开始之前",
};

export const S1_STRINGS: Record<LangCode6, S1> = {
  "en-US": S1_EN,
  "es-MX": S1_ES,
  "fr":    S1_FR,
  "pt-BR": S1_PT,
  "ht":    S1_HT,
  "zh-CN": S1_ZH,
};

// ── Screen 2 translations ─────────────────────────────────────────────────────

const S2_EN: S2 = {
  title: "A quick check-in",
  sub: "This helps Nova meet you where you are. Skip anything you do not want to answer.",
  name_label: "What should I call you?",
  name_ph: "Name or nickname (optional)",
  journey_label: "Where are you in your HIV journey?",
  journey_opts: ["I was diagnosed today", "Within the last 3 months", "3–12 months ago", "More than a year ago", "Prefer not to say"],
  provider_label: "Do you have an HIV provider?",
  yesno: ["Yes", "No", "Prefer not to say"],
  provider_modal: "You do not have to figure this out alone. When we get to the chat just say the word and we will find someone safe, private, and friendly near you. You have already taken a brave step just by being here.",
  provider_modal_btn: "I am ready, let us go",
  meds_label: "Are you currently taking HIV medication?",
  meds_modal: "That is okay — starting medications is a big decision and there is no rush. When you are ready I will walk you through everything at your pace. No pressure, just support.",
  meds_modal_btn: "Got it, let us continue",
  pronouns_label: "What are your pronouns?",
  pronouns_opts: ["She/Her", "He/Him", "They/Them", "Ze/Zir", "Prefer not to say"],
  pronouns_note: "Optional — helps Nova address you the way you prefer",
  mood_label: "How are you feeling right now?",
  mood_opts: ["Scared", "Overwhelmed", "Numb", "Confused", "Sad", "Okay", "Prefer not to say"],
  skip_label: "Do not show this page next time I open the app",
  start_btn: "Start conversation",
  skip_btn: "Skip for now",
  skip_hint: "You can always add this later in your profile",
  page_label: "Page 2 of 3",
  page_sub: "Optional quick check-in",
};

const S2_ES: S2 = {
  title: "Un breve momento de conexión",
  sub: "Esto ayuda a Nova a encontrarte donde estás. Omite lo que no quieras responder.",
  name_label: "¿Cómo debo llamarte?",
  name_ph: "Nombre o apodo (opcional)",
  journey_label: "¿En qué punto de tu camino con el VIH estás?",
  journey_opts: ["Me diagnosticaron hoy", "En los últimos 3 meses", "De 3 a 12 meses", "Hace más de un año", "Prefiero no decir"],
  provider_label: "¿Tienes un proveedor de atención para el VIH?",
  yesno: ["Sí", "No", "Prefiero no decir"],
  provider_modal: "No tienes que resolver esto solo/a. Cuando lleguemos al chat, di la palabra y encontraremos a alguien seguro, privado y amigable cerca de ti. Ya diste un paso valiente solo con estar aquí.",
  provider_modal_btn: "Estoy listo/a, vamos",
  meds_label: "¿Estás tomando medicamentos para el VIH actualmente?",
  meds_modal: "Está bien — comenzar los medicamentos es una decisión grande y no hay prisa. Cuando estés listo/a, te guiaré a tu propio ritmo. Sin presión, solo apoyo.",
  meds_modal_btn: "Entendido, continuemos",
  pronouns_label: "¿Cuáles son tus pronombres?",
  pronouns_opts: ["Ella", "Él", "Elle/Elles", "Ze/Zir", "Prefiero no decir"],
  pronouns_note: "Opcional — ayuda a Nova a dirigirse a ti como prefieres",
  mood_label: "¿Cómo te sientes ahora mismo?",
  mood_opts: ["Asustado/a", "Abrumado/a", "Entumecido/a", "Confundido/a", "Triste", "Bien", "Prefiero no decir"],
  skip_label: "No mostrar esta página la próxima vez",
  start_btn: "Iniciar conversación",
  skip_btn: "Omitir por ahora",
  skip_hint: "Siempre puedes agregar esto más tarde en tu perfil",
  page_label: "Página 2 de 3",
  page_sub: "Momento de conexión opcional",
};

const S2_FR: S2 = {
  title: "Un bref bilan",
  sub: "Cela aide Nova à vous rejoindre là où vous êtes. Ignorez ce que vous ne souhaitez pas répondre.",
  name_label: "Comment dois-je vous appeler ?",
  name_ph: "Prénom ou surnom (facultatif)",
  journey_label: "Où en êtes-vous dans votre parcours avec le VIH ?",
  journey_opts: ["J'ai été diagnostiqué(e) aujourd'hui", "Au cours des 3 derniers mois", "Il y a 3 à 12 mois", "Il y a plus d'un an", "Je préfère ne pas dire"],
  provider_label: "Avez-vous un prestataire de soins pour le VIH ?",
  yesno: ["Oui", "Non", "Je préfère ne pas dire"],
  provider_modal: "Vous n'avez pas à résoudre cela seul(e). Lorsque nous arriverons au chat, dites-le et nous trouverons quelqu'un de sûr, privé et bienveillant près de vous. Vous avez déjà fait un pas courageux rien qu'en étant ici.",
  provider_modal_btn: "Je suis prêt(e), allons-y",
  meds_label: "Prenez-vous actuellement des médicaments contre le VIH ?",
  meds_modal: "C'est normal — commencer un traitement est une grande décision et rien ne presse. Quand vous serez prêt(e), je vous guiderai à votre rythme. Pas de pression, juste du soutien.",
  meds_modal_btn: "Compris, continuons",
  pronouns_label: "Quels sont vos pronoms ?",
  pronouns_opts: ["Elle", "Il", "Iel", "Ze/Zir", "Je préfère ne pas dire"],
  pronouns_note: "Facultatif — aide Nova à s'adresser à vous comme vous le souhaitez",
  mood_label: "Comment vous sentez-vous en ce moment ?",
  mood_opts: ["Effrayé(e)", "Dépassé(e)", "Engourdi(e)", "Confus(e)", "Triste", "Ça va", "Je préfère ne pas dire"],
  skip_label: "Ne plus afficher cette page la prochaine fois",
  start_btn: "Démarrer la conversation",
  skip_btn: "Ignorer pour l'instant",
  skip_hint: "Vous pouvez toujours ajouter cela plus tard dans votre profil",
  page_label: "Page 2 sur 3",
  page_sub: "Bilan rapide facultatif",
};

const S2_PT: S2 = {
  title: "Uma breve verificação",
  sub: "Isso ajuda Nova a encontrá-lo/a onde você está. Pule o que não quiser responder.",
  name_label: "Como devo te chamar?",
  name_ph: "Nome ou apelido (opcional)",
  journey_label: "Em que ponto da sua jornada com HIV você está?",
  journey_opts: ["Fui diagnosticado/a hoje", "Nos últimos 3 meses", "De 3 a 12 meses atrás", "Há mais de um ano", "Prefiro não dizer"],
  provider_label: "Você tem um médico especializado em HIV?",
  yesno: ["Sim", "Não", "Prefiro não dizer"],
  provider_modal: "Você não precisa resolver isso sozinho/a. Quando chegarmos ao chat, é só falar e vamos encontrar alguém seguro, privado e amigável perto de você. Você já deu um passo corajoso só por estar aqui.",
  provider_modal_btn: "Estou pronto/a, vamos lá",
  meds_label: "Você está tomando medicamentos para HIV atualmente?",
  meds_modal: "Tudo bem — começar medicamentos é uma grande decisão e não há pressa. Quando estiver pronto/a, vou te guiar no seu ritmo. Sem pressão, apenas apoio.",
  meds_modal_btn: "Entendi, vamos continuar",
  pronouns_label: "Quais são seus pronomes?",
  pronouns_opts: ["Ela", "Ele", "Elu", "Ze/Zir", "Prefiro não dizer"],
  pronouns_note: "Opcional — ajuda Nova a se dirigir a você como você prefere",
  mood_label: "Como você está se sentindo agora?",
  mood_opts: ["Assustado/a", "Sobrecarregado/a", "Entorpecido/a", "Confuso/a", "Triste", "Bem", "Prefiro não dizer"],
  skip_label: "Não mostrar esta página da próxima vez",
  start_btn: "Iniciar conversa",
  skip_btn: "Pular por agora",
  skip_hint: "Você sempre pode adicionar isso mais tarde no seu perfil",
  page_label: "Página 2 de 3",
  page_sub: "Verificação rápida opcional",
};

const S2_HT: S2 = {
  title: "Yon ti bilan rapid",
  sub: "Sa a ede Nova jwenn ou kote ou ye. Sote nenpòt bagay ou pa vle repon.",
  name_label: "Ki jan m ta dwe rele ou?",
  name_ph: "Non oswa ti non (opsyonèl)",
  journey_label: "Ki kote ou ye nan chemen VIH ou?",
  journey_opts: ["Yo dyagnostike m jodi a", "Nan dènye 3 mwa yo", "Ant 3 a 12 mwa pase", "Plis pase yon ane", "Mwen prefere pa di"],
  provider_label: "Eske ou gen yon pwofesyonèl sante pou VIH?",
  yesno: ["Wi", "Non", "Mwen prefere pa di"],
  provider_modal: "Ou pa oblije rezoud sa pou kont ou. Lè nou rive nan chat la, di yon mo epi nou pral jwenn yon moun ki an sekirite, prive, epi zanmitay tou pre ou. Ou deja fè yon pa kouraj jis pou ou la a.",
  provider_modal_btn: "Mwen prè, ann ale",
  meds_label: "Eske ou pran medikaman VIH kounye a?",
  meds_modal: "Sa bon — kòmanse medikaman se yon gwo desizyon e pa gen presyon. Lè ou prè, m ap gide ou nan pwòp ritmow. Pa gen presyon, jis sipò.",
  meds_modal_btn: "Konprann, ann kontinye",
  pronouns_label: "Ki pwonon ou itilize?",
  pronouns_opts: ["Li (fi)", "Li (gason)", "Yo", "Ze/Zir", "Mwen prefere pa di"],
  pronouns_note: "Opsyonèl — ede Nova adrese ou jan ou prefere",
  mood_label: "Ki jan ou santi ou kounye a?",
  mood_opts: ["Pè", "Depase", "Angoudi", "Konfize", "Tris", "Rzonab", "Mwen prefere pa di"],
  skip_label: "Pa montre paj sa pwochen fwa",
  start_btn: "Kòmanse konvèsasyon",
  skip_btn: "Sote pou kounye a",
  skip_hint: "Ou toujou ka ajoute sa pita nan pwofil ou",
  page_label: "Paj 2 sou 3",
  page_sub: "Bilan rapid opsyonèl",
};

const S2_ZH: S2 = {
  title: "快速签到",
  sub: "这有助于Nova在您所在的地方与您相遇。跳过任何您不想回答的问题。",
  name_label: "我应该怎么称呼您？",
  name_ph: "姓名或昵称（可选）",
  journey_label: "您在HIV之路上处于哪个阶段？",
  journey_opts: ["我今天被诊断", "在过去3个月内", "3至12个月前", "超过一年前", "不愿透露"],
  provider_label: "您有HIV医疗提供者吗？",
  yesno: ["是", "否", "不愿透露"],
  provider_modal: "您不必独自解决这个问题。当我们进入聊天时，说一声，我们会在您附近找到一个安全、私密且友善的人。仅仅是在这里，您已经迈出了勇敢的一步。",
  provider_modal_btn: "我准备好了，我们走吧",
  meds_label: "您目前正在服用HIV药物吗？",
  meds_modal: "没关系——开始服药是一个重大决定，不需要急于求成。当您准备好时，我会按照您的节奏引导您完成一切。没有压力，只有支持。",
  meds_modal_btn: "明白了，让我们继续",
  pronouns_label: "您使用什么代词？",
  pronouns_opts: ["她/她的", "他/他的", "他们/他们的", "Ze/Zir", "不愿透露"],
  pronouns_note: "可选 — 帮助Nova以您喜欢的方式称呼您",
  mood_label: "您现在感觉怎么样？",
  mood_opts: ["害怕", "不知所措", "麻木", "困惑", "悲伤", "还好", "不愿透露"],
  skip_label: "下次打开应用时不再显示此页面",
  start_btn: "开始对话",
  skip_btn: "暂时跳过",
  skip_hint: "您随时可以在个人资料中添加此内容",
  page_label: "第2页，共3页",
  page_sub: "可选快速签到",
};

export const S2_STRINGS: Record<LangCode6, S2> = {
  "en-US": S2_EN,
  "es-MX": S2_ES,
  "fr":    S2_FR,
  "pt-BR": S2_PT,
  "ht":    S2_HT,
  "zh-CN": S2_ZH,
};

export function getS1(code: string): S1 {
  return S1_STRINGS[(code as LangCode6)] ?? S1_EN;
}

export function getS2(code: string): S2 {
  return S2_STRINGS[(code as LangCode6)] ?? S2_EN;
}
