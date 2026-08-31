"use strict";

/*
=========================================
 EDITH - LEARNING UNIVERSE
 Blind Accessibility Voice Assistant
=========================================

 Works only when:
 localStorage.getItem("accessibilityMode") === "blind"

 Flow:
 1. Page opens
 2. Edith starts listening automatically
 3. User says "Hey Edith"
 4. Edith listens for the command
 5. Command opens the requested page
=========================================
*/


/* =====================================
   SETTINGS
===================================== */

const EDITH_NAME = "edith";

let edithListening = false;
let edithCommandMode = false;
let edithRecognition = null;
let edithRestartTimer = null;


/* =====================================
   CHECK BLIND MODE
===================================== */

function isBlindMode() {

    return (
        localStorage.getItem("accessibilityMode") === "blind"
    );

}


/* =====================================
   SPEAK
===================================== */

function edithSpeak(text) {

    if (!isBlindMode()) {
        return;
    }

    if (!("speechSynthesis" in window)) {
        return;
    }

    window.speechSynthesis.cancel();

    const speech =
        new SpeechSynthesisUtterance(text);

    speech.rate = 0.9;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);

}


/* =====================================
   ANNOUNCE
===================================== */

function edithAnnounce(text) {

    const announcement =
        document.getElementById("announcement") ||
        document.getElementById("screenReaderAnnouncement");

    if (announcement) {

        announcement.textContent = "";

        setTimeout(function () {

            announcement.textContent = text;

        }, 50);

    }

    edithSpeak(text);

}


/* =====================================
   NORMALIZE VOICE TEXT
===================================== */

function cleanEdithCommand(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/[.,!?]/g, "");

}


/* =====================================
   CHECK WAKE WORD
===================================== */

function containsWakeWord(text) {

    const command =
        cleanEdithCommand(text);

    return (
        command.includes("hey edith") ||
        command.includes("edith") ||
        command.includes("hey edit")
    );

}


/* =====================================
   REMOVE WAKE WORD
===================================== */

function removeWakeWord(text) {

    return cleanEdithCommand(text)
        .replace("hey edith", "")
        .replace("hey edit", "")
        .replace("edith", "")
        .trim();

}


/* =====================================
   START EDITH
===================================== */

function startEdith() {

    if (!isBlindMode()) {
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        edithAnnounce(
            "Edith voice assistant is not supported by this browser. Please use Chrome."
        );

        return;
    }


    if (edithListening) {
        return;
    }


    edithRecognition =
        new SpeechRecognition();


    /*
       Indian English.
       Browser may also recognize Telugu,
       Hindi and other languages depending
       on browser support.
    */

    edithRecognition.lang = "en-IN";

    edithRecognition.continuous = true;

    edithRecognition.interimResults = false;

    edithRecognition.maxAlternatives = 3;


    edithRecognition.onstart =
        function () {

            edithListening = true;

            console.log(
                "Edith is listening..."
            );

        };


    edithRecognition.onresult =
        function (event) {

            const lastIndex =
                event.results.length - 1;

            const spokenText =
                event.results[lastIndex][0].transcript;


            console.log(
                "Edith heard:",
                spokenText
            );


            /*
               COMMAND MODE
            */

            if (edithCommandMode) {

                edithCommandMode = false;

                processEdithCommand(
                    spokenText
                );

                return;
            }


            /*
               WAKE WORD MODE
            */

            if (
                containsWakeWord(
                    spokenText
                )
            ) {

                const command =
                    removeWakeWord(
                        spokenText
                    );


                edithCommandMode = false;


                /*
                   Example:
                   "Hey Edith open courses"

                   We already have the command,
                   so execute directly.
                */

                if (command.length > 0) {

                    processEdithCommand(
                        command
                    );

                    return;
                }


                /*
                   Example:
                   "Hey Edith"

                   Now wait for the user's
                   next sentence.
                */

                edithCommandMode = true;


                edithAnnounce(
                    "Yes. Edith is listening. Tell me what you want to open."
                );

            }

        };


    edithRecognition.onerror =
        function (event) {

            console.log(
                "Edith recognition error:",
                event.error
            );


            /*
               Ignore normal microphone
               / network interruptions.
            */

            if (
                event.error === "not-allowed" ||
                event.error === "service-not-allowed"
            ) {

                edithAnnounce(
                    "Microphone permission is required for Edith. Please allow microphone access in your browser."
                );

                return;

            }

        };


    edithRecognition.onend =
        function () {

            edithListening = false;


            /*
               Automatically restart Edith
               while blind mode is active.
            */

            if (isBlindMode()) {

                clearTimeout(
                    edithRestartTimer
                );


                edithRestartTimer =
                    setTimeout(
                        function () {

                            startEdith();

                        },
                        800
                    );

            }

        };


    try {

        edithRecognition.start();

    } catch (error) {

        console.log(
            "Edith could not start:",
            error
        );

        edithListening = false;

    }

}


/* =====================================
   PROCESS COMMAND
===================================== */

function processEdithCommand(command) {

    const text =
        cleanEdithCommand(command);


    console.log(
        "Edith command:",
        text
    );


    /*
    =====================================
    COURSES
    =====================================
    */

    if (
        text.includes("open course") ||
        text.includes("my course") ||
        text.includes("courses") ||
        text.includes("learning course")
    ) {

        edithAnnounce(
            "Opening your courses."
        );

        setTimeout(
            function () {

                window.location.href =
                    "courses.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    AI ASSISTANT
    =====================================
    */

    if (
        text.includes("open ai") ||
        text.includes("ai assistant") ||
        text.includes("open assistant") ||
        text.includes("artificial intelligence")
    ) {

        edithAnnounce(
            "Opening AI Learning Assistant."
        );

        setTimeout(
            function () {

                window.location.href =
                    "ai-assistance.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    QUIZ
    =====================================
    */

    if (
        text.includes("start quiz") ||
        text.includes("open quiz") ||
        text.includes("take quiz") ||
        text.includes("quiz")
    ) {

        edithAnnounce(
            "Opening the accessibility quiz."
        );

        setTimeout(
            function () {

                window.location.href =
                    "accessibility-quiz.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    CERTIFICATE
    =====================================
    */

    if (
        text.includes("certificate") ||
        text.includes("open certificate") ||
        text.includes("my certificate")
    ) {

        edithAnnounce(
            "Opening your certificate."
        );

        setTimeout(
            function () {

                window.location.href =
                    "certificate.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    ACCESSIBILITY PAGE
    =====================================
    */

    if (
        text.includes("accessibility") ||
        text.includes("accessibility learning")
    ) {

        edithAnnounce(
            "Opening accessibility learning."
        );

        setTimeout(
            function () {

                window.location.href =
                    "accessibility.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    MISSIONS
    =====================================
    */

    if (
        text.includes("mission") ||
        text.includes("missions")
    ) {

        edithAnnounce(
            "Opening your learning missions."
        );

        setTimeout(
            function () {

                window.location.href =
                    "missions.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    CAREER
    =====================================
    */

    if (
        text.includes("career") ||
        text.includes("careers")
    ) {

        edithAnnounce(
            "Opening the career section."
        );

        setTimeout(
            function () {

                window.location.href =
                    "career.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    HOME
    =====================================
    */

    if (
        text === "home" ||
        text.includes("go home") ||
        text.includes("open home")
    ) {

        edithAnnounce(
            "Opening the Learning Universe home page."
        );

        setTimeout(
            function () {

                window.location.href =
                    "index.html";

            },
            700
        );

        return;
    }


    /*
    =====================================
    STOP VOICE
    =====================================
    */

    if (
        text.includes("stop speaking") ||
        text.includes("stop voice") ||
        text.includes("be quiet")
    ) {

        if ("speechSynthesis" in window) {

            window.speechSynthesis.cancel();

        }

        return;
    }


    /*
    =====================================
    UNKNOWN COMMAND
    =====================================
    */

    edithAnnounce(
        "Sorry, I did not understand that command. " +
        "You can say open courses, open AI assistant, start quiz, certificate, missions, or career."
    );

}


/* =====================================
   PAGE GUIDANCE
===================================== */

function edithPageGuidance() {

    if (!isBlindMode()) {
        return;
    }


    const page =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();


    let message = "";


    if (
        page === "disability-dashboard.html"
    ) {

        message =
            "Edith is active. " +
            "Say Hey Edith followed by your command. " +
            "For example, Hey Edith, open my courses.";

    }

    else if (
        page === "courses.html"
    ) {

        message =
            "You are on the Courses page. " +
            "Edith is listening. Say Hey Edith followed by what you want to do.";

    }

    else if (
        page === "accessibility.html"
    ) {

        message =
            "You are on the Accessibility Learning page. " +
            "Edith is available for voice commands.";

    }

    else if (
        page === "accessibility-quiz.html"
    ) {

        message =
            "You are on the Accessibility Quiz page. " +
            "Edith is available for voice commands.";

    }

    else if (
        page === "certificate.html"
    ) {

        message =
            "You are on the Certificate page. " +
            "Edith is available for voice commands.";

    }

    else if (
        page === "missions.html"
    ) {

        message =
            "You are on the Missions page. " +
            "Edith is available for voice commands.";

    }

    else if (
        page === "career.html"
    ) {

        message =
            "You are on the Career page. " +
            "Edith is available for voice commands.";

    }

    else if (
        page === "ai-assistance.html"
    ) {

        message =
            "You are on the AI Learning Assistant page. " +
            "Edith is available for voice commands.";

    }


    if (message) {

        setTimeout(
            function () {

                edithAnnounce(message);

            },
            1000
        );

    }

}

/* =====================================
   EXTERNAL EDITH CONTROL
   Used by courses.html
===================================== */

window.stopEdithListening = function () {

    clearTimeout(edithRestartTimer);

    edithCommandMode = false;

    if (edithRecognition) {

        try {
            edithRecognition.stop();
        } catch (error) {
            console.log("Edith stopped.");
        }

    }

    edithListening = false;

};


window.startEdithListening = function () {

    if (!isBlindMode()) {
        return;
    }

    if (edithListening) {
        return;
    }

    startEdith();

};


/* =====================================
   INITIALIZE EDITH
===================================== */

function initializeEdith() {

    /*
       Edith MUST NOT run for regular
       or deaf users.
    */

    if (!isBlindMode()) {

        console.log(
            "Edith disabled because blind mode is not active."
        );

        return;
    }


    /*
       Voice guidance is automatically enabled.
    */

    localStorage.setItem(
        "voiceGuidance",
        "enabled"
    );


    edithPageGuidance();


    /*
       Give browser a moment before
       requesting microphone.
    */

    setTimeout(
        function () {

            startEdith();

        },
        1800
    );

}


/* =====================================
   PAGE LOAD
===================================== */

window.addEventListener(
    "load",
    function () {

        initializeEdith();

    }
);


/* =====================================
   PAGE VISIBILITY
===================================== */

document.addEventListener(
    "visibilitychange",
    function () {

        if (
            document.visibilityState === "visible" &&
            isBlindMode() &&
            !edithListening
        ) {

            setTimeout(
                function () {

                    startEdith();

                },
                700
            );

        }

    }
);


/* =====================================
   CLEANUP
===================================== */

window.addEventListener(
    "beforeunload",
    function () {

        clearTimeout(
            edithRestartTimer
        );


        if (edithRecognition) {

            try {

                edithRecognition.stop();

            } catch (error) {

                console.log(
                    "Edith cleanup complete."
                );

            }

        }

    }
);