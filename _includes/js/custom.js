jtd.onReady(function () {
  var content = document.getElementById("main-content");
  var wrap = document.querySelector(".main-content-wrap");

  if (!content || !wrap) {
    return;
  }

  var sectionNavDepth = Number(window.pinokioSectionNavDepth || 1);
  var headingSelector = sectionNavDepth >= 2
    ? "main > h1[id], main > h2[id]"
    : "main > h1[id]";
  var headings = Array.prototype.slice.call(
    content.querySelectorAll(headingSelector)
  );

  if (headings.length < 2) {
    return;
  }

  var nav = document.createElement("nav");
  nav.className = "section-nav";
  nav.setAttribute("aria-label", "Page sections");

  var label = document.createElement("div");
  label.className = "section-nav-label";
  label.textContent = "Sections";
  nav.appendChild(label);

  var list = document.createElement("ol");
  list.className = "section-nav-list";

  var links = headings.map(function (heading) {
    var item = document.createElement("li");
    var link = document.createElement("a");
    var title = heading.textContent.replace(/\s+/g, " ").trim();
    var level = heading.tagName.toLowerCase();

    item.className = "section-nav-item section-nav-" + level;
    link.href = "#" + heading.id;
    link.textContent = title;
    item.appendChild(link);
    list.appendChild(item);

    return link;
  });

  nav.appendChild(list);
  wrap.insertBefore(nav, content);

  if (!("IntersectionObserver" in window)) {
    return;
  }

  var setActiveLink = function (id) {
    links.forEach(function (link) {
      var isActive = link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  var visibleSections = {};

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visibleSections[entry.target.id] = entry.boundingClientRect.top;
        } else {
          delete visibleSections[entry.target.id];
        }
      });

      var active = Object.keys(visibleSections).sort(function (a, b) {
        return visibleSections[a] - visibleSections[b];
      })[0];

      if (active) {
        setActiveLink(active);
      }
    },
    {
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0
    }
  );

  headings.forEach(function (heading) {
    observer.observe(heading);
  });

  setActiveLink(headings[0].id);
});

jtd.onReady(function () {
  var content = document.getElementById("main-content");

  if (!content) {
    return;
  }

  var imageSizes = {
    "media/p81-01-global-overview.jpg": [1280, 720],
    "media/p81-02-duplicates.jpg": [1280, 720],
    "media/p81-03-deduplicate-selection.jpg": [1280, 720],
    "media/p81-04-cannot-deduplicate.jpg": [1280, 720],
    "media/p81-05-make-separate.jpg": [1280, 720],
    "media/p81-06-unused-files.jpg": [1280, 720],
    "media/p81-07-add-locations.jpg": [1280, 720],
    "media/p81-08-find-more-savings.jpg": [1280, 720],
    "media/p81-09-app-disk-saver.jpg": [1280, 720],
    "media/p81-10-activity.jpg": [1280, 720],
    "media/p81-11-automatic-app-checking.jpg": [1280, 720]
  };

  var hashScrollState = {
    activeUntil: 0,
    interrupted: false,
    resizeObserver: null,
    target: null,
    token: 0
  };

  var normalizeMediaPath = function (src) {
    var match = (src || "").match(/media\/[^?#]+/);
    return match ? match[0] : src;
  };

  var prepareImages = function () {
    Array.prototype.forEach.call(content.querySelectorAll("img"), function (img) {
      var size = imageSizes[normalizeMediaPath(img.getAttribute("src"))];

      if (!size) {
        return;
      }

      if (!img.hasAttribute("width")) {
        img.setAttribute("width", size[0]);
      }

      if (!img.hasAttribute("height")) {
        img.setAttribute("height", size[1]);
      }

      img.decoding = "async";
    });
  };

  var getHashTarget = function () {
    var id = window.location.hash.slice(1);

    if (!id) {
      return null;
    }

    try {
      id = decodeURIComponent(id);
    } catch (error) {
      return null;
    }

    return document.getElementById(id);
  };

  var imageIsBeforeTarget = function (img, target) {
    return Boolean(
      img.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
    );
  };

  var alignHashTarget = function () {
    if (
      hashScrollState.interrupted ||
      Date.now() > hashScrollState.activeUntil ||
      !hashScrollState.target
    ) {
      return;
    }

    hashScrollState.target.scrollIntoView({ block: "start" });
  };

  var scheduleAlign = function (delay) {
    var token = hashScrollState.token;

    window.setTimeout(function () {
      if (token === hashScrollState.token) {
        alignHashTarget();
      }
    }, delay);
  };

  var stopResizeObserver = function (token) {
    if (token !== hashScrollState.token || !hashScrollState.resizeObserver) {
      return;
    }

    hashScrollState.resizeObserver.disconnect();
    hashScrollState.resizeObserver = null;
  };

  var startHashScrollCorrection = function () {
    var target = getHashTarget();

    hashScrollState.token += 1;
    hashScrollState.target = target;
    hashScrollState.interrupted = false;
    hashScrollState.activeUntil = Date.now() + 15000;

    if (!target) {
      return;
    }

    [0, 50, 150, 350, 700, 1200, 2000].forEach(scheduleAlign);

    if ("ResizeObserver" in window) {
      if (hashScrollState.resizeObserver) {
        hashScrollState.resizeObserver.disconnect();
      }

      hashScrollState.resizeObserver = new ResizeObserver(function () {
        scheduleAlign(60);
      });
      hashScrollState.resizeObserver.observe(content);
      window.setTimeout(function () {
        stopResizeObserver(hashScrollState.token);
      }, 15000);
    }
  };

  prepareImages();
  startHashScrollCorrection();

  window.addEventListener("hashchange", startHashScrollCorrection);

  ["wheel", "touchstart", "keydown"].forEach(function (eventName) {
    window.addEventListener(
      eventName,
      function () {
        if (Date.now() <= hashScrollState.activeUntil) {
          hashScrollState.interrupted = true;
        }
      },
      { passive: true }
    );
  });

  content.addEventListener(
    "load",
    function (event) {
      if (
        event.target &&
        event.target.tagName === "IMG" &&
        hashScrollState.target &&
        imageIsBeforeTarget(event.target, hashScrollState.target)
      ) {
        scheduleAlign(60);
      }
    },
    true
  );
});
