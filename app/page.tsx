"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

function RevealLine({
  text,
  start = 0.16,
  step = 0.085,
  className = "",
}: {
  text: string;
  start?: number;
  step?: number;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <span className={`reveal-line ${className}`} aria-hidden="true">
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span
            className="reveal-word"
            style={{ "--reveal-delay": `${(start + index * step).toFixed(3)}s` } as CSSProperties}
          >
            {word}
          </span>
        </span>
      ))}
    </span>
  );
}

const scenes = ["Início", "Símbolo", "Visão", "Propostas", "Equipe", "Compromisso"];

const proposals = [
  {
    number: "01",
    title: "Copa Enny",
    category: "Esporte & integração",
    accent: "#ff3147",
    art: "/proposal-copa-v3.webp",
    summary: "Uma competição entre turmas que vai muito além do futsal.",
    how: "Modalidades como futsal, vôlei, tênis de mesa, xadrez, damas e basquete somam pontos para uma classificação geral.",
    benefits: ["Mais alunos participando", "Integração entre salas e anos", "Competição saudável e trabalho em equipe"],
    extra: "Premiação simbólica para a turma campeã geral.",
  },
  {
    number: "02",
    title: "Grêmio Digital",
    category: "Voz & participação",
    accent: "#2d8cff",
    art: "/proposal-digital-v3.webp",
    summary: "Um canal direto para ideias, reclamações, votações e respostas.",
    how: "QR Codes pela escola levam a um espaço oficial para enviar demandas, sugerir eventos, votar e acompanhar cada projeto.",
    benefits: ["A voz do aluno chega ao Grêmio", "Decisões mais participativas", "Demandas com resposta e andamento"],
    extra: "Resolvido, em andamento, encaminhado ou recusado — sempre com explicação.",
  },
  {
    number: "03",
    title: "Feira Jovem Empreendedor",
    category: "Criatividade & futuro",
    accent: "#ff7a2d",
    art: "/proposal-feira-v3.webp",
    summary: "Ideias de negócio e projetos criados pelos próprios alunos.",
    how: "Grupos desenvolvem marca, produto ou serviço e trabalham divulgação, preço, vendas, finanças e apresentação.",
    benefits: ["Criatividade e comunicação", "Integração com os cursos técnicos", "Descoberta de novos talentos"],
    extra: "Prêmios para projeto, apresentação e ideia mais criativa.",
  },
  {
    number: "04",
    title: "Oportunidades Enny",
    category: "Carreira & palestras",
    accent: "#ffd33d",
    art: "/proposal-oportunidades-v3.webp",
    summary: "Informação útil para ninguém perder uma grande chance.",
    how: "Divulgação de cursos, Jovem Aprendiz, empregos, ENEM, bolsas e eventos, além de palestras sobre carreira, finanças, tecnologia e IA.",
    benefits: ["Acesso a cursos e bolsas", "Apoio ao primeiro emprego", "Informação prática para o futuro"],
    extra: "Nenhum aluno perde uma oportunidade por não ter ficado sabendo.",
  },
  {
    number: "05",
    title: "Cinema Enny",
    category: "Cultura & lazer",
    accent: "#9a58ff",
    art: "/proposal-cinema-v3.webp",
    summary: "Sessões especiais escolhidas com a participação dos alunos.",
    how: "Filmes, animações e documentários em datas especiais, com votação pelo Grêmio Digital e organização junto à escola.",
    benefits: ["Lazer dentro da escola", "Integração entre turmas", "Cultura ligada a projetos pedagógicos"],
    extra: "Tudo respeitando as permissões de exibição da escola.",
  },
  {
    number: "06",
    title: "Espaço Enny",
    category: "Convivência",
    accent: "#25d39a",
    art: "/proposal-espaco-v3.webp",
    summary: "Um lugar melhor para conversar, jogar e viver os intervalos.",
    how: "Melhorias graduais com mesas, bancos, jogos, livros, mural e, se houver estrutura, tênis de mesa.",
    benefits: ["Intervalos mais agradáveis", "Um espaço para toda a escola", "Melhoria que permanece"],
    extra: "Os alunos votam no que deve ser colocado primeiro.",
  },
  {
    number: "07",
    title: "Enny Melhor",
    category: "Estrutura & cuidado",
    accent: "#31c7ff",
    art: "/proposal-melhor-v3.webp",
    summary: "Prioridades escolhidas pelos alunos e buscadas com responsabilidade.",
    how: "Levantar necessidades reais e buscar, com direção, APM e parcerias, melhorias em assentos, materiais, bebedouros, iluminação e ventilação.",
    benefits: ["Ação sobre problemas reais", "Prioridades definidas pelos alunos", "Melhorias físicas duradouras"],
    extra: "Cada etapa será mostrada com clareza, inclusive quando algo não for possível.",
  },
];

const members = [
  {
    name: "Pedro",
    role: "Coordenação Geral",
    initials: "P",
    accent: "#ff3147",
    description: "Coordena a equipe, define prioridades e representa a chapa nas decisões gerais.",
    focus: ["Coordenação", "Representação", "Prioridades"],
  },
  {
    name: "Gabriel Gentil",
    role: "Vice-Geral",
    initials: "GG",
    accent: "#2d8cff",
    description: "Acompanha todas as áreas e assume a coordenação quando for necessário.",
    focus: ["Apoio geral", "Integração", "Continuidade"],
  },
  {
    name: "Fábio",
    role: "1º Secretário",
    initials: "F",
    accent: "#ff7a2d",
    description: "Organiza atas, documentos, reuniões e o registro oficial das ações.",
    focus: ["Atas", "Documentos", "Reuniões"],
  },
  {
    name: "Gabriel Garrido",
    role: "2º Secretário",
    initials: "GG",
    accent: "#9a58ff",
    description: "Apoia a secretaria e mantém comunicados, pautas e arquivos em ordem.",
    focus: ["Pautas", "Comunicados", "Arquivos"],
  },
  {
    name: "Samuel",
    role: "Tesoureiro",
    initials: "S",
    accent: "#25d39a",
    description: "Cuida do planejamento financeiro, dos recursos e da prestação de contas.",
    focus: ["Orçamento", "Recursos", "Prestação"],
  },
  {
    name: "Yury",
    role: "Coordenação Esportiva",
    initials: "Y",
    accent: "#ffd33d",
    description: "Organiza campeonatos, atividades físicas e integração por meio do esporte.",
    focus: ["Campeonatos", "Inclusão", "Esporte"],
  },
  {
    name: "Yasmin",
    role: "Coordenação Cultural",
    initials: "Y",
    accent: "#ff63ad",
    description: "Cria eventos, projetos artísticos, cinema e outras atividades culturais.",
    focus: ["Eventos", "Cultura", "Cinema"],
  },
  {
    name: "Kelvin",
    role: "Coordenação de Imprensa",
    initials: "K",
    accent: "#31c7ff",
    description: "Cuida da divulgação, das redes e da transparência de todas as ações.",
    focus: ["Divulgação", "Redes", "Transparência"],
  },
  {
    name: "Em definição",
    role: "Coordenação Educacional",
    initials: "?",
    accent: "#c5c8d0",
    description: "Acompanha demandas de aprendizagem e aproxima os alunos de oportunidades educacionais.",
    focus: ["Aprendizagem", "Oportunidades", "Escuta"],
  },
  {
    name: "Pietro",
    role: "Coordenação Ambiental",
    initials: "P",
    accent: "#58dc72",
    description: "Lidera projetos de sustentabilidade, reciclagem e cuidado com os espaços.",
    focus: ["Sustentabilidade", "Reciclagem", "Cuidado"],
  },
  {
    name: "Karina",
    role: "Direção da chapa",
    initials: "K",
    accent: "#ff3147",
    description: "Orienta a estratégia e conecta equipe, alunos e gestão escolar.",
    focus: ["Estratégia", "Conexão", "Orientação"],
  },
];

export default function Home() {
  const [ready, setReady] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitionTarget, setTransitionTarget] = useState(0);
  const [activeProposal, setActiveProposal] = useState(0);
  const [activeMember, setActiveMember] = useState(0);
  const activeSceneRef = useRef(0);
  const transitionRef = useRef(false);
  const transitionTimers = useRef<number[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const flagVideoRef = useRef<HTMLVideoElement>(null);

  const goToScene = useCallback((requested: number) => {
    const target = Math.max(0, Math.min(scenes.length - 1, requested));
    const current = activeSceneRef.current;
    if (target === current || transitionRef.current) return;

    const nextDirection: 1 | -1 = target > current ? 1 : -1;
    transitionRef.current = true;
    setDirection(nextDirection);
    setTransitionTarget(target);
    setTransitioning(true);

    transitionTimers.current.push(
      window.setTimeout(() => {
        activeSceneRef.current = target;
        setActiveScene(target);
      }, 280),
      window.setTimeout(() => {
        transitionRef.current = false;
        setTransitioning(false);
      }, 1050),
    );
  }, []);

  useEffect(() => {
    const timers = transitionTimers.current;
    const intro = window.setTimeout(() => setReady(true), 700);
    const wheel = (event: WheelEvent) => {
      event.preventDefault();
      if (Math.abs(event.deltaY) < 18) return;
      goToScene(activeSceneRef.current + (event.deltaY > 0 ? 1 : -1));
    };
    const keyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) return;
      if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        goToScene(activeSceneRef.current + 1);
      }
      if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
        event.preventDefault();
        goToScene(activeSceneRef.current - 1);
      }
      if (event.key === "Home") goToScene(0);
      if (event.key === "End") goToScene(scenes.length - 1);
    };
    window.addEventListener("wheel", wheel, { passive: false });
    window.addEventListener("keydown", keyboard);
    return () => {
      window.clearTimeout(intro);
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("wheel", wheel);
      window.removeEventListener("keydown", keyboard);
    };
  }, [goToScene]);

  useEffect(() => {
    const video = flagVideoRef.current;
    if (!video) return;
    if (activeScene === 1) {
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }, [activeScene]);

  const onTouchStart = (event: ReactPointerEvent<HTMLElement>) => {
    if (event.pointerType !== "touch") return;
    if ((event.target as HTMLElement).closest("[data-no-swipe]")) {
      touchStart.current = null;
      return;
    }
    touchStart.current = { x: event.clientX, y: event.clientY };
  };
  const onTouchEnd = (event: ReactPointerEvent<HTMLElement>) => {
    if (!touchStart.current || event.pointerType !== "touch") return;
    const deltaX = event.clientX - touchStart.current.x;
    const deltaY = event.clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(deltaY) > 54 && Math.abs(deltaY) > Math.abs(deltaX) * 1.1) {
      goToScene(activeSceneRef.current + (deltaY < 0 ? 1 : -1));
      return;
    }
    if (Math.abs(deltaX) > 54 && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
      goToScene(activeSceneRef.current + (deltaX < 0 ? 1 : -1));
    }
  };

  const selectedProposal = proposals[activeProposal];
  const selectedMember = members[activeMember];
  const nextMember = members[(activeMember + 1) % members.length];
  const memberNameParts = selectedMember.name.split(" ");
  const memberFirstName = memberNameParts[0];
  const memberRestName = memberNameParts.slice(1).join(" ");
  const sceneClass = (index: number) =>
    `scene ${activeScene === index ? "is-active" : index < activeScene ? "is-before" : "is-after"}`;

  const moveMember = (amount: number) => {
    setActiveMember((current) => (current + amount + members.length) % members.length);
  };

  return (
    <main className={`site-shell ${ready ? "is-ready" : ""}`} onPointerDown={onTouchStart} onPointerUp={onTouchEnd}>
      <div className={`intro-loader ${ready ? "loader-exit" : ""}`} aria-hidden={ready}>
        <div className="loader-symbol"><span>U</span><i /><span>A</span><i /><span>J</span></div>
        <div className="loader-track"><b /></div>
        <p>UNIÃO • AVANÇO • JOVEM</p>
      </div>

      <div className="global-texture" aria-hidden="true" />

      <header className="site-header">
        <button className="brand" onClick={() => goToScene(0)} aria-label="Ir para o início">
          <span className="brand-mark"><i /></span>
          <strong>U.A.J.</strong>
        </button>
        <nav className="desktop-nav" aria-label="Navegação principal">
          {[0, 2, 3, 4, 5].map((index) => (
            <button
              key={scenes[index]}
              className={activeScene === index ? "active" : ""}
              onClick={() => goToScene(index)}
            >
              {scenes[index]}
            </button>
          ))}
        </nav>
        <button className="header-cta" onClick={() => goToScene(3)}>
          7 propostas <span>↗</span>
        </button>
      </header>

      <div className="scene-deck" aria-live="polite">
        <section className={`${sceneClass(0)} home-scene`} aria-hidden={activeScene !== 0}>
          <div className="hero-image" aria-hidden="true">
            <Image src="/uaj-hero-classroom-v4.webp" alt="" fill priority unoptimized sizes="100vw" />
          </div>
          <div className="hero-shade" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />

          <div className="home-copy">
            <div className="eyebrow"><i /> Grêmio Estudantil • 2026</div>
            <h1 aria-label="A escola vai ouvir nossa voz.">
              <span className="headline-line" aria-hidden="true">
                <span className="headline-word" style={{ "--word-delay": "0.44s" } as CSSProperties}>A</span>{" "}
                <span className="headline-word" style={{ "--word-delay": "0.53s" } as CSSProperties}>escola</span>{" "}
                <span className="headline-word" style={{ "--word-delay": "0.62s" } as CSSProperties}>vai</span>
              </span>
              <span className="headline-line" aria-hidden="true">
                <span className="headline-word" style={{ "--word-delay": "0.71s" } as CSSProperties}>ouvir</span>{" "}
                <em><span className="headline-word" style={{ "--word-delay": "0.80s" } as CSSProperties}>nossa</span>{" "}<span className="headline-word" style={{ "--word-delay": "0.89s" } as CSSProperties}>voz.</span></em>
              </span>
            </h1>
            <div className="home-bottom">
              <p>União que escuta.<br />Avanço que acontece.</p>
              <button className="primary-button" onClick={() => goToScene(1)}>
                Entrar na experiência <span>→</span>
              </button>
            </div>
          </div>

          <div className="hero-school-rail" aria-label="Destaques da chapa">
            <article><span>07</span><div><strong>Propostas possíveis</strong><small>Esporte, cultura, futuro e convivência.</small></div><i>↗</i></article>
            <article><span>11</span><div><strong>Áreas representadas</strong><small>Uma equipe organizada para fazer acontecer.</small></div><i>↗</i></article>
            <article><span>UAJ</span><div><strong>Gestão aberta</strong><small>Escuta e transparência em cada etapa.</small></div><i>↗</i></article>
          </div>

          <button className="floating-flag-card" onClick={() => goToScene(1)} aria-label="Conhecer o símbolo da U.A.J.">
            <Image src="/uaj-bandeira-realista-v1.webp" alt="Bandeira realista da U.A.J." fill priority unoptimized sizes="190px" />
            <span>Nosso símbolo <i>↗</i></span>
          </button>
          <div className="giant-side-type" aria-hidden="true">AVANÇO</div>
        </section>

        <section className={`${sceneClass(1)} flag-scene`} aria-hidden={activeScene !== 1}>
          <div className="symbol-video-backdrop" aria-hidden="true">
            <Image
              src="/uaj-bandeira-realista-v1.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
            />
            <video
              ref={flagVideoRef}
              className="symbol-flag-video"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/uaj-bandeira-realista-v1.webp"
            >
              <source src="/uaj-bandeira-vento-v1.webm" type="video/webm" />
              <source src="/uaj-bandeira-vento-v1.mp4" type="video/mp4" />
            </video>
            <div className="symbol-photo-sheen" />
          </div>
          <div className="symbol-atmosphere" aria-hidden="true" />
          <div className="symbol-wordmark" aria-hidden="true">
            <span>UNIÃO</span>
            <span>AVANÇO JOVEM</span>
          </div>

          <div className="symbol-layout">
            <div className="symbol-copy">
              <span className="scene-kicker">02 / 06 — NOSSO SÍMBOLO</span>
              <small>IDENTIDADE • MOVIMENTO • 2026</small>
              <h2 aria-label="União. Avanço. Jovem.">
                <RevealLine text="União." start={0.2} />
                <RevealLine text="Avanço." start={0.29} />
                <RevealLine text="Jovem." start={0.38} className="outline-line" />
              </h2>
              <div className="symbol-manifesto">
                <i />
                <p>Uma bandeira para lembrar que a escola muda quando a voz dos alunos deixa de ser fundo e vira direção.</p>
              </div>
            </div>

            <div className="symbol-signature"><span>U.A.J.</span><i /><small>GRÊMIO ESTUDANTIL</small></div>
          </div>

          <div className="symbol-values">
            <article><span>01</span><strong>UNIÃO</strong><small>Várias vozes. Uma direção.</small></article>
            <article><span>02</span><strong>VOZ</strong><small>Todo aluno merece espaço.</small></article>
            <article><span>03</span><strong>AVANÇO</strong><small>Ideias que saem do papel.</small></article>
          </div>
        </section>

        <section className={`${sceneClass(2)} vision-scene`} aria-hidden={activeScene !== 2}>
          <div className="vision-photo" aria-hidden="true">
            <Image src="/uaj-vision-council-v4.webp" alt="" fill unoptimized sizes="100vw" />
          </div>
          <div className="vision-mask" aria-hidden="true" />
          <div className="vision-copy">
            <span className="scene-kicker">03 / 06 — O QUE NOS MOVE</span>
            <h2 aria-label="Não é sobre uma chapa.">
              <RevealLine text="Não é sobre" start={0.18} />
              <RevealLine text="uma chapa." start={0.42} />
            </h2>
            <h3 aria-label="É sobre a nossa escola.">
              <RevealLine text="É sobre" start={0.58} />
              <RevealLine text="a nossa escola." start={0.74} className="accent-line" />
            </h3>
            <p>O Grêmio não deve falar pelos alunos. Deve falar <strong>com</strong> os alunos — e transformar participação em ação.</p>
          </div>
          <div className="vision-pillars">
            <article><span>01</span><i>◉</i><div><strong>Escutar</strong><p>Toda voz merece espaço.</p></div></article>
            <article><span>02</span><i>↗</i><div><strong>Construir</strong><p>Ideias viram planos possíveis.</p></div></article>
            <article><span>03</span><i>✓</i><div><strong>Mostrar</strong><p>Transparência em cada etapa.</p></div></article>
          </div>
          <div className="vision-stamp" aria-hidden="true"><span>U.A.J.</span><small>JUNTOS<br />AVANÇAMOS</small></div>
        </section>

        <section
          className={`${sceneClass(3)} proposals-scene`}
          aria-hidden={activeScene !== 3}
          style={{ "--proposal-accent": selectedProposal.accent } as CSSProperties}
        >
          <div className="proposal-glow" aria-hidden="true" />
          <div className="proposals-photo" aria-hidden="true">
            <Image src="/uaj-projects-campus-v4.webp" alt="" fill unoptimized sizes="100vw" />
          </div>
          <div className="proposal-visual" key={`visual-${selectedProposal.number}`} aria-hidden="true">
            <div className="visual-rings"><i /><i /><i /></div>
            <div className="proposal-art">
              <Image src={selectedProposal.art} alt="" fill unoptimized sizes="(max-width: 680px) 42vw, 510px" />
            </div>
            <i className="proposal-art-shadow" />
            <strong>{selectedProposal.number}</strong>
          </div>

          <div className="proposal-heading" key={`heading-${selectedProposal.number}`}>
            <span className="scene-kicker">04 / 06 — PROJETOS PARA A ENNY</span>
            <small>{selectedProposal.category}</small>
            <h2 aria-label={selectedProposal.title}>
              <RevealLine text={selectedProposal.title} start={0.16} step={0.09} />
            </h2>
            <p>{selectedProposal.summary}</p>
          </div>

          <div className="proposal-detail" key={`detail-${selectedProposal.number}`}>
            <article>
              <span>COMO VAI FUNCIONAR</span>
              <p>{selectedProposal.how}</p>
            </article>
            <article>
              <span>IMPACTO DIRETO</span>
              <ul>{selectedProposal.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
            </article>
            <div className="proposal-extra"><i>+</i><p>{selectedProposal.extra}</p></div>
          </div>

          <div className="proposal-switcher" data-no-swipe>
            <div className="proposal-tabs">
              {proposals.map((proposal, index) => (
                <button
                  key={proposal.number}
                  className={activeProposal === index ? "active" : ""}
                  onClick={() => setActiveProposal(index)}
                  aria-label={`Abrir ${proposal.title}`}
                  aria-pressed={activeProposal === index}
                >
                  <span>{proposal.number}</span><i />
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          className={`${sceneClass(4)} team-scene`}
          aria-hidden={activeScene !== 4}
          style={{ "--member-accent": selectedMember.accent } as CSSProperties}
        >
          <div className="team-photo" aria-hidden="true">
            <Image src="/uaj-team-background-v5.webp" alt="" fill unoptimized sizes="100vw" />
          </div>
          <div className="team-shade" aria-hidden="true" />
          <div className="team-topline">
            <span className="scene-kicker">05 / 06 — QUEM FAZ ACONTECER</span>
            <span className="team-count"><i /> 11 PESSOAS • UMA DIREÇÃO</span>
          </div>

          <div className="member-editorial">
            <aside className="member-role-panel">
              <span>ÁREA DE ATUAÇÃO</span>
              <h3>{selectedMember.role}</h3>
              <i />
              <small><b>{String(activeMember + 1).padStart(2, "0")}</b> / {String(members.length).padStart(2, "0")}</small>
            </aside>

            <button
              className="member-portrait"
              onClick={() => moveMember(1)}
              aria-label={`Ver próximo integrante: ${nextMember.name}`}
              data-no-swipe
            >
              <span className="portrait-halo" aria-hidden="true"><i /><i /><i /></span>
              <Image src="/uaj-team-sculpture-v4.webp" alt="" fill unoptimized sizes="(max-width: 680px) 44vw, 430px" />
              <span className="portrait-id">{selectedMember.initials}</span>
              <span className="portrait-next">PRÓXIMO <i>↗</i></span>
            </button>

            <aside className="member-bio-panel">
              <span>NO GRÊMIO</span>
              <p>{selectedMember.description}</p>
              <small><i /> UNIÃO AVANÇO JOVEM</small>
            </aside>

            <div
              className={`member-name-lockup ${memberRestName ? "has-surname" : ""}`}
              key={`member-name-${activeMember}`}
            >
              <small>{selectedMember.initials} • REPRESENTAÇÃO ESTUDANTIL</small>
              <h2 aria-label={memberFirstName}><RevealLine text={memberFirstName} start={0.12} /></h2>
              {memberRestName && <h3 aria-label={memberRestName}><RevealLine text={memberRestName} start={0.3} /></h3>}
            </div>
          </div>

          <div className="member-focus-strip">
            <div className="focus-heading"><span>O QUE FAZ</span><small>RESPONSABILIDADES</small></div>
            {selectedMember.focus.map((item, index) => (
              <article key={item}><span>0{index + 1}</span><strong>{item}</strong><i>↗</i></article>
            ))}
          </div>

          <div className="member-switcher" data-no-swipe>
            <div className="member-tabs">
              {members.map((member, index) => (
                <button
                  key={`${member.name}-${member.role}`}
                  className={activeMember === index ? "active" : ""}
                  onClick={() => setActiveMember(index)}
                  aria-label={`Ver ${member.name}, ${member.role}`}
                  aria-pressed={activeMember === index}
                >
                  <span>{member.initials}</span><small>{member.name.split(" ")[0]}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className={`${sceneClass(5)} commitment-scene`} aria-hidden={activeScene !== 5}>
          <div className="commitment-aurora" aria-hidden="true" />
          <div className="commitment-emblem" aria-hidden="true">
            <div className="emblem-flag"><Image src="/uaj-bandeira.jpg" alt="" fill unoptimized sizes="180px" /></div>
            <i className="orbit-one" /><i className="orbit-two" /><i className="orbit-three" />
            <span className="satellite-one">✓</span><span className="satellite-two">→</span><span className="satellite-three">●</span>
          </div>
          <div className="commitment-copy">
            <span className="scene-kicker">06 / 06 — NOSSO COMPROMISSO</span>
            <h2 aria-label="Prometer menos. Ouvir mais. Fazer acontecer.">
              <RevealLine text="Prometer menos." start={0.18} />
              <RevealLine text="Ouvir mais." start={0.38} className="outline-line" />
              <RevealLine text="Fazer acontecer." start={0.58} />
            </h2>
            <p>Algumas propostas dependem de verba e aprovação. Nosso compromisso é tentar de verdade e mostrar cada etapa.</p>
          </div>
          <div className="status-board">
            <article><i className="green">✓</i><div><strong>Resolvido</strong><span>Concluído e entregue.</span></div></article>
            <article><i className="yellow">●</i><div><strong>Em andamento</strong><span>Trabalho acontecendo.</span></div></article>
            <article><i className="blue">→</i><div><strong>Encaminhado</strong><span>Aguardando aprovação.</span></div></article>
            <article><i className="red">×</i><div><strong>Não foi possível</strong><span>Motivo explicado.</span></div></article>
          </div>
          <button className="restart-button" onClick={() => goToScene(0)}>Rever desde o início <span>↺</span></button>
          <div className="closing-line">UNIÃO QUE ESCUTA <i>✦</i> AVANÇO QUE ACONTECE</div>
        </section>
      </div>

      <aside className="scene-pagination" aria-label="Escolher cena">
        {scenes.map((scene, index) => (
          <button
            key={scene}
            className={activeScene === index ? "active" : ""}
            onClick={() => goToScene(index)}
            aria-label={`Ir para ${scene}`}
            aria-current={activeScene === index ? "step" : undefined}
          >
            <span>{String(index + 1).padStart(2, "0")}</span><i /><small>{scene}</small>
          </button>
        ))}
      </aside>

      <div className="scene-controls">
        <div className="gesture-hint"><i><b /></i><span>ARRASTE OU USE O MENU</span></div>
        <div className="current-scene"><span>{String(activeScene + 1).padStart(2, "0")}</span><i />{String(scenes.length).padStart(2, "0")}</div>
      </div>

      <div
        className={`scene-wipe ${transitioning ? "is-running" : ""} ${direction === 1 ? "forward" : "backward"}`}
        aria-hidden="true"
      >
        <i /><i /><i />
        <div><span>{String(transitionTarget + 1).padStart(2, "0")}</span><small>{scenes[transitionTarget]}</small></div>
      </div>
    </main>
  );
}
