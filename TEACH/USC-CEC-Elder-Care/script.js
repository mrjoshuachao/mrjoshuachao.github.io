const signupForm = document.querySelector(".signup-form");
const formMessage = document.querySelector(".form-message");
const canUseFineMotion = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const countdownHours = document.querySelector("[data-countdown-hours]");
const countdownMinutes = document.querySelector("[data-countdown-minutes]");
const countdownSeconds = document.querySelector("[data-countdown-seconds]");
const countdownDeadline = new Date("2026-06-01T23:59:59+08:00").getTime();
const seatCount = document.querySelector("[data-seat-count]");
const visibleSeats = 24;
const courseCalendar = document.querySelector("[data-course-calendar]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarTitle = document.querySelector("[data-calendar-title]");
const calendarPrev = document.querySelector("[data-calendar-prev]");
const calendarNext = document.querySelector("[data-calendar-next]");
const courseTimeInput = document.querySelector("[data-course-time]");
const calendarSelection = document.querySelector("[data-calendar-selection]");
let resetCourseCalendar = () => {};

if (countdownHours && countdownMinutes && countdownSeconds) {
  const updateCountdown = () => {
    const remaining = Math.max(0, countdownDeadline - Date.now());
    const totalSeconds = remaining / 1000;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownHours.textContent = String(hours).padStart(3, "0");
    countdownMinutes.textContent = String(minutes).padStart(2, "0");
    countdownSeconds.textContent = seconds.toFixed(1).padStart(4, "0");
  };

  updateCountdown();
  window.setInterval(updateCountdown, 100);
}

if (seatCount) {
  seatCount.textContent = String(visibleSeats);

  window.setInterval(() => {
    seatCount.classList.remove("is-pulsing");
    window.requestAnimationFrame(() => seatCount.classList.add("is-pulsing"));
  }, 5200);
}

if (courseCalendar && calendarGrid && calendarTitle && courseTimeInput && calendarSelection) {
  const courseStart = new Date(2026, 5, 7);
  const courseEnd = new Date(2026, 9, 26);
  const monthFormatter = new Intl.DateTimeFormat("zh-TW", { month: "long", year: "numeric" });
  const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
    day: "numeric",
    month: "numeric",
    weekday: "short",
    year: "numeric",
  });
  let visibleMonth = new Date(2026, 5, 1);
  let selectedDateKey = "";

  const toDateKey = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const isCourseDay = (date) => {
    const day = date.getDay();
    return date >= courseStart && date <= courseEnd && (day === 2 || day === 4);
  };

  const setCalendarNavState = () => {
    const firstMonth = new Date(courseStart.getFullYear(), courseStart.getMonth(), 1);
    const lastMonth = new Date(courseEnd.getFullYear(), courseEnd.getMonth(), 1);
    calendarPrev.disabled = visibleMonth <= firstMonth;
    calendarNext.disabled = visibleMonth >= lastMonth;
  };

  const selectCourseDate = (date) => {
    selectedDateKey = toDateKey(date);
    const label = dateFormatter.format(date);
    courseTimeInput.value = `${label}｜09:30-16:30`;
    calendarSelection.textContent = `已選擇：${label}｜09:30-16:30`;
    renderCalendar();
  };

  const renderCalendar = () => {
    calendarGrid.textContent = "";
    calendarTitle.textContent = monthFormatter.format(visibleMonth);

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0).getDate();

    for (let index = 0; index < firstDay.getDay(); index += 1) {
      const spacer = document.createElement("span");
      spacer.className = "calendar-empty";
      calendarGrid.append(spacer);
    }

    for (let day = 1; day <= lastDate; day += 1) {
      const date = new Date(year, month, day);
      const dateKey = toDateKey(date);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      button.textContent = String(day);

      if (isCourseDay(date)) {
        button.classList.add("is-available");
        button.setAttribute("aria-label", `選擇 ${dateFormatter.format(date)} 09:30 到 16:30`);
        button.addEventListener("click", () => selectCourseDate(date));
      } else {
        button.disabled = true;
        button.classList.add("is-disabled");
        button.setAttribute("aria-label", `${dateFormatter.format(date)} 無課程`);
      }

      if (dateKey === selectedDateKey) {
        button.classList.add("is-selected");
        button.setAttribute("aria-pressed", "true");
      }

      calendarGrid.append(button);
    }

    setCalendarNavState();
  };

  calendarPrev?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
    renderCalendar();
  });

  calendarNext?.addEventListener("click", () => {
    visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
    renderCalendar();
  });

  resetCourseCalendar = () => {
    selectedDateKey = "";
    courseTimeInput.value = "";
    calendarSelection.textContent = "請在月曆中選擇週二或週四的課程日期。";
    renderCalendar();
  };

  renderCalendar();
}

if (signupForm && formMessage) {
  signupForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const courseTime = String(formData.get("courseTime") || "").trim();

    if (!email || !courseTime) {
      formMessage.textContent = "請先填寫 Email，並選擇課程日期與時間。";
      return;
    }

    const greeting = name ? `${name}，` : "";
    formMessage.textContent = `${greeting}已收到你的報名資料，我們會用 ${email} 與你確認「${courseTime}」。`;
    signupForm.reset();
    resetCourseCalendar();
  });
}

const posterCards = document.querySelectorAll(".poster-card");

if (posterCards.length) {
  const lightbox = document.createElement("div");
  lightbox.className = "lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "海報放大檢視");
  lightbox.hidden = true;

  const lightboxInner = document.createElement("div");
  lightboxInner.className = "lightbox-inner";

  const lightboxImage = document.createElement("img");
  lightboxImage.className = "lightbox-image";
  lightboxImage.alt = "";

  const lightboxClose = document.createElement("button");
  lightboxClose.className = "lightbox-close";
  lightboxClose.type = "button";
  lightboxClose.setAttribute("aria-label", "關閉放大圖片");
  lightboxClose.textContent = "×";

  lightboxInner.append(lightboxImage);
  lightbox.append(lightboxInner, lightboxClose);
  document.body.append(lightbox);

  let lastFocusedElement = null;

  const openLightbox = (image) => {
    lastFocusedElement = document.activeElement;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add("lightbox-open");
    lightboxClose.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");
    lightboxImage.removeAttribute("src");

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  posterCards.forEach((card) => {
    const image = card.querySelector("img");

    if (!image) {
      return;
    }

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `放大檢視：${image.alt}`);

    card.addEventListener("click", () => openLightbox(image));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightboxClose.addEventListener("click", closeLightbox);

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
}

if (!prefersReducedMotion) {
  document.body.classList.add("motion-ready");

  const revealTargets = document.querySelectorAll(
    ".intro-copy, .intro-info, .section-heading, .poster-card, .signup-copy, .signup-form"
  );

  revealTargets.forEach((target, index) => {
    target.style.setProperty("--stagger", `${Math.min(index * 55, 360)}ms`);
  });

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }
    );

    revealTargets.forEach((target) => revealObserver.observe(target));
  } else {
    revealTargets.forEach((target) => target.classList.add("is-visible"));
  }
}

if (canUseFineMotion && !prefersReducedMotion) {
  const aura = document.createElement("span");
  aura.className = "cursor-aura";
  aura.setAttribute("aria-hidden", "true");
  document.body.append(aura);

  const colors = ["#dfa91b", "#173e63", "#315641", "#df8790"];
  const shapes = ["is-circle", "is-diamond", "is-bar", "is-triangle"];
  const state = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    auraX: window.innerWidth / 2,
    auraY: window.innerHeight / 2,
    lastSpark: 0,
    visible: false,
    focusedElement: null,
  };

  const renderAura = () => {
    state.auraX += (state.x - state.auraX) * 0.16;
    state.auraY += (state.y - state.auraY) * 0.16;
    aura.style.transform = `translate3d(${state.auraX - 12}px, ${state.auraY - 12}px, 0)`;
    requestAnimationFrame(renderAura);
  };

  const addSpark = (x, y) => {
    if (document.querySelectorAll(".cursor-spark").length >= 52) {
      return;
    }

    const spark = document.createElement("span");
    const size = 12 + Math.random() * 12;
    const driftX = (Math.random() - 0.5) * 42;
    const driftY = -18 - Math.random() * 28;

    spark.className = `cursor-spark ${shapes[Math.floor(Math.random() * shapes.length)]}`;
    spark.style.setProperty("--spark-x", `${x - size / 2}px`);
    spark.style.setProperty("--spark-y", `${y - size / 2}px`);
    spark.style.setProperty("--spark-size", `${size}px`);
    spark.style.setProperty("--spark-drift-x", `${driftX}px`);
    spark.style.setProperty("--spark-drift-y", `${driftY}px`);
    spark.style.setProperty("--spark-rotate", `${Math.random() * 180}deg`);
    spark.style.setProperty("--spark-color", colors[Math.floor(Math.random() * colors.length)]);

    document.body.append(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  };

  window.addEventListener("pointermove", (event) => {
    state.x = event.clientX;
    state.y = event.clientY;

    if (!state.visible) {
      state.visible = true;
      aura.style.opacity = "1";
    }

    const now = performance.now();
    const interactiveTarget =
      event.target instanceof Element
        ? event.target.closest("a, button, input, select, textarea, .poster-card, .calendar-day")
        : null;
    const focusTarget =
      event.target instanceof Element
        ? event.target.closest(
            ".poster-card, .intro-info, .signup-form, h1, .button, .nav-button, .submit-button, .sticky-cta, .calendar-day"
          )
        : null;

    if (focusTarget !== state.focusedElement) {
      state.focusedElement?.classList.remove("is-cursor-focus");
      state.focusedElement = focusTarget;
      state.focusedElement?.classList.add("is-cursor-focus");
    }
    const gap = interactiveTarget ? 20 : 32;

    if (now - state.lastSpark > gap) {
      addSpark(event.clientX, event.clientY);
      state.lastSpark = now;
    }
  });

  window.addEventListener("pointerleave", () => {
    state.visible = false;
    aura.style.opacity = "0";
    state.focusedElement?.classList.remove("is-cursor-focus");
    state.focusedElement = null;
  });

  renderAura();
}
