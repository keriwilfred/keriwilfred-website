(function () {
  if (!location.hash) {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }

  const CONTENT_KEY = "keri-site-content";
  const PASS_KEY = "keri-admin-pass";
  const AUTH_KEY = "keri-admin-auth";
  const DEFAULT_PASS = "admin123";

  const defaultContent = {
    hero: {
      eyebrow: "Design & Web Services",
      titleBefore: "Professional design that helps your business ",
      titleHighlight: "get noticed",
      titleAfter: "",
      subtitle:
        "Affordable logos, flyers, CVs and websites for shops, freelancers, companies and organizations — delivered fast and mobile-friendly.",
      stats: [
        { value: "7+", label: "Services" },
        { value: "3", label: "Website packages" },
        { value: "From $10", label: "Starting price" }
      ]
    },
    sections: {
      services: {
        eyebrow: "What I offer",
        title: "Services & pricing",
        sub: "Clear prices, no surprises. Pick what you need or mix and match."
      },
      packages: {
        eyebrow: "Website packages",
        title: "Pick the right package",
        sub: "From a simple one-page site to a full organization presence."
      },
      contact: {
        eyebrow: "Get in touch",
        title: "Let's start your project",
        sub: "Message me on WhatsApp or send an email — I usually reply quickly."
      }
    },
    services: [
      { icon: "📄", title: "Simple flyer or promotional poster", price: "$15", note: "" },
      { icon: "🎨", title: "Basic logo design", price: "$25", note: "" },
      { icon: "💳", title: "Business card design", price: "$10", note: "" },
      { icon: "📄", title: "CV formatting and design", price: "$10", note: "" },
      { icon: "🔗", title: "Add WhatsApp and social links to an existing website", price: "$10", note: "" },
      { icon: "✏️", title: "Website content updates", price: "$35", note: "" },
      { icon: "🛠️", title: "Basic website maintenance", price: "$40", note: "/ month" }
    ],
    packages: [
      {
        name: "Starter Website",
        forText: "For shops, salons, freelancers and small businesses",
        price: "$70–$100",
        features: [
          "One-page mobile-friendly website",
          "Services and contact information",
          "WhatsApp and social media links"
        ],
        featured: false
      },
      {
        name: "Business Website",
        forText: "For small companies, shops and service providers",
        price: "$150–$200",
        features: ["3–5 pages", "Contact form and map", "Responsive design and basic SEO"],
        featured: true
      },
      {
        name: "Organization Website",
        forText: "For NGOs, churches, schools and community projects",
        price: "$280–$340",
        features: ["5–8 pages", "Programs, projects and gallery", "Contact and donation links"],
        featured: false
      }
    ],
    contact: {
      whatsapp: "250796159206",
      whatsappDisplay: "+250 796 159 206",
      email: "kerilaguu@gmail.com",
      linkedin: "keriwilfred",
      linkedinUrl: "https://www.linkedin.com/in/keriwilfred"
    },
    profile: {
      posX: 58,
      posY: 22
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function mergeContent(saved) {
    const base = deepClone(defaultContent);
    if (!saved || typeof saved !== "object") return base;
    if (saved.hero) Object.assign(base.hero, saved.hero);
    if (saved.sections) {
      ["services", "packages", "contact"].forEach(function (key) {
        if (saved.sections[key]) Object.assign(base.sections[key], saved.sections[key]);
      });
    }
    if (Array.isArray(saved.services)) base.services = saved.services;
    if (Array.isArray(saved.packages)) base.packages = saved.packages;
    if (saved.contact) Object.assign(base.contact, saved.contact);
    if (saved.profile) Object.assign(base.profile, saved.profile);
    return base;
  }

  function loadContent() {
    try {
      const raw = localStorage.getItem(CONTENT_KEY);
      if (!raw) return deepClone(defaultContent);
      return mergeContent(JSON.parse(raw));
    } catch (_) {
      return deepClone(defaultContent);
    }
  }

  function saveContent(content) {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }

  let content = loadContent();

  const PHOTO_KEY = "keri-profile-photo";

  function applyProfilePhoto() {
    const img = document.getElementById("profileImg");
    if (!img) return;
    const pos = content.profile || { posX: 58, posY: 22 };
    img.style.objectPosition = pos.posX + "% " + pos.posY + "%";
    try {
      const saved = localStorage.getItem(PHOTO_KEY);
      if (saved) {
        img.src = saved;
        img.style.display = "block";
      }
    } catch (_) {}
  }

  applyProfilePhoto();

  function waLink(text) {
    const num = String(content.contact.whatsapp || "").replace(/\D/g, "");
    let url = "https://wa.me/" + num;
    if (text) url += "?text=" + encodeURIComponent(text);
    return url;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value == null ? "" : String(value);
  }

  function renderSite() {
    const hero = content.hero;
    setText("heroEyebrow", hero.eyebrow);
    const heroTitle = document.getElementById("heroTitle");
    if (heroTitle) {
      heroTitle.innerHTML =
        escapeHtml(hero.titleBefore) +
        '<span class="gradient-text">' +
        escapeHtml(hero.titleHighlight) +
        "</span>" +
        escapeHtml(hero.titleAfter);
    }
    setText("heroSub", hero.subtitle);

    const statsEl = document.getElementById("heroStats");
    if (statsEl) {
      statsEl.innerHTML = (hero.stats || [])
        .map(function (s) {
          return (
            "<li><strong>" +
            escapeHtml(s.value) +
            "</strong><span>" +
            escapeHtml(s.label) +
            "</span></li>"
          );
        })
        .join("");
    }

    setText("servicesEyebrow", content.sections.services.eyebrow);
    setText("servicesTitle", content.sections.services.title);
    setText("servicesSub", content.sections.services.sub);
    setText("packagesEyebrow", content.sections.packages.eyebrow);
    setText("packagesTitle", content.sections.packages.title);
    setText("packagesSub", content.sections.packages.sub);
    setText("contactEyebrow", content.sections.contact.eyebrow);
    setText("contactTitle", content.sections.contact.title);
    setText("contactSub", content.sections.contact.sub);

    const servicesGrid = document.getElementById("servicesGrid");
    if (servicesGrid) {
      servicesGrid.innerHTML = (content.services || [])
        .map(function (s) {
          return (
            '<article class="card reveal visible">' +
            '<div class="card-icon">' +
            escapeHtml(s.icon) +
            "</div>" +
            "<h3>" +
            escapeHtml(s.title) +
            "</h3>" +
            '<p class="price">' +
            escapeHtml(s.price) +
            (s.note
              ? ' <small>' + escapeHtml(s.note) + "</small>"
              : "") +
            "</p>" +
            "</article>"
          );
        })
        .join("");
    }

    const packagesGrid = document.getElementById("packagesGrid");
    if (packagesGrid) {
      packagesGrid.innerHTML = (content.packages || [])
        .map(function (p) {
          const featured = p.featured ? " package-featured" : "";
          const badge = p.featured ? '<span class="badge">Popular</span>' : "";
          const btnClass = p.featured ? "btn btn-primary" : "btn btn-ghost";
          const features = (p.features || [])
            .map(function (f) {
              return "<li>" + escapeHtml(f) + "</li>";
            })
            .join("");
          return (
            '<article class="card package-card' +
            featured +
            ' reveal visible">' +
            badge +
            '<p class="package-for">' +
            escapeHtml(p.forText) +
            "</p>" +
            "<h3>" +
            escapeHtml(p.name) +
            "</h3>" +
            '<p class="package-price">' +
            escapeHtml(p.price) +
            "</p>" +
            '<ul class="feature-list">' +
            features +
            "</ul>" +
            '<a href="' +
            escapeHtml(waLink("Hi! I'm interested in the " + p.name + " package")) +
            '" class="' +
            btnClass +
            '" target="_blank" rel="noopener">Get started</a>' +
            "</article>"
          );
        })
        .join("");
    }

    const icons = {
      whatsapp:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>',
      email:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
      linkedin:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>'
    };

    const contactGrid = document.getElementById("contactGrid");
    if (contactGrid) {
      const c = content.contact;
      contactGrid.innerHTML =
        '<a class="contact-card reveal visible" href="' +
        escapeHtml(waLink()) +
        '" target="_blank" rel="noopener">' +
        '<div class="card-icon">' +
        icons.whatsapp +
        "</div><h3>WhatsApp</h3><p>" +
        escapeHtml(c.whatsappDisplay) +
        "</p></a>" +
        '<a class="contact-card reveal visible" href="mailto:' +
        escapeHtml(c.email) +
        '">' +
        '<div class="card-icon">' +
        icons.email +
        "</div><h3>Email</h3><p>" +
        escapeHtml(c.email) +
        "</p></a>" +
        '<a class="contact-card reveal visible" href="' +
        escapeHtml(c.linkedinUrl) +
        '" target="_blank" rel="noopener">' +
        '<div class="card-icon">' +
        icons.linkedin +
        "</div><h3>LinkedIn</h3><p>" +
        escapeHtml(c.linkedin) +
        "</p></a>";
    }

    const wa = waLink();
    ["navWhatsapp", "heroWhatsapp"].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) el.setAttribute("href", wa);
    });
    const cta = document.getElementById("contactCta");
    if (cta) {
      cta.setAttribute("href", waLink("Hi! I'd like to discuss a project"));
    }
  }

  renderSite();

  // Nav
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const yearEl = document.getElementById("year");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      const open = navLinks.classList.toggle("open");
      navToggle.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });

    function closeMenu() {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }

    const desktopMq = window.matchMedia("(min-width: 769px)");
    function onBreakpointChange(e) {
      if (e.matches) closeMenu();
    }
    if (desktopMq.addEventListener) {
      desktopMq.addEventListener("change", onBreakpointChange);
    } else if (desktopMq.addListener) {
      desktopMq.addListener(onBreakpointChange);
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  // Reveal animations
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) {
      el.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  // Active nav
  const sections = document.querySelectorAll("main section[id]");
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]:not(.btn)');

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute("id");
          navAnchors.forEach(function (anchor) {
            anchor.classList.toggle("active", anchor.getAttribute("href") === "#" + id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // ——— Admin panel ———
  const adminOverlay = document.getElementById("adminOverlay");
  const adminLogin = document.getElementById("adminLogin");
  const adminEditor = document.getElementById("adminEditor");
  const adminPassword = document.getElementById("adminPassword");
  const adminLoginError = document.getElementById("adminLoginError");
  const adminLoginBtn = document.getElementById("adminLoginBtn");
  const adminClose = document.getElementById("adminClose");
  const adminSave = document.getElementById("adminSave");
  const adminRevert = document.getElementById("adminRevert");
  const adminLogout = document.getElementById("adminLogout");
  const adminStatus = document.getElementById("adminStatus");
  const adNewPassword = document.getElementById("adNewPassword");
  const adExport = document.getElementById("adExport");
  const adImportBtn = document.getElementById("adImportBtn");
  const adImportFile = document.getElementById("adImportFile");
  const adStats = document.getElementById("adStats");
  const adServices = document.getElementById("adServices");
  const adPackages = document.getElementById("adPackages");
  const adAddStat = document.getElementById("adAddStat");
  const adAddService = document.getElementById("adAddService");
  const adAddPackage = document.getElementById("adAddPackage");

  function showStatus(msg) {
    if (!adminStatus) return;
    adminStatus.hidden = false;
    adminStatus.textContent = msg;
    clearTimeout(showStatus._t);
    showStatus._t = setTimeout(function () {
      adminStatus.hidden = true;
    }, 3500);
  }

  function isAuthenticated() {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch (_) {
      return false;
    }
  }

  function setAuthenticated(on) {
    try {
      if (on) sessionStorage.setItem(AUTH_KEY, "1");
      else sessionStorage.removeItem(AUTH_KEY);
    } catch (_) {}
  }

  function getStoredPass() {
    try {
      return localStorage.getItem(PASS_KEY) || DEFAULT_PASS;
    } catch (_) {
      return DEFAULT_PASS;
    }
  }

  function setStoredPass(pass) {
    try {
      localStorage.setItem(PASS_KEY, pass);
    } catch (_) {}
  }

  function openAdmin() {
    if (!adminOverlay) return;
    adminOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    if (isAuthenticated()) {
      adminLogin.hidden = true;
      adminEditor.hidden = false;
      fillAdminForms();
      if (adminClose) adminClose.focus();
    } else {
      adminLogin.hidden = false;
      adminEditor.hidden = true;
      if (adminLoginError) adminLoginError.hidden = true;
      if (adminPassword) {
        adminPassword.value = "";
        adminPassword.focus();
      }
    }
  }

  function closeAdmin() {
    if (!adminOverlay) return;
    adminOverlay.hidden = true;
    document.body.style.overflow = "";
  }

  function fieldVal(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (arguments.length === 1) return el.value;
    el.value = value == null ? "" : String(value);
  }

  function makeItemCard(titleLabel) {
    const item = document.createElement("div");
    item.className = "admin-item";
    item.innerHTML =
      '<div class="admin-item-head"><strong>' +
      escapeHtml(titleLabel) +
      '</strong><button type="button" class="admin-item-remove">Remove</button></div>';
    return item;
  }

  function labelInput(parent, labelText, value, className) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const input = document.createElement("input");
    input.type = "text";
    input.className = "admin-input" + (className ? " " + className : "");
    input.value = value == null ? "" : String(value);
    label.appendChild(input);
    parent.appendChild(label);
    return input;
  }

  function labelTextarea(parent, labelText, value, rows) {
    const label = document.createElement("label");
    label.textContent = labelText;
    const ta = document.createElement("textarea");
    ta.className = "admin-input";
    ta.rows = rows || 3;
    ta.value = value == null ? "" : String(value);
    label.appendChild(ta);
    parent.appendChild(label);
    return ta;
  }

  function fillAdminForms() {
    const c = content;
    fieldVal("adHeroEyebrow", c.hero.eyebrow);
    fieldVal("adHeroTitleBefore", c.hero.titleBefore);
    fieldVal("adHeroTitleHighlight", c.hero.titleHighlight);
    fieldVal("adHeroTitleAfter", c.hero.titleAfter);
    fieldVal("adHeroSub", c.hero.subtitle);
    fieldVal("adServicesEyebrow", c.sections.services.eyebrow);
    fieldVal("adServicesTitle", c.sections.services.title);
    fieldVal("adServicesSub", c.sections.services.sub);
    fieldVal("adPackagesEyebrow", c.sections.packages.eyebrow);
    fieldVal("adPackagesTitle", c.sections.packages.title);
    fieldVal("adPackagesSub", c.sections.packages.sub);
    fieldVal("adContactEyebrow", c.sections.contact.eyebrow);
    fieldVal("adContactTitle", c.sections.contact.title);
    fieldVal("adContactSub", c.sections.contact.sub);
    fieldVal("adWhatsapp", c.contact.whatsapp);
    fieldVal("adWhatsappDisplay", c.contact.whatsappDisplay);
    fieldVal("adEmail", c.contact.email);
    fieldVal("adLinkedin", c.contact.linkedin);
    fieldVal("adLinkedinUrl", c.contact.linkedinUrl);
    const adPhotoX = document.getElementById("adPhotoX");
    const adPhotoY = document.getElementById("adPhotoY");
    if (adPhotoX) adPhotoX.value = c.profile ? c.profile.posX : 58;
    if (adPhotoY) adPhotoY.value = c.profile ? c.profile.posY : 22;
    if (adNewPassword) adNewPassword.value = "";

    if (adStats) {
      adStats.innerHTML = "";
      (c.hero.stats || []).forEach(function (s) {
        addStatRow(s);
      });
    }
    if (adServices) {
      adServices.innerHTML = "";
      (c.services || []).forEach(function (s) {
        addServiceRow(s);
      });
    }
    if (adPackages) {
      adPackages.innerHTML = "";
      (c.packages || []).forEach(function (p) {
        addPackageRow(p);
      });
    }
  }

  function addStatRow(stat) {
    stat = stat || { value: "", label: "" };
    const item = makeItemCard("Stat");
    item.querySelector(".admin-item-remove").addEventListener("click", function () {
      item.remove();
    });
    labelInput(item, "Value", stat.value);
    labelInput(item, "Label", stat.label);
    adStats.appendChild(item);
  }

  function addServiceRow(svc) {
    svc = svc || { icon: "✨", title: "", price: "", note: "" };
    const item = makeItemCard("Service");
    item.querySelector(".admin-item-remove").addEventListener("click", function () {
      item.remove();
    });
    labelInput(item, "Icon (emoji)", svc.icon);
    labelInput(item, "Title", svc.title);
    labelInput(item, "Price", svc.price);
    labelInput(item, "Price note (optional, e.g. / month)", svc.note);
    adServices.appendChild(item);
  }

  function addPackageRow(pkg) {
    pkg = pkg || { name: "", forText: "", price: "", features: [], featured: false };
    const item = makeItemCard("Package");
    item.querySelector(".admin-item-remove").addEventListener("click", function () {
      item.remove();
    });
    labelInput(item, "Name", pkg.name);
    labelInput(item, "Who it's for", pkg.forText);
    labelInput(item, "Price", pkg.price);
    labelTextarea(item, "Features (one per line)", (pkg.features || []).join("\n"), 4);
    const checkLabel = document.createElement("label");
    checkLabel.className = "admin-check";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = !!pkg.featured;
    checkLabel.appendChild(checkbox);
    checkLabel.appendChild(document.createTextNode(" Highlight as Popular"));
    item.appendChild(checkLabel);
    adPackages.appendChild(item);
  }

  function collectInputs(container) {
    return Array.prototype.slice.call(container.querySelectorAll(".admin-item"));
  }

  function readAdminContent() {
    const next = deepClone(defaultContent);
    next.hero.eyebrow = fieldVal("adHeroEyebrow");
    next.hero.titleBefore = fieldVal("adHeroTitleBefore");
    next.hero.titleHighlight = fieldVal("adHeroTitleHighlight");
    next.hero.titleAfter = fieldVal("adHeroTitleAfter");
    next.hero.subtitle = fieldVal("adHeroSub");
    next.sections.services.eyebrow = fieldVal("adServicesEyebrow");
    next.sections.services.title = fieldVal("adServicesTitle");
    next.sections.services.sub = fieldVal("adServicesSub");
    next.sections.packages.eyebrow = fieldVal("adPackagesEyebrow");
    next.sections.packages.title = fieldVal("adPackagesTitle");
    next.sections.packages.sub = fieldVal("adPackagesSub");
    next.sections.contact.eyebrow = fieldVal("adContactEyebrow");
    next.sections.contact.title = fieldVal("adContactTitle");
    next.sections.contact.sub = fieldVal("adContactSub");
    next.contact.whatsapp = fieldVal("adWhatsapp");
    next.contact.whatsappDisplay = fieldVal("adWhatsappDisplay");
    next.contact.email = fieldVal("adEmail");
    next.contact.linkedin = fieldVal("adLinkedin");
    next.contact.linkedinUrl = fieldVal("adLinkedinUrl");
    const adPhotoX = document.getElementById("adPhotoX");
    const adPhotoY = document.getElementById("adPhotoY");
    next.profile = {
      posX: adPhotoX ? parseInt(adPhotoX.value, 10) || 50 : 58,
      posY: adPhotoY ? parseInt(adPhotoY.value, 10) || 50 : 22
    };

    next.hero.stats = collectInputs(adStats).map(function (item) {
      const inputs = item.querySelectorAll("input.admin-input");
      return { value: inputs[0].value, label: inputs[1].value };
    });

    next.services = collectInputs(adServices).map(function (item) {
      const inputs = item.querySelectorAll("input.admin-input");
      return {
        icon: inputs[0].value,
        title: inputs[1].value,
        price: inputs[2].value,
        note: inputs[3].value
      };
    });

    next.packages = collectInputs(adPackages).map(function (item) {
      const inputs = item.querySelectorAll("input.admin-input");
      const ta = item.querySelector("textarea.admin-input");
      const checkbox = item.querySelector('input[type="checkbox"]');
      return {
        name: inputs[0].value,
        forText: inputs[1].value,
        price: inputs[2].value,
        features: (ta.value || "")
          .split("\n")
          .map(function (line) {
            return line.trim();
          })
          .filter(Boolean),
        featured: !!(checkbox && checkbox.checked)
      };
    });

    return next;
  }

  if (adminLoginBtn) {
    adminLoginBtn.addEventListener("click", function () {
      const pass = adminPassword ? adminPassword.value : "";
      if (pass === getStoredPass()) {
        setAuthenticated(true);
        adminLogin.hidden = true;
        adminEditor.hidden = false;
        if (adminLoginError) adminLoginError.hidden = true;
        fillAdminForms();
      } else {
        if (adminLoginError) adminLoginError.hidden = false;
        if (adminPassword) adminPassword.value = "";
      }
    });
  }

  if (adminPassword) {
    adminPassword.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (adminLoginBtn) adminLoginBtn.click();
      }
    });
  }

  if (adminSave) {
    adminSave.addEventListener("click", function () {
      const newPass = adNewPassword ? adNewPassword.value : "";
      if (newPass) {
        if (newPass.length < 4) {
          showStatus("New password must be at least 4 characters.");
          return;
        }
        setStoredPass(newPass);
        if (adNewPassword) adNewPassword.value = "";
      }
      content = readAdminContent();
      try {
        saveContent(content);
      } catch (_) {
        showStatus("Could not save — browser storage may be full.");
        return;
      }
      renderSite();
      applyProfilePhoto();
      showStatus("Saved. Your site is updated.");
    });
  }

  if (adminRevert) {
    adminRevert.addEventListener("click", function () {
      if (!confirm("Reset all site content back to defaults?")) return;
      try {
        localStorage.removeItem(CONTENT_KEY);
        localStorage.removeItem(PHOTO_KEY);
      } catch (_) {}
      content = deepClone(defaultContent);
      const img = document.getElementById("profileImg");
      if (img) {
        img.removeAttribute("src");
        img.setAttribute("src", "profile.jpg");
        img.style.display = "";
        img.onerror = function () {
          img.style.display = "none";
          img.onerror = null;
        };
      }
      renderSite();
      applyProfilePhoto();
      fillAdminForms();
      showStatus("Reset to default content and photo.");
    });
  }

  const adResetPhoto = document.getElementById("adResetPhoto");
  if (adResetPhoto) {
    adResetPhoto.addEventListener("click", function () {
      if (!confirm("Reset the profile photo back to profile.jpg?")) return;
      try {
        localStorage.removeItem(PHOTO_KEY);
      } catch (_) {}
      const img = document.getElementById("profileImg");
      if (img) {
        img.removeAttribute("src");
        img.setAttribute("src", "profile.jpg");
        img.style.display = "";
        img.onerror = function () {
          img.style.display = "none";
          img.onerror = null;
        };
      }
      applyProfilePhoto();
      showStatus("Photo reset to default file.");
    });
  }

  const adUploadPhoto = document.getElementById("adUploadPhoto");
  const adPhotoFile = document.getElementById("adPhotoFile");
  if (adUploadPhoto && adPhotoFile) {
    adUploadPhoto.addEventListener("click", function () {
      adPhotoFile.click();
    });
    adPhotoFile.addEventListener("change", function () {
      const f = adPhotoFile.files && adPhotoFile.files[0];
      if (!f) return;
      if (!f.type.startsWith("image/")) {
        alert("Please choose an image file.");
        adPhotoFile.value = "";
        return;
      }
      if (f.size > 8 * 1024 * 1024) {
        alert("Image is too large (max 8 MB).");
        adPhotoFile.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        const dataUrl = String(reader.result);
        try {
          localStorage.setItem(PHOTO_KEY, dataUrl);
        } catch (_) {
          showStatus("Could not save photo — try a smaller image.");
          adPhotoFile.value = "";
          return;
        }
        const img = document.getElementById("profileImg");
        if (img) {
          img.src = dataUrl;
          img.style.display = "block";
        }
        showStatus("Photo loaded. Adjust focus, then Publish photo to website.");
      };
      reader.readAsDataURL(f);
      adPhotoFile.value = "";
    });
  }

  const adPublishPhoto = document.getElementById("adPublishPhoto");
  if (adPublishPhoto) {
    adPublishPhoto.addEventListener("click", function () {
      const img = document.getElementById("profileImg");
      let dataUrl = "";
      try {
        dataUrl = localStorage.getItem(PHOTO_KEY) || "";
      } catch (_) {}
      if (!dataUrl && img && img.src && img.src.indexOf("data:") === 0) {
        dataUrl = img.src;
      }
      if (!dataUrl) {
        showStatus("Choose a photo first, then publish.");
        return;
      }
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "profile.jpg";
      document.body.appendChild(a);
      a.click();
      a.remove();
      showStatus(
        "Downloaded profile.jpg. Put it in the site folder, then push to GitHub so all devices show it."
      );
    });
  }

  const adPhotoX = document.getElementById("adPhotoX");
  const adPhotoY = document.getElementById("adPhotoY");
  function previewPhotoFocus() {
    const img = document.getElementById("profileImg");
    if (!img || !adPhotoX || !adPhotoY) return;
    img.style.objectPosition = adPhotoX.value + "% " + adPhotoY.value + "%";
  }
  if (adPhotoX) adPhotoX.addEventListener("input", previewPhotoFocus);
  if (adPhotoY) adPhotoY.addEventListener("input", previewPhotoFocus);

  if (adminLogout) {
    adminLogout.addEventListener("click", function () {
      setAuthenticated(false);
      adminEditor.hidden = true;
      adminLogin.hidden = false;
      if (adminPassword) adminPassword.value = "";
    });
  }

  if (adminClose) {
    adminClose.addEventListener("click", closeAdmin);
  }

  if (adminOverlay) {
    adminOverlay.addEventListener("click", function (e) {
      if (e.target === adminOverlay) closeAdmin();
    });
  }

  if (adAddStat) {
    adAddStat.addEventListener("click", function () {
      addStatRow({ value: "", label: "" });
    });
  }
  if (adAddService) {
    adAddService.addEventListener("click", function () {
      addServiceRow(null);
    });
  }
  if (adAddPackage) {
    adAddPackage.addEventListener("click", function () {
      addPackageRow(null);
    });
  }

  if (adExport) {
    adExport.addEventListener("click", function () {
      const data = JSON.stringify(readAdminContent(), null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "keriwilfred-site-content.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showStatus("Content exported.");
    });
  }

  if (adImportBtn && adImportFile) {
    adImportBtn.addEventListener("click", function () {
      adImportFile.click();
    });
    adImportFile.addEventListener("change", function () {
      const file = adImportFile.files && adImportFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          content = mergeContent(JSON.parse(String(reader.result)));
          fillAdminForms();
          showStatus("Imported. Click Save & publish to apply.");
        } catch (_) {
          showStatus("Invalid content file.");
        }
      };
      reader.readAsText(file);
      adImportFile.value = "";
    });
  }

  // Open admin via #admin link, footer Sign in, or Ctrl+Shift+A
  const footerSignin = document.getElementById("footerSignin");
  if (footerSignin) {
    footerSignin.addEventListener("click", function () {
      openAdmin();
    });
  }

  function maybeOpenAdminFromHash() {
    if (location.hash === "#admin") {
      openAdmin();
      history.replaceState(null, "", location.pathname + location.search);
    }
  }
  maybeOpenAdminFromHash();
  window.addEventListener("hashchange", maybeOpenAdminFromHash);

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      if (adminOverlay && !adminOverlay.hidden) closeAdmin();
      else openAdmin();
    }
  });
})();
