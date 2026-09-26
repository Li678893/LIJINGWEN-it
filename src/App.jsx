import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Plus, Play, Menu } from 'lucide-react';
import { useContent } from './content/ContentContext.jsx';
import Editable, { RowTools } from './editor/Editable.jsx';
import MediaPicker from './editor/MediaPicker.jsx';
import SmartMedia from './editor/SmartMedia.jsx';
import MediaTransform from './editor/MediaTransform.jsx';
import CursorRipples from './effects/CursorRipples.jsx';

const RATIOS = ['wide', 'tall', 'square'];

export default function App() {
  const { content, edit, set, projects, capabilities, stats, navLinks } = useContent();
  const [activeIdx, setActiveIdx] = useState(null);

  const projectList = content.work.projects;
  const projectCount = projectList.length;

  // 入场动画 + 视差：新增/删除卡片后要重新点亮，否则新卡片会一直停在初始状态
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal');
    let io = null;
    if (edit) {
      // 编辑时要立刻看到内容，不等动画
      targets.forEach((t) => t.classList.add('is-visible'));
    } else {
      io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });
      targets.forEach((target) => io.observe(target));
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mobile = window.matchMedia('(max-width: 800px)');
    const handleScroll = () => {
      if (reduceMotion.matches || mobile.matches) return;
      document.querySelectorAll('[data-parallax]').forEach((node) => {
        const rect = node.getBoundingClientRect();
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * 0.055;
        node.style.setProperty('--parallax-y', `${Math.max(-18, Math.min(18, offset))}px`);
      });
    };
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    handleScroll();
    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [projectCount, edit, content.caps.items.length]);

  const activeProject = activeIdx == null ? null : projectList[activeIdx] || null;

  return (
    <div className={`site${edit ? ' editing' : ''}`}>
      <div className="grain" />
      <CursorRipples />

      <header className="nav">
        <a className="logo" href="#top">
          <Editable as="b" path="nav.logo" />
          <span> / </span>
          <Editable as="b" path="nav.logoMark" />
        </a>
        <nav>
          {content.nav.links.map((l, i) => (
            <a
              key={i}
              href={l.href}
              onClick={(e) => {
                if (edit) e.preventDefault();
              }}
            >
              <Editable path={`nav.links.${i}.label`} />
              {edit && (
                <span className="ed-row ed-row--inline">
                  <button type="button" onClick={() => navLinks.remove(i)} title="删除">
                    ×
                  </button>
                </span>
              )}
            </a>
          ))}
        </nav>
        <button className="menu">
          <Menu size={17} />
          <Editable path="nav.menu" />
        </button>
      </header>

      <main id="top">
        <section className="hero section-pad">
          <div className="hero-weather" aria-hidden="true">
            <span className="hero-cloud-layer" />
            <span className="hero-grass-layer" />
            <span className="hero-water-layer" />
            <span className="hero-light-layer" />
          </div>
          <nav className="hero-quick-nav" aria-label="页面导航">
            <a href="#work">作品</a>
            <a href="#about">关于</a>
            <a href="#capabilities">优势</a>
            <a href="#contact">联系</a>
            <a className="hero-quick-cta" href="#contact">预约合作 <span aria-hidden="true">↗</span></a>
          </nav>
          <div className="hero-watermark" aria-hidden="true">
            <Editable path="hero.watermarkTop" />
            <br />
            <Editable path="hero.watermarkBottom" />
          </div>
          <div className="hero-topline reveal reveal--delay1">
            {content.hero.topline.map((t, i) => (
              <span key={i}>
                <Editable path={`hero.topline.${i}`} />
              </span>
            ))}
          </div>
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow reveal reveal--delay2">
                <Editable path="hero.eyebrow" />
              </p>
              <h1 className="reveal reveal--delay3">
                <Editable path="hero.title.l1" />
                <br />
                <i>
                  <Editable path="hero.title.l2" />
                </i>
                <br />
                <Editable path="hero.title.l3" />
                <br />
                <span>
                  <Editable path="hero.title.l4" />
                </span>
                <em>
                  <Editable path="hero.title.l5" />
                </em>
              </h1>
              <p className="hero-intro reveal reveal--delay4">
                <Editable path="hero.intro" multiline />
              </p>
              <a
                className="outline-btn reveal reveal--delay5"
                href="#work"
                onClick={(e) => {
                  if (edit) e.preventDefault();
                }}
              >
                <Editable path="hero.cta" /> <ArrowUpRight size={15} />
              </a>
            </div>
            <figure className="hero-image reveal reveal--delay3" data-parallax>
              <div className="image-window">
                <MediaTransform path="hero.transform">
                  <SmartMedia src={content.hero.image} alt="Editorial portrait from the archive" />
                </MediaTransform>
              </div>
              <figcaption>
                <span>
                  <Editable path="hero.captionLeft" />
                </span>
                <span>
                  <Editable path="hero.captionRight" />
                </span>
              </figcaption>
              {edit && (
                <div className="ed-row">
                  <MediaPicker
                    path="hero.image"
                    accept="image/*"
                    label="换主图"
                  />
                </div>
              )}
            </figure>
          </div>
          <div className="hero-footer">
            <span>
              <Editable path="hero.footerLeft" />
            </span>
            <span className="scroll-mark">↓</span>
            <span className="ed-pre">
              <Editable path="hero.footerRight" multiline className="ed-pre" />
            </span>
          </div>
        </section>

        <section className="resume-page section-pad">
          <aside className="resume-sidebar reveal">
            <p className="resume-kicker">02 / CURRICULUM VITAE</p>
            <h2>李婧雯</h2>
            <p className="resume-role">编导 · 新媒体运营</p>
            <p className="resume-status">● 开放合作中</p>
            <div className="resume-contact">
              <p>⌕　18002067803</p>
              <p>✉　17612294812@163.com</p>
      <p>⌖　北京 </p>
            </div>
            <a className="resume-download" href="/简历_李婧雯_短视频编导.docx" download>下载简历 ↓</a>
            <div className="resume-facts">
              <span>2004.08<small>出生年月</small></span>
              <span>2年<small>工作经验</small></span>
              <span>编导 / 新媒体运营<small>求职方向</small></span>
            </div>
            <div className="resume-skills"><p>个人技能</p><span>ChatGPT · WorkBuddy · LibTV<br/>剪映 · 达芬奇 · 秘塔 · PS / AI<br/>视频封面设计 · 账号视觉体系搭建</span></div>
          </aside>
          <div className="resume-main reveal reveal--delay1">
            <div className="resume-heading"><span>WORK EXPERIENCE / 工作经历</span><h2>工作经历</h2></div>
            <div className="timeline">
              <article><time>2024.10 — 2026.09</time><h3>北京金诚同达（杭州）律师事务所 <em>IP 编导</em></h3><p>0-1 搭建婚姻律师账号，负责选题策划、文案撰写、拍摄统筹与直播节奏协同；产出 350+ 条作品，单条最高播放 600W+，账号涨粉 8W+，月用户留资提升至 280+。</p></article>
              <article><time>2024.02 — 2024.09</time><h3>上海国瓴律师事务所 <em>运营实习生</em></h3><p>负责律师账号选题、直播切片、剪辑发布与视觉统一；产出 230+ 条视频，日均更新 2+ 条，跑通“切片—剪辑—发布—成交转化”链路。</p></article>
              <article><time>2022.09 — 2026.06</time><h3>天津仁爱学院 <em>财务管理 · 全日制本科</em></h3><p>持续积累内容策划、影像表达与视觉系统搭建能力，形成从创意到成片的完整工作方法。</p></article>
            </div>
            <div className="resume-highlight"><strong>560+</strong><span>短视频产出</span><strong>823W+</strong><span>单条最高播放</span><strong>10000+</strong><span>平台公域留资</span></div>
          </div>
        </section>

        <section id="about" className="about section-pad">
          <div className="section-label reveal">
            <span>
              <Editable path="about.no" />
            </span>
            <span>
              <Editable path="about.label" />
            </span>
          </div>
          <div className="about-profile">
            <div className="about-profile-photo reveal reveal--delay1">
              <h2>关于我</h2>
              <figure>
                <SmartMedia src={content.hero.image} alt="李婧雯个人照片" />
              </figure>
            </div>
            <div className="about-profile-copy reveal reveal--delay2">
              <p className="about-profile-lead"><Editable path="about.lead" multiline className="ed-pre" /></p>
              <p><Editable path="about.body" multiline className="ed-pre" /></p>
              <p><Editable path="about.bio" multiline className="ed-pre" /></p>
            </div>
          </div>
        </section>

        <section id="work" className="work section-pad">
          <div className="section-label reveal">
            <span>
              <Editable path="work.no" />
            </span>
            <span>
              <Editable path="work.label" />
            </span>
            <span>
              <Editable path="work.extra" />
            </span>
          </div>
          <div className="work-head reveal reveal--delay1">
            <h2>
              <Editable path="work.titleA" />
              <br />
              <i>
                <Editable path="work.titleB" />
              </i>
            </h2>
            <p className="ed-pre">
              <Editable path="work.desc" multiline className="ed-pre" />
            </p>
          </div>
          <div className="project-grid">
            {projectList.map((p, i) => (
              <article
                className={`project ${p.cls} reveal reveal--delay${Math.min((i % 4) + 2, 5)}`}
                key={p.n}
                onClick={() => {
                  if (edit) return;
                  setActiveIdx(i);
                }}
                role="button"
                tabIndex="0"
                onKeyDown={(e) => {
                  if (edit) return;
                  if (e.key === 'Enter' || e.key === ' ') setActiveIdx(i);
                }}
              >
                <div className="media" data-parallax>
                  <MediaTransform path={`work.projects.${i}.transform`}>
                    <SmartMedia
                      kind="video"
                      src={p.video}
                      poster={p.poster}
                      preload="auto"
                      onLoadedMetadata={(e) => {
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  </MediaTransform>
                  <div className="play">
                    <Play size={14} fill="currentColor" />
                    <span>OPEN</span>
                  </div>
                </div>
                <div className="project-info">
                  <span>
                    {p.n} / {String(projectCount).padStart(2, '0')}
                  </span>
                  <Editable as="h3" path={`work.projects.${i}.title`} />
                  <Editable className="project-tag" path={`work.projects.${i}.tag`} />
                  <Editable path={`work.projects.${i}.meta`} />
                  <ArrowUpRight size={15} />
                </div>
                {edit && (
                  <div className="ed-row">
                    <MediaPicker
                      path={`work.projects.${i}.video`}
                      posterPath={`work.projects.${i}.poster`}
                      accept="video/*"
                      label="上传视频"
                    />
                    <MediaPicker
                      path={`work.projects.${i}.poster`}
                      accept="image/*"
                      label="换封面"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        set(
                          `work.projects.${i}.cls`,
                          RATIOS[(RATIOS.indexOf(p.cls) + 1) % RATIOS.length]
                        )
                      }
                      title="切换卡片比例"
                    >
                      比例 {p.cls}
                    </button>
                    <RowTools
                      onUp={() => projects.move(i, -1)}
                      onDown={() => projects.move(i, 1)}
                      onRemove={() => projects.remove(i)}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
          {edit && (
            <div className="ed-row">
              <button type="button" onClick={() => projects.add()}>
                + 增加视频模块
              </button>
            </div>
          )}
          <div className="archive-link reveal">
            <Plus size={14} /> <Editable path="work.archive" />{' '}
            <span>({projectCount} PROJECTS)</span>
          </div>
        </section>

        <section id="capabilities" className="capabilities section-pad">
          <div className="section-label reveal">
            <span>
              <Editable path="caps.no" />
            </span>
            <span>
              <Editable path="caps.label" />
            </span>
          </div>
          <div className="cap-grid">
            <div className="cap-intro reveal reveal--delay1">
              <h2>
                <Editable path="caps.titleA" />
                <br />
                <i>
                  <Editable path="caps.titleB" />
                </i>
              </h2>
              <p>
                <Editable path="caps.intro" multiline className="ed-pre" />
              </p>
            </div>
            <div className="cap-list">
              {content.caps.items.map((x, i) => (
                <div key={i}>
                  <div className={`cap-item reveal reveal--delay${i + 2}`}>
                    <span>
                      <Editable path={`caps.items.${i}.no`} />
                    </span>
                    <div>
                      <Editable as="h3" path={`caps.items.${i}.title`} />
                      <Editable as="p" path={`caps.items.${i}.desc`} multiline />
                    </div>
                    <ArrowUpRight size={16} />
                  </div>
                  {edit && (
                    <RowTools
                      onUp={() => capabilities.move(i, -1)}
                      onDown={() => capabilities.move(i, 1)}
                      onRemove={() => capabilities.remove(i)}
                    />
                  )}
                </div>
              ))}
              {edit && (
                <div className="ed-row">
                  <button type="button" onClick={() => capabilities.add()}>
                    + 加一项能力
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="contact" className="contact section-pad">
          <div className="section-label reveal">
            <span>
              <Editable path="contact.no" />
            </span>
            <span>
              <Editable path="contact.label" />
            </span>
          </div>
          <div className="contact-main reveal reveal--delay1">
            <p className="eyebrow contact-description">
              <Editable path="contact.eyebrow" />
            </p>
            <h2>
              <Editable path="contact.titleA" />
              {content.contact.titleB && <><br /><i><Editable path="contact.titleB" /></i></>}
            </h2>
            <div className="contact-pills">
              {content.contact.buttons.map((button, i) => (
                <span className="contact-pill" key={i}>
                  <Editable path={`contact.buttons.${i}`} />
                </span>
              ))}
            </div>
            <p className="contact-status"><span aria-hidden="true">●</span> <Editable path="contact.status" /></p>
          </div>
          {content.contact.bottom.length > 0 && <div className="contact-bottom reveal">
            {content.contact.bottom.map((b, i) => <span key={i}><Editable path={`contact.bottom.${i}`} /></span>)}
          </div>}
        </section>
      </main>

      {activeProject && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} video`}
          onClick={() => setActiveIdx(null)}
        >
          <div className="video-modal__panel" onClick={(e) => e.stopPropagation()}>
            <button
              className="video-modal__close"
              onClick={() => setActiveIdx(null)}
              aria-label="Close video"
            >
              CLOSE ×
            </button>
            <SmartMedia
              kind="video"
              src={activeProject.video}
              poster={activeProject.poster || '/hero-editorial.png'}
              controls
              autoPlay
              preload="auto"
              muted={false}
            />
            <div className="video-modal__meta">
              <span>
                {activeProject.n} / {String(projectCount).padStart(2, '0')}
              </span>
              <strong>{activeProject.title}</strong>
              <span>{activeProject.meta} · SOUND ON</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
