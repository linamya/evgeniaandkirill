document.addEventListener("DOMContentLoaded", function () {
    
    // --- 1. ПЕРЕКЛЮЧЕНИЕ ЭКРАНА (1 БЛОК) ---
    const introOverlay = document.getElementById("intro-overlay");
    const mainContent = document.getElementById("main-content");

    if (introOverlay && mainContent) {
        introOverlay.addEventListener("click", function () {
            introOverlay.classList.add("hidden");
            mainContent.classList.remove("hidden");
            window.scrollTo(0, 0);
        });
    }

    // --- 2. ПОЛЕ "ВОЗРАСТ РЕБЕНКА" ---
    const withKidsRadio = document.getElementById("with-kids");
    const noKidsRadio = document.getElementById("no-kids");
    const childrenAgeInput = document.getElementById("children-age");

    document.querySelectorAll('input[name="children"]').forEach(radio => {
        radio.addEventListener("change", function () {
            if (withKidsRadio && withKidsRadio.checked) {
                childrenAgeInput.classList.remove("hidden");
            } else if (childrenAgeInput) {
                childrenAgeInput.classList.add("hidden");
                childrenAgeInput.value = "";
            }
        });
    });

    // --- 3. ЛОГИКА ТАЙМЕРА (01.10.2026 10:00) ---
    (function () {
        // Месяцы в JS считаются с 0, поэтому 9 — это Октябрь
        const countDownDate = new Date(2026, 9, 1, 10, 0, 0).getTime();

        function updateTimer() {
            const now = new Date().getTime();
            const distance = countDownDate - now;

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            const dEl = document.getElementById("days");
            const hEl = document.getElementById("hours");
            const mEl = document.getElementById("minutes");
            const sEl = document.getElementById("seconds");

            if (dEl && hEl && mEl && sEl) {
                if (distance < 0) {
                    clearInterval(timerInterval);
                    dEl.innerText = "00";
                    hEl.innerText = "00";
                    mEl.innerText = "00";
                    sEl.innerText = "00";
                    const displayEl = document.querySelector(".timer-display");
                    if (displayEl) {
                        displayEl.innerHTML = "<span style='font-size: 24px; font-family: \"Forum\", serif;'>Событие началось!</span>";
                    }
                } else {
                    dEl.innerText = days < 10 ? "0" + days : days;
                    hEl.innerText = hours < 10 ? "0" + hours : hours;
                    mEl.innerText = minutes < 10 ? "0" + minutes : minutes;
                    sEl.innerText = seconds < 10 ? "0" + seconds : seconds;
                }
            }
        }

        updateTimer();
        const timerInterval = setInterval(updateTimer, 1000);
    })();

    // --- 4. ОБРАБОТКА ФОРМЫ (ОТПРАВКА В VK ЧЕРЕЗ CLOUDFLARE) ---
    const form = document.getElementById("wedding-form");

    if (form) {
        const submitBtn = form.querySelector(".submit-btn");

        form.addEventListener("submit", async function (e) {
            e.preventDefault();

            const WORKER_URL = "https://wedding-form-czb.pages.dev/send";

            // Сбор данных формы
            const formData = new FormData(form);
            const data = {
                name: formData.get("name"),
                attendance: formData.get("attendance"),
                companion: formData.get("companion"),
                children: formData.get("children"),
                children_age: formData.get("children_age"),
                preferences: formData.get("preferences"),
                music: formData.get("music")
            };

            // Блокируем кнопку на время отправки
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "ОТПРАВКА...";
            }

            try {
                const response = await fetch(WORKER_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert("Спасибо за ваш ответ! Анкета успешно отправлена.");
                    form.reset();
                    if (childrenAgeInput) childrenAgeInput.classList.add("hidden");
                } else {
                    alert("Произошла ошибка при отправке. Попробуйте еще раз.");
                }
            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка сети. Проверьте подключение.");
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "ОТПРАВИТЬ";
                }
            }
        });
    }

}); // <-- ВОТ ЗДЕСЬ НЕ ХВАТАЛО ЗАКРЫВАЮЩЕЙ СКОБКИ И ТОЧКИ С ЗАПЯТОЙ
