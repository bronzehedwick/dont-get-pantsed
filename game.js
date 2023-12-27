(function game() {
  'use strict';

  const rawAchievements = JSON.parse(window.localStorage.getItem('achievements'));
  const achievements = new Set(rawAchievements ? rawAchievements : []);
  const totalAchievements = document
    .querySelectorAll('[data-achievement-text]')
    .length;

  if (achievements.size) {
    document
      .getElementById('achievements-count')
      .textContent = `${achievements.size}/${totalAchievements}`;
    achievements.forEach(logAchievement);
  }

  document.documentElement.addEventListener('click', choiceClicks);

  /**
   * Handle choices click.
   * @param {Event} event The `click` event.
   * @return {void}
   */
  function choiceClicks(event) {
    if (!event.target.closest('.game-button')) return;
    if (event.target.dataset.targetId === 'restart') {
      restartGame()
      return;
    }
    showSelectedPath(event.target);
    const achievementText = event.target.dataset.achievementText;
    if (achievementText && !achievements.has(achievementText)) {
      displayNotification(achievementText);
      logAchievement(achievementText);
      saveAchievements();
    }
  }

  /**
   * Add achievement to the DOM.
   * @param {string} text The achievement text.
   * @return {void}
   */
  function logAchievement(text) {
    const achievementElement = document.createElement('li');
    achievementElement.textContent = text;
    document.getElementById('achievements-list').appendChild(achievementElement);
    achievements.add(text);
  }

  /**
   * Save achievements state in `localStorage`.
   * @return {void}
   */
  function saveAchievements() {
    window.localStorage.setItem(
      'achievements',
      JSON.stringify(Array.from(achievements))
    );
  }

  /**
   * Render a notification.
   * @param {string} text The text to display.
   * @return {void}
   */
  function displayNotification(text) {
    const notificationTemplate = document
      .getElementById('notification-template')
      .content
      .cloneNode(true);
    notificationTemplate.firstElementChild.children[0].textContent = text;
    document.body.appendChild(notificationTemplate);
    const notificationElement = document.getElementById('notification');
    window.setTimeout(function showAchievementMessage() {
      notificationElement.classList.add('notification--active');
    }, 4);
    window.setTimeout(function hideAchievementMessage() {
      notificationElement.classList.remove('notification--active');
    }, 3000);
    window.setTimeout(function clearAchievementNode() {
      notificationElement.parentNode.removeChild(notificationElement);
    }, 3500);
  }

  /**
   * Unhide the game path indicated.
   * @param {Element} buttonElement The choice button the player selected.
   * @return {void}
   */
  function showSelectedPath(buttonElement) {
    // Show the path selected.
    document.getElementById(buttonElement.dataset.targetId).hidden = false;
    // Disable the buttons to choose the current path,
    // and indicate your correct choice.
    buttonElement.parentNode.querySelectorAll('.game-button')
      .forEach(function disableButtons(button) {
        button.setAttribute('disabled', 'disabled');
        if (button.dataset.targetId === buttonElement.dataset.targetId) {
          button.classList.add('game-button--selected');
        }
      });
  }

  /**
   * Restart the game.
   * @return {void}
   */
  function restartGame() {
    // Hide all exposed path paragraphs.
    document.querySelectorAll('.game-scene:not([hidden])')
      .forEach(function hideGamePath(element) {
        element.hidden = true;
      });
    // Re-enable all choice buttons.
    document.querySelectorAll('.game-button')
      .forEach(function showChoices(element) {
        element.removeAttribute('disabled');
        element.classList.remove('game-button--selected');
      });
    // Show the starting segment.
    document.querySelector('.game-scene').hidden = false;
    // Scroll to top, aka the beginning of the story.
    window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }, 4);
  }

  function showEnd() {
    if (achievements.length === totalAchievements) {
      logAchievement('⭐️ Beat the game to the max!');
      achievements.push('⭐️ Beat the game to the max!');
      window.localStorage.setItem('achievements', JSON.stringify(achievements));
      document.getElementById('achievements-count').textContent = ( totalAchievements + 1 ) + '/' + ( totalAchievements + 1 );
      document.getElementById('achievement-max').classList.add('achievement--active');
      document.querySelector('#achievement-max button').addEventListener('click', function click() {
        document.getElementById('achievement-max').classList.remove('achievement--active');
      }, false);
    }
  }

})();
