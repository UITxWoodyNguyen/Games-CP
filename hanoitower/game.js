let towers;
let selectedDisc = null;
let moveCount = 0;
let discCount = 3;
let maxMoves = 0;
let timerInterval;
let timeLeft = 300;
let gameEnded = false;
let restartUsed = false;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimer() {
  if (gameEnded) return;
  timeLeft--;
  document.getElementById('timer').textContent = formatTime(timeLeft);
  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    endGame(false);
  }
}

async function submitToGoogleForm(playerName, discCount, moves, timeUsed, result) {
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe4uXLO4XKvTc1sfcivVFLzeQmArCPqsR6hf2l0ctLtQtVlCw/formResponse';

  // Tên các trường trong Form (thay bằng ID thực tế)
  const formFields = {
    "entry.376621263": playerName,    // Thay bằng ID trường "Tên người chơi"
    "entry.496682450": discCount,     // Thay bằng ID trường "Số đĩa"
    "entry.364574772": moves,         // Thay bằng ID trường "Số bước"
    "entry.1679190620": timeUsed,      // Thay bằng ID trường "Thời gian"
    "entry.2046182108": result         // Thay bằng ID trường "Kết quả"
  };

  // Chuyển dữ liệu thành URL-encoded
  const formData = new URLSearchParams();
  for (const key in formFields) {
    formData.append(key, formFields[key]);
  }

  // Gửi dữ liệu bằng fetch()
  try {
    await fetch(formUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log("Đã gửi kết quả thành công!");
  } catch (error) {
    console.error("Lỗi khi gửi kết quả:", error);
  }
}

function endGame(won) {
  gameEnded = true;
  clearInterval(timerInterval);
  const message = document.getElementById('message');
  const timeUsed = 300 - timeLeft;
  const formattedTime = formatTime(timeUsed);

  if (won) {
    message.textContent = `🎉 Bạn đã thắng với ${moveCount} bước trong ${formattedTime}!`;
  } else if (timeLeft <= 0) {
    message.textContent = "😢 Hết thời gian";
  } else {
    message.textContent = "😢 Chúc bạn may mắn lần sau";
  }

  // Gửi dữ liệu đến Google Form
  const playerName = document.getElementById('player-name').textContent;
  submitToGoogleForm(
    playerName,
    discCount,
    moveCount,
    formattedTime,
    won ? "Thắng" : "Thua"
  );

  // Nếu thắng, sau 2-3s thì fetch lại bảng xếp hạng và hiển thị vị trí
  if (won) {
    setTimeout(() => {
      fetch('https://opensheet.elk.sh/1c3Zy0gG_0Vg_7FofCh0zXMZgzPZI2SczvNBjlflVG7w/Form%20Responses%201')
        .then(res => res.json())
        .then(data => {
          // Dùng đúng key cột Sheet
          const valid = data.filter(row => row['Tên người chơi?'] && row['Số bước di chuyển'] && row['Kết quả?']==='Thắng');
          valid.sort((a, b) => {
            const movesA = parseInt(a['Số bước di chuyển']);
            const movesB = parseInt(b['Số bước di chuyển']);
            if (movesA !== movesB) return movesA - movesB;
            const timeA = a['Thời gian chơi'] ? a['Thời gian chơi'].split(':').reduce((m,s,i)=>m*60+parseInt(s),0) : 9999;
            const timeB = b['Thời gian chơi'] ? b['Thời gian chơi'].split(':').reduce((m,s,i)=>m*60+parseInt(s),0) : 9999;
            return timeA - timeB;
          });
          // Tìm vị trí của người chơi (tìm theo tên, số bước, thời gian)
          const idx = valid.findIndex(row =>
            row['Tên người chơi?'] === playerName &&
            parseInt(row['Số bước di chuyển']) === moveCount &&
            row['Thời gian chơi'] === formattedTime
          );
          if (idx !== -1) {
            alert(`🎉 Bạn đã hoàn thành trò chơi trong ${formattedTime} và đạt được vị trí thứ ${idx+1} trên bảng xếp hạng!`);
          } else {
            alert('Đã gửi kết quả, vui lòng tải lại trang để xem vị trí trên bảng xếp hạng!');
          }
        })
        .catch(() => {
          alert('Không thể kiểm tra vị trí trên bảng xếp hạng!');
        });
    }, 2500); // Đợi 2.5s để Google Sheet cập nhật
  }
}

function checkWin() {
  const tower1 = document.getElementById('tower-1');
  const tower2 = document.getElementById('tower-2');

  if (
    tower1.childElementCount === discCount ||
    tower2.childElementCount === discCount
  ) {
    endGame(true);
  } else if ((maxMoves - moveCount) <= 0) {
    endGame(false);
  }
}

function setupDiscs() {
  const baseTower = document.getElementById('tower-0');
  for (let i = discCount; i >= 1; i--) {
    const disc = document.createElement('div');
    disc.classList.add('disc', `size-${i}`);
    disc.setAttribute('draggable', 'true');
    // Drag events
    disc.addEventListener('dragstart', (e) => {
      if (gameEnded) {
        e.preventDefault();
        return;
      }
      // Chỉ cho phép kéo đĩa trên cùng của cọc
      const parent = disc.parentElement;
      if (parent && parent.lastElementChild !== disc) {
        e.preventDefault();
        return;
      }
      disc.classList.add('dragging');
      e.dataTransfer.setData('text/plain', '');
      // Lưu thông tin đĩa đang kéo
      window._draggedDisc = disc;
    });
    disc.addEventListener('dragend', () => {
      disc.classList.remove('dragging');
      window._draggedDisc = null;
    });
    baseTower.appendChild(disc);
  }
}

function resetGame() {
  moveCount = 0;
  timeLeft = 300;
  gameEnded = false;
  selectedDisc = null;

  towers.forEach(tower => tower.innerHTML = '');
  setupDiscs();

  document.getElementById('moves').textContent = maxMoves;
  document.getElementById('timer').textContent = formatTime(timeLeft);
  document.getElementById('message').textContent = '';

  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
}

function initGame() {
    // Auto Solve logic

    // Helper: Get current state of all towers as arrays of disc sizes (bottom to top)
    function getCurrentTowersState() {
      return [0, 1, 2].map(i => {
        const tower = document.getElementById(`tower-${i}`);
        // Discs are DOM children, bottom to top
        return Array.from(tower.children).map(disc => {
          // Extract disc size from class (e.g., 'size-3')
          const match = disc.className.match(/size-(\d+)/);
          return match ? parseInt(match[1]) : null;
        }).filter(Boolean);
      });
    }

    // Generalized Hanoi solver for any configuration
    function solveHanoiArbitrary(state, goal, moves, n) {
      // state: [ [bottom..top], [..], [..] ]
      // goal:  [ [..], [..], [bottom..top] ]
      // n: number of discs to consider (largest n discs)
      if (n === 0) return;
      // Find which tower the nth (largest) disc is on
      let from = -1, to = -1;
      for (let i = 0; i < 3; i++) {
        if (state[i][0] === n) from = i;
        if (goal[i][0] === n) to = i;
      }
      if (from === -1 || to === -1) return;
      // Remove nth disc from current and goal
      const stateCopy = state.map(arr => arr.slice());
      const goalCopy = goal.map(arr => arr.slice());
      stateCopy[from].shift();
      goalCopy[to].shift();
      // Find aux tower
      const aux = [0,1,2].find(i => i !== from && i !== to);
      // Move smaller discs to aux (as needed)
      solveHanoiArbitrary(stateCopy, [[],[],[]].map((_,i)=>i===aux?stateCopy.flat().sort((a,b)=>a-b):[]), moves, n-1);
      // Move nth disc
      moves.push([from, to]);
      // Move smaller discs to goal
      solveHanoiArbitrary([[],[],[]].map((_,i)=>i===aux?stateCopy.flat().sort((a,b)=>a-b):[]), goalCopy, moves, n-1);
    }

    function doAutoSolve(steps = 6) {
      if (discCount < 5) {
        alert('Chỉ hỗ trợ auto solve cho từ 5 đĩa trở lên!');
        return;
      }
      // Get current state
      const state = getCurrentTowersState();
      // Build goal state: all discs on tower 2, bottom to top
      const goal = [[], [], []];
      goal[2] = [];
      for (let i = discCount; i >= 1; i--) goal[2].push(i);
      // Copy state arrays (bottom to top)
      const stateCopy = state.map(arr => arr.slice());
      const goalCopy = goal.map(arr => arr.slice());
      // Generate moves
      const moves = [];
      solveHanoiArbitrary(stateCopy, goalCopy, moves, discCount);
      // Animate moves
      const towersArr = [
        document.getElementById('tower-0'),
        document.getElementById('tower-1'),
        document.getElementById('tower-2')
      ];
      let step = 0;
      function getTopDisc(tower) {
        const discs = Array.from(tower.children);
        return discs.length ? discs[discs.length - 1] : null;
      }
      function doStep() {
        if (step >= Math.min(steps, moves.length) || gameEnded) return;
        const [from, to] = moves[step];
        const fromTower = towersArr[from];
        const toTower = towersArr[to];
        const disc = getTopDisc(fromTower);
        if (!disc) { step++; setTimeout(doStep, 10); return; }
        // Check move legality
        const topTo = getTopDisc(toTower);
        if (topTo && disc.offsetWidth > topTo.offsetWidth) {
          step++;
          setTimeout(doStep, 10);
          return;
        }
        toTower.appendChild(disc);
        moveCount++;
        const movesLeft = Math.max(0, maxMoves - moveCount);
        document.getElementById('moves').textContent = movesLeft;
        checkWin();
        step++;
        setTimeout(doStep, 600);
      }
      doStep();
    }

    let autoSolveUsed = false;
    const autoSolveBtn = document.getElementById('auto-solve-btn');
    if (autoSolveBtn) {
      autoSolveBtn.addEventListener('click', () => {
        if (autoSolveUsed) {
          alert('Bạn chỉ được dùng Auto Solve 1 lần!');
          return;
        }
        autoSolveUsed = true;
        doAutoSolve(Math.floor(Math.random()*3)+5); // 5-7 bước
      });
    }
  towers = document.querySelectorAll('.tower');

  const urlParams = new URLSearchParams(window.location.search);
  const playerClass = urlParams.get('player') || 'Không rõ';
  discCount = Math.min(parseInt(urlParams.get('discs')) || 3, 8);
  maxMoves = Math.pow(2, discCount) + 5;
  document.getElementById('player-name').textContent = playerClass;
  document.getElementById('moves').textContent = maxMoves;

  setupDiscs();


  // Kéo thả đĩa
  towers.forEach(tower => {
    tower.addEventListener('dragover', (e) => {
      e.preventDefault();
      // Chỉ highlight nếu có thể thả
      const disc = window._draggedDisc;
      if (!disc) return;
      const topDisc = tower.lastElementChild;
      if (!topDisc || disc.offsetWidth < topDisc.offsetWidth) {
        tower.classList.add('drag-over');
      }
    });
    tower.addEventListener('dragleave', () => {
      tower.classList.remove('drag-over');
    });
    tower.addEventListener('drop', (e) => {
      e.preventDefault();
      tower.classList.remove('drag-over');
      const disc = window._draggedDisc;
      if (!disc) return;
      if (gameEnded) return;
      const topDisc = tower.lastElementChild;
      if (!topDisc || disc.offsetWidth < topDisc.offsetWidth) {
        disc.classList.remove('dragging');
        tower.appendChild(disc);
        moveCount++;
        const movesLeft = Math.max(0, maxMoves - moveCount);
        document.getElementById('moves').textContent = movesLeft;
        checkWin();
      }
      window._draggedDisc = null;
    });
  });

  // Vẫn giữ click để chọn/thả như cũ (tùy chọn)
  towers.forEach(tower => {
    tower.addEventListener('click', () => {
      if (gameEnded) return;
      const topDisc = tower.lastElementChild;
      if (!selectedDisc && topDisc) {
        selectedDisc = topDisc;
        selectedDisc.style.border = '2px solid #000';
      } else if (selectedDisc) {
        const canPlace = !topDisc || selectedDisc.offsetWidth < topDisc.offsetWidth;
        if (canPlace) {
          selectedDisc.style.border = '';
          tower.appendChild(selectedDisc);
          moveCount++;
          const movesLeft = Math.max(0, maxMoves - moveCount);
          document.getElementById('moves').textContent = movesLeft;
          checkWin();
        } else {
          selectedDisc.style.border = '';
        }
        selectedDisc = null;
      }
    });
  });

  document.getElementById('timer').textContent = formatTime(timeLeft);
  timerInterval = setInterval(updateTimer, 1000);

  // Sự kiện nút chơi lại
  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      if (restartUsed) {
        alert("⚠️ Bạn chỉ có thể chơi lại 1 lần!");
        return;
      }

      const confirmRestart = confirm("🔁 Bạn có chắc chắn muốn chơi lại? (Chỉ có 1 lượt)");
      if (confirmRestart) {
        restartUsed = true;
        resetGame();
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', initGame);
