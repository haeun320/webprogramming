/**
 * 가위바위보 게임 핵심 로직
 * 게임 규칙 및 승부 판정을 담당
 */

// 게임 선택지 정의
const CHOICES = {
  rock: { name: '바위', icon: '✊', image: 'images/rock.png', beats: 'scissors' },
  paper: { name: '보', icon: '🖐️', image: 'images/paper.png', beats: 'rock' },
  scissors: { name: '가위', icon: '✌️', image: 'images/scissors.png', beats: 'paper' },
};

// 게임 결과 상수
const GAME_RESULTS = {
  WIN: 'win',
  LOSE: 'lose',
  DRAW: 'draw',
};

/**
 * 컴퓨터의 선택을 랜덤으로 생성
 * @returns {string} 컴퓨터의 선택 (rock, paper, scissors 중 하나)
 */
function getComputerChoice() {
  const choices = Object.keys(CHOICES);
  const randomIndex = Math.floor(Math.random() * choices.length);
  return choices[randomIndex];
}

/**
 * 게임 승부 판정 로직
 * @param {string} playerChoice - 플레이어의 선택
 * @param {string} computerChoice - 컴퓨터의 선택
 * @returns {string} 게임 결과 (win, lose, draw)
 */
function determineWinner(playerChoice, computerChoice) {
  // 같은 선택일 경우 무승부
  if (playerChoice === computerChoice) {
    return GAME_RESULTS.DRAW;
  }

  // 플레이어가 이기는 경우 체크
  if (CHOICES[playerChoice].beats === computerChoice) {
    return GAME_RESULTS.WIN;
  }

  // 나머지는 패배
  return GAME_RESULTS.LOSE;
}

/**
 * 게임 결과 메시지 생성
 * @param {string} result - 게임 결과
 * @param {string} playerChoice - 플레이어의 선택
 * @param {string} computerChoice - 컴퓨터의 선택
 * @returns {string} 결과 메시지
 */
function getResultMessage(result, playerChoice, computerChoice) {
  const playerName = CHOICES[playerChoice].name;
  const computerName = CHOICES[computerChoice].name;

  switch (result) {
    case GAME_RESULTS.WIN:
      return `🎉 승리! ${playerName}이(가) ${computerName}을(를) 이겼습니다!`;
    case GAME_RESULTS.LOSE:
      return `😢 패배! ${computerName}이(가) ${playerName}을(를) 이겼습니다!`;
    case GAME_RESULTS.DRAW:
      return `🤝 무승부! 둘 다 ${playerName}을(를) 선택했습니다!`;
    default:
      return '알 수 없는 결과입니다.';
  }
}

/**
 * 메인 게임 실행 함수
 * @param {string} playerChoice - 플레이어의 선택
 * @returns {object} 게임 결과 객체
 */
function playGame(playerChoice) {
  // 컴퓨터 선택 생성
  const computerChoice = getComputerChoice();

  // 승부 판정
  const result = determineWinner(playerChoice, computerChoice);

  // 결과 메시지 생성
  const message = getResultMessage(result, playerChoice, computerChoice);

  // 게임 결과 객체 반환
  return {
    playerChoice: playerChoice,
    computerChoice: computerChoice,
    result: result,
    message: message,
    timestamp: new Date(),
  };
}

/**
 * 선택지 정보 가져오기
 * @param {string} choice - 선택지 키
 * @returns {object} 선택지 정보 객체
 */
function getChoiceInfo(choice) {
  return CHOICES[choice] || null;
}
