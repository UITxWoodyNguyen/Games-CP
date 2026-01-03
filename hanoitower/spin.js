const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spin");
const result = document.getElementById("result");

const options = ["3", "4", "5", "6", "7", "8"];

// Tạo mảng weightedOptions để random theo tỉ lệ yêu cầu
// 3,4: 40% (mỗi số 20%)
// 5,6: 30% (mỗi số 15%)
// 7: 20%
// 8: 10%
const weightedOptions = [
    "3", "3", "3", "3", "3", "3", "3", "3", // 8 lần (20%)
    "4", "4", "4", "4", "4", "4", "4", "4", // 8 lần (20%)
    "5", "5", "5", "5", "5", "5", // 6 lần (15%)
    "6", "6", "6", "6", "6", "6", // 6 lần (15%)
    "7", "7", "7", "7", // 4 lần (20%)
    "8", "8" // 2 lần (10%)
];
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
    // Quay random theo weightedOptions
    const selected = weightedOptions[Math.floor(Math.random() * weightedOptions.length)];
    // Tìm index của selected trong options để xác định góc quay
    const selectedIndex = options.indexOf(selected);
    // Quay đến đúng ô selectedIndex
    const arcSize = 2 * Math.PI / options.length;
    // Quay nhiều vòng rồi dừng ở selectedIndex
    const baseAngle = (options.length - selectedIndex) * arcSize;
    const randomOffset = Math.random() * arcSize * 0.8 - arcSize * 0.4; // Để không luôn dừng chính giữa
    const finalAngle = baseAngle + randomOffset;
    const rotation = 360 * 5 + (finalAngle * 180 / Math.PI);
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
            // Xác định lại selectedIndex từ góc quay thực tế
            const idx = Math.floor((options.length - (angle / arcSize)) % options.length);
            const realSelected = options[idx >= 0 ? idx : options.length + idx];
            result.textContent = `🎯 Bạn sẽ chơi với ${realSelected} đĩa!`;
            result.style.color = "#28a745";

            localStorage.setItem('selectedDiscs', realSelected);
            localStorage.setItem('lockSelection', 'true');
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000); // Chờ 2 giây rồi chuyển trang
        }
    }

    requestAnimationFrame(animate);
};
