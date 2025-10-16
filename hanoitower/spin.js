const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

const options = ["4", "7", "8", "5", "3", "6"];
const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C780FA", "#FFA07A"];
const arcSize = 2 * Math.PI / options.length;
let angle = 0;
let hasSpun = false;

function drawWheel() {
    for (let i = 0; i < options.length; i++) {
        const startAngle = angle + i * arcSize;
        const endAngle = startAngle + arcSize;
        ctx.beginPath();
        ctx.fillStyle = colors[i];
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 200, startAngle, endAngle);
        ctx.lineTo(250, 250);
        ctx.fill();

        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 24px Be Vietnam Pro";
        ctx.fillText(options[i], 190, 10);
        ctx.restore();
    }
}

drawWheel();

spinBtn.onclick = function () {
    if (hasSpun) {
        result.textContent = "🎉 Bạn chỉ được quay 1 lần!";
        result.style.color = "#FFD93D";
        return;
    }

    hasSpun = true;
    const rotation = 360 * 5 + Math.floor(Math.random() * 360);
    const duration = 2000;
    const start = performance.now();

    spinBtn.disabled = true;
    spinBtn.style.backgroundColor = "#ccc";
    spinBtn.style.cursor = "not-allowed";

    function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        angle = (rotation * progress * Math.PI / 180) % (2 * Math.PI);
        ctx.clearRect(0, 0, 500, 500);
        drawWheel();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            const selectedIndex = Math.floor((options.length - (angle / arcSize)) % options.length);
            const selected = options[selectedIndex >= 0 ? selectedIndex : options.length + selectedIndex];
            result.textContent = `🎯 Bạn sẽ chơi với ${selected} đĩa!`;
            result.style.color = "#28a745";

            localStorage.setItem('selectedDiscs', selected);
            // localStorage.setItem('lockSelection', 'true');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000); // Chờ 2 giây rồi chuyển trang
        }
    }

    requestAnimationFrame(animate);
};
