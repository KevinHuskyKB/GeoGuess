// Variables and Constants
const flagsBtn = document.getElementById("flagsBtn");
const capitalsBtn = document.getElementById("capitalsBtn");
const mapsBtn = document.getElementById("mapsBtn");
const mainMenu = document.querySelector(".mainMenu");
const regionSelection = document.querySelector(".regionSelection");
const capitalSelection = document.querySelector(".capitalSelection");
const mapsSelection = document.querySelector(".mapsSelection");
const questionCountSelection = document.querySelector(".questionCountSelection");
const difficultySelection = document.querySelector(".difficultySelection");
const gameScreen = document.querySelector(".gameScreen");
const gameOverScreen = document.querySelector(".gameOverScreen");
const selectedRegion = document.getElementById("selectedRegion");
const questionArea = document.querySelector(".countryImagePlaceholder");
const questionTitle = document.getElementById("questionTitle");
const answerButtons = document.querySelectorAll(".answer");
const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const questionNumberDisplay = document.getElementById("questionNumber");
const questionTotalDisplay = document.getElementById("questionTotal");
const timerDisplay = document.getElementById("timer");
const finalScoreDisplay = document.getElementById("finalScore");
const finalScoreTotalDisplay = document.getElementById("finalScoreTotal");
const accuracyDisplay = document.getElementById("accuracy");
const bestStreakDisplay = document.getElementById("bestStreak");
const finalDifficultyDisplay = document.getElementById("finalDifficulty");
const finalGameModeDisplay = document.getElementById("finalGameMode");
const finalRegionDisplay = document.getElementById("finalRegion");
const highScoreDisplay = document.getElementById("highScore");
const highScoreTotalDisplay = document.getElementById("highScoreTotal");
const availableCountryCountDisplay = document.getElementById("availableCountryCount");
const playAgainBtn = document.getElementById("playAgainBtn");
const mainMenuBtn = document.getElementById("mainMenuBtn");
const backToMenuBtns = document.querySelectorAll(".backToMenuBtn");
const quitGameBtn = document.getElementById("quitGameBtn");
const soundToggle = document.getElementById("soundToggle");
const sounds = {
    correct: document.getElementById("correctSound"),
    wrong: document.getElementById("wrongSound"),
    timeout: document.getElementById("timeoutSound"),
    gameOver: document.getElementById("gameOverSound")
};

let score = 0;
let streak = 0;
let bestStreak = 0;
let questionNumber = 1;
let totalQuestions = 10;
let activeRegion = "";
let selectedGameMode = "flags";
let isAnswerLocked = false;
let questionTime = 10;
let selectedDifficulty = "Normal";
let timerId;
let nextQuestionTimeoutId;
let usedCountries = [];
let highScore = getHighScore();
let isMuted = localStorage.getItem("gameSoundsMuted") === "true";
let countryMapDataPromise;
let mapRequestId = 0;
let flagRequestId = 0;

const countries = [
    // Europe
    ["Albania", "Europe", "Tirana", "🇦🇱"], ["Andorra", "Europe", "Andorra la Vella", "🇦🇩"],
    ["Austria", "Europe", "Vienna", "🇦🇹"], ["Belarus", "Europe", "Minsk", "🇧🇾"],
    ["Belgium", "Europe", "Brussels", "🇧🇪"], ["Bosnia and Herzegovina", "Europe", "Sarajevo", "🇧🇦"],
    ["Bulgaria", "Europe", "Sofia", "🇧🇬"], ["Croatia", "Europe", "Zagreb", "🇭🇷"],
    ["Czechia", "Europe", "Prague", "🇨🇿"], ["Denmark", "Europe", "Copenhagen", "🇩🇰"],
    ["Estonia", "Europe", "Tallinn", "🇪🇪"], ["Finland", "Europe", "Helsinki", "🇫🇮"],
    ["France", "Europe", "Paris", "🇫🇷"], ["Germany", "Europe", "Berlin", "🇩🇪"],
    ["Greece", "Europe", "Athens", "🇬🇷"], ["Hungary", "Europe", "Budapest", "🇭🇺"],
    ["Iceland", "Europe", "Reykjavik", "🇮🇸"], ["Ireland", "Europe", "Dublin", "🇮🇪"],
    ["Italy", "Europe", "Rome", "🇮🇹"], ["Latvia", "Europe", "Riga", "🇱🇻"],
    ["Liechtenstein", "Europe", "Vaduz", "🇱🇮"], ["Lithuania", "Europe", "Vilnius", "🇱🇹"],
    ["Luxembourg", "Europe", "Luxembourg", "🇱🇺"], ["Malta", "Europe", "Valletta", "🇲🇹"],
    ["Moldova", "Europe", "Chisinau", "🇲🇩"], ["Monaco", "Europe", "Monaco", "🇲🇨"],
    ["Montenegro", "Europe", "Podgorica", "🇲🇪"], ["Netherlands", "Europe", "Amsterdam", "🇳🇱"],
    ["North Macedonia", "Europe", "Skopje", "🇲🇰"], ["Norway", "Europe", "Oslo", "🇳🇴"],
    ["Poland", "Europe", "Warsaw", "🇵🇱"], ["Portugal", "Europe", "Lisbon", "🇵🇹"],
    ["Romania", "Europe", "Bucharest", "🇷🇴"], ["Russia", "Europe", "Moscow", "🇷🇺"],
    ["San Marino", "Europe", "San Marino", "🇸🇲"], ["Serbia", "Europe", "Belgrade", "🇷🇸"],
    ["Slovakia", "Europe", "Bratislava", "🇸🇰"], ["Slovenia", "Europe", "Ljubljana", "🇸🇮"],
    ["Spain", "Europe", "Madrid", "🇪🇸"], ["Sweden", "Europe", "Stockholm", "🇸🇪"],
    ["Switzerland", "Europe", "Bern", "🇨🇭"], ["Ukraine", "Europe", "Kyiv", "🇺🇦"],
    ["United Kingdom", "Europe", "London", "🇬🇧"], ["Vatican City", "Europe", "Vatican City", "🇻🇦"],

    // Africa
    ["Algeria", "Africa", "Algiers", "🇩🇿"], ["Angola", "Africa", "Luanda", "🇦🇴"],
    ["Benin", "Africa", "Porto-Novo", "🇧🇯"], ["Botswana", "Africa", "Gaborone", "🇧🇼"],
    ["Burkina Faso", "Africa", "Ouagadougou", "🇧🇫"], ["Burundi", "Africa", "Gitega", "🇧🇮"],
    ["Cabo Verde", "Africa", "Praia", "🇨🇻"], ["Cameroon", "Africa", "Yaounde", "🇨🇲"],
    ["Central African Republic", "Africa", "Bangui", "🇨🇫"], ["Chad", "Africa", "N'Djamena", "🇹🇩"],
    ["Comoros", "Africa", "Moroni", "🇰🇲"], ["Democratic Republic of the Congo", "Africa", "Kinshasa", "🇨🇩"],
    ["Republic of the Congo", "Africa", "Brazzaville", "🇨🇬"], ["Côte d'Ivoire", "Africa", "Yamoussoukro", "🇨🇮"],
    ["Djibouti", "Africa", "Djibouti", "🇩🇯"], ["Egypt", "Africa", "Cairo", "🇪🇬"],
    ["Equatorial Guinea", "Africa", "Malabo", "🇬🇶"], ["Eritrea", "Africa", "Asmara", "🇪🇷"],
    ["Eswatini", "Africa", "Mbabane", "🇸🇿"], ["Ethiopia", "Africa", "Addis Ababa", "🇪🇹"],
    ["Gabon", "Africa", "Libreville", "🇬🇦"], ["Gambia", "Africa", "Banjul", "🇬🇲"],
    ["Ghana", "Africa", "Accra", "🇬🇭"], ["Guinea", "Africa", "Conakry", "🇬🇳"],
    ["Guinea-Bissau", "Africa", "Bissau", "🇬🇼"], ["Kenya", "Africa", "Nairobi", "🇰🇪"],
    ["Lesotho", "Africa", "Maseru", "🇱🇸"], ["Liberia", "Africa", "Monrovia", "🇱🇷"],
    ["Libya", "Africa", "Tripoli", "🇱🇾"], ["Madagascar", "Africa", "Antananarivo", "🇲🇬"],
    ["Malawi", "Africa", "Lilongwe", "🇲🇼"], ["Mali", "Africa", "Bamako", "🇲🇱"],
    ["Mauritania", "Africa", "Nouakchott", "🇲🇷"], ["Mauritius", "Africa", "Port Louis", "🇲🇺"],
    ["Morocco", "Africa", "Rabat", "🇲🇦"], ["Mozambique", "Africa", "Maputo", "🇲🇿"],
    ["Namibia", "Africa", "Windhoek", "🇳🇦"], ["Niger", "Africa", "Niamey", "🇳🇪"],
    ["Nigeria", "Africa", "Abuja", "🇳🇬"], ["Rwanda", "Africa", "Kigali", "🇷🇼"],
    ["São Tomé and Príncipe", "Africa", "São Tomé", "🇸🇹"], ["Senegal", "Africa", "Dakar", "🇸🇳"],
    ["Seychelles", "Africa", "Victoria", "🇸🇨"], ["Sierra Leone", "Africa", "Freetown", "🇸🇱"],
    ["Somalia", "Africa", "Mogadishu", "🇸🇴"], ["South Africa", "Africa", "Pretoria", "🇿🇦"],
    ["South Sudan", "Africa", "Juba", "🇸🇸"], ["Sudan", "Africa", "Khartoum", "🇸🇩"],
    ["Tanzania", "Africa", "Dodoma", "🇹🇿"], ["Togo", "Africa", "Lome", "🇹🇬"],
    ["Tunisia", "Africa", "Tunis", "🇹🇳"], ["Uganda", "Africa", "Kampala", "🇺🇬"],
    ["Zambia", "Africa", "Lusaka", "🇿🇲"], ["Zimbabwe", "Africa", "Harare", "🇿🇼"],

    // Asia
    ["Afghanistan", "Asia", "Kabul", "🇦🇫"], ["Armenia", "Asia", "Yerevan", "🇦🇲"],
    ["Azerbaijan", "Asia", "Baku", "🇦🇿"], ["Bahrain", "Asia", "Manama", "🇧🇭"],
    ["Bangladesh", "Asia", "Dhaka", "🇧🇩"], ["Bhutan", "Asia", "Thimphu", "🇧🇹"],
    ["Brunei", "Asia", "Bandar Seri Begawan", "🇧🇳"], ["Cambodia", "Asia", "Phnom Penh", "🇰🇭"],
    ["China", "Asia", "Beijing", "🇨🇳"], ["Cyprus", "Asia", "Nicosia", "🇨🇾"],
    ["Georgia", "Asia", "Tbilisi", "🇬🇪"], ["India", "Asia", "New Delhi", "🇮🇳"],
    ["Indonesia", "Asia", "Jakarta", "🇮🇩"], ["Iran", "Asia", "Tehran", "🇮🇷"],
    ["Iraq", "Asia", "Baghdad", "🇮🇶"], ["Israel", "Asia", "Jerusalem", "🇮🇱"],
    ["Japan", "Asia", "Tokyo", "🇯🇵"], ["Jordan", "Asia", "Amman", "🇯🇴"],
    ["Kazakhstan", "Asia", "Astana", "🇰🇿"], ["Kuwait", "Asia", "Kuwait City", "🇰🇼"],
    ["Kyrgyzstan", "Asia", "Bishkek", "🇰🇬"], ["Laos", "Asia", "Vientiane", "🇱🇦"],
    ["Lebanon", "Asia", "Beirut", "🇱🇧"], ["Malaysia", "Asia", "Kuala Lumpur", "🇲🇾"],
    ["Maldives", "Asia", "Malé", "🇲🇻"], ["Mongolia", "Asia", "Ulaanbaatar", "🇲🇳"],
    ["Myanmar", "Asia", "Naypyidaw", "🇲🇲"], ["Nepal", "Asia", "Kathmandu", "🇳🇵"],
    ["North Korea", "Asia", "Pyongyang", "🇰🇵"], ["Oman", "Asia", "Muscat", "🇴🇲"],
    ["Pakistan", "Asia", "Islamabad", "🇵🇰"], ["Palestine", "Asia", "Ramallah", "🇵🇸"],
    ["Philippines", "Asia", "Manila", "🇵🇭"], ["Qatar", "Asia", "Doha", "🇶🇦"],
    ["Saudi Arabia", "Asia", "Riyadh", "🇸🇦"], ["Singapore", "Asia", "Singapore", "🇸🇬"],
    ["South Korea", "Asia", "Seoul", "🇰🇷"], ["Sri Lanka", "Asia", "Sri Jayawardenepura Kotte", "🇱🇰"],
    ["Syria", "Asia", "Damascus", "🇸🇾"], ["Tajikistan", "Asia", "Dushanbe", "🇹🇯"],
    ["Thailand", "Asia", "Bangkok", "🇹🇭"], ["Timor-Leste", "Asia", "Dili", "🇹🇱"],
    ["Turkey", "Asia", "Ankara", "🇹🇷"], ["Turkmenistan", "Asia", "Ashgabat", "🇹🇲"],
    ["United Arab Emirates", "Asia", "Abu Dhabi", "🇦🇪"], ["Uzbekistan", "Asia", "Tashkent", "🇺🇿"],
    ["Vietnam", "Asia", "Hanoi", "🇻🇳"], ["Yemen", "Asia", "Sanaa", "🇾🇪"],

    // North America, including Central America and the Caribbean
    ["Antigua and Barbuda", "North America", "Saint John's", "🇦🇬"], ["Bahamas", "North America", "Nassau", "🇧🇸"],
    ["Barbados", "North America", "Bridgetown", "🇧🇧"], ["Belize", "North America", "Belmopan", "🇧🇿"],
    ["Canada", "North America", "Ottawa", "🇨🇦"], ["Costa Rica", "North America", "San José", "🇨🇷"],
    ["Cuba", "North America", "Havana", "🇨🇺"], ["Dominica", "North America", "Roseau", "🇩🇲"],
    ["Dominican Republic", "North America", "Santo Domingo", "🇩🇴"], ["El Salvador", "North America", "San Salvador", "🇸🇻"],
    ["Grenada", "North America", "Saint George's", "🇬🇩"], ["Guatemala", "North America", "Guatemala City", "🇬🇹"],
    ["Haiti", "North America", "Port-au-Prince", "🇭🇹"], ["Honduras", "North America", "Tegucigalpa", "🇭🇳"],
    ["Jamaica", "North America", "Kingston", "🇯🇲"], ["Mexico", "North America", "Mexico City", "🇲🇽"],
    ["Nicaragua", "North America", "Managua", "🇳🇮"], ["Panama", "North America", "Panama City", "🇵🇦"],
    ["Saint Kitts and Nevis", "North America", "Basseterre", "🇰🇳"], ["Saint Lucia", "North America", "Castries", "🇱🇨"],
    ["Saint Vincent and the Grenadines", "North America", "Kingstown", "🇻🇨"],
    ["Trinidad and Tobago", "North America", "Port of Spain", "🇹🇹"], ["United States", "North America", "Washington, D.C.", "🇺🇸"],

    // South America
    ["Argentina", "South America", "Buenos Aires", "🇦🇷"], ["Bolivia", "South America", "Sucre", "🇧🇴"],
    ["Brazil", "South America", "Brasília", "🇧🇷"], ["Chile", "South America", "Santiago", "🇨🇱"],
    ["Colombia", "South America", "Bogotá", "🇨🇴"], ["Ecuador", "South America", "Quito", "🇪🇨"],
    ["Guyana", "South America", "Georgetown", "🇬🇾"], ["Paraguay", "South America", "Asunción", "🇵🇾"],
    ["Peru", "South America", "Lima", "🇵🇪"], ["Suriname", "South America", "Paramaribo", "🇸🇷"],
    ["Uruguay", "South America", "Montevideo", "🇺🇾"], ["Venezuela", "South America", "Caracas", "🇻🇪"],

    // Oceania
    ["Australia", "Oceania", "Canberra", "🇦🇺"], ["Fiji", "Oceania", "Suva", "🇫🇯"],
    ["Kiribati", "Oceania", "South Tarawa", "🇰🇮"], ["Marshall Islands", "Oceania", "Majuro", "🇲🇭"],
    ["Micronesia", "Oceania", "Palikir", "🇫🇲"], ["Nauru", "Oceania", "Yaren", "🇳🇷"],
    ["New Zealand", "Oceania", "Wellington", "🇳🇿"], ["Palau", "Oceania", "Ngerulmud", "🇵🇼"],
    ["Papua New Guinea", "Oceania", "Port Moresby", "🇵🇬"], ["Samoa", "Oceania", "Apia", "🇼🇸"],
    ["Solomon Islands", "Oceania", "Honiara", "🇸🇧"], ["Tonga", "Oceania", "Nuku'alofa", "🇹🇴"],
    ["Tuvalu", "Oceania", "Funafuti", "🇹🇻"], ["Vanuatu", "Oceania", "Port Vila", "🇻🇺"]
].map(([name, region, capital, flag]) => ({
    name,
    region,
    capital,
    flag
}));

function updateStats() {
    scoreDisplay.textContent = score;
    streakDisplay.textContent = streak;
    questionNumberDisplay.textContent = questionNumber;
    questionTotalDisplay.textContent = totalQuestions;
}

function getAvailableCountries(region) {
    const regionCountries = region === "🌍ALL"
        ? countries
        : countries.filter((country) => country.region === region);
    return [...new Map(regionCountries.map((country) => [country.name, country])).values()];
}

function getHighScore() {
    const savedScore = localStorage.getItem(`highScore-${totalQuestions}`);
    if (savedScore !== null) {
        return Number(savedScore) || 0;
    }

    return totalQuestions === 10 ? Number(localStorage.getItem("highScore")) || 0 : 0;
}

function updateQuestionCountOptions() {
    const availableCountries = getAvailableCountries(activeRegion);
    availableCountryCountDisplay.textContent = `${availableCountries.length} unique countries available`;

    document.querySelectorAll(".questionCount").forEach((countButton) => {
        const amount = countButton.dataset.count === "all"
            ? availableCountries.length
            : Number(countButton.dataset.count);
        const isAvailable = amount <= availableCountries.length;
        countButton.hidden = !isAvailable;
        countButton.disabled = !isAvailable;
    });
}

function updateSoundToggle() {
    soundToggle.textContent = isMuted ? "🔇" : "🔊";
    const label = isMuted ? "Unmute game sounds" : "Mute game sounds";
    soundToggle.setAttribute("aria-label", label);
    soundToggle.title = label;
    Object.values(sounds).forEach((sound) => {
        sound.muted = isMuted;
    });
}

function playSound(soundName) {
    const sound = sounds[soundName];
    if (!isMuted && sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

function getCountryCodeFromFlag(flag) {
    const codePoints = Array.from(flag).map((character) => character.codePointAt(0));
    const firstRegionalIndicator = 0x1F1E6;
    const lastRegionalIndicator = 0x1F1FF;

    if (codePoints.length !== 2 || codePoints.some((codePoint) =>
        codePoint < firstRegionalIndicator || codePoint > lastRegionalIndicator
    )) {
        return null;
    }

    return codePoints
        .map((codePoint) => String.fromCharCode(65 + codePoint - firstRegionalIndicator))
        .join("")
        .toLowerCase();
}

function showFlagFallback(flag) {
    questionArea.textContent = flag;
    questionArea.setAttribute("aria-label", "Country flag");
}

function renderCountryFlag(country) {
    const requestId = flagRequestId;
    const countryCode = getCountryCodeFromFlag(country.flag);
    showFlagFallback(country.flag);

    if (!countryCode) {
        return;
    }

    const flagImage = new Image();
    flagImage.className = "countryFlag";
    flagImage.alt = "Country flag";
    flagImage.addEventListener("load", () => {
        if (requestId === flagRequestId) {
            questionArea.replaceChildren(flagImage);
            questionArea.classList.add("flagImageQuestion");
        }
    });
    flagImage.addEventListener("error", () => {
        if (requestId === flagRequestId) {
            showFlagFallback(country.flag);
        }
    });
    flagImage.src = `https://flagcdn.com/w640/${countryCode}.png`;
}

function normalizeCountryName(name) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

function getMapName(countryName) {
    const mapNameAliases = {
        "antiguaandbarbuda": "antiguaandbarb",
        "bosniaandherzegovina": "bosniaandherz",
        "centralafricanrepublic": "centralafricanrep",
        "democraticrepublicofthecongo": "demrepcongo",
        "dominicanrepublic": "dominicanrep",
        "equatorialguinea": "eqguinea",
        "marshallislands": "marshallis",
        "republicofthecongo": "congo",
        "northmacedonia": "macedonia",
        "saintkittsandnevis": "stkittsandnevis",
        "saintvincentandthegrenadines": "stvinandgren",
        "solomonislands": "solomonis",
        "southsudan": "ssudan",
        "unitedstates": "unitedstatesofamerica",
        "vaticancity": "vatican"
    };
    const normalizedName = normalizeCountryName(countryName);
    return mapNameAliases[normalizedName] || normalizedName;
}

function decodeArc(topology, arcIndex) {
    const arc = topology.arcs[arcIndex < 0 ? ~arcIndex : arcIndex];
    let x = 0;
    let y = 0;
    const points = arc.map(([deltaX, deltaY]) => {
        x += deltaX;
        y += deltaY;
        return [
            x * topology.transform.scale[0] + topology.transform.translate[0],
            y * topology.transform.scale[1] + topology.transform.translate[1]
        ];
    });
    return arcIndex < 0 ? points.reverse() : points;
}

function getGeometryRings(topology, geometry) {
    const polygons = geometry.type === "Polygon" ? [geometry.arcs] : geometry.arcs;
    return polygons.flatMap((polygon) => polygon.map((ring) => {
        const points = ring.flatMap((arcIndex, index) => {
            const arc = decodeArc(topology, arcIndex);
            return index === 0 ? arc : arc.slice(1);
        });
        return points;
    }));
}

function createCountryMapSvg(topology, geometry) {
    const rings = getGeometryRings(topology, geometry);
    const points = rings.flat();
    const xValues = points.map(([x]) => x);
    const yValues = points.map(([, y]) => y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const padding = Math.max(maxX - minX, maxY - minY) * 0.08 || 1;
    const viewBox = `${minX - padding} ${minY - padding} ${maxX - minX + padding * 2} ${maxY - minY + padding * 2}`;
    const pathData = rings.map((ring) => ring
        .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x} ${y}`)
        .join(" ") + " Z")
        .join(" ");

    return `<svg class="countryMap" viewBox="${viewBox}" role="img" aria-label="Country map"><path d="${pathData}"></path></svg>`;
}

function showMapFallback() {
    questionArea.textContent = "Map unavailable for this country.";
    questionArea.setAttribute("aria-label", "Country map unavailable");
}

function renderCountryMap(country) {
    const requestId = mapRequestId;
    questionArea.textContent = "Loading map…";
    questionArea.setAttribute("aria-label", "Loading country map");

    if (!countryMapDataPromise) {
        // Free Natural Earth country boundaries, distributed by World Atlas.
        countryMapDataPromise = fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Country map request failed");
                }
                return response.json();
            });
    }

    countryMapDataPromise
        .then((topology) => {
            if (requestId !== mapRequestId) {
                return;
            }

            const countryName = getMapName(country.name);
            const geometry = topology.objects.countries.geometries.find((item) =>
                normalizeCountryName(item.properties.name) === countryName
            );

            if (!geometry) {
                showMapFallback();
                return;
            }

            questionArea.innerHTML = createCountryMapSvg(topology, geometry);
            questionArea.setAttribute("aria-label", "Country map");
        })
        .catch(() => {
            if (requestId === mapRequestId) {
                showMapFallback();
            }
        });
}

function resetGameState() {
    clearInterval(timerId);
    clearTimeout(nextQuestionTimeoutId);
    mapRequestId += 1;
    flagRequestId += 1;
    timerId = undefined;
    nextQuestionTimeoutId = undefined;
    isAnswerLocked = true;
    score = 0;
    streak = 0;
    bestStreak = 0;
    questionNumber = 1;
    activeRegion = "";
    usedCountries = [];
    timerDisplay.textContent = questionTime;
    updateStats();
}

function returnToMainMenu() {
    resetGameState();
    regionSelection.style.display = "none";
    capitalSelection.style.display = "none";
    mapsSelection.style.display = "none";
    questionCountSelection.style.display = "none";
    difficultySelection.style.display = "none";
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "none";
    mainMenu.style.display = "block";
}

function showGameOverScreen() {
    playSound("gameOver");
    if (score > highScore) {
        highScore = score;
        localStorage.setItem(`highScore-${totalQuestions}`, highScore);
        if (totalQuestions === 10) {
            localStorage.setItem("highScore", highScore);
        }
    }

    finalScoreDisplay.textContent = score;
    finalScoreTotalDisplay.textContent = totalQuestions;
    accuracyDisplay.textContent = Math.round((score / totalQuestions) * 100);
    bestStreakDisplay.textContent = bestStreak;
    finalDifficultyDisplay.textContent = selectedDifficulty;
    finalGameModeDisplay.textContent = selectedGameMode[0].toUpperCase() + selectedGameMode.slice(1);
    finalRegionDisplay.textContent = activeRegion;
    highScoreDisplay.textContent = highScore;
    highScoreTotalDisplay.textContent = totalQuestions;
    gameScreen.style.display = "none";
    gameOverScreen.style.display = "block";
}

function handleAnswer(selectedButton, correctAnswer, timedOut = false) {
    if (isAnswerLocked) {
        return;
    }

    isAnswerLocked = true;
    clearInterval(timerId);
    answerButtons.forEach((answerButton) => {
        answerButton.disabled = true;
    });

    if (selectedButton && selectedButton.textContent === correctAnswer) {
        selectedButton.classList.add("correct");
        playSound("correct");
        score += 1;
        streak += 1;
        bestStreak = Math.max(bestStreak, streak);
    } else {
        if (selectedButton) {
            selectedButton.classList.add("wrong");
            playSound("wrong");
        }

        streak = 0;
        answerButtons.forEach((answerButton) => {
            if (answerButton.textContent === correctAnswer) {
                answerButton.classList.add("correct");
                if (timedOut) {
                    answerButton.classList.add("timedOut");
                }
            }
        });
    }

    updateStats();

    nextQuestionTimeoutId = window.setTimeout(() => {
        if (questionNumber < totalQuestions) {
            questionNumber += 1;
            updateStats();
            generateQuestion();
        } else {
            showGameOverScreen();
        }
    }, 1000);
}

function startTimer(correctAnswer) {
    let secondsLeft = questionTime;
    timerDisplay.textContent = secondsLeft;

    timerId = window.setInterval(() => {
        secondsLeft -= 1;
        timerDisplay.textContent = secondsLeft;

        if (secondsLeft === 0) {
            playSound("timeout");
            handleAnswer(null, correctAnswer, true);
        }
    }, 1000);
}

function generateQuestion() {
    clearInterval(timerId);
    mapRequestId += 1;
    flagRequestId += 1;
    questionArea.classList.remove("flagImageQuestion");
    const filteredCountries = getAvailableCountries(activeRegion);

    const availableCountries = filteredCountries.filter((country) => !usedCountries.includes(country.name));
    const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
    usedCountries.push(randomCountry.name);

    const wrongCountries = countries
        .filter((country) => country.name !== randomCountry.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

    const answers = [randomCountry, ...wrongCountries];
    let correctAnswer;
    let shuffledAnswers;

    if (selectedGameMode === "maps") {
        renderCountryMap(randomCountry);
    } else if (selectedGameMode === "flags") {
        renderCountryFlag(randomCountry);
    } else {
        questionArea.textContent = randomCountry.flag;
        questionArea.setAttribute("aria-label", "Country flag");
    }
    isAnswerLocked = false;

    if (selectedGameMode === "capitals") {
        questionTitle.textContent = `What is the capital of ${randomCountry.name}?`;
        correctAnswer = randomCountry.capital;
        shuffledAnswers = answers
            .map((country) => country.capital)
            .sort(() => Math.random() - 0.5);
    } else {
        questionTitle.textContent = "Which country is this?";
        correctAnswer = randomCountry.name;
        shuffledAnswers = answers
            .map((country) => country.name)
            .sort(() => Math.random() - 0.5);
    }

    answerButtons.forEach((button, index) => {
        button.textContent = shuffledAnswers[index];
        button.classList.remove("correct", "wrong", "timedOut");
        button.disabled = false;

        button.onclick = () => handleAnswer(button, correctAnswer);
    });

    startTimer(correctAnswer);
}

function showGameScreen(region) {
    clearInterval(timerId);
    clearTimeout(nextQuestionTimeoutId);
    activeRegion = region;
    score = 0;
    streak = 0;
    bestStreak = 0;
    questionNumber = 1;
    usedCountries = [];
    updateStats();

    // Hide every menu before displaying the quiz.
    mainMenu.style.display = "none";
    regionSelection.style.display = "none";
    capitalSelection.style.display = "none";
    mapsSelection.style.display = "none";
    questionCountSelection.style.display = "none";
    difficultySelection.style.display = "none";
    gameOverScreen.style.display = "none";
    selectedRegion.textContent = region;
    gameScreen.style.display = "block";
    generateQuestion();
}

flagsBtn.addEventListener("click", () => {
    selectedGameMode = "flags";
    mainMenu.style.display = "none";
    regionSelection.style.display = "block";
});

capitalsBtn.addEventListener("click", () => {
    selectedGameMode = "capitals";
    mainMenu.style.display = "none";
    capitalSelection.style.display = "block";
});

mapsBtn.addEventListener("click", () => {
    selectedGameMode = "maps";
    mainMenu.style.display = "none";
    mapsSelection.style.display = "block";
});

playAgainBtn.addEventListener("click", () => {
    showGameScreen(activeRegion);
});

mainMenuBtn.addEventListener("click", () => {
    returnToMainMenu();
});

backToMenuBtns.forEach((backToMenuBtn) => {
    backToMenuBtn.addEventListener("click", returnToMainMenu);
});

quitGameBtn.addEventListener("click", returnToMainMenu);

soundToggle.addEventListener("click", () => {
    isMuted = !isMuted;
    localStorage.setItem("gameSoundsMuted", isMuted);
    updateSoundToggle();
});

updateSoundToggle();

// A region is chosen before selecting a question count and difficulty.
document.querySelectorAll(".region, .capital, .map").forEach((regionButton) => {
    regionButton.addEventListener("click", () => {
        activeRegion = regionButton.textContent.trim();
        regionSelection.style.display = "none";
        capitalSelection.style.display = "none";
        mapsSelection.style.display = "none";
        updateQuestionCountOptions();
        questionCountSelection.style.display = "block";
    });
});

document.querySelectorAll(".questionCount").forEach((countButton) => {
    countButton.addEventListener("click", () => {
        const availableCountries = getAvailableCountries(activeRegion);
        totalQuestions = countButton.dataset.count === "all"
            ? availableCountries.length
            : Number(countButton.dataset.count);
        highScore = getHighScore();
        updateStats();
        questionCountSelection.style.display = "none";
        difficultySelection.style.display = "block";
    });
});

document.querySelectorAll(".difficulty").forEach((difficultyButton) => {
    difficultyButton.addEventListener("click", () => {
        questionTime = Number(difficultyButton.dataset.seconds);
        selectedDifficulty = difficultyButton.dataset.difficulty;
        showGameScreen(activeRegion);
    });
});
