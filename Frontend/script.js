let voiceEnabled = false;


/* =========================
   VOICE SYSTEM
========================= */

function speak(text) {

    if (!voiceEnabled) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const message = new SpeechSynthesisUtterance(text);

    message.rate = 0.9;
    message.pitch = 1;
    message.volume = 1;

    window.speechSynthesis.speak(message);
}


/* =========================
   ENABLE VOICE GUIDANCE
========================= */

function enableVoiceGuidance() {

    voiceEnabled = true;

    const button =
        document.getElementById("voiceGuideButton");

    if (button) {
        button.textContent = "🔊 Voice Guidance ON";
    }

    speak(
        "Welcome to Learning Universe. " +
        "Press L for Login. " +
        "Press R for Regular Login. " +
        "Press A for Accessibility Login."
    );
}


/* =========================
   OPEN LOGIN MODAL
========================= */

function openLoginModal() {

    const modal =
        document.getElementById("loginModal");

    const regularButton =
        document.getElementById("regularLoginButton");

    const announcement =
        document.getElementById(
            "screenReaderAnnouncement"
        );

    if (!modal) {
        return;
    }

    modal.style.display = "flex";

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    if (announcement) {

        announcement.textContent =
            "Choose Login Type. " +
            "Press R for Regular Login. " +
            "Press A for Accessibility Login.";
    }

    speak(
        "Choose Login Type. " +
        "Press R for Regular Login. " +
        "Press A for Accessibility Login."
    );

    setTimeout(function () {

        if (regularButton) {
            regularButton.focus();
        }

    }, 100);
}


/* =========================
   CLOSE LOGIN MODAL
========================= */

function closeLoginModal() {

    const modal =
        document.getElementById("loginModal");

    const mainLoginButton =
        document.getElementById("mainLoginButton");

    const announcement =
        document.getElementById(
            "screenReaderAnnouncement"
        );

    if (!modal) {
        return;
    }

    modal.style.display = "none";

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (announcement) {
        announcement.textContent = "";
    }

    if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
    }

    if (mainLoginButton) {
        mainLoginButton.focus();
    }
}


/* =========================
   REGULAR LOGIN
========================= */

function selectRegular() {

    speak(
        "Opening Regular Student Login."
    );

    setTimeout(function () {

        window.location.href =
            "regular-login.html";

    }, 400);
}


/* =========================
   ACCESSIBILITY LOGIN
========================= */

function selectDisability() {

    speak(
        "Opening Accessibility Student Login."
    );

    setTimeout(function () {

        window.location.href =
            "disability-login.html";

    }, 400);
}


/* =========================
   KEYBOARD CONTROLS
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        const key =
            event.key.toLowerCase();

        const modal =
            document.getElementById("loginModal");

        if (!modal) {
            return;
        }


        /* =====================
           L = OPEN LOGIN
        ===================== */

        if (
            key === "l" &&
            modal.getAttribute("aria-hidden") !== "false"
        ) {

            event.preventDefault();

            openLoginModal();

            return;
        }


        /* =====================
           BELOW KEYS WORK
           ONLY WHEN MODAL OPEN
        ===================== */

        if (
            modal.getAttribute("aria-hidden") !== "false"
        ) {
            return;
        }


        /* =====================
           R = REGULAR LOGIN
        ===================== */

        if (key === "r") {

            event.preventDefault();

            selectRegular();

            return;
        }


        /* =====================
           A = ACCESSIBILITY LOGIN
        ===================== */

        if (key === "a") {

            event.preventDefault();

            selectDisability();

            return;
        }


        /* =====================
           ESC = CLOSE
        ===================== */

        if (event.key === "Escape") {

            event.preventDefault();

            closeLoginModal();

            return;
        }

    }
);


/* =========================
   CLICK OUTSIDE MODAL
========================= */

window.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById("loginModal");

        if (
            modal &&
            event.target === modal
        ) {

            closeLoginModal();

        }

    }
);


/* =========================
   PAGE LOAD
========================= */

window.addEventListener(
    "load",
    function () {

        const voiceButton =
            document.getElementById(
                "voiceGuideButton"
            );

        if (voiceButton) {

            voiceButton.focus();

        }

    }
);