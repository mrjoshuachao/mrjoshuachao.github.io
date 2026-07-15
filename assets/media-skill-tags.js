(() => {
  "use strict";

  // Section-level profiles keep each skill row tied to the work directly above it.
  // They intentionally use the nearest preceding heading instead of the page overview,
  // so unrelated projects on the same page do not inherit one another's specialties.
  const sectionProfiles = [
    { pattern: /KKTV Television Commercials/i, skills: ["Integrated Campaigns", "Film Direction", "Storyboarding", "Motion & Video Direction", "Consumer Marketing"] },
    { pattern: /KKTV Landing Page/i, skills: ["UI\/UX & Web Direction", "Key Visual Development", "Digital Campaigns", "Brand Identity Systems"] },
    { pattern: /KKTV Drama Trailers/i, skills: ["Trailer Direction", "Video Editing", "Motion & Video Direction", "Content Marketing"] },
    { pattern: /KKTV Prepaid Cards/i, skills: ["Retail Design", "Print Production", "Brand Applications", "Consumer Marketing"] },
    { pattern: /KKTV Guidelines & Materials/i, skills: ["Brand Guidelines", "Brand Governance", "Motion Identity", "End-to-End Production"] },

    { pattern: /^Music Videos & jutv$/i, skills: ["Music Video Direction", "Artist Branding", "Storyboarding", "Video Production", "Motion & Video Direction"] },
    { pattern: /Anniversary Photography Book/i, skills: ["Photography Direction", "Editorial Design", "Art Direction", "Print Production"] },
    { pattern: /Project SUI Cover Arts/i, skills: ["Album Artwork", "Key Visual Development", "Artist Branding", "Art Direction"] },
    { pattern: /Project SUI Music Videos/i, skills: ["Music Video Direction", "Artist Branding", "Storyboarding", "Video Production", "Motion & Video Direction"] },

    { pattern: /KKBOX Group Image & Recruitment/i, skills: ["Employer Branding", "Recruitment Campaign", "Corporate Storytelling", "Film Direction", "Integrated Campaigns"] },
    { pattern: /KKBOX 2020 Brand Book & Application/i, skills: ["Brand Identity Systems", "Brand Guidelines", "Editorial Design", "Art Direction"] },
    { pattern: /KKStream \/ BlendVision/i, skills: ["3D Creative Direction", "Enterprise Storytelling", "Product Visualization", "Motion & Video Direction", "B2B Brand Communication"] },

    { pattern: /^KKCompany \(2021-2022\)/i, skills: ["Corporate Storytelling", "Brand Strategy", "Motion & Video Direction", "Executive Communication"] },
    { pattern: /Process Sketches & Concept Development/i, skills: ["Logo Design", "Brand Identity Systems", "Concept Development", "Color System"] },
    { pattern: /KKCompany Career Website & Search Interface Design/i, skills: ["UI\/UX & Web Direction", "Interaction Design", "Information Architecture", "Employer Branding"] },

    { pattern: /Connected Dots.*Motion System/i, skills: ["Motion Identity", "Brand Identity Systems", "Motion Direction", "Concept Development"] },
    { pattern: /Business Card Unified Design System/i, skills: ["Visual Identity", "Print Design", "Production Design", "Brand System Rollout"] },
    { pattern: /^KKCulture 2023 Website$/i, skills: ["UI\/UX & Web Direction", "Digital Brand System", "Motion Prototyping", "Responsive Design"] },
    { pattern: /Intro Deck Animation Design/i, skills: ["Presentation Design", "Motion Graphics", "Executive Communication", "Visual Storytelling"] },
    { pattern: /You Create.*Office Visual System/i, skills: ["Environmental Graphics", "Workplace Branding", "Spatial Applications", "Art Direction"] },
    { pattern: /KKCulture 2024 Website Redesign/i, skills: ["UI\/UX & Web Direction", "Digital Brand System", "Interaction Design", "Responsive Design"] },

    { pattern: /Project NV Computex Showreel/i, skills: ["Generative AI Creative Workflows", "AI Image Development", "Storyboarding", "Video Editing", "Creative Direction"] },
    { pattern: /Project NV Meetings with Alex Ju/i, skills: ["Creative Collaboration", "Concept Development", "AI Workflow Planning", "Cross-Functional Leadership"] },
    { pattern: /Kimberley.*Street Signs.*Generative AI MV/i, skills: ["Generative AI Creative Workflows", "Music Video Direction", "AI Image Development", "Video Editing", "Artist Branding"] },

    { pattern: /Applied Creativity Engine/i, skills: ["Curriculum Design", "Workshop Facilitation", "AI-Assisted Ideation", "Creative Education"] }
  ];

  const itemRules = [
    { pattern: /Turn Up Festival Merch/i, replace: ["Merchandise Design", "Event & Retail Design", "Brand Identity Systems", "Production Design"] },
    { pattern: /Feature Intro Video/i, replace: ["Product Storytelling", "Motion Design", "Brand Identity Systems", "Motion & Video Direction"] },
    { pattern: /Guidelines & Materials Open Database/i, replace: ["Digital Asset Curation", "UI\/UX & Web Direction", "Brand Guidelines", "Brand Governance"] },
    { pattern: /You Create.*Interface/i, skills: ["Interface Design"] },
    { pattern: /InCG Issue/i, replace: ["Editorial Communication", "Media Storytelling", "Generative AI Case Study", "Artist Branding"] },
    { pattern: /UWC ISAK JAPAN/i, skills: ["APAC Collaboration", "English-Language Facilitation"] },
    { pattern: /Chunghwa Telecom/i, skills: ["Corporate Training"] },
    { pattern: /Gallup|WAVE Brand Leadership/i, skills: ["Leadership Development", "Executive Training"] },
    { pattern: /Creative Confidence AI Summer Lab|Junyi|Sharestart/i, skills: ["Design Thinking", "Creative Facilitation"] }
  ];

  const pageKey = document.querySelector(".content-panel")?.dataset.panel
    || (location.pathname.split("/").pop() || "").replace(/\.html$/i, "")
    || "index";

  const uniqueSkills = (skills) => [...new Set(skills)].slice(0, 6);

  function buildGroup(skills) {
    const group = document.createElement("div");
    group.className = "media-skill-keywords";
    group.setAttribute("role", "list");
    group.setAttribute("aria-label", "Professional skills used in this work");

    uniqueSkills(skills).forEach((skill) => {
      const chip = document.createElement("span");
      chip.className = "media-skill-keyword";
      chip.setAttribute("role", "listitem");
      chip.textContent = skill;
      group.append(chip);
    });
    return group;
  }

  const pageHeadings = [...document.querySelectorAll(".content-panel h2")];

  function nearestPrecedingHeading(element) {
    let heading = null;
    pageHeadings.forEach((candidate) => {
      if (candidate.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING) {
        heading = candidate;
      }
    });
    return heading?.textContent?.trim() || "";
  }

  function skillsFor(element, media) {
    const itemContext = [
      element.dataset?.title,
      element.dataset?.id,
      element.getAttribute("aria-label"),
      element.querySelector("h3, figcaption")?.textContent
    ].filter(Boolean).join(" ");
    const headingContext = nearestPrecedingHeading(element);
    const sectionProfile = sectionProfiles.find((profile) => profile.pattern.test(headingContext));
    let skills = sectionProfile ? [...sectionProfile.skills] : [];

    itemRules.forEach((rule) => {
      if (!rule.pattern.test(itemContext)) return;
      if (rule.replace) skills = [...rule.replace];
      else skills.push(...rule.skills);
    });

    if (!skills.length) {
      skills = ["Creative Direction"];
      if (media?.matches("video, iframe")) skills.push("Motion & Video Direction");
      if (media?.matches("img")) skills.push("Art Direction");
    }
    return uniqueSkills(skills);
  }

  function ensureVisibleCaption({ card, media, body: existingBody, captionIsVisible }) {
    let body = existingBody;
    if (!body) {
      body = document.createElement("div");
      body.className = "card-body";
      card.append(body);
    }

    let caption = body.querySelector("h3, figcaption, p");
    if (!caption) {
      caption = document.createElement("h3");
      caption.className = "generated-media-caption";
      caption.textContent = card.dataset.title
        || media.getAttribute("alt")
        || media.getAttribute("title")
        || (media.matches("video, iframe") ? "Project Video" : "Project Image");
      body.prepend(caption);
    }

    if (!captionIsVisible) {
      body.classList.add("has-generated-media-caption");
      caption.classList.add("generated-media-caption");
    }
    body.classList.add("has-visible-media-caption");
    return body;
  }

  function groupedCaptionFor(gallery, items) {
    const sectionTitle = gallery.closest("section")?.querySelector(":scope > h2")?.textContent?.trim();
    return sectionTitle
      || items[0]?.card.dataset.title
      || items[0]?.media.getAttribute("alt")
      || "Selected Work";
  }

  const refreshGridLayoutClasses = () => {
    document.querySelectorAll(".grid").forEach((grid) => {
      grid.classList.toggle("is-layout-grid", getComputedStyle(grid).display === "grid");
    });
  };
  refreshGridLayoutClasses();
  addEventListener("resize", refreshGridLayoutClasses, { passive: true });

  const cardInfo = [...document.querySelectorAll(".card")].map((card) => {
    const media = card.querySelector(".media-frame video, .media-frame img, .media-frame iframe");
    const body = card.querySelector(":scope > .card-body");
    const caption = body?.querySelector("h3, figcaption, p");
    const captionIsVisible = Boolean(
      body
      && caption
      && getComputedStyle(body).display !== "none"
      && getComputedStyle(body).visibility !== "hidden"
      && getComputedStyle(caption).display !== "none"
      && getComputedStyle(caption).visibility !== "hidden"
    );
    return {
      card,
      media,
      body,
      captionIsVisible,
      gallery: card.closest(".grid")
    };
  }).filter(({ media }) => media);

  const galleryCards = new Map();
  cardInfo.forEach((info) => {
    if (!info.gallery) return;
    const items = galleryCards.get(info.gallery) || [];
    items.push(info);
    galleryCards.set(info.gallery, items);
  });

  const groupedRuns = [];
  const groupedCards = new WeakMap();
  galleryCards.forEach((items, gallery) => {
    let run = [];
    const finishRun = () => {
      if (run.length > 1) {
        const groupData = { gallery, items: run, skills: [] };
        groupedRuns.push(groupData);
        run.forEach(({ card }) => groupedCards.set(card, groupData));
      }
      run = [];
    };

    items.forEach((info) => {
      if (info.captionIsVisible) {
        finishRun();
      } else {
        run.push(info);
      }
    });
    finishRun();
  });

  cardInfo.forEach((info) => {
    const { card, media } = info;
    const groupedRun = groupedCards.get(card);
    if (groupedRun) {
      groupedRun.skills.push(...skillsFor(card, media));
      return;
    }
    const body = ensureVisibleCaption(info);
    if (card.querySelector(":scope > .card-body .media-skill-keywords")) return;
    body.classList.add("has-media-skill-keywords");
    body.append(buildGroup(skillsFor(card, media)));
    card.classList.add("has-individual-media-footer");
  });

  groupedRuns.forEach(({ gallery, items, skills }) => {
    const footer = document.createElement("div");
    footer.className = "grouped-media-footer";

    const captionBody = document.createElement("div");
    captionBody.className = "card-body grouped-media-caption has-visible-media-caption";
    const caption = document.createElement("h3");
    caption.textContent = groupedCaptionFor(gallery, items);
    captionBody.append(caption);
    footer.append(captionBody);

    const group = buildGroup(skills);
    group.classList.add("media-skill-keywords--gallery");
    footer.append(group);

    let placement = items.at(-1).card;
    while (placement.parentElement && placement.parentElement !== gallery) {
      placement = placement.parentElement;
    }
    if (placement.nextElementSibling?.classList.contains("grouped-media-footer")) return;
    placement.insertAdjacentElement("afterend", footer);
  });

})();
