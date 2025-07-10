document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".navbar ul li a");

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      navLinks.forEach((navLink) => {
        navLink.parentElement.classList.remove("active");
      });

      this.parentElement.classList.add("active");

      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  });

  const sections = document.querySelectorAll("section");
  const navItems = document.querySelectorAll(".navbar ul li");

  window.addEventListener("scroll", () => {
    let current = "";
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        current = section.getAttribute("id");
      }
    });

    if (window.scrollY < 100) {
      current = "home";
    }

    navItems.forEach((item) => {
      item.classList.remove("active");
      const link = item.querySelector("a");
      const href = link.getAttribute("href").substring(1);

      if (href === current || (href === "" && current === "home")) {
        item.classList.add("active");
      }
    });
  });

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const name = contactForm.querySelector('input[name="name"]').value.trim();
      const email = contactForm
        .querySelector('input[name="email"]')
        .value.trim();
      const message = contactForm
        .querySelector('textarea[name="message"]')
        .value.trim();

      if (!name || !email || !message) {
        showNotification("Please fill in all fields", "error");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address", "error");
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        const response = await fetch("https://formspree.io/f/mrbknkqe", {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: formData,
        });

        if (response.ok) {
          showNotification(
            "Message sent successfully! I'll get back to you soon.",
            "success"
          );
          contactForm.reset();
        } else {
          showNotification(
            "Something went wrong. Please try again later.",
            "error"
          );
        }
      } catch (error) {
        showNotification(
          "Network error. Please check your internet connection.",
          "error"
        );
      }

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    });
  }

  function showNotification(message, type) {
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.3s ease;
      ${type === "success" ? "background: #4caf50;" : "background: #f44336;"}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    setTimeout(() => {
      notification.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }, 5000);
  }

  // 🟡 Additional UX Effects

  // Typing effect
  const spans = document.querySelectorAll(".home-info h2 span");
  spans.forEach((span, index) => {
    const style = document.createElement("style");
    style.textContent = `
      .home-info h2 span:nth-child(${index + 1})::before {
        animation: fill-text 4s linear infinite, cursor-blink 1s infinite;
      }
      @keyframes cursor-blink {
        0%, 50% { border-right-color: #9ec2ee; }
        51%, 100% { border-right-color: transparent; }
      }
    `;
    document.head.appendChild(style);
  });

  // Service/Portfolio hover effect
  const hoverItems = document.querySelectorAll(
    ".services-box, .portfolio-item"
  );
  hoverItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "0 10px 30px rgba(158, 194, 238, 0.3)";
      this.style.borderColor = "#9ec2ee";
      this.style.transition = "all 0.3s ease";
    });
    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "none";
      this.style.borderColor = "#272c33";
    });
  });

  // Intersection Observer reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.transform = "translateY(0)";
          entry.target.style.opacity = "1";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  hoverItems.forEach((item) => {
    item.style.transform = "translateY(30px)";
    item.style.opacity = "0.8";
    item.style.transition = "all 0.6s ease";
    observer.observe(item);
  });

  // Mouse particle trail
  let mouseX = 0,
    mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (Math.random() > 0.98) createParticle(mouseX, mouseY);
  });

  function createParticle(x, y) {
    const particle = document.createElement("div");
    particle.style.cssText = `
      position: fixed;
      width: 3px;
      height: 3px;
      background: #9ec2ee;
      border-radius: 50%;
      pointer-events: none;
      z-index: 1000;
      left: ${x}px;
      top: ${y}px;
      opacity: 0.7;
      transform: scale(0);
      animation: particle-fade 2s ease-out forwards;
    `;
    document.body.appendChild(particle);
    setTimeout(() => {
      if (particle.parentNode) particle.remove();
    }, 2000);
  }

  const particleStyle = document.createElement("style");
  particleStyle.textContent = `
    @keyframes particle-fade {
      0% {
        transform: scale(0) translateY(0);
        opacity: 0.7;
      }
      50% {
        transform: scale(1) translateY(-20px);
        opacity: 1;
      }
      100% {
        transform: scale(0) translateY(-40px);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(particleStyle);

  console.log("Portfolio JavaScript fully loaded with effects ✅");
});
