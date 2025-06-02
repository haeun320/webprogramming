/**
 * 게임 결과 저장 및 조회 기능
 * 로컬스토리지를 활용한 데이터 관리
 *
 * ====================================
 * 데이터 구조체 정의
 * ====================================
 *
 * [게임 통계 구조체 - stats]
 * {
 *   win: number,        // 승리 횟수
 *   lose: number,       // 패배 횟수
 *   draw: number,       // 무승부 횟수
 *   totalGames: number  // 총 게임 횟수
 * }
 *
 * [게임 기록 구조체 - history]
 * [
 *   {
 *     gameNumber: number,      // 게임 번호 (1부터 시작)
 *     playerChoice: string,    // 플레이어 선택 ('rock', 'paper', 'scissors')
 *     computerChoice: string,  // 컴퓨터 선택 ('rock', 'paper', 'scissors')
 *     result: string,          // 게임 결과 ('win', 'lose', 'draw')
 *     message: string,         // 결과 메시지 ('🎉 승리!', '😢 패배!', '🤝 무승부!')
 *     timestamp: Date          // 게임 시간
 *   },
 *   ...
 * ]
 */

// 로컬스토리지 키 상수
const STORAGE_KEYS = {
  GAME_HISTORY: 'rps_game_history',
  GAME_STATS: 'rps_game_stats',
};

// 최대 저장할 게임 기록 수
const MAX_HISTORY_COUNT = 5;

/**
 * 게임 통계 초기화
 * @returns {object} 초기 통계 객체
 */
function initializeStats() {
  return {
    win: 0,
    lose: 0,
    draw: 0,
    totalGames: 0,
  };
}

/**
 * 로컬스토리지에서 게임 통계 불러오기
 * @returns {object} 게임 통계 객체
 */
function loadGameStats() {
  try {
    const statsData = localStorage.getItem(STORAGE_KEYS.GAME_STATS);
    if (statsData) {
      return JSON.parse(statsData);
    }
  } catch (error) {
    console.error('게임 통계 로드 중 오류:', error);
  }

  // 데이터가 없거나 오류가 발생한 경우 초기 통계 반환
  return initializeStats();
}

/**
 * 게임 통계를 로컬스토리지에 저장
 * @param {object} stats - 저장할 통계 객체
 */
function saveGameStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_STATS, JSON.stringify(stats));
  } catch (error) {
    console.error('게임 통계 저장 중 오류:', error);
  }
}

/**
 * 전체 게임 기록 불러오기 (모달용)
 * @returns {array} 전체 게임 기록 배열
 */
function loadAllGameHistory() {
  try {
    const historyData = localStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
    if (historyData) {
      const history = JSON.parse(historyData);
      // 날짜 객체로 변환하여 전체 기록 반환
      return history.map((game) => ({
        ...game,
        timestamp: new Date(game.timestamp),
      }));
    }
  } catch (error) {
    console.error('전체 게임 기록 로드 중 오류:', error);
  }

  return [];
}

/**
 * 로컬스토리지에서 게임 기록 불러오기
 * @returns {array} 게임 기록 배열
 */
function loadGameHistory() {
  // 전체 기록을 가져온 후 최근 5개만 반환
  const allHistory = loadAllGameHistory();
  return allHistory.slice(0, MAX_HISTORY_COUNT);
}

/**
 * 게임 기록을 로컬스토리지에 저장
 * @param {array} history - 저장할 기록 배열
 */
function saveGameHistory(history) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(history));
  } catch (error) {
    console.error('게임 기록 저장 중 오류:', error);
  }
}

/**
 * 새로운 게임 결과를 저장
 * @param {object} gameResult - 게임 결과 객체
 */
function saveGameResult(gameResult) {
  // 현재 통계 로드
  const currentStats = loadGameStats();

  // 통계 업데이트
  currentStats[gameResult.result]++;
  currentStats.totalGames++;

  // 업데이트된 통계 저장
  saveGameStats(currentStats);

  let allHistory = loadAllGameHistory();

  // 게임 번호 추가
  const gameNumber = currentStats.totalGames;
  const gameRecord = {
    ...gameResult,
    gameNumber: gameNumber,
  };

  // 새 기록을 맨 앞에 추가 (전체 기록에는 제한 없이 저장)
  allHistory.unshift(gameRecord);

  // 전체 기록 저장 (제한 없음)
  saveGameHistory(allHistory);

  // 최근 5개 기록만 추출하여 반환
  const recentHistory = allHistory.slice(0, MAX_HISTORY_COUNT);

  return {
    stats: currentStats,
    history: recentHistory, // UI 업데이트용으로는 최근 5개만 반환
  };
}

/**
 * 게임 데이터 완전 초기화
 */
function resetAllGameData() {
  try {
    // 로컬스토리지에서 게임 데이터 삭제
    localStorage.removeItem(STORAGE_KEYS.GAME_STATS);
    localStorage.removeItem(STORAGE_KEYS.GAME_HISTORY);

    console.log('게임 데이터가 초기화되었습니다.');

    return {
      stats: initializeStats(),
      history: [],
    };
  } catch (error) {
    console.error('게임 데이터 초기화 중 오류:', error);
    return null;
  }
}

/**
 * 게임 기록을 표시용 형태로 변환
 * @param {object} gameRecord - 게임 기록 객체
 * @returns {object} 표시용 게임 기록
 */
function formatGameRecord(gameRecord) {
  const playerChoice = getChoiceInfo(gameRecord.playerChoice);
  const computerChoice = getChoiceInfo(gameRecord.computerChoice);

  // 결과 텍스트 및 스타일 클래스 결정
  let resultText, resultClass;
  switch (gameRecord.result) {
    case 'win':
      resultText = '승리';
      resultClass = 'result-win-text';
      break;
    case 'lose':
      resultText = '패배';
      resultClass = 'result-lose-text';
      break;
    case 'draw':
      resultText = '무승부';
      resultClass = 'result-draw-text';
      break;
    default:
      resultText = '알 수 없음';
      resultClass = '';
  }

  // 시간 포맷팅 (HH:MM:SS)
  const timeString = gameRecord.timestamp.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return {
    gameNumber: gameRecord.gameNumber,
    playerChoice: {
      icon: playerChoice.icon,
      name: playerChoice.name,
    },
    computerChoice: {
      icon: computerChoice.icon,
      name: computerChoice.name,
    },
    result: {
      text: resultText,
      class: resultClass,
    },
    time: timeString,
  };
}

/**
 * 승률 계산
 * @param {object} stats - 게임 통계 객체
 * @returns {object} 승률 정보
 */
function calculateWinRate(stats) {
  if (stats.totalGames === 0) {
    return '0%';
  }

  const winRate = stats.win / stats.totalGames;
  const winPercentage = (winRate * 100).toFixed(2) + '%';

  return winPercentage;
}
