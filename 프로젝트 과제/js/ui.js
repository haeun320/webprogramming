/**
 * UI 조작 및 DOM 요소 처리
 * jQuery를 활용한 사용자 인터페이스 관리
 */

// 테마 관련 상수
const THEME_STORAGE_KEY = 'rps_theme_mode';
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

// DOM이 준비되면 실행
$(document).ready(function () {
  // 초기화 함수 실행
  initializeGame();

  // 이벤트 리스너 등록
  setupEventListeners();

  // 테마 초기화
  initializeTheme();
});

/**
 * 게임 초기화 함수
 */
function initializeGame() {
  // 저장된 통계 및 기록 로드하여 화면에 표시
  updateStatsDisplay();
  updateHistoryDisplay();

  console.log('게임이 초기화되었습니다.');
}

/**
 * 테마 초기화 함수
 */
function initializeTheme() {
  // 저장된 테마 설정 불러오기 (기본값: 라이트 모드)
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) || THEMES.LIGHT;

  // 테마 적용
  applyTheme(savedTheme);

  console.log('테마가 초기화되었습니다:', savedTheme);
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
  // 선택 버튼 클릭 이벤트
  $('.choice-btn').on('click', function () {
    const playerChoice = $(this).data('choice');
    handlePlayerChoice(playerChoice);
  });

  // 게임 초기화 버튼 클릭 이벤트
  $('#resetGame').on('click', function () {
    handleResetGame();
  });

  // 테마 토글 버튼 클릭 이벤트
  $('#themeToggle').on('click', function () {
    handleThemeToggle();
  });

  // 버튼 호버 효과 (jQuery 애니메이션)
  $('.choice-btn').hover(
    function () {
      // 마우스 진입 시
      $(this).addClass('btn-hover');
    },
    function () {
      // 마우스 떠날 시
      $(this).removeClass('btn-hover');
    }
  );
}

/**
 * 테마 토글 처리 함수
 */
function handleThemeToggle() {
  // 현재 테마 확인
  const currentTheme = $('body').hasClass('dark-mode') ? THEMES.DARK : THEMES.LIGHT;

  // 새로운 테마 결정
  const newTheme = currentTheme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;

  // 테마 적용
  applyTheme(newTheme);

  // 테마 설정 저장
  localStorage.setItem(THEME_STORAGE_KEY, newTheme);

  // 테마 변경 피드백
  showThemeChangeFeedback(newTheme);

  console.log('테마가 변경되었습니다:', newTheme);
}

/**
 * 테마 적용 함수
 * @param {string} theme - 적용할 테마 (light 또는 dark)
 */
function applyTheme(theme) {
  const $body = $('body');
  const $themeIcon = $('.theme-icon');

  if (theme === THEMES.DARK) {
    // 다크 모드 적용
    $body.addClass('dark-mode');
    $themeIcon.text('☀️'); // 태양 아이콘 (라이트 모드로 전환)
    $('#themeToggle').attr('title', '라이트모드 전환');
  } else {
    // 라이트 모드 적용
    $body.removeClass('dark-mode');
    $themeIcon.text('🌙'); // 달 아이콘 (다크 모드로 전환)
    $('#themeToggle').attr('title', '다크모드 전환');
  }
}

/**
 * 테마 변경 피드백 표시
 * @param {string} newTheme - 새로 적용된 테마
 */
function showThemeChangeFeedback(newTheme) {
  const themeText = newTheme === THEMES.DARK ? '다크 모드' : '라이트 모드';
  const $message = $(`<div class="theme-change-message">${themeText}로 변경되었습니다!</div>`);

  $('body').append($message);

  // 애니메이션 효과
  $message
    .fadeIn(300)
    .delay(1500)
    .fadeOut(300, function () {
      $(this).remove();
    });
}

/**
 * 플레이어 선택 처리 함수
 * @param {string} playerChoice - 플레이어가 선택한 값
 */
function handlePlayerChoice(playerChoice) {
  // 버튼 비활성화 (중복 클릭 방지)
  $('.choice-btn').prop('disabled', true);

  // 게임 실행
  const gameResult = playGame(playerChoice);

  // 선택 효과 애니메이션
  animatePlayerChoice(playerChoice);

  // 컴퓨터 선택 애니메이션 (딜레이 후 실행)
  setTimeout(() => {
    animateComputerChoice(gameResult.computerChoice);

    // 결과 표시 (추가 딜레이)
    setTimeout(() => {
      displayGameResult(gameResult);
      saveAndUpdateUI(gameResult);

      // 버튼 다시 활성화
      $('.choice-btn').prop('disabled', false);
    }, 800);
  }, 500);
}

/**
 * 플레이어 선택 애니메이션
 * @param {string} choice - 선택된 값
 */
function animatePlayerChoice(choice) {
  const choiceInfo = getChoiceInfo(choice);
  const $playerChoice = $('#playerChoice');
  const $playerChoiceImage = $('#playerChoiceImage');
  const $playerChoiceIcon = $('#playerChoiceIcon');

  // 이미지로 선택 표시 업데이트
  $playerChoiceImage.attr('src', choiceInfo.image);
  $playerChoiceImage.attr('alt', choiceInfo.name);
  $playerChoiceImage.show();
  $playerChoiceIcon.hide();
  $playerChoice.find('.choice-text').text(choiceInfo.name);

  // 선택 효과 애니메이션
  $playerChoice.addClass('choice-selected');
  setTimeout(() => {
    $playerChoice.removeClass('choice-selected');
  }, 300);
}

/**
 * 컴퓨터 선택 애니메이션
 * @param {string} choice - 컴퓨터 선택값
 */
function animateComputerChoice(choice) {
  const $computerChoice = $('#computerChoice');
  const $computerChoiceImage = $('#computerChoiceImage');
  const $computerChoiceIcon = $('#computerChoiceIcon');
  const choiceInfo = getChoiceInfo(choice);

  // 로딩 애니메이션
  $computerChoice.addClass('computer-thinking');
  $computerChoiceImage.hide();
  $computerChoiceIcon.show();
  $computerChoiceIcon.text('🤔');
  $computerChoice.find('.choice-text').text('생각 중...');

  // 잠시 후 실제 선택 표시
  setTimeout(() => {
    $computerChoice.removeClass('computer-thinking');
    $computerChoiceImage.attr('src', choiceInfo.image);
    $computerChoiceImage.attr('alt', choiceInfo.name);
    $computerChoiceImage.show();
    $computerChoiceIcon.hide();
    $computerChoice.find('.choice-text').text(choiceInfo.name);

    // 컴퓨터 선택 효과
    $computerChoice.addClass('choice-selected');
    setTimeout(() => {
      $computerChoice.removeClass('choice-selected');
    }, 300);
  }, 300);
}

/**
 * 게임 결과를 팝업으로 표시
 * @param {object} gameResult - 게임 결과 객체
 */
function displayGameResult(gameResult) {
  const $resultPopup = $('#resultPopup');
  const $resultMessage = $('#resultMessage');

  // 이전 결과 클래스 제거
  $resultMessage.removeClass('result-win result-lose result-draw');

  // 결과에 따른 스타일 클래스 추가
  $resultMessage.addClass(`result-${gameResult.result}`);

  // 결과 메시지 표시
  $resultMessage.text(gameResult.message);

  // 팝업 표시 애니메이션
  $resultPopup.removeClass('hide').addClass('show');

  // 0.8초 후 자동으로 사라지게 설정
  setTimeout(() => {
    hideResultPopup();
  }, 800);
}

/**
 * 결과 팝업 숨기기
 */
function hideResultPopup() {
  const $resultPopup = $('#resultPopup');

  $resultPopup.removeClass('show').addClass('hide');

  // 애니메이션 완료 후 클래스 정리
  setTimeout(() => {
    $resultPopup.removeClass('hide');
  }, 300);
}

/**
 * 게임 결과 저장 및 UI 업데이트
 * @param {object} gameResult - 게임 결과 객체
 */
function saveAndUpdateUI(gameResult) {
  // 게임 결과 저장
  const savedData = saveGameResult(gameResult);

  if (savedData) {
    // 통계 업데이트
    updateStatsDisplay(savedData.stats);

    // 기록 업데이트
    updateHistoryDisplay(savedData.history);

    // 성공 피드백
    showSuccessFeedback();
  } else {
    console.error('게임 결과 저장에 실패했습니다.');
  }
}

/**
 * 통계 표시 업데이트
 * @param {object} stats - 통계 객체 (선택사항)
 */
function updateStatsDisplay(stats = null) {
  // 통계가 제공되지 않은 경우 로드
  if (!stats) {
    stats = loadGameStats();
  }

  // 각 통계 값 업데이트 (애니메이션 효과)
  animateCounterUpdate('#winCount', stats.win);
  animateCounterUpdate('#drawCount', stats.draw);
  animateCounterUpdate('#loseCount', stats.lose);
}

/**
 * 숫자 카운터 애니메이션
 * @param {string} selector - 대상 요소 선택자
 * @param {number} targetValue - 목표 값
 */
function animateCounterUpdate(selector, targetValue) {
  const $element = $(selector);
  const currentValue = parseInt($element.text()) || 0;

  // 값이 변경된 경우에만 애니메이션 실행
  if (currentValue !== targetValue) {
    $({ counter: currentValue }).animate(
      { counter: targetValue },
      {
        duration: 500,
        step: function () {
          $element.text(Math.ceil(this.counter));
        },
        complete: function () {
          $element.text(targetValue);
          // 업데이트 효과
          $element.parent().addClass('stat-updated');
          setTimeout(() => {
            $element.parent().removeClass('stat-updated');
          }, 600);
        },
      }
    );
  }
}

/**
 * 게임 기록 표시 업데이트
 * @param {array} history - 게임 기록 배열 (선택사항)
 */
function updateHistoryDisplay(history = null) {
  // 기록이 제공되지 않은 경우 로드
  if (!history) {
    history = loadGameHistory();
  }

  const $historyBody = $('#historyBody');
  const $noHistory = $('#noHistory');
  const $historyTable = $('#historyTable');

  // 기록이 없는 경우
  if (history.length === 0) {
    $historyTable.hide();
    $noHistory.show();
    return;
  }

  // 기록이 있는 경우
  $noHistory.hide();
  $historyTable.show();

  // 테이블 내용 초기화
  $historyBody.empty();

  // 각 기록을 테이블 행으로 추가
  history.forEach((record, index) => {
    const formattedRecord = formatGameRecord(record);
    const $row = createHistoryRow(formattedRecord, index === 0);
    $historyBody.append($row);
  });
}

/**
 * 게임 기록 테이블 행 생성
 * @param {object} record - 포맷된 게임 기록
 * @param {boolean} isLatest - 최신 기록 여부
 * @returns {jQuery} 테이블 행 jQuery 객체
 */
function createHistoryRow(record, isLatest = false) {
  const $row = $('<tr>');

  // 최신 기록인 경우 특별한 클래스 추가
  if (isLatest) {
    $row.addClass('latest-game');
  }

  // 각 셀 내용 추가
  $row.append(`<td>${record.gameNumber}</td>`);
  $row.append(`<td>${record.playerChoice.icon} ${record.playerChoice.name}</td>`);
  $row.append(`<td>${record.computerChoice.icon} ${record.computerChoice.name}</td>`);
  $row.append(`<td><span class="${record.result.class}">${record.result.text}</span></td>`);
  $row.append(`<td>${record.time}</td>`);

  return $row;
}

/**
 * 게임 초기화 처리
 */
function handleResetGame() {
  // 확인 대화상자 표시
  if (confirm('정말로 모든 게임 기록을 초기화하시겠습니까?')) {
    // 데이터 초기화
    const resetData = resetAllGameData();

    if (resetData) {
      // UI 초기화
      updateStatsDisplay(resetData.stats);
      updateHistoryDisplay(resetData.history);

      // 게임 결과 영역 초기화
      resetGameDisplay();

      // 성공 메시지
      showResetFeedback();
    }
  }
}

/**
 * 게임 표시 영역 초기화
 */
function resetGameDisplay() {
  // 플레이어 선택 초기화
  $('#playerChoiceImage').hide();
  $('#playerChoiceIcon').show().text('❓');
  $('#playerChoice .choice-text').text('선택하세요');

  // 컴퓨터 선택 초기화
  $('#computerChoiceImage').hide();
  $('#computerChoiceIcon').show().text('❓');
  $('#computerChoice .choice-text').text('대기 중');

  // 결과 팝업 숨기기
  hideResultPopup();
}

/**
 * 성공 피드백 표시
 */
function showSuccessFeedback() {
  // 간단한 성공 효과
  $('body').addClass('game-success');
  setTimeout(() => {
    $('body').removeClass('game-success');
  }, 300);
}

/**
 * 초기화 피드백 표시
 */
function showResetFeedback() {
  // 초기화 완료 메시지
  const $message = $('<div class="reset-message">게임 기록이 초기화되었습니다!</div>');
  $('body').append($message);

  // 애니메이션 효과
  $message
    .fadeIn(300)
    .delay(2000)
    .fadeOut(300, function () {
      $(this).remove();
    });
}
