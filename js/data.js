/* Conteúdo do infográfico — extraído da pesquisa da dupla (seção 8 e seções 2–4). */
window.IOT = window.IOT || {};

IOT.GLOSSARY = {
  nr: ['5G NR', 'New Radio: a nova interface de rádio do 5G, padronizada pelo 3GPP.'],
  imt: ['IMT-2020', 'Programa da ITU que define os requisitos mínimos de uma rede 5G.'],
  '3gpp': ['3GPP', 'Consórcio que escreve as normas das redes celulares (4G, 5G), organizadas em Releases.'],
  mimo: ['Massive MIMO', 'Dezenas ou centenas de antenas na mesma estação, que formam feixes direcionados (beamforming) para cada usuário.'],
  slicing: ['Network slicing', 'Fatiamento: redes virtuais isoladas sobre a mesma infraestrutura física, cada uma com garantias próprias.'],
  mec: ['MEC / edge computing', 'Multi-access Edge Computing: processamento na borda da rede, perto do dispositivo, e não em uma nuvem distante.'],
  sa: ['5G SA', 'Standalone: rede 5G com núcleo (5G Core) próprio. Libera URLLC, fatiamento e RedCap.'],
  nsa: ['5G NSA', 'Non-Standalone: rádio 5G apoiado no núcleo do 4G. Entrega principalmente mais velocidade.'],
  lgpd: ['LGPD', 'Lei Geral de Proteção de Dados (Lei 13.709/2018), que regula o uso de dados pessoais no Brasil.'],
  nwdaf: ['NWDAF', 'Network Data Analytics Function: função do núcleo 5G que analisa dados da rede para prever congestionamentos e ajustar recursos.'],
  son: ['SON', 'Self-Organizing Networks: redes auto-organizáveis que otimizam antenas e economizam energia automaticamente.'],
  embb: ['eMBB', 'Enhanced Mobile Broadband: banda larga móvel de altíssima capacidade.'],
  urllc: ['URLLC', 'Ultra-Reliable Low-Latency Communications: comunicação ultraconfiável com latência mínima.'],
  mmtc: ['mMTC', 'Massive Machine-Type Communications: conexão massiva de dispositivos simples e de baixo consumo.'],
  redcap: ['RedCap', 'Reduced Capability (Release 17): 5G simplificado, com modem mais barato e econômico, para dispositivos intermediários.'],
  tsn: ['TSN', 'Time-Sensitive Networking: Ethernet industrial com sincronismo preciso, suportada pelo 5G a partir do Release 16.'],
  ntn: ['NTN', 'Non-Terrestrial Networks: integração do 5G com satélites, a partir do Release 17.'],
  cv2x: ['C-V2X', 'Cellular Vehicle-to-Everything: comunicação do veículo com outros veículos, com a infraestrutura e com pedestres.'],
  lpwan: ['LPWAN', 'Low-Power Wide-Area Network: redes de longo alcance e baixo consumo, como LoRaWAN, NB-IoT e LTE-M.']
};

IOT.PILLARS = {
  embb: {
    key: 'embb', name: 'eMBB', full: 'Enhanced Mobile Broadband',
    offer: 'Banda larga móvel de altíssima capacidade.',
    goals: 'Pico de até 20 Gbit/s (download) e ~100 Mbit/s de taxa experimentada pelo usuário.',
    iot: 'Câmeras 4K/8K, inspeção por vídeo com drones, realidade aumentada e virtual na manutenção, gêmeos digitais alimentados em tempo real.',
    need: 'Banda'
  },
  urllc: {
    key: 'urllc', name: 'URLLC', full: 'Ultra-Reliable Low-Latency Communications',
    offer: 'Comunicação ultraconfiável com latência mínima.',
    goals: 'Latência de ~1 ms na interface aérea e confiabilidade de 99,999%.',
    iot: 'Controle de robôs e máquinas em tempo real, veículos conectados (V2X), cirurgia e monitoramento remoto críticos, proteção de redes elétricas.',
    need: 'Latência e confiabilidade'
  },
  mmtc: {
    key: 'mmtc', name: 'mMTC', full: 'Massive Machine-Type Communications',
    offer: 'Conexão massiva de dispositivos simples e de baixo consumo.',
    goals: 'Até 1 milhão de dispositivos por km² e baterias de 10+ anos.',
    iot: 'Sensores em cidades inteligentes, medidores de água, gás e energia, agricultura de precisão e rastreamento em larga escala (via NB-IoT e LTE-M).',
    need: 'Densidade'
  }
};

IOT.GENS = [
  { id: '2g', g: '2G', when: 'anos 1990', for: 'Pessoas', who: 'p', text: 'Voz digital e mensagens de texto (SMS). O celular vira pessoal e móvel.' },
  { id: '3g', g: '3G', when: 'anos 2000', for: 'Pessoas', who: 'p', text: 'Internet móvel: e-mail, navegação e os primeiros aplicativos.' },
  { id: '4g', g: '4G', when: '2008 (3GPP Rel. 8)', for: 'Pessoas', who: 'p', text: 'Banda larga no smartphone: vídeo, redes sociais e streaming. A IoT foi "encaixada" depois, com NB-IoT e LTE-M.' },
  { id: '5g', g: '5G', when: '2019 no mundo · 2022 no Brasil', for: 'Pessoas e máquinas', who: 'pm', text: 'Primeira geração pensada desde o início também para máquinas: uma plataforma que une eMBB, URLLC e mMTC na mesma infraestrutura.' },
  { id: '6g', g: '6G', when: '~2030', for: 'Rede com IA nativa', who: 'ai', text: 'Em pesquisa. Pensado como uma rede nativamente baseada em IA, em que comunicação, computação e inteligência fazem parte da mesma infraestrutura.' }
];

IOT.SPECS = [
  { v: 20, dec: 0, unit: 'Gbit/s', label: 'Taxa de pico', note: '~20× o pico do 4G (LTE-Advanced, ~1 Gbit/s).', p: 'embb' },
  { v: 100, dec: 0, unit: 'Mbit/s', label: 'Taxa experimentada', note: 'O que o usuário sente na média, não só no pico.', p: 'embb' },
  { v: 1, dec: 0, unit: 'ms', label: 'Latência no rádio', note: 'Meta para aplicações críticas (URLLC).', p: 'urllc' },
  { v: 99.999, dec: 3, unit: '%', label: 'Confiabilidade', note: 'Os "cinco noves": no máximo 1 pacote perdido a cada 100 mil.', p: 'urllc' },
  { v: 1, dec: 0, unit: 'milhão/km²', label: 'Densidade de conexões', note: '10× a densidade do 4G (~100 mil/km²).', p: 'mmtc' },
  { v: 10, dec: 0, unit: '+ anos', label: 'Bateria de sensores', note: 'Dispositivos simples e de baixo consumo.', p: 'mmtc' },
  { v: 500, dec: 0, unit: 'km/h', label: 'Mobilidade', note: 'Conexão estável em trens de alta velocidade (4G: ~350 km/h).', p: 'urllc' },
  { v: 100, dec: 0, unit: '×', label: 'Eficiência energética', note: 'Muito mais dados por unidade de energia do que no 4G.', p: 'mmtc' },
  { v: 400, dec: 0, unit: 'MHz', label: 'Canal máximo (FR2)', note: 'Até 100 MHz em FR1 e 400 MHz em FR2 por portadora; no 4G, 20 MHz.', p: 'embb' }
];

/* Aplicações no triângulo: pesos [eMBB, mMTC, URLLC] (somam 1) */
IOT.APPS = [
  { n: 'Vídeo 4K/8K e streaming', w: [.9, .05, .05], d: 'Câmeras e telas de altíssima resolução precisam de banda.' },
  { n: 'Câmeras com análise de vídeo', w: [.65, .25, .1], d: 'Segurança pública e controle de qualidade com IA.' },
  { n: 'Drones com inspeção por vídeo', w: [.7, .1, .2], d: 'Imagem em alta definição transmitida durante o voo.' },
  { n: 'Realidade aumentada na manutenção', w: [.6, .05, .35], d: 'Técnico recebe instruções sobrepostas ao equipamento.' },
  { n: 'Gêmeo digital em tempo real', w: [.45, .2, .35], d: 'Cópia virtual da fábrica atualizada continuamente.' },
  { n: 'Casa e prédio inteligentes', w: [.35, .6, .05], d: 'Muitos dispositivos, com algum vídeo (câmeras, interfones).' },
  { n: 'Cidade inteligente', w: [.2, .75, .05], d: 'Iluminação, estacionamento, lixeiras e qualidade do ar.' },
  { n: 'Agricultura de precisão', w: [.08, .82, .1], d: 'Sensores de solo e clima espalhados pela lavoura.' },
  { n: 'Medidores de água, gás e energia', w: [.03, .94, .03], d: 'Milhões de medidores enviando poucos bytes por dia.' },
  { n: 'Rastreamento de cargas', w: [.1, .7, .2], d: 'Contêineres e frotas em larga escala.' },
  { n: 'Manutenção preditiva', w: [.1, .55, .35], d: 'Milhares de sensores de vibração e temperatura.' },
  { n: 'Proteção de redes elétricas', w: [.04, .3, .66], d: 'Subestações que reagem a falhas em milissegundos.' },
  { n: 'Cirurgia remota assistida', w: [.32, .02, .66], d: 'Vídeo de qualidade e comandos sem atraso.' },
  { n: 'Veículos conectados (C-V2X)', w: [.22, .05, .73], d: 'Alertas de colisão entre veículos, infraestrutura e pedestres.' },
  { n: 'Robôs e AGVs na fábrica', w: [.12, .08, .8], d: 'Controle de máquinas em tempo real, sem cabos.' }
];

IOT.BANDS = [
  { id: 'b700', f: 0.7e9, label: '700 MHz', fr: 'FR1 · faixa baixa', r: 1, cov: 5, cap: 1,
    range: 'vários km (10 km+ em área rural)',
    note: 'Grande alcance e boa penetração em prédios. Ideal para cobertura ampla, interior e áreas rurais.' },
  { id: 'b2300', f: 2.3e9, label: '2,3 GHz', fr: 'FR1 · faixa média', r: .5, cov: 3, cap: 2,
    range: '~1 a 3 km',
    note: 'Equilíbrio entre alcance e capacidade.' },
  { id: 'b3500', f: 3.5e9, label: '3,5 GHz', fr: 'FR1 · faixa média', r: .3, cov: 2, cap: 4,
    range: '~0,5 a 1,5 km (urbano)',
    note: 'Principal faixa do 5G no Brasil: canais de até 100 MHz, com massive MIMO e beamforming.' },
  { id: 'b26000', f: 26e9, label: '26 GHz', fr: 'FR2 · ondas milimétricas', r: .07, cov: 1, cap: 5,
    range: '~100 a 300 m, com visada',
    note: 'Capacidade enorme (canais de até 400 MHz) em áreas pequenas, como fábricas, estádios e hotspots. Sensível a obstáculos: paredes, árvores e até o corpo humano.' }
];

IOT.ENABLERS = [
  { id: 'sa', icon: 'i-core', t: '5G Standalone (SA)', rel: 15, s: 'Núcleo 5G próprio',
    d: 'Rede 5G com núcleo próprio, sem depender do núcleo 4G. É o que libera de fato URLLC, network slicing, RedCap e latência baixa. O 5G NSA, usado nas primeiras implantações, entrega principalmente mais velocidade.' },
  { id: 'slice', icon: 'i-slice', t: 'Network slicing', rel: 15, s: 'Redes virtuais isoladas',
    d: 'Cria redes virtuais isoladas sobre a mesma infraestrutura física, cada uma com garantias próprias de latência, banda e segurança. Exemplo: uma fatia para sensores de uma distribuidora de energia e outra para câmeras de segurança pública.' },
  { id: 'mec', icon: 'i-edge', t: 'Edge computing (MEC)', rel: 15, s: 'Processar perto',
    d: 'Processamento próximo do dispositivo, na borda da rede, e não em uma nuvem distante. Reduz latência e tráfego, permitindo análise de vídeo e IA em tempo real.' },
  { id: 'npn', icon: 'i-private', t: 'Redes privadas 5G', rel: 16, s: 'Fábrica, porto, mina',
    d: 'Rede 5G dedicada a uma fábrica, porto, mina ou fazenda, com controle total sobre cobertura, segurança e dados. Substitui cabos e redes Wi-Fi em ambientes industriais.' },
  { id: 'tsn', icon: 'i-clock', t: 'Integração com TSN', rel: 16, s: 'Sincronismo industrial',
    d: 'Suporte ao Time-Sensitive Networking (Release 16), permitindo que o 5G substitua cabos Ethernet industriais em aplicações que exigem sincronismo preciso.' },
  { id: 'pos', icon: 'i-pin', t: 'Posicionamento 5G', rel: 16, s: 'Precisão de metro',
    d: 'Localização com precisão de metro a submetro em ambientes internos, útil para rastrear ativos, empilhadeiras e robôs.' },
  { id: 'redcap', icon: 'i-chip', t: 'RedCap e eRedCap', rel: 17, s: '5G simplificado',
    d: 'Reduced Capability (Release 17) e enhanced RedCap (Release 18): versões simplificadas do 5G, com modems mais baratos e de menor consumo, para wearables, câmeras, sensores industriais e roteadores. Preenchem o espaço entre LTE-M/NB-IoT e o 5G completo e substituem o LTE Cat-1/Cat-4.' },
  { id: 'ntn', icon: 'i-sat', t: 'Redes não terrestres (NTN)', rel: 17, s: 'IoT via satélite',
    d: 'A partir do Release 17, o 5G passa a integrar satélites, levando conectividade IoT a áreas sem cobertura terrestre: agro, oceanos, florestas e mineração remota.' },
  { id: 'adv', icon: 'i-spark', t: '5G-Advanced e Ambient IoT', rel: 18, s: 'IA na rede · sem bateria',
    d: 'O 5G-Advanced (Releases 18 a 20) traz IA na rede, mais eficiência energética e estudos de Ambient IoT: dispositivos sem bateria que funcionam com energia captada do ambiente, como etiquetas para logística. É a ponte para o 6G.' }
];

/* Comparador: barras numéricas */
IOT.GAUGES = [
  { id: 'peak', label: 'Taxa de pico', unit: 'Gbit/s', g4: 1, g5: 20, max: 20, fmt: v => fmtNum(v, v < 10 ? 1 : 0), better: 'up', note4: 'LTE-Advanced', note5: 'meta IMT-2020' },
  { id: 'lat', label: 'Latência típica', unit: 'ms', g4: 40, g5: 10, max: 50, fmt: v => fmtNum(v, 0), better: 'down', note4: '30–50 ms', note5: '≤10 ms · 1 ms em URLLC', range4: [30, 50], tick5: 1 },
  { id: 'dens', label: 'Densidade de dispositivos', unit: 'mil/km²', g4: 100, g5: 1000, max: 1000, fmt: v => fmtNum(v, 0), better: 'up', note4: '~100 mil', note5: '1 milhão' },
  { id: 'mob', label: 'Mobilidade máxima', unit: 'km/h', g4: 350, g5: 500, max: 500, fmt: v => fmtNum(v, 0), better: 'up', note4: '~350 km/h', note5: '~500 km/h' },
  { id: 'chan', label: 'Largura de canal por portadora', unit: 'MHz', g4: 20, g5: 400, max: 400, fmt: v => fmtNum(v, 0), better: 'up', note4: '20 MHz (agregável)', note5: '100 MHz FR1 · 400 MHz FR2' }
];

IOT.CMP_ROWS = [
  ['Padronização', 'ITU IMT-Advanced; 3GPP a partir do Release 8 (2008)', 'ITU IMT-2020; 3GPP a partir do Release 15 (2018)'],
  ['Confiabilidade', 'Boa, sem garantias para aplicações críticas', 'Até 99,999% em URLLC'],
  ['Espectro', 'Faixas abaixo de 3 GHz, em sua maioria', 'Abaixo de 7 GHz (FR1) e ondas milimétricas acima de 24 GHz (FR2)'],
  ['Antenas', 'MIMO convencional', 'Massive MIMO e beamforming (feixes direcionados)'],
  ['Núcleo de rede', 'EPC, baseado em equipamentos dedicados', '5G Core baseado em serviços (SBA), virtualizado e nativo em nuvem'],
  ['Fatiamento de rede', '✗ Não', '✓ Sim (no 5G SA)'],
  ['Edge computing', 'Limitado', '✓ Integrado à arquitetura (MEC)'],
  ['IoT', 'NB-IoT, LTE-M e LTE Cat-1/Cat-4', 'NB-IoT e LTE-M + RedCap/eRedCap + URLLC + futura Ambient IoT']
];

IOT.SA_FEATS = [
  { t: 'Mais velocidade (eMBB)', nsa: true },
  { t: 'Latência baixa de ponta a ponta', nsa: false },
  { t: 'URLLC (comunicação crítica)', nsa: false },
  { t: 'Network slicing', nsa: false },
  { t: 'RedCap e eRedCap', nsa: false }
];

IOT.BENEFITS = [
  { icon: 'i-dots', t: 'Escala', p: ['mmtc'], d: 'Suporte a até 1 milhão de dispositivos por km², viabilizando cidades e fábricas com milhares de sensores.' },
  { icon: 'i-timer', t: 'Tempo real', p: ['urllc'], d: 'Latência de milissegundos permite fechar o ciclo sensor → decisão → atuador pela rede, como no controle de robôs e veículos.' },
  { icon: 'i-shield', t: 'Confiabilidade', p: ['urllc'], d: 'Garantias de entrega que permitem trocar cabos por conexão sem fio em aplicações críticas: indústria, energia e saúde.' },
  { icon: 'i-video', t: 'Banda larga para dados pesados', p: ['embb'], d: 'Câmeras de alta resolução, drones e realidade aumentada passam a ser dispositivos IoT.' },
  { icon: 'i-slice', t: 'Redes sob medida', p: ['embb', 'urllc', 'mmtc'], d: 'O network slicing e as redes privadas 5G dão a cada aplicação o nível de serviço de que ela precisa, isolada das demais.' },
  { icon: 'i-edge', t: 'Processamento na borda', p: ['urllc'], d: 'O edge computing analisa os dados perto de onde são gerados, reduzindo latência, tráfego e custos de nuvem.' },
  { icon: 'i-devices', t: 'Dispositivos de todos os níveis', p: ['mmtc', 'embb'], d: 'NB-IoT e LTE-M para sensores simples, RedCap/eRedCap para dispositivos intermediários e 5G completo para aplicações exigentes, tudo na mesma rede.' },
  { icon: 'i-sat', t: 'Cobertura ampliada', p: ['mmtc'], d: 'A integração com satélites (NTN) leva a IoT a áreas rurais e remotas.' },
  { icon: 'i-route', t: 'Mobilidade e localização', p: ['urllc'], d: 'Conexão estável em movimento e posicionamento preciso em ambientes internos.' },
  { icon: 'i-lock', t: 'Segurança e longevidade', p: ['embb', 'urllc', 'mmtc'], d: 'Autenticação e criptografia padronizadas pelo 3GPP e uma rede que substitui o 2G/3G em desligamento, protegendo investimentos de longo prazo.' }
];

IOT.FAB_STEPS = [
  { t: 'Sensores detectam a anomalia', p: 'mmtc', t0: 0, t1: 2.4, d: 'Sensores de vibração no motor (massive IoT) percebem um padrão fora do normal e avisam a rede.' },
  { t: 'Câmera envia as imagens', p: 'embb', t0: 2.4, t1: 4.0, d: 'A câmera registra a peça suspeita em alta resolução e transmite o vídeo ao servidor de borda.' },
  { t: 'IA na borda confirma o defeito', p: 'mec', t0: 4.0, t1: 5.2, d: 'O servidor de borda (MEC), dentro da fábrica, roda a visão computacional e confirma o defeito sem depender de uma nuvem distante.' },
  { t: 'Robô retira a peça', p: 'urllc', t0: 5.2, t1: 8.6, d: 'O comando crítico chega ao robô em milissegundos, com 99,999% de confiabilidade, e a peça sai da linha.' }
];

IOT.TIERS = [
  { id: 'nbiot', n: 'NB-IoT', sub: 'massive IoT · 3GPP Rel. 13+', lv: { taxa: 1, bateria: 5, mobilidade: 1, custo: 1 },
    rows: [['Taxa', 'dezenas a ~100+ kbit/s'], ['Latência', '1 a 10 s'], ['Bateria', '10+ anos'], ['Módulo', '~US$ 3–10 + plano de dados']] },
  { id: 'ltem', n: 'LTE-M', sub: 'massive IoT · 3GPP Rel. 13+', lv: { taxa: 2, bateria: 4, mobilidade: 4, custo: 2 },
    rows: [['Taxa', 'até ~1 Mbit/s'], ['Latência', '10–15 ms ideal, ~100 ms típica'], ['Extras', 'handover, VoLTE e FOTA'], ['Módulo', '~US$ 5–15 + plano de dados']] },
  { id: 'redcap', n: 'RedCap / eRedCap', sub: 'Rel. 17 / 18 · exige 5G SA', lv: { taxa: 3, bateria: 3, mobilidade: 4, custo: 3 },
    rows: [['Taxa', '~10 Mbit/s (eRedCap) a 100+ Mbit/s (RedCap)'], ['Consumo', 'menor que o do 5G completo'], ['Substitui', 'LTE Cat-1 e Cat-4'], ['Módulo', 'eRedCap mira o preço do LTE Cat-1']] },
  { id: 'full', n: '5G completo', sub: 'eMBB + URLLC · Rel. 15+', lv: { taxa: 5, bateria: 1, mobilidade: 5, custo: 5 },
    rows: [['Taxa', 'Gbit/s'], ['Latência', '~1 ms no rádio (URLLC)'], ['Confiabilidade', '99,999%'], ['Módulo', 'ainda caro para IoT']] }
];

IOT.DEVICES = [
  { n: 'Medidor de água', tier: 'nbiot', why: 'Fixo, envia poucos bytes por dia e costuma ficar em subsolo: precisa de cobertura profunda e bateria de 10+ anos.' },
  { n: 'Sensor de estacionamento', tier: 'nbiot', why: 'Fica parado no chão e só informa "livre" ou "ocupado".' },
  { n: 'Rastreador de frota', tier: 'ltem', why: 'Está em movimento: precisa de handover entre antenas e de alguns dados de telemetria.' },
  { n: 'Botão de pânico com voz', tier: 'ltem', why: 'Mobilidade e voz (VoLTE) com baixo consumo.' },
  { n: 'Smartwatch com 5G', tier: 'redcap', why: 'Precisa de mais dados que um sensor, sem chegar a Gbit/s; o modem simplificado poupa bateria.' },
  { n: 'Câmera de vigilância', tier: 'redcap', why: 'Vídeo contínuo de qualidade moderada: o nível intermediário que o RedCap atende.' },
  { n: 'Sensor industrial', tier: 'redcap', why: 'Mais dados e confiabilidade que um sensor LPWAN, com custo menor que o 5G completo.' },
  { n: 'Robô / AGV', tier: 'full', why: 'Controle em tempo real exige URLLC: latência de milissegundos e 99,999% de confiabilidade.' },
  { n: 'Óculos de realidade aumentada', tier: 'full', why: 'Vídeo pesado (eMBB) e resposta rápida para não causar enjoo.' },
  { n: 'Veículo conectado (C-V2X)', tier: 'full', why: 'Alertas de colisão precisam chegar em milissegundos, mesmo em alta velocidade.' }
];

IOT.SECTORS = [
  { id: 'ind', icon: 'i-factory', n: 'Indústria 4.0', p: ['urllc', 'embb', 'mmtc'],
    apps: ['Fábricas sem cabos com robôs e AGVs controlados pela rede', 'Controle de qualidade com câmeras e IA na borda', 'Manutenção preditiva com milhares de sensores de vibração e temperatura', 'Gêmeos digitais', 'Manutenção assistida por realidade aumentada', 'Redes privadas 5G no chão de fábrica'] },
  { id: 'sau', icon: 'i-health', n: 'Saúde', p: ['urllc', 'embb'],
    apps: ['Monitoramento remoto contínuo de pacientes com wearables', 'Ambulâncias que transmitem sinais vitais e vídeo durante o trajeto', 'Telemedicina em alta definição', 'Rastreamento de equipamentos hospitalares', 'Estudos de telecirurgia assistida'] },
  { id: 'agr', icon: 'i-agro', n: 'Agronegócio', p: ['mmtc', 'embb', 'urllc'],
    apps: ['Agricultura de precisão com sensores de solo e clima', 'Máquinas agrícolas autônomas ou teleoperadas', 'Drones para pulverização e análise de lavouras por imagem', 'Monitoramento de rebanhos', 'Conectividade rural via redes privadas e satélites (NTN)'] },
  { id: 'cid', icon: 'i-city', n: 'Cidades inteligentes', p: ['mmtc', 'embb'],
    apps: ['Iluminação pública inteligente', 'Semáforos adaptativos', 'Câmeras de segurança com análise de vídeo em tempo real', 'Monitoramento de qualidade do ar, ruído e enchentes', 'Estacionamento inteligente', 'Coleta de lixo otimizada por sensores'] },
  { id: 'tra', icon: 'i-car', n: 'Transporte e mobilidade', p: ['urllc', 'embb'],
    apps: ['C-V2X: veículo com veículo, com a infraestrutura e com pedestres', 'Alertas de colisão', 'Gestão de frotas e telemetria', 'Transporte público conectado', 'Base para veículos autônomos'] },
  { id: 'ene', icon: 'i-energy', n: 'Energia e utilities', p: ['urllc', 'mmtc'],
    apps: ['Smart grids com proteção e automação de subestações em tempo real', 'Medição inteligente de energia, água e gás em massa', 'Monitoramento de linhas de transmissão', 'Integração de geração solar e eólica distribuída'] },
  { id: 'log', icon: 'i-port', n: 'Logística e portos', p: ['urllc', 'mmtc'],
    apps: ['Rastreamento de cargas e contêineres em tempo real', 'Guindastes operados remotamente', 'Armazéns automatizados com robôs', 'Localização precisa de ativos em pátios'] },
  { id: 'min', icon: 'i-mine', n: 'Mineração, óleo e gás', p: ['urllc', 'mmtc'],
    apps: ['Caminhões e perfuratrizes autônomos ou teleoperados', 'Monitoramento de segurança de trabalhadores', 'Sensores de gases e de estabilidade de barragens', 'Redes privadas em locais remotos'] },
  { id: 'var', icon: 'i-retail', n: 'Varejo', p: ['mmtc', 'embb'],
    apps: ['Prateleiras e etiquetas eletrônicas inteligentes', 'Controle de estoque em tempo real', 'Lojas sem caixa com câmeras e sensores', 'Maquininhas de pagamento conectadas'] }
];

IOT.CHALLENGES = [
  { icon: 'i-bars', t: 'Cobertura desigual', d: 'As faixas altas (3,5 GHz e principalmente 26 GHz) têm alcance menor e exigem muitas antenas; áreas rurais e cidades pequenas ainda dependem do 4G.', fix: 'Verificar a cobertura real no local (painel da Anatel) e usar LPWAN ou satélite (NTN) onde o 5G não chega.' },
  { icon: 'i-core', t: 'Dependência do 5G SA', d: 'Fatiamento, URLLC e RedCap só aparecem em redes Standalone, cuja implantação ainda está em andamento.', fix: 'Planejar com alternativa em 4G/LTE-M e acompanhar o cronograma de metas de 5G SA.' },
  { icon: 'i-coin', t: 'Custo e consumo dos módulos', d: 'Módulos 5G completos são caros e consomem mais que NB-IoT, LTE-M ou Zigbee.', fix: 'Usar LPWAN para sensores simples e RedCap/eRedCap para dispositivos intermediários.' },
  { icon: 'i-lock', t: 'Segurança e privacidade', d: 'Mais dispositivos significam mais superfície de ataque.', fix: 'Autenticação forte, atualização de firmware, segmentação de rede e conformidade com a LGPD.' },
  { icon: 'i-brief', t: 'Modelos de negócio', d: 'Fatiamento e redes privadas ainda amadurecem comercialmente; muitas empresas não sabem como contratar ou medir o retorno.', fix: 'Começar por projetos-piloto, com indicadores claros, antes de escalar.' },
  { icon: 'i-puzzle', t: 'Interoperabilidade e mão de obra', d: 'Integração com sistemas industriais legados e falta de profissionais qualificados em 5G e IoT.', fix: 'Padrões abertos, gateways de integração e formação técnica de profissionais.' },
  { icon: 'i-energy', t: 'Energia da infraestrutura', d: 'A grande quantidade de antenas e equipamentos aumenta o consumo total das redes.', fix: 'Eficiência energética com IA: redes auto-organizáveis (SON) que economizam energia automaticamente.' },
  { icon: 'i-timer', t: 'Latência fim a fim', d: 'A baixa latência do rádio só vira resposta rápida se o processamento também estiver perto.', fix: 'Edge computing (MEC): processar na borda, não em nuvens distantes (veja a FIG 5.3).' },
  { icon: 'i-law', t: 'Regulação e infraestrutura urbana', d: 'Licenciamento de antenas, leis municipais e custos de instalação atrasam a expansão em várias cidades.', fix: 'Leis de antenas atualizadas nos municípios e compartilhamento de infraestrutura entre operadoras.' }
];

IOT.LOOP = {
  nodes: [
    { id: 'iot', t: 'Sensores IoT', role: 'geram os dados', icon: 'i-dots' },
    { id: 'net', t: 'Rede 5G', role: 'transporta os dados', icon: 'i-antenna' },
    { id: 'ai', t: 'IA', role: 'decide, na borda ou na nuvem', icon: 'i-spark' },
    { id: 'act', t: 'Automação', role: 'executa no mundo físico', icon: 'i-factory' }
  ],
  sectors: [
    { id: 'ind', n: 'Indústria', iot: 'Sensores de vibração e câmeras na linha', net: 'Rede privada com URLLC e eMBB', ai: 'Visão computacional e manutenção preditiva na borda', act: 'Robôs e AGVs agem; reparos são agendados antes da falha', fb: 'Gêmeo digital atualizado em tempo real' },
    { id: 'tra', n: 'Transporte', iot: 'Sensores do veículo e da via (C-V2X)', net: 'Baixa latência em movimento', ai: 'Apoio às decisões de condução autônoma', act: 'Frenagem, desvio e alertas de colisão', fb: 'Novos dados de trânsito a cada instante' },
    { id: 'ene', n: 'Energia', iot: 'Medidores e sensores da rede elétrica', net: 'URLLC na proteção, mMTC na medição', ai: 'Detecta falhas e prevê a demanda', act: 'A rede se reconfigura sozinha (self-healing)', fb: 'O consumo medido refina a previsão' },
    { id: 'agr', n: 'Agronegócio', iot: 'Imagens de drones e sensores de solo', net: 'Redes privadas rurais e satélites', ai: 'Identifica pragas por imagem', act: 'Aplica defensivo só onde é preciso', fb: 'Nova imagem confirma o resultado' },
    { id: 'cid', n: 'Cidades', iot: 'Câmeras de trânsito', net: 'eMBB para o vídeo', ai: 'Analisa o fluxo e detecta incidentes', act: 'Semáforos se ajustam ao fluxo', fb: 'O trânsito é medido de novo' },
    { id: 'sau', n: 'Saúde', iot: 'Wearables com sinais vitais', net: 'Conexão contínua e confiável', ai: 'Detecta padrões anormais', act: 'Aciona alertas para a equipe médica', fb: 'Acompanhamento contínuo do paciente' }
  ],
  dirA: [
    'Baixa latência e edge computing permitem rodar modelos de IA perto dos dispositivos, com resposta em tempo real.',
    'A alta capacidade permite enviar vídeos e grandes volumes de dados para treinar e atualizar modelos.',
    'A confiabilidade torna possível automatizar processos críticos sem fios.'
  ],
  dirB: [
    { t: 'NWDAF', d: 'Função do núcleo 5G que analisa dados da rede para prever congestionamentos e ajustar recursos.' },
    { t: 'SON', d: 'Redes auto-organizáveis que otimizam antenas e economizam energia automaticamente.' },
    { t: 'IA no rádio', d: 'O 5G-Advanced (Release 18 em diante) usa aprendizado de máquina na interface de rádio para gestão de feixes, posicionamento e economia de energia.' }
  ]
};

IOT.PICK = {
  start: 'q1',
  nodes: {
    q1: { q: 'O projeto precisa de vídeo pesado ou de resposta em milissegundos (robôs, veículos, realidade aumentada)?', o: [['Sim', 'r5g'], ['Não', 'q2']] },
    q2: { q: 'O dispositivo se movimenta ou precisa de voz, atualização remota (FOTA) ou latência baixa?', o: [['Sim, ele se move', 'q2b'], ['Não, fica parado', 'q3']] },
    q2b: { q: 'Ele envia mais dados que um sensor comum (imagens, áudio, um wearable completo)?', o: [['Sim, mais dados', 'rredcap'], ['Não, poucos dados', 'rltem']] },
    q3: { q: 'Qual a distância entre os dispositivos e o ponto de conexão?', o: [['Curta: casa, sala ou prédio', 'q4'], ['Longa: fazenda, cidade ou subsolo', 'q5']] },
    q4: { q: 'Como é o uso?', o: [['Dispositivo pessoal que conversa com o celular', 'rble'], ['Streaming de áudio ou dados contínuos', 'rbt'], ['Dezenas ou centenas de dispositivos fixos', 'rzig']] },
    q5: { q: 'Quem vai operar a rede?', o: [['Rede própria, sem mensalidade e sem cobertura celular', 'rlora'], ['Operadora, com cobertura profunda (ex.: subsolo)', 'rnb']] }
  },
  results: {
    r5g: { t: '5G completo (eMBB + URLLC)', p: 'urllc', why: 'Latência de milissegundos, 99,999% de confiabilidade e Gbit/s. Em fábricas, portos e minas, costuma ser uma rede 5G privada com edge computing.', s: [['Alcance', 'cobertura 5G SA ou rede privada'], ['Taxa', 'Gbit/s'], ['Latência', '~1 ms no rádio'], ['Custo recorrente', 'plano ou rede própria']] },
    rredcap: { t: '5G RedCap / eRedCap', p: 'embb', why: 'O nível intermediário do 5G: mais dados que o LTE-M, com modem mais simples e econômico que o 5G completo. Exige rede 5G SA.', s: [['Alcance', 'cobertura 5G SA'], ['Taxa', '~10 a 100+ Mbit/s'], ['Mobilidade', 'alta'], ['Custo recorrente', 'plano de dados']] },
    rltem: { t: 'LTE-M', p: 'mmtc', why: 'Handover, maior taxa de dados que o NB-IoT e suporte a VoLTE. Reconhecido como massive IoT do 5G.', s: [['Alcance', '1–10 km+ (operadora)'], ['Taxa', 'até ~1 Mbit/s'], ['Bateria', '5–10 anos'], ['Custo recorrente', 'plano baixo/médio']] },
    rble: { t: 'BLE (Bluetooth Low Energy)', p: null, why: 'Presente em todo smartphone e com consumo mínimo.', s: [['Alcance', '10–100 m'], ['Taxa', '125 kbit/s – 2 Mbit/s'], ['Bateria', 'meses a anos'], ['Custo recorrente', 'nenhum']] },
    rbt: { t: 'Bluetooth Clássico', p: null, why: 'Maior taxa de dados contínua no curto alcance.', s: [['Alcance', '10–100 m'], ['Taxa', '1–3 Mbit/s'], ['Bateria', 'horas a dias'], ['Custo recorrente', 'nenhum']] },
    rzig: { t: 'Zigbee', p: null, star: true, why: 'Rede em malha robusta, local e sem mensalidade. Um gateway com conexão 5G pode levar os dados da malha até a nuvem.', s: [['Alcance', '10–100 m por salto (malha)'], ['Taxa', 'até 250 kbit/s'], ['Bateria', 'meses a anos'], ['Custo recorrente', 'nenhum']] },
    rlora: { t: 'LoRaWAN', p: null, why: 'Quilômetros de alcance, espectro livre e baixo custo operacional, com rede própria.', s: [['Alcance', '2–5 km urbano · 15+ km rural'], ['Taxa', '~0,3–50 kbit/s'], ['Bateria', 'até ~10 anos'], ['Custo recorrente', 'nenhum (rede própria)']] },
    rnb: { t: 'NB-IoT', p: 'mmtc', why: 'Cobertura indoor profunda e bateria de longa duração. Reconhecido como massive IoT do 5G.', s: [['Alcance', '1–10 km+ (operadora)'], ['Taxa', '~20–250 kbit/s'], ['Bateria', '10+ anos'], ['Custo recorrente', 'plano de dados baixo']] }
  }
};

IOT.QUIZ = [
  { q: 'Qual pilar do 5G foi feito para conectar até 1 milhão de dispositivos por km²?', o: ['eMBB', 'URLLC', 'mMTC', '5G NSA'], a: 2, e: 'mMTC (Massive Machine-Type Communications) atende sensores simples em massa, com baterias de 10+ anos.' },
  { q: 'O que é necessário para ter fatiamento de rede, URLLC e RedCap?', o: ['5G NSA, apoiado no núcleo 4G', '5G Standalone (SA), com núcleo 5G', 'Somente antenas de 26 GHz', 'Wi-Fi 6 integrado à rede'], a: 1, e: 'As redes NSA entregam principalmente velocidade. O núcleo 5G próprio (SA) libera fatiamento, URLLC e RedCap.' },
  { q: 'Na fábrica 5G da FIG 3.2, qual pilar leva o comando até o robô?', o: ['mMTC', 'eMBB', 'URLLC', 'LoRaWAN'], a: 2, e: 'URLLC: latência de ~1 ms e 99,999% de confiabilidade para o comando crítico.' },
  { q: 'Em uma cidade inteligente (iluminação, estacionamento, lixeiras), qual pilar pesa mais?', o: ['URLLC', 'mMTC', 'eMBB', 'Nenhum, só Wi-Fi'], a: 1, e: 'São milhares de sensores simples: mMTC, com eMBB para as câmeras.' },
  { q: 'Por que o edge computing é essencial para aplicações em tempo real?', o: ['Aumenta o alcance da antena', 'Processa os dados perto de onde são gerados e reduz a latência fim a fim', 'Dispensa a criptografia', 'Substitui o núcleo 5G'], a: 1, e: 'Só o trajeto da luz até um servidor a 100 km já consome cerca de 1 ms (ida e volta).' },
  { q: 'Qual função do núcleo 5G usa análise de dados para prever congestionamentos?', o: ['SON', 'TSN', 'NWDAF', 'NTN'], a: 2, e: 'A NWDAF (Network Data Analytics Function) é a IA a serviço da própria rede.' }
];

