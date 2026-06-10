/* ============================================
   PRATHMESH JAIN — Portfolio JS
   Dark mode toggle + adaptive + interactions
   ============================================ */

// ── Dark Mode (runs immediately, before paint) ──
(function() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
})();

// ── Page load ──
document.body.style.opacity = '0';
window.addEventListener('load', () => {
  document.body.style.transition = 'opacity 0.4s ease';
  document.body.style.opacity = '1';
});

// ── Theme toggle ──
const themeToggle = document.getElementById('themeToggle');

function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'light';
}
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });
}

// Adapt to OS preference changes (when no manual override stored)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  if (!localStorage.getItem('theme')) {
    setTheme(e.matches ? 'dark' : 'light');
  }
});

// ── Header scroll ──
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ── Mobile menu ──
const burger        = document.getElementById('burger');
const drawer        = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');

function openDrawer() {
  burger.classList.add('active');
  drawer.classList.add('open');
  drawerOverlay.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  burger.classList.remove('active');
  drawer.classList.remove('open');
  drawerOverlay.classList.remove('show');
  document.body.style.overflow = '';
}
if (burger) burger.addEventListener('click', () =>
  drawer.classList.contains('open') ? closeDrawer() : openDrawer()
);
if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
document.querySelectorAll('.drawer-link').forEach(l => l.addEventListener('click', closeDrawer));

// ── Scroll-reveal ──
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Counter animation ──
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCount(el, target, duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOutCubic(t) * target);
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.about-numbers').forEach(el => counterObserver.observe(el));

// ── Active nav link on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAs    = document.querySelectorAll('.nav-links a');
const drawerAs = document.querySelectorAll('.drawer-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const targetId = '#' + entry.target.id;
      navAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetId);
      });
      drawerAs.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === targetId);
      });
    }
  });
}, { threshold: 0.45 });

sections.forEach(s => navObserver.observe(s));

// ── Smooth scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  });
});

// ── Hero role rotator ──
const roles = [
  'Software Development Engineer',
  'Full Stack Developer',
  'Cloud & DevOps Enthusiast',
  'Competitive Programmer · 1748'
];
const roleEl = document.querySelector('.hcard-role');
if (roleEl) {
  roleEl.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  let i = 0;
  setInterval(() => {
    roleEl.style.opacity = '0';
    roleEl.style.transform = 'translateY(6px)';
    setTimeout(() => {
      i = (i + 1) % roles.length;
      roleEl.textContent = roles[i];
      roleEl.style.opacity = '1';
      roleEl.style.transform = 'translateY(0)';
    }, 300);
  }, 3000);
}

// ── KitabGhar interactive demo ──
(function () {
  const card = document.getElementById('kg-card');
  if (!card) return;

  // Tab switcher
  const tabs  = card.querySelectorAll('.kg-chrome-tab');
  const views = card.querySelectorAll('.kg-view');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      views.forEach(v => v.classList.remove('active'));
      tab.classList.add('active');
      const target = card.querySelector('#kgView' + tab.dataset.view.charAt(0).toUpperCase() + tab.dataset.view.slice(1));
      if (target) target.classList.add('active');
    });
  });

  // Seat selection in booking view
  card.querySelectorAll('.kg-sm-seat.av').forEach(seat => {
    seat.addEventListener('click', () => {
      card.querySelectorAll('.kg-sm-seat').forEach(s => {
        if (s.classList.contains('sel')) { s.classList.remove('sel'); s.classList.add('av'); }
      });
      seat.classList.remove('av');
      seat.classList.add('sel');
      const bar = card.querySelector('.kg-cta-bar span');
      if (bar) bar.textContent = 'Seat ' + seat.textContent + ' · Floor 1';
    });
  });

  // Admin sidebar nav active state
  card.querySelectorAll('.kg-sb-item').forEach(item => {
    item.addEventListener('click', () => {
      card.querySelectorAll('.kg-sb-item').forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      // Update page title
      const titleEl = card.querySelector('.kg-page-title');
      if (titleEl) {
        const label = item.textContent.replace(/^[^\s]+\s/, '').trim();
        titleEl.textContent = label;
      }
    });
  });

  // Pulse occupied seats on hover of live grid
  const liveGrid = card.querySelector('#kgLiveGrid');
  if (liveGrid) {
    liveGrid.querySelectorAll('.kg-lg-seat.occ').forEach((seat, i) => {
      setTimeout(() => {
        seat.style.boxShadow = '0 0 0 2px rgba(248,113,113,.5)';
        setTimeout(() => seat.style.boxShadow = '', 600);
      }, i * 80);
    });
  }
})();

document.querySelectorAll('.hero-card, .proj-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    card.style.transition = 'transform 0.08s linear, box-shadow 0.3s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.45s ease, box-shadow 0.3s ease';
    card.style.transform = '';
  });
});

// ── Zuuby interactive Chrome Extension UI demo ──
(function () {
  function initZuubyPanel(container, options = {}) {
    const welcome = container.querySelector('.zuuby-ext-welcome');
    const chatArea = container.querySelector('.zuuby-ext-chat');
    const pills = container.querySelectorAll('.zp-pill');
    const statusProvider = container.querySelector('.zeh-status-provider');
    const statusDot = container.querySelector('.zeh-status-dot');
    const clearBtn = container.querySelector('.zuuby-clear-btn');
    const chips = container.querySelectorAll('.zec-chip');
    const input = container.querySelector('.zef-input');
    const sendBtn = container.querySelector('.zef-send-btn');
    const toast = container.querySelector('.zuuby-ext-toast');

    let activeProvider = 'gemini';
    let typing = false;
    let cycleTimer = null;
    let cycleIdx = 0;
    const providerOrder = ['gemini', 'groq', 'mistral', 'cohere'];

    const replies = {
      gemini: {
        summary: "This is Prathmesh Jain's professional portfolio. He is an SDE / Full-Stack Engineer skilled in React, Node.js, and Firebase. Key projects showcased are KitabGhar, Zuuby, EquiFund, and RideLink.",
        keyPoints: "Key highlights of Prathmesh's background:\n• Skilled in full-stack web development & Chrome extension design\n• Immediate availability for SDE roles\n• Creator of KitabGhar (multi-tenant SaaS) and Zuuby (auto-switching multi-AI extension)",
        tldr: "Prathmesh Jain is a highly capable full-stack developer ready for SDE opportunities. Check out his interactive projects on this page!",
        custom: "Gemini here! That's a great question. Prathmesh built me using Vanilla JS and the Chrome Extension API, leveraging client-side fallback."
      },
      groq: {
        summary: "⚡ Groq (Llama 3.1) Response: This page is Prathmesh Jain's digital portfolio, loaded with interactive mockups demonstrating full-stack engineering skills.",
        keyPoints: "⚡ Groq (Llama 3.1) Response:\n• React, Vite, Firebase stack expertise\n• Strong focus on UX and performance\n• Active Chrome Web Store developer",
        tldr: "⚡ Groq (Llama 3.1) Response: Prathmesh is a full-stack developer based in Indore, available immediately for SDE roles.",
        custom: "Groq Llama 3.1 here! Insanely fast response. Ask me anything about Prathmesh's skills."
      },
      mistral: {
        summary: "Mistral AI Response: A portfolio website detailing the software development career of Prathmesh Jain, featuring interactive full-stack app mockups.",
        keyPoints: "Mistral AI Response:\n• Expert in building multi-tenant SaaS platforms like KitabGhar\n• Proficient in Chrome MV3 Extension APIs\n• Focused on fluid, micro-animated client-side interfaces",
        tldr: "Mistral AI Response: Portfolio of SDE Prathmesh Jain, showcasing top projects with functional simulation environments.",
        custom: "Bonjour! Mistral AI here. Prathmesh is ready to tackle challenging front-end and back-end problems."
      },
      cohere: {
        summary: "Cohere Command-R: Portfolio of Prathmesh Jain, Full-Stack Developer. Showcases active projects and technical expertise.",
        keyPoints: "Cohere Command-R:\n• Expertise: React, Firebase, Node.js, Zustand, Chrome Extensions\n• Key Apps: KitabGhar (SaaS Room Booking), Zuuby (Chrome Extension)\n• Timeline: Open to SDE roles immediately",
        tldr: "Cohere Command-R: Prathmesh Jain is a software developer open to work immediately. Explore his featured items above.",
        custom: "Cohere Command-R ready! Prathmesh is a detail-oriented developer who loves building premium user experiences."
      }
    };

    function showToast(msg) {
      if (!toast) return;
      toast.innerHTML = `<svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style="margin-right:4px;"><path d="M13 2v9h9L11 22v-9H2L13 2z"/></svg> ${msg}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    function updateStatusUI(providerId) {
      if (statusProvider) statusProvider.textContent = providerId.charAt(0).toUpperCase() + providerId.slice(1);
      if (statusDot) {
        statusDot.className = 'zeh-status-dot ' + providerId;
      }
      pills.forEach(p => {
        p.classList.toggle('active', p.dataset.id === providerId);
      });
    }

    function addMessage(sender, text) {
      if (!chatArea) return;
      welcome.style.display = 'none';
      chatArea.style.display = 'flex';

      const line = document.createElement('div');
      line.className = 'zuuby-chat-line';

      const tag = document.createElement('span');
      tag.className = 'zcl-tag ' + sender;
      tag.textContent = sender === 'user' ? 'You' : sender.charAt(0).toUpperCase() + sender.slice(1);

      const content = document.createElement('span');
      content.className = 'zcl-content';
      content.innerHTML = text.replace(/\n/g, '<br>');

      line.appendChild(tag);
      line.appendChild(content);
      chatArea.appendChild(line);
      chatArea.scrollTop = chatArea.scrollHeight;
    }

    function handleQuery(text, isSuggestion = false) {
      if (typing) return;
      typing = true;

      if (input) { input.value = ''; input.disabled = true; }
      if (sendBtn) sendBtn.disabled = true;

      addMessage('user', text);

      const typingLine = document.createElement('div');
      typingLine.className = 'zuuby-chat-line';
      typingLine.id = 'zuubyTypingLine';
      typingLine.innerHTML = `
        <span class="zcl-tag ${activeProvider}">${activeProvider.charAt(0).toUpperCase() + activeProvider.slice(1)}</span>
        <span class="zuuby-typing"><span></span><span></span><span></span></span>
      `;
      chatArea.appendChild(typingLine);
      chatArea.scrollTop = chatArea.scrollHeight;

      let prevProvider = activeProvider;
      let fallbackPerformed = false;
      if (isSuggestion && Math.random() > 0.45) {
        const currentIdx = providerOrder.indexOf(activeProvider);
        const nextIdx = (currentIdx + 1) % providerOrder.length;
        activeProvider = providerOrder[nextIdx];
        fallbackPerformed = true;
      }

      setTimeout(() => {
        const indicator = chatArea.querySelector('#zuubyTypingLine');
        if (indicator) indicator.remove();

        if (fallbackPerformed) {
          updateStatusUI(activeProvider);
          const prevName = prevProvider.charAt(0).toUpperCase() + prevProvider.slice(1);
          const nextName = activeProvider.charAt(0).toUpperCase() + activeProvider.slice(1);
          showToast(`Auto-switched: ${prevName} → ${nextName} (Quota exceeded)`);
        }

        let reply = '';
        if (text.toLowerCase().includes('summarise') || text.toLowerCase().includes('summarize')) {
          reply = replies[activeProvider].summary;
        } else if (text.toLowerCase().includes('key') || text.toLowerCase().includes('takeaway')) {
          reply = replies[activeProvider].keyPoints;
        } else if (text.toLowerCase().includes('tl;dr') || text.toLowerCase().includes('tldr')) {
          reply = replies[activeProvider].tldr;
        } else {
          reply = replies[activeProvider].custom;
        }

        addMessage(activeProvider, reply);

        typing = false;
        if (input) { input.disabled = false; input.focus(); }
        if (sendBtn) sendBtn.disabled = false;
      }, 1200);
    }

    pills.forEach(p => {
      p.addEventListener('click', () => {
        stopAutoCycle();
        const id = p.dataset.id;
        if (id === activeProvider) return;
        
        const prevName = activeProvider.charAt(0).toUpperCase() + activeProvider.slice(1);
        const nextName = id.charAt(0).toUpperCase() + id.slice(1);
        
        activeProvider = id;
        updateStatusUI(id);
        showToast(`Switched to: ${nextName}`);
      });
    });

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        stopAutoCycle();
        const text = chip.dataset.text;
        handleQuery(text, true);
      });
    });

    if (input) {
      input.addEventListener('input', () => {
        if (sendBtn) sendBtn.disabled = !input.value.trim();
      });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && input.value.trim() && !typing) {
          stopAutoCycle();
          handleQuery(input.value.trim());
        }
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', () => {
        if (input.value.trim() && !typing) {
          stopAutoCycle();
          handleQuery(input.value.trim());
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (chatArea) {
          chatArea.innerHTML = '';
          chatArea.style.display = 'none';
        }
        if (welcome) welcome.style.display = 'flex';
        showToast('Chat history cleared');
      });
    }

    function startAutoCycle() {
      if (options.noCycle) return;
      cycleTimer = setInterval(() => {
        if (typing) return;
        cycleIdx = (cycleIdx + 1) % providerOrder.length;
        const nextProvider = providerOrder[cycleIdx];
        updateStatusUI(nextProvider);
        
        const prevName = activeProvider.charAt(0).toUpperCase() + activeProvider.slice(1);
        const nextName = nextProvider.charAt(0).toUpperCase() + nextProvider.slice(1);
        
        activeProvider = nextProvider;
        
        if (welcome.style.display !== 'none') {
          handleQuery("Give me a quick TL;DR", true);
        } else {
          showToast(`Auto-switched: ${prevName} → ${nextName}`);
        }
      }, 4500);
    }

    function stopAutoCycle() {
      if (cycleTimer) {
        clearInterval(cycleTimer);
        cycleTimer = null;
      }
    }

    if (options.observeIntersection && options.observerTarget) {
      const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          startAutoCycle();
        } else {
          stopAutoCycle();
        }
      }, { threshold: 0.5 });
      observer.observe(options.observerTarget);
    } else if (!options.noCycle) {
      startAutoCycle();
    }

    return {
      stopCycle: stopAutoCycle,
      startCycle: startAutoCycle
    };
  }

  const cardPanel = document.getElementById('zuubyDemo');
  const globalPanel = document.getElementById('zuubyGlobalPopup');
  const zuubyCard = document.getElementById('zuuby-card');

  if (cardPanel && zuubyCard) {
    initZuubyPanel(cardPanel, {
      observeIntersection: true,
      observerTarget: zuubyCard
    });
  }

  if (globalPanel) {
    initZuubyPanel(globalPanel, {
      noCycle: true
    });
  }

  // Global floating popup toggle
  const globalTrigger = document.getElementById('zuubyGlobalTrigger');
  const globalPopup = document.getElementById('zuubyGlobalPopup');
  const globalCloseBtn = document.getElementById('zuubyCloseBtn');

  if (globalTrigger && globalPopup) {
    globalTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = globalPopup.classList.contains('open');
      if (isOpen) {
        globalPopup.classList.remove('open');
      } else {
        globalPopup.classList.add('open');
        const input = globalPopup.querySelector('.zef-input');
        if (input) setTimeout(() => input.focus(), 200);
      }
    });

    if (globalCloseBtn) {
      globalCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        globalPopup.classList.remove('open');
      });
    }

    document.addEventListener('click', (e) => {
      if (!globalPopup.contains(e.target) && !globalTrigger.contains(e.target)) {
        globalPopup.classList.remove('open');
      }
    });
  }
})();