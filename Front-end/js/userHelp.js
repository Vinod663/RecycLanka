// ===== Knowledge Cards (Modal or Alert) =====
function showKnowledge(topic) {
    let messages = {
        "getting-started": "Welcome to RecycLanka! Learn how to set up your profile, navigate your dashboard, and start using the system.",
        "schedule": "Collection schedules show when waste will be picked up in your area. You can set reminders and view timelines.",
        "sorting": "Separate waste into recyclable, organic, and general. Proper sorting increases recycling efficiency.",
        "troubleshooting": "Missed collections or technical issues? Submit complaints and track resolutions here.",
        "tips": "Discover eco-friendly tips to reduce waste and live sustainably every day."
    };
    alert(messages[topic] || "More information coming soon!");
}

// ===== Quick Tips Carousel =====
let currentSlide = 0;
const slides = document.querySelectorAll(".tip-slide");
const dots = document.querySelectorAll(".carousel-dot");
const slidesWrapper = document.getElementById("tipSlides");

function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;
    slidesWrapper.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    dots.forEach(dot => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

// Auto-slide every 5 seconds
setInterval(() => {
    let next = (currentSlide + 1) % slides.length;
    goToSlide(next);
}, 5000);

// ===== FAQ Expand/Collapse =====
function toggleFAQ(element) {
    const item = element.parentElement;
    item.classList.toggle("active");
}

// ===== Search Functionality =====
// SEARCH FUNCTIONALITY
// Get the search input
document.addEventListener("DOMContentLoaded", () => {
    // ===== Search Functionality =====
    const searchInput = document.querySelector(".help-search");

    searchInput.addEventListener("keyup", (e) => {
        if (e.key === "Enter") {
            performSearch(searchInput.value);
        }
    });

    function performSearch(query) {
        query = query.toLowerCase().trim();

        if (!query) {
            alert("Please type something to search.");
            return;
        }

        let found = false;

        // Search FAQs
        document.querySelectorAll(".faq-item").forEach(item => {
            const question = item.querySelector(".faq-question").innerText.toLowerCase();
            const answer = item.querySelector(".faq-answer").innerText.toLowerCase();

            if (question.includes(query) || answer.includes(query)) {
                item.style.display = "block"; // show matching
                found = true;
            } else {
                item.style.display = "none"; // hide non-matching
            }
        });

        // Search Knowledge Cards
        document.querySelectorAll(".knowledge-card").forEach(card => {
            const text = card.innerText.toLowerCase();
            if (text.includes(query)) {
                card.style.display = "block"; // show matching
                found = true;
            } else {
                card.style.display = "none"; // hide non-matching
            }
        });

        if (!found) {
            alert("No results found for: " + query);
        }
    }
});




const knowledgeData = [
    {
        title: "Getting Started",
        desc: "Learn the basics of navigating your dashboard and using RecycLanka.",
        icon: "fa-play-circle"
    },
    {
        title: "Collection Schedules",
        desc: "View and set reminders for your waste collection days.",
        icon: "fa-calendar-check"
    },
    {
        title: "Waste Sorting Guide",
        desc: "Understand how to properly separate recyclables, organic, and general waste.",
        icon: "fa-recycle"
    },
    {
        title: "Common Issues & Solutions",
        desc: "Troubleshoot missed collections and technical glitches.",
        icon: "fa-tools"
    },
    {
        title: "Eco-Friendly Tips",
        desc: "Practical advice for reducing waste and living sustainably.",
        icon: "fa-leaf"
    }
];

