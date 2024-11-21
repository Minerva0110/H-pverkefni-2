interface Progress {
    correct: number;
    total: number;
}

interface UserProgress {
    [topic: string]: Progress;
}

// Overload signatures
function displayProgress(): void;
function displayProgress(topic: string): void;

// Function implementation
function displayProgress(topic?: string): void {
    const progress: UserProgress = JSON.parse(localStorage.getItem('userProgress') || '{}');
    const progressList = document.getElementById('progress-list');

    if (!progressList) {
        console.error('Progress list element not found!');
        return;
    }

    progressList.innerHTML = '';  // Clear the list

    if (topic) {
        // Display progress for a specific topic
        displayTopicProgress(topic, progress[topic], progressList);
    } else {
        // Display progress for all topics
        Object.keys(progress).forEach(topic => {
            displayTopicProgress(topic, progress[topic], progressList);
        });
    }
}

function displayTopicProgress(topic: string, progress: Progress, container: HTMLElement): void {
    const percentCorrect = ((progress.correct / progress.total) * 100).toFixed(2);
    const listItem = document.createElement('li');
    listItem.textContent = `${topic.toUpperCase()}: ${percentCorrect}% correct (${progress.correct} out of ${progress.total} questions)`;
    listItem.className = percentCorrect === '100.00' ? 'perfect-score' : 'needs-improvement';
    container.appendChild(listItem);
}
