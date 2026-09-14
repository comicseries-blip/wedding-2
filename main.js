document.addEventListener("DOMContentLoaded", () => {

    const openingScreen = document.getElementById("openingScreen");
    const openInvitation = document.getElementById("openInvitation");
    const mainContent = document.getElementById("mainContent");
    const musicButton = document.getElementById("musicButton");
    const shareButton = document.getElementById("shareButton");
    const weddingMusic = document.getElementById("weddingMusic");
    const toast = document.getElementById("toast");
    const rsvpForm = document.getElementById("rsvpForm");

    function getGuestName() {
        const params = new URLSearchParams(window.location.search);
        return params.get("to") || "Tamu Undangan";
    }

    const guestName = document.getElementById("guestName");
    const rsvpName = document.getElementById("rsvpName");
    const guest = getGuestName();

    guestName.textContent = guest;
    if (guest !== "Tamu Undangan" && rsvpName) {
        rsvpName.value = guest;
    }

    document.body.classList.add("lock-scroll");

    openInvitation.addEventListener("click", () => {
        openingScreen.classList.add("hide");
        document.body.classList.remove("lock-scroll");
        setTimeout(() => startMusic(), 700);
        createConfetti();
    });

    const weddingDate = new Date("December 12, 2026 08:00:00").getTime();

    function updateCountdown() {
        const distance = weddingDate - new Date().getTime();
        const labels = { days: "00", hours: "00", minutes: "00", seconds: "00" };

        if (distance > 0) {
            labels.days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, "0");
            labels.hours = String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, "0");
            labels.minutes = String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0");
            labels.seconds = String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, "0");
        }

        Object.entries(labels).forEach(([key, value]) => {
            document.getElementById(key).textContent = value;
        });
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    let musicPlaying = false;

    async function startMusic() {
        if (!weddingMusic.src) return;
        try {
            await weddingMusic.play();
            musicPlaying = true;
            musicButton.classList.add("playing");
            musicButton.textContent = "♫";
        } catch (error) {
            console.log("Musik belum dapat diputar.");
        }
    }

    musicButton.addEventListener("click", async () => {
        if (!weddingMusic.src) {
            showToast("Tambahkan file musik terlebih dahulu.");
            return;
        }
        if (musicPlaying) {
            weddingMusic.pause();
            musicPlaying = false;
            musicButton.classList.remove("playing");
            musicButton.textContent = "♪";
        } else {
            try {
                await weddingMusic.play();
                musicPlaying = true;
                musicButton.classList.add("playing");
                musicButton.textContent = "♫";
            } catch (error) {
                showToast("Musik tidak dapat diputar.");
            }
        }
    });

    document.querySelectorAll(".copy-btn").forEach((button) => {
        button.addEventListener("click", async () => {
            try {
                await navigator.clipboard.writeText(button.dataset.copy);
                button.textContent = "✓ Berhasil Disalin";
                showToast("Nomor rekening berhasil disalin.");
                setTimeout(() => (button.textContent = "Salin Nomor Rekening"), 2000);
            } catch (error) {
                showToast("Gagal menyalin nomor rekening.");
            }
        });
    });

    const whatsappNumber = "6281234567890";

    if (rsvpForm) {
        rsvpForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const name = document.getElementById("rsvpName").value.trim();
            const attendance = document.getElementById("attendance").value;
            const message = document.getElementById("message").value.trim();

            if (!name || !attendance) {
                showToast("Mohon lengkapi data.");
                return;
            }

            const text =
                `Halo Raka & Aulia 👋\n\n` +
                `Saya *${name}* ingin mengonfirmasi kehadiran.\n\n` +
                `Kehadiran: *${attendance}*\n\n` +
                `Ucapan:\n${message || "-"}\n\n` +
                `Terima kasih 🙏`;

            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
        });
    }

    shareButton.addEventListener("click", async () => {
        const shareData = {
            title: "Undangan Pernikahan Raka & Aulia",
            text: "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di pernikahan Raka & Aulia.",
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (error) {
                console.log("Share dibatalkan.");
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                showToast("Link undangan berhasil disalin.");
            } catch (error) {
                showToast("Tidak dapat membagikan link.");
            }
        }
    });

    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove("show"), 2500);
    }

    function createConfetti() {
        const colors = ["#b8955b", "#d8bd88", "#ffffff", "#eee6d8"];

        for (let i = 0; i < 35; i++) {
            const piece = document.createElement("span");
            piece.style.position = "fixed";
            piece.style.top = "-20px";
            piece.style.left = Math.random() * 100 + "%";
            piece.style.width = Math.random() * 5 + 4 + "px";
            piece.style.height = Math.random() * 8 + 5 + "px";
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.zIndex = "10000";
            piece.style.pointerEvents = "none";
            piece.style.opacity = "0.9";
            piece.style.transform = `rotate(${Math.random() * 360}deg)`;

            document.body.appendChild(piece);

            const duration = 2500 + Math.random() * 2500;
            const horizontal = (Math.random() - 0.5) * 250;

            piece.animate(
                [
                    { transform: "translate3d(0, 0, 0) rotate(0deg)", opacity: 1 },
                    { transform: `translate3d(${horizontal}px, 110vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 },
                ],
                { duration: duration, easing: "cubic-bezier(.2,.8,.3,1)" }
            );

            setTimeout(() => piece.remove(), duration);
        }
    }

    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    window.addEventListener(
        "scroll",
        () => {
            if (!hero || !heroContent) return;
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroContent.style.transform = `translateY(${scroll * 0.15}px)`;
                heroContent.style.opacity = Math.max(0, 1 - scroll / window.innerHeight);
            }
        },
        { passive: true }
    );

    let lastTouchEnd = 0;

    document.addEventListener(
        "touchend",
        (event) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) event.preventDefault();
            lastTouchEnd = now;
        },
        { passive: false }
    );

    document.addEventListener("visibilitychange", () => {
        if (document.hidden && musicPlaying) weddingMusic.pause();
    });

    document.querySelectorAll("img").forEach((image) => {
        image.addEventListener("error", () => (image.style.opacity = "0.4"));
    });

    function createLuxuryParticles() {
        const targets = [document.querySelector(".opening-screen"), document.querySelector(".hero")];
        targets.forEach((container) => {
            if (!container) return;
            for (let i = 0; i < 18; i++) {
                const p = document.createElement("span");
                p.className = "particle";
                p.style.left = Math.random() * 100 + "%";
                p.style.bottom = "-10px";
                p.style.width = p.style.height = 2 + Math.random() * 4 + "px";
                p.style.animationDuration = 5 + Math.random() * 8 + "s";
                p.style.animationDelay = Math.random() * 6 + "s";
                container.appendChild(p);
            }
        });
    }

    createLuxuryParticles();

});
