(function () {
  var BASE_WIDTH = 800;
  var MOBILE_QUERY = "(max-width: 820px)";

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  function isChtPage() {
    return /(?:-cht|index-cht)\.html$/i.test(window.location.pathname);
  }

  function pageNameFor(section) {
    var suffix = isChtPage() ? "cht" : "eng";
    return section + "-" + suffix + ".html";
  }

  function isIndexPage() {
    var name = window.location.pathname.split("/").pop().toLowerCase() || "index.html";
    return name === "index.html" || name === "index-cht.html";
  }

  function pageFor(base) {
    return base + "-" + (isChtPage() ? "cht" : "eng") + ".html";
  }

  function buildMobileNav() {
    if (document.getElementById("kktv-rwd-mobile-nav")) {
      return;
    }

    var nav = document.createElement("nav");
    nav.id = "kktv-rwd-mobile-nav";
    nav.setAttribute("aria-label", "KKTV guideline navigation");

    var navRow = document.createElement("div");
    navRow.className = "kktv-rwd-nav-row";

    var brand = document.createElement("a");
    brand.className = "kktv-rwd-brand";
    brand.href = isChtPage() ? "index-cht.html" : "index.html";

    var logo = document.createElement("img");
    logo.className = "kktv-rwd-logo";
    logo.src = "images/kktv_logotype_-000000.gif";
    logo.setAttribute("data-hidpi-src", "images/kktv_logotype_-000000_2x.gif");
    logo.alt = "KKTV";
    logo.width = 74;
    logo.height = 36;
    brand.appendChild(logo);

    var title = document.createElement("span");
    title.className = "kktv-rwd-title";
    title.textContent = "Guidelines & Materials";
    brand.appendChild(title);
    navRow.appendChild(brand);

    var toggle = document.createElement("button");
    toggle.className = "kktv-rwd-menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigation menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "kktv-rwd-mobile-menu");
    for (var i = 0; i < 3; i += 1) {
      toggle.appendChild(document.createElement("span"));
    }
    navRow.appendChild(toggle);
    nav.appendChild(navRow);

    var links = document.createElement("div");
    links.id = "kktv-rwd-mobile-menu";
    links.className = "kktv-rwd-links";

    [
      ["General", pageNameFor("general")],
      ["Image", pageNameFor("image")],
      ["Video", pageNameFor("video")],
      ["Miscellany", pageNameFor("miscellany")]
    ].forEach(function (item) {
      var link = document.createElement("a");
      link.href = item[1];
      link.textContent = item[0];
      links.appendChild(link);
    });

    nav.appendChild(links);
    document.body.insertBefore(nav, document.body.firstChild);

    function closeMenu() {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    links.addEventListener("click", closeMenu);

    document.addEventListener("click", function (event) {
      if (!nav.contains(event.target)) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  function appendLink(parent, label, href) {
    var link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    parent.appendChild(link);
  }

  function appendGroup(parent, label, links) {
    var group = document.createElement("div");
    group.className = "kktv-rwd-index-group";

    var heading = document.createElement("div");
    heading.className = "kktv-rwd-index-group-title";
    heading.textContent = label;
    group.appendChild(heading);

    links.forEach(function (item) {
      appendLink(group, item[0], item[1]);
    });

    parent.appendChild(group);
  }

  function mobileIndexData() {
    var cht = isChtPage();
    return {
      title: "Guidelines & Materials",
      subtitle: cht ? "快速瀏覽 KKTV 品牌規範與素材。" : "The easiest way to gain access to the latest information.",
      sections: [
        {
          title: "General",
          icon: "images/_icon_general.gif",
          groups: [
            ["1. Logotype Series", [
              ["1.1. Logotype", pageFor("logotype")],
              ["1.2. Logotype & Slogan-A", pageFor("logotype-slogan-a")],
              ["1.3. Logotype & Slogan-B", pageFor("logotype-slogan-b")],
              ["1.4. Logotype & Slogan-C", pageFor("logotype-slogan-c")]
            ]],
            ["2. App Icon", [["2. App Icon", pageFor("app-icon")]]],
            ["3. Color", [["3. Color", pageFor("color")]]],
            ["4. Typeface", [
              ["4.1. Chinese Typeface", pageFor("chinese-typeface")],
              ["4.2. English Typeface", pageFor("english-typeface")],
              ["4.3. Japanese Typeface", pageFor("japanese-typeface")],
              ["4.4. Korean Typeface", pageFor("korean-typeface")]
            ]]
          ]
        },
        {
          title: "Image",
          icon: "images/_icon_image.gif",
          groups: [
            ["1. Screen-based", [
              ["1.1. Press Release Photo", cht ? "press-release-photo-screen-based-cht.html" : "screen-based-press-release-photo-eng.html"],
              ["1.2. Facebook Cover Photo", pageFor("facebook-cover-photo")]
            ]],
            ["2. Printing", [
              ["2.1. Press Release Photo", cht ? "press-release-photo-printing-cht.html" : "printing-press-release-photo-eng.html"],
              ["2.2. Postcard", pageFor("postcard")]
            ]]
          ]
        },
        {
          title: "Video",
          icon: "images/_icon_video.gif",
          groups: [
            ["1. Full HD (1920-by-1080)", [
              ["1.1.1. Teaser", pageFor("animation-in-full-hd-teaser")],
              ["1.1.2. Trailer", pageFor("animation-in-full-hd-trailer")],
              ["1.1.3. Original Drama", pageFor("animation-in-full-hd-original-drama")],
              ["1.2. Bug", pageFor("full-hd-video-bug")],
              ["1.3. Subtitle", pageFor("full-hd-video-subtitle")]
            ]],
            ["2. Square (1080-by-1080)", [
              ["2.1.1. Teaser", pageFor("animation-in-square-teaser")],
              ["2.1.2. Trailer", pageFor("animation-in-square-trailer")],
              ["2.2. Bug", pageFor("square-video-bug")],
              ["2.3. Subtitle", pageFor("square-video-subtitle")]
            ]]
          ]
        },
        {
          title: "Miscellany",
          icon: "images/_icon_other.gif",
          groups: [
            ["1. Wording", [
              ["1.1. The Company Name", pageFor("the-company-name")],
              ["1.2. The URL", pageFor("the-url")],
              ["1.3. Spacing", pageFor("spacing")]
            ]]
          ]
        }
      ]
    };
  }

  function buildMobileIndex() {
    if (!isIndexPage() || document.getElementById("kktv-rwd-mobile-index")) {
      return;
    }

    document.body.classList.add("kktv-rwd-index-page");

    var data = mobileIndexData();
    var main = document.createElement("main");
    main.id = "kktv-rwd-mobile-index";

    var hero = document.createElement("section");
    hero.className = "kktv-rwd-index-hero";

    var title = document.createElement("h1");
    title.textContent = data.title;
    hero.appendChild(title);

    var subtitle = document.createElement("p");
    subtitle.textContent = data.subtitle;
    hero.appendChild(subtitle);

    var language = document.createElement("div");
    language.className = "kktv-rwd-index-language";
    appendLink(language, "繁體中文", "index-cht.html");
    appendLink(language, "English", "index.html");
    hero.appendChild(language);
    main.appendChild(hero);

    data.sections.forEach(function (section) {
      var sectionEl = document.createElement("section");
      sectionEl.className = "kktv-rwd-index-section";

      var header = document.createElement("div");
      header.className = "kktv-rwd-index-section-header";

      var icon = document.createElement("img");
      icon.src = section.icon;
      icon.alt = "";
      icon.width = 60;
      icon.height = 60;
      header.appendChild(icon);

      var sectionTitle = document.createElement("h2");
      sectionTitle.textContent = section.title;
      header.appendChild(sectionTitle);
      sectionEl.appendChild(header);

      section.groups.forEach(function (group) {
        appendGroup(sectionEl, group[0], group[1]);
      });

      main.appendChild(sectionEl);
    });

    var shell = document.getElementById("kktv-rwd-shell");
    if (shell) {
      shell.parentNode.insertBefore(main, shell);
    } else {
      document.body.appendChild(main);
    }
  }

  function wrapPage() {
    var page = document.getElementById("page");
    if (!page) {
      return null;
    }

    if (page.parentElement && page.parentElement.id === "kktv-rwd-shell") {
      return page.parentElement;
    }

    var shell = document.createElement("div");
    shell.id = "kktv-rwd-shell";
    page.parentNode.insertBefore(shell, page);
    shell.appendChild(page);
    return shell;
  }

  function markFixedChrome() {
    var page = document.getElementById("page");
    if (!page) {
      return;
    }

    Array.prototype.forEach.call(page.querySelectorAll("*"), function (element) {
      var style = window.getComputedStyle(element);
      if (style.position === "fixed") {
        element.classList.add("kktv-rwd-hide-on-mobile");
      }
    });
  }

  function updateScale() {
    var page = document.getElementById("page");
    var shell = document.getElementById("kktv-rwd-shell");
    if (!page || !shell) {
      return;
    }

    if (!window.matchMedia(MOBILE_QUERY).matches) {
      document.documentElement.style.removeProperty("--kktv-rwd-scale");
      shell.style.width = "";
      shell.style.height = "";
      return;
    }

    var available = Math.max(280, window.innerWidth - 16);
    var scale = Math.min(1, available / BASE_WIDTH);
    var pageHeight = Math.max(page.scrollHeight, page.offsetHeight, page.getBoundingClientRect().height);

    document.documentElement.style.setProperty("--kktv-rwd-scale", scale.toFixed(5));
    shell.style.width = Math.ceil(BASE_WIDTH * scale) + "px";
    shell.style.height = Math.ceil(pageHeight * scale) + "px";
  }

  onReady(function () {
    buildMobileNav();
    wrapPage();
    buildMobileIndex();
    markFixedChrome();
    updateScale();
    window.addEventListener("resize", updateScale);
    window.addEventListener("orientationchange", updateScale);
    window.addEventListener("load", updateScale);
    window.setTimeout(updateScale, 250);
    window.setTimeout(updateScale, 1000);
  });
}());
