document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("ir-module-container");
    if (!container) return;

    renderSubjects();

    function renderSubjects() {
        container.innerHTML = "";
        
        irDatabase.forEach(subject => {
            let totalUnits = subject.units.length;
            let totalLessons = subject.units.reduce((acc, unit) => acc + unit.lessons.length, 0);

            const subjectCard = document.createElement("div");
            subjectCard.className = "premium-subject-card";
            subjectCard.innerHTML = `
                <div class="card-header">
                    <div class="card-title-wrap">
                        <div class="subject-icon">
                            <i class="${subject.icon}"></i>
                        </div>
                        <div class="subject-info">
                            <h2>${subject.title}</h2>
                            <p>${totalUnits} Units &bull; ${totalLessons} Lessons</p>
                        </div>
                    </div>
                    <div class="progress-wrap">
                        <span class="progress-text">${subject.progress}% Completed</span>
                        <div class="progress-bar-container">
                            <div class="progress-bar-fill" style="width: ${subject.progress}%"></div>
                        </div>
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn-continue" onclick="toggleSubject('${subject.id}')">
                        <span>Continue Learning</span>
                        <i class="fas fa-chevron-down toggle-icon" id="icon-${subject.id}"></i>
                    </button>
                </div>
                <div class="units-container" id="units-${subject.id}" style="display: none;">
                    <!-- Units injected here -->
                </div>
            `;
            container.appendChild(subjectCard);
        });
    }

    // Global toggle function
    window.toggleSubject = function(subjectId) {
        const unitsContainer = document.getElementById(`units-${subjectId}`);
        const icon = document.getElementById(`icon-${subjectId}`);
        
        if (unitsContainer.style.display === "none") {
            unitsContainer.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
            renderUnits(subjectId, unitsContainer);
        } else {
            unitsContainer.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    }

    function renderUnits(subjectId, container) {
        const subject = irDatabase.find(s => s.id === subjectId);
        if (!subject) return;

        let html = '<div class="timeline">';
        
        subject.units.forEach((unit, index) => {
            let completedLessons = unit.lessons.filter(l => l.completed).length;
            let isUnitCompleted = completedLessons === unit.lessons.length && unit.lessons.length > 0;
            let unitStatusIcon = isUnitCompleted ? '<i class="fas fa-check-circle" style="color: var(--premium-success);"></i>' : `<span class="unit-number">${index + 1}</span>`;

            html += `
                <div class="timeline-item">
                    <div class="timeline-marker">${unitStatusIcon}</div>
                    <div class="timeline-content">
                        <div class="unit-header" onclick="toggleUnit('${unit.id}')">
                            <div>
                                <h3>Unit ${index + 1}: ${unit.title}</h3>
                                <p>${unit.lessons.length} Lessons &bull; ${completedLessons}/${unit.lessons.length} Completed</p>
                            </div>
                            <i class="fas fa-chevron-down unit-toggle-icon" id="unit-icon-${unit.id}"></i>
                        </div>
                        <div class="lessons-container" id="lessons-${unit.id}" style="display: none;">
                            <ul class="lesson-list">
                                ${unit.lessons.map(lesson => {
                                    let icon = lesson.type === 'video' ? 'fa-play-circle' : (lesson.type === 'practice' || lesson.type === 'quiz' ? 'fa-pen-to-square' : (lesson.type === 'text' ? 'fa-file-alt' : 'fa-file-pdf'));
                                    let colorClass = lesson.completed ? 'completed' : '';
                                    let checkIcon = lesson.completed ? '<i class="fas fa-check" style="color: var(--premium-success); margin-left: auto;"></i>' : '';
                                    let descriptionHtml = lesson.description ? `<div class="lesson-description">${lesson.description}</div>` : '';
                                    return `
                                        <li class="lesson-item ${colorClass}">
                                            <div class="lesson-header-row">
                                                <i class="fas ${icon} lesson-type-icon"></i>
                                                <span class="lesson-title">${lesson.title}</span>
                                                <span class="lesson-duration">(${lesson.duration || 'N/A'})</span>
                                                ${checkIcon}
                                            </div>
                                            ${descriptionHtml}
                                        </li>
                                    `;
                                }).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    }

    window.toggleUnit = function(unitId) {
        const lessonsContainer = document.getElementById(`lessons-${unitId}`);
        const icon = document.getElementById(`unit-icon-${unitId}`);
        
        if (lessonsContainer.style.display === "none") {
            lessonsContainer.style.display = "block";
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        } else {
            lessonsContainer.style.display = "none";
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    }
});

