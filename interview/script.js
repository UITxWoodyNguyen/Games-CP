document.addEventListener('DOMContentLoaded', function () {
    // Form elements
    const personalInfoForm = document.getElementById('personal-info-form');
    const formContainer = document.getElementById('form-container');
    let timeSlotsContainer;

    // Personal info
    let personalInfo = {};

    // Google Form configuration
    const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdJWIgTQXhiovutrEaKCUtaNDeXFOhYti7qG-AQSwHZOOriHA/formResponse';
    const FORM_FIELD_IDS = {
        name: 'entry.1552575798',
        class: 'entry.473342047',
        email: 'entry.927123985',
        position: 'entry.1613197133',
        date: 'entry.2133791484',
        period: 'entry.1575707357',
        time: 'entry.1815278514'
    };

    // Time slots data - now with 15-minute intervals
    const timeSlotsData = {
        "22/8": {
            "Sáng": generateTimeSlots("08:00", "10:45", 15, 4),
            "Trưa-Chiều": generateTimeSlots("14:00", "16:45", 15, 4),
            "Tối": generateTimeSlots("20:00", "21:45", 15, 4)
        },
        "23/8": {
            "Sáng": generateTimeSlots("08:00", "10:45", 15, 4),
            "Trưa-Chiều": generateTimeSlots("14:00", "16:45", 15, 4),
            "Tối": generateTimeSlots("20:00", "21:45", 15, 4)
        }
    };

    // Function to generate time slots with 15-minute intervals
    function generateTimeSlots(startTime, endTime, intervalMinutes, maxSlots) {
        const slots = {};
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        let currentHour = startHour;
        let currentMinute = startMinute;

        while (currentHour < endHour || (currentHour === endHour && currentMinute <= endMinute)) {
            const startTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;

            let endHourCalc = currentHour;
            let endMinuteCalc = currentMinute + intervalMinutes;

            if (endMinuteCalc >= 60) {
                endHourCalc += Math.floor(endMinuteCalc / 60);
                endMinuteCalc = endMinuteCalc % 60;
            }

            const endTimeStr = `${endHourCalc.toString().padStart(2, '0')}:${endMinuteCalc.toString().padStart(2, '0')}`;
            const timeRange = `${startTimeStr} - ${endTimeStr}`;
            slots[timeRange] = { slots: maxSlots, available: maxSlots };

            currentMinute += intervalMinutes;
            if (currentMinute >= 60) {
                currentHour += Math.floor(currentMinute / 60);
                currentMinute = currentMinute % 60;
            }
        }
        return slots;
    }

    // Handle personal info form submission
    personalInfoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        personalInfo = {
            fullname: document.getElementById('fullname').value.trim(),
            class: document.getElementById('class').value.trim(),
            email: document.getElementById('email').value.trim(),
            position: document.getElementById('position').value
        };

        if (!personalInfo.fullname || !personalInfo.class || !personalInfo.email || !personalInfo.position) {
            showAlert('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        createTimeSlotsPage();
    });

    // Create time slots selection page
    function createTimeSlotsPage() {
        formContainer.innerHTML = '';

        const backButton = document.createElement('button');
        backButton.className = 'btn btn-secondary';
        backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Quay lại';
        backButton.addEventListener('click', function () {
            location.reload();
        });
        formContainer.appendChild(backButton);

        timeSlotsContainer = document.createElement('div');
        timeSlotsContainer.id = 'time-slots-container';
        formContainer.appendChild(timeSlotsContainer);

        const title = document.createElement('h2');
        title.textContent = 'Chọn Khung Giờ Phỏng Vấn';
        title.style.marginBottom = '20px';
        title.style.color = 'var(--primary-color)';
        timeSlotsContainer.appendChild(title);

        const instruction = document.createElement('p');
        instruction.textContent = 'Vui lòng chọn một khung giờ phỏng vấn phù hợp với bạn:';
        instruction.style.marginBottom = '30px';
        instruction.style.color = 'var(--gray-color)';
        timeSlotsContainer.appendChild(instruction);

        // Create time slots for each day
        for (const day in timeSlotsData) {
            const daySection = document.createElement('div');
            daySection.className = 'day-selection';

            const dayTitle = document.createElement('div');
            dayTitle.className = 'day-title';
            dayTitle.textContent = `Ngày ${day}`;
            daySection.appendChild(dayTitle);

            // Create sections for each time period (Sáng, Trưa-Chiều, Tối)
            for (const period in timeSlotsData[day]) {
                const periodSection = document.createElement('div');
                periodSection.style.marginBottom = '20px';

                const periodTitle = document.createElement('h3');
                periodTitle.textContent = `Buổi ${period}`;
                periodTitle.style.margin = '15px 0 10px 0';
                periodTitle.style.color = 'var(--dark-color)';
                periodSection.appendChild(periodTitle);

                const slotsContainer = document.createElement('div');
                slotsContainer.className = 'time-slots';

                for (const timeSlot in timeSlotsData[day][period]) {
                    const slotData = timeSlotsData[day][period][timeSlot];
                    const slotElement = document.createElement('div');
                    slotElement.className = slotData.available > 0 ? 'time-slot' : 'time-slot disabled';
                    slotElement.dataset.day = day;
                    slotElement.dataset.period = period;
                    slotElement.dataset.time = timeSlot;

                    const slotTime = document.createElement('div');
                    slotTime.className = 'slot-time';
                    slotTime.textContent = timeSlot;

                    const slotAvailability = document.createElement('div');
                    slotAvailability.className = 'slot-availability';
                    slotAvailability.textContent = `${slotData.available}/${slotData.slots} slot`;

                    slotElement.appendChild(slotTime);
                    slotElement.appendChild(slotAvailability);

                    if (slotData.available > 0) {
                        slotElement.addEventListener('click', function () {
                            selectTimeSlot(this);
                        });
                    }

                    slotsContainer.appendChild(slotElement);
                }

                periodSection.appendChild(slotsContainer);
                daySection.appendChild(periodSection);
            }

            timeSlotsContainer.appendChild(daySection);
        }

        timeSlotsContainer.style.display = 'block';
    }

    // Handle time slot selection
    function selectTimeSlot(slotElement) {
        const previousSelected = document.querySelector('.time-slot.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }

        slotElement.classList.add('selected');

        const existingConfirmButton = document.getElementById('confirm-button');
        if (existingConfirmButton) {
            existingConfirmButton.remove();
        }

        const confirmButton = document.createElement('button');
        confirmButton.id = 'confirm-button';
        confirmButton.className = 'btn';
        confirmButton.innerHTML = 'Xác nhận lịch phỏng vấn <i class="fas fa-check"></i>';
        confirmButton.style.marginTop = '30px';
        confirmButton.addEventListener('click', function () {
            confirmAppointment(
                slotElement.dataset.day,
                slotElement.dataset.period,
                slotElement.dataset.time
            );
        });

        timeSlotsContainer.appendChild(confirmButton);
    }


    

    // Confirm appointment
    function confirmAppointment(day, period, time) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-icon">
                    <i class="fas fa-calendar-check"></i>
                </div>
                <h2>Xác nhận lịch phỏng vấn</h2>
                <p>Bạn có chắc chắn muốn đặt lịch phỏng vấn vào:</p>
                <p><strong>Ngày ${day}, Buổi ${period}</strong></p>
                <p><strong>Khung giờ: ${time}</strong></p>
                <div class="modal-buttons">
                    <button id="cancel-button" class="btn btn-secondary">Hủy</button>
                    <button id="submit-button" class="btn">Xác nhận</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.style.display = 'flex';

        document.getElementById('cancel-button').addEventListener('click', function () {
            modal.remove();
        });

        document.getElementById('submit-button').addEventListener('click', function () {
            submitToGoogleForm(day, period, time, modal);
        });
    }

    // Submit appointment to Google Form
    function submitToGoogleForm(day, period, time, modal) {
        const iframe = document.getElementById('hidden-iframe');
        
        // Tạo form ẩn để submit dữ liệu
        const form = document.createElement('form');
        form.action = GOOGLE_FORM_URL;
        form.method = 'POST';
        form.target = 'hidden-iframe';

        // Thêm các trường dữ liệu vào form
        const addField = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        addField(FORM_FIELD_IDS.name, personalInfo.fullname);
        addField(FORM_FIELD_IDS.class, personalInfo.class);
        addField(FORM_FIELD_IDS.email, personalInfo.email);
        addField(FORM_FIELD_IDS.position, personalInfo.position);
        addField(FORM_FIELD_IDS.date, day);
        addField(FORM_FIELD_IDS.period, period);
        addField(FORM_FIELD_IDS.time, time);

        // Thêm form vào DOM và submit
        document.body.appendChild(form);
        form.submit();

        // Xử lý sau khi submit
        iframe.onload = function() {
            // Kiểm tra nếu submit thành công (đơn giản)
            // Trong thực tế, bạn có thể cần kiểm tra phức tạp hơn
            try {
                // Trừ slot sau khi submit thành công
                timeSlotsData[day][period][time].available--;
                updateSlotDisplay(day, period, time);
                
                // Hiển thị thông báo thành công
                showSuccessMessage(modal, day, period, time);
            } catch (error) {
                console.error('Error updating slot:', error);
                showAlert('Có lỗi xảy ra khi cập nhật slot', 'error');
            } finally {
                // Dọn dẹp
                document.body.removeChild(form);
            }
        };

        // Fallback nếu iframe.onload không hoạt động
        setTimeout(() => {
            try {
                timeSlotsData[day][period][time].available--;
                updateSlotDisplay(day, period, time);
                showSuccessMessage(modal, day, period, time);
                document.body.removeChild(form);
            } catch (error) {
                console.error('Error in fallback:', error);
            }
        }, 2000);
    }

    // Update slot display
    function updateSlotDisplay(day, period, time) {
        const slotElements = document.querySelectorAll(`.time-slot[data-day="${day}"][data-period="${period}"][data-time="${time}"]`);
        const newAvailable = timeSlotsData[day][period][time].available;

        slotElements.forEach(slot => {
            const availabilityElement = slot.querySelector('.slot-availability');
            availabilityElement.textContent = `${newAvailable}/${timeSlotsData[day][period][time].slots} slot`;

            if (newAvailable <= 0) {
                slot.classList.add('disabled');
                slot.classList.remove('selected');
                slot.onclick = null;
            }
        });
    }

    // Show success message
    function showSuccessMessage(modal, day, period, time) {
        modal.querySelector('.modal-content').innerHTML = `
            <div class="modal-icon success">
                <i class="fas fa-check-circle"></i>
            </div>
            <h2>Đặt lịch thành công!</h2>
            <p>Thông tin lịch phỏng vấn:</p>
            <p><strong>Ngày ${day}, Buổi ${period}</strong></p>
            <p><strong>Khung giờ: ${time}</strong></p>
            <button id="return-button" class="btn">Trở về trang chủ</button>
        `;

        document.getElementById('return-button').addEventListener('click', function () {
            location.reload();
        });
    }

    // Show alert message
    function showAlert(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${type}`;
        alertDiv.textContent = message;
        
        formContainer.insertBefore(alertDiv, formContainer.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }
});