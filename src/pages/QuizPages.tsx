import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getBookById } from '../api/bookApi';
import type { Book } from '../api/bookApi';
import { DkTopNav, DkTabs, DBack, DCheck, DX, DArrow, GlassBtn } from '../components/Primitives';
import { Loader2, AlertCircle } from 'lucide-react';

interface Question {
  q: string;
  choices: string[];
  answer: number;
  explain: string;
}

const MOCK_QUIZZES: Record<string, Question[]> = {
  pride: [
    {
      q: '엘리자베스 베넷은 몇 자매 중 몇째인가요?',
      choices: ['다섯 자매 중 첫째', '다섯 자매 중 둘째', '네 자매 중 둘째', '세 자매 중 막내'],
      answer: 1,
      explain: '베넷 가의 다섯 자매 중 엘리자베스는 둘째입니다.',
    },
    {
      q: '다아시의 첫 청혼 어조로 가장 적절한 것은?',
      choices: ['겸손함', '오만함', '장난스러움', '사무적'],
      answer: 1,
      explain: '첫 청혼에서 다아시는 엘리자베스 가문을 얕보는 오만한 태도를 보입니다.',
    },
    {
      q: '"펨벌리"는 누구의 저택인가요?',
      choices: ['빙리', '콜린스', '다아시', '위컴'],
      answer: 2,
      explain: '펨벌리는 다아시 가문의 저택이며 엘리자베스의 인상이 바뀌는 전환점입니다.',
    },
    {
      q: '리디아와 함께 도망친 인물은?',
      choices: ['다아시', '빙리', '콜린스', '위컴'],
      answer: 3,
      explain: '다아시가 뒤에서 개입해 두 사람을 결혼시키며 베넷 가의 체면을 지킵니다.',
    },
    {
      q: '"Prejudice(편견)"은 주로 누구의 감정을 가리키나요?',
      choices: ['다아시가 베넷 가에 대해', '엘리자베스가 다아시에 대해', '콜린스가 베넷 가에 대해', '빙리 누이가 제인에 대해'],
      answer: 1,
      explain: '엘리자베스의 섣부른 편견을 가리키는 것으로 흔히 해석됩니다.',
    },
  ],
  gatsby: [
    {
      q: '개츠비가 매일 밤 응시하던 초록색 불빛은 어디에 있었나요?',
      choices: ['개츠비의 선착장 끝', '데이지의 집 선착장 끝', '뉴욕 플라자 호텔', '재의 계곡'],
      answer: 1,
      explain: '초록색 불빛은 이스트에그에 있는 데이지의 집 선착장 끝에 켜져 있었습니다.',
    },
    {
      q: '이 소설의 서술자(화자)이자 관찰자는 누구인가요?',
      choices: ['제이 개츠비', '닉 캐러웨이', '톰 뷰캐넌', '조지 윌슨'],
      answer: 1,
      explain: '닉 캐러웨이가 이야기의 서술자로서 개츠비의 삶을 우리에게 전달합니다.',
    },
    {
      q: '개츠비가 엄청난 부를 모은 주된 진짜 목적은 무엇인가요?',
      choices: ['데이지의 사랑을 되찾기 위해', '상류사회 일원이 되기 위해', '가난했던 어린 시절을 보상받기 위해', '정치인이 되기 위해'],
      answer: 0,
      explain: '개츠비는 오직 잃어버린 옛 사랑 데이지를 되찾고 그녀의 수준에 맞추기 위해 부를 축적했습니다.',
    },
    {
      q: '개츠비의 원래 본명은 무엇인가요?',
      choices: ['닉 캐러웨이', '제임스 개츠', '제이 게리', '코디 개츠'],
      answer: 1,
      explain: '그의 본명은 제임스 개츠(James Gatz)였으나, 성공을 꿈꾸며 제이 개츠비로 개명했습니다.',
    },
    {
      q: '데이지의 남편 톰 뷰캐넌의 성격으로 가장 적절한 것은?',
      choices: ['헌신적이고 자상함', '이기적이고 권력지향적임', '순진하고 어리숙함', '예술적이고 감성적임'],
      answer: 1,
      explain: '톰은 부유한 상류층으로서 이기적이고 폭력적이며 자신의 안위만을 챙기는 인물입니다.',
    },
  ],
};

const DEFAULT_QUIZ: Question[] = [
  {
    q: '이 도서의 핵심 주제로 가장 알맞은 것은 무엇인가요?',
    choices: ['인간의 실존적 고뇌와 구원', '신분 질서의 파괴와 자유의 획득', '산업화 속 소외되는 대중의 초상', '현대 자본주의 사회의 구조적 갈등'],
    answer: 0,
    explain: '이 고전 작품은 인물의 한계 극복과 도덕적 구원이라는 보편적 실존 주제를 담고 있습니다.',
  },
  {
    q: '주인공이 직면한 갈등의 주된 원인은 무엇인가요?',
    choices: ['지배층과 피지배층의 계급 갈등', '사회적 통념 및 도덕적 기준과의 불일치', '개인 내부의 도덕적 결함과 자아 분열', '급격한 시대적 변화에 따른 세대 간 격차'],
    answer: 1,
    explain: '사회의 낡은 질서와 법률, 그리고 주인공의 고결한 이성이 충돌하면서 파생되는 외적 갈등이 핵심 줄거리입니다.',
  },
  {
    q: '작품의 배경이 되는 공간적 특징은 어떤 상징성을 지녔나요?',
    choices: ['산업적 화려함과 도덕적 황폐함의 대비', '고귀한 안식처이자 속박의 굴레', '미지의 개척지이자 투쟁의 역사', '전통적 가치관이 붕괴되는 도시 문명'],
    answer: 1,
    explain: '작가가 설정한 주요 공간은 주인공에게 안식처를 주는 동시에, 극복해야 할 사회적 제약을 대변합니다.',
  },
  {
    q: '결말부에서 드러나는 작가의 메시지로 가장 알맞은 것은 무엇인가요?',
    choices: ['비극을 통한 연대 의식의 고취', '운명의 한계를 받아들이는 순응적 태도', '진정한 용서와 상생을 향한 화해', '소시민들의 이기심과 사회 부조리 폭로'],
    answer: 2,
    explain: '모든 파국적 갈등이 봉합되고 인물 간의 화해와 역사적 성찰이 이루어지는 휴머니즘적 가치관을 강조합니다.',
  },
  {
    q: '이 작품의 시점과 서술 방식의 특징으로 적절한 것은?',
    choices: ['1인칭 주인공 시점으로 극도의 주관성을 띤다', '전지적 작가 시점으로 인물의 심리를 입체적으로 추적한다', '관찰자의 눈을 빌려 객관적인 서사만을 전달한다', '여러 화자가 등장하는 다성적 서사 구조를 갖는다'],
    answer: 1,
    explain: '서술자는 각 인물의 내밀한 욕망과 고뇌를 전지적 시점에서 포착하여 풍성한 독서 경험을 돕습니다.',
  },
];

interface ScoreRingProps {
  score: number;
  total: number;
  size?: number;
}

const ScoreRing: React.FC<ScoreRingProps> = ({ score, total, size = 96 }) => {
  const pct = score / total;
  const r = size / 2 - 8;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={pct >= 0.8 ? '#5FC9A0' : pct >= 0.6 ? '#E8B86F' : '#D46A6A'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${circ * pct} ${circ}`}
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  );
};

export const QuizPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { user, logout, isMockMode, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Quiz solving states
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Array<{ q: string; correct: string; chosen: string; ok: boolean }>>([]);

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBookById(isMockMode, bookId);
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '도서 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, isMockMode]);

  if (loading) {
    return (
      <div className="min-h-screen dk-surface flex flex-col items-center justify-center relative">
        <div className="dk-grain" />
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-xs mt-3">퀴즈 시험지를 인쇄하고 있습니다...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen dk-surface flex flex-col items-center justify-center p-6 relative">
        <div className="dk-grain" />
        <div className="glass p-8 rounded-2xl text-center max-w-md">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-slate-800 dark:text-white mb-2">오류 발생</h2>
          <p className="text-slate-500 dark:text-white/45 text-sm mb-6">{error || '도서를 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-[#0B0E14] text-xs font-semibold"
          >
            서재로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const questions = MOCK_QUIZZES[book.id] || DEFAULT_QUIZ;
  const q = questions[i];
  const pct = Math.round((i / questions.length) * 100);

  const pick = (idx: number) => {
    if (reveal) return;
    setPicked(idx);
    setReveal(true);
    const isCorrect = idx === q.answer;
    if (isCorrect) setScore((s) => s + 1);

    setAnswers((prev) => [
      ...prev,
      {
        q: q.q,
        correct: q.choices[q.answer],
        chosen: q.choices[idx],
        ok: isCorrect,
      },
    ]);
  };

  const next = () => {
    if (i === questions.length - 1) {
      navigate(`/books/${book.id}/quiz/result`, {
        state: { score, total: questions.length, answers },
        replace: true,
      });
      return;
    }
    setI(i + 1);
    setPicked(null);
    setReveal(false);
  };

  const handleGo = (tab: string) => {
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'history') {
      navigate('/health');
    } else {
      alert('준비 중인 기능입니다!');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderQuizBody = () => {
    return (
      <>
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider mb-2 text-white/70">
          <span>{i + 1} / {questions.length}</span>
          <span className="text-white/45">SCORE {score}</span>
        </div>
        <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-white transition-[width] duration-300" style={{ width: `${pct}%` }} />
        </div>
        <div className="mt-5 glass rounded-2xl p-5 border border-white/5 relative z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">Q{i + 1}</div>
          <div className="font-display text-[20px] text-white leading-[1.4] mt-1.5 font-bold">{q.q}</div>
          <div className="mt-4 space-y-2">
            {q.choices.map((c, idx) => {
              const isCorrect = reveal && idx === q.answer;
              const isWrong = reveal && idx === picked && picked !== q.answer;
              const ring = isCorrect
                ? 'border-[#5FC9A0] bg-[#5FC9A0]/10 text-white'
                : isWrong
                ? 'border-[#D46A6A] bg-[#D46A6A]/10 text-white'
                : picked === idx
                ? 'border-white/30 bg-white/5 text-white'
                : 'border-white/10 hover:border-white/25 text-white/90';
              return (
                <button
                  key={idx}
                  onClick={() => pick(idx)}
                  className={`w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl border transition ${ring}`}
                >
                  <div
                    className={`w-6 h-6 rounded-full grid place-items-center text-[10px] font-mono shrink-0 ${
                      isCorrect ? 'bg-[#5FC9A0] text-white' : isWrong ? 'bg-[#D46A6A] text-white' : 'glass-soft text-white/70'
                    }`}
                  >
                    {isCorrect ? (
                      <DCheck className="w-3.5 h-3.5" />
                    ) : isWrong ? (
                      <DX className="w-3.5 h-3.5" />
                    ) : (
                      String.fromCharCode(65 + idx)
                    )}
                  </div>
                  <div className="text-[12px] flex-1">{c}</div>
                </button>
              );
            })}
          </div>
          {reveal && (
            <div className={`mt-4 rounded-xl p-3.5 ${picked === q.answer ? 'glass border-l-2 border-[#5FC9A0]' : 'glass-soft border-l-2 border-[#D46A6A]'}`}>
              <div className={`font-mono text-[10px] uppercase tracking-wider ${picked === q.answer ? 'text-[#5FC9A0]' : 'text-[#D46A6A]'}`}>
                {picked === q.answer ? '정답 · CORRECT' : '오답 · INCORRECT'}
              </div>
              <div className="text-[11px] text-white/75 leading-[1.6] mt-1.5 font-light">{q.explain}</div>
            </div>
          )}
        </div>
        <div className="mt-6 flex items-center justify-between relative z-10">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">{book.title} · CH 1–3</div>
          <GlassBtn
            kind={reveal ? 'primary' : 'soft'}
            size="md"
            onClick={reveal ? next : undefined}
            disabled={!reveal}
            className="flex items-center gap-1.5"
          >
            {i === questions.length - 1 ? '결과 보기' : '다음 문제'}
            <DArrow className="w-3.5 h-3.5" />
          </GlassBtn>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen dk-surface flex flex-col relative overflow-hidden text-white selection:bg-purple-500 selection:text-white">
      <div className="dk-grain absolute inset-0 opacity-40 pointer-events-none" />

      {/* Mobile view */}
      <div className="md:hidden flex-1 flex flex-col">
        <div className="px-4 pt-4 pb-2 flex items-center justify-between z-10">
          <button onClick={() => navigate(`/books/${book.id}`)} className="p-2 -ml-2 text-white/70">
            <DBack className="w-5 h-5" />
          </button>
          <div className="text-[11px] text-white/55 font-mono uppercase tracking-[0.16em]">QUIZ</div>
          <div className="w-8" />
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-[88px] pt-2">
          <div className="font-display text-[22px] font-bold text-white mb-0.5 leading-tight">{book.title}</div>
          <div className="text-[10px] text-white/45 font-mono uppercase tracking-wider mb-5">5 QUESTIONS · ~2 MIN</div>
          {renderQuizBody()}
        </div>
        <DkTabs active="quiz" go={handleGo} />
      </div>

      {/* Web/Desktop view */}
      <div className="hidden md:flex flex-col flex-1 relative">
        <DkTopNav 
          active="home" 
          go={handleGo} 
          onLogout={isAuthenticated ? handleLogout : undefined} 
          nickname={user?.nickname || '민'} 
        />
        <div className="flex-1 overflow-y-auto pt-24 px-10 py-8 max-w-6xl mx-auto w-full">
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            className="text-[11px] font-mono uppercase tracking-[0.14em] text-white/45 hover:text-white flex items-center gap-1 transition"
          >
            <DBack className="w-3.5 h-3.5" /> BACK TO DETAIL
          </button>
          <div className="grid grid-cols-[1fr_300px] gap-10 mt-6">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">COMPREHENSION QUIZ</div>
              <div className="font-display text-[44px] text-white leading-[1] mt-2 font-bold">{book.title}</div>
              <div className="text-[12px] text-white/45 mt-1 font-mono uppercase tracking-wider mb-8">5 QUESTIONS · CH 1–3</div>
              <div className="max-w-[640px]">{renderQuizBody()}</div>
            </div>
            <aside className="space-y-3">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">나의 이해도</div>
                <div className="flex items-end gap-1 mt-2">
                  <div className="font-display text-[44px] leading-none font-bold">82</div>
                  <div className="text-[10px] text-white/45 mb-1.5 font-mono">%</div>
                </div>
                <div className="mt-3 h-[2px] bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-white" style={{ width: '82%' }} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export const QuizResultPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isMockMode, isAuthenticated } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  const state = location.state as {
    score?: number;
    total?: number;
    answers?: Array<{ q: string; correct: string; chosen: string; ok: boolean }>;
  } | null;

  const score = state?.score ?? 4;
  const total = state?.total ?? 5;
  const answers = state?.answers ?? [
    {
      q: '엘리자베스 베넷은 몇 자매 중 몇째인가요?',
      correct: '다섯 자매 중 둘째',
      chosen: '다섯 자매 중 둘째',
      ok: true,
    },
    {
      q: '다아시의 첫 청혼 어조로 가장 적절한 것은?',
      correct: '오만함',
      chosen: '오만함',
      ok: true,
    },
    {
      q: '"펨벌리"는 누구의 저택인가요?',
      correct: '다아시',
      chosen: '다아시',
      ok: true,
    },
    {
      q: '리디아와 함께 도망친 인물은?',
      correct: '위컴',
      chosen: '위컴',
      ok: true,
    },
    {
      q: '"Prejudice(편견)"은 주로 누구의 감정을 가리키나요?',
      correct: '엘리자베스가 다아시에 대해',
      chosen: '다아시가 베넷 가에 대해',
      ok: false,
    },
  ];

  useEffect(() => {
    if (!bookId) return;

    const fetchBook = async () => {
      setLoading(true);
      try {
        const data = await getBookById(isMockMode, bookId);
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId, isMockMode]);

  if (loading || !book) {
    return (
      <div className="min-h-screen dk-surface flex flex-col items-center justify-center relative">
        <div className="dk-grain" />
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <p className="text-slate-400 text-xs mt-3">결과 리포트를 계산 중입니다...</p>
      </div>
    );
  }

  const handleGo = (tab: string) => {
    if (tab === 'home') {
      navigate('/');
    } else if (tab === 'history') {
      navigate('/health');
    } else {
      alert('준비 중인 기능입니다!');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const titleText = score >= 4 ? '훌륭해요!' : score >= 3 ? '잘 했어요' : '다시 도전!';

  return (
    <div className="min-h-screen dk-surface flex flex-col relative overflow-hidden text-white selection:bg-purple-500 selection:text-white">
      <div className="dk-grain absolute inset-0 opacity-40 pointer-events-none" />

      {/* Mobile view */}
      <div className="md:hidden flex-1 flex flex-col">
        <div className="px-5 pt-4 pb-2 flex items-center justify-between z-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">QUIZ RESULT</div>
          <button onClick={() => navigate('/health')} className="text-[11px] text-white/50 font-mono">
            상태 페이지 →
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pb-[96px] pt-2">
          {/* Score card */}
          <div className="glass rounded-2xl p-5 mt-2 flex items-center gap-5 border border-white/5">
            <div className="relative shrink-0">
              <ScoreRing score={score} total={total} size={88} />
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="font-display text-[26px] leading-none text-ac font-bold">{score}</div>
                  <div className="text-[10px] text-white/40 font-mono">/ {total}</div>
                </div>
              </div>
            </div>
            <div>
              <div className="font-display text-[22px] leading-[1.1] font-bold text-white">{titleText}</div>
              <div className="text-[12px] text-white/55 mt-1.5 font-light">{book.title} · CH 1–3 · 정답률 {Math.round((score / total) * 100)}%</div>
              <div className="text-[10px] font-mono text-white/35 mt-1">STANDARD · 소요 3분 21초</div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="glass rounded-2xl p-5 mt-4 border border-white/5">
            <div className="font-display text-[16px] mb-4 font-bold">문항별 채점 결과</div>
            <div className="space-y-4">
              {answers.map((ans, idx) => (
                <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-mono font-bold shrink-0 ${
                          ans.ok ? 'bg-[#5FC9A0] text-white' : 'bg-[#D46A6A] text-white'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <div className="text-[12px] font-medium leading-snug">{ans.q}</div>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${ans.ok ? 'text-[#5FC9A0]' : 'text-[#D46A6A]'}`}>
                      {ans.ok ? '정답' : '오답'}
                    </span>
                  </div>
                  <div className="mt-2 pl-7 text-[11px] text-white/55 space-y-1 font-light">
                    <div>
                      <span className="text-white/30 mr-1">내가 선택한 답:</span>
                      {ans.chosen}
                    </div>
                    {!ans.ok && (
                      <div>
                        <span className="text-white/30 mr-1">올바른 정답:</span>
                        {ans.correct}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4 z-10 relative">
            <button
              onClick={() => navigate(`/books/${book.id}/quiz`)}
              className="flex-1 py-3 glass-soft rounded-full text-[12px] text-white/75 text-center active:scale-[0.98] transition"
            >
              다시 풀기
            </button>
            <button
              onClick={() => navigate(`/books/${book.id}`)}
              className="flex-1 py-3 rounded-full text-[12px] text-white font-medium text-center active:scale-[0.98] transition"
              style={{ background: 'linear-gradient(135deg,#7AA3D6,#3E6FA9)' }}
            >
              상세로 돌아가기
            </button>
          </div>
        </div>
        <DkTabs active="me" go={handleGo} />
      </div>

      {/* Web/Desktop view */}
      <div className="hidden md:flex flex-col flex-1 relative">
        <DkTopNav 
          active="home" 
          go={handleGo} 
          onLogout={isAuthenticated ? handleLogout : undefined} 
          nickname={user?.nickname || '민'} 
        />
        <div className="flex-1 overflow-y-auto pt-24 px-10 py-8 max-w-6xl mx-auto w-full">
          <button
            onClick={() => navigate(`/books/${book.id}/quiz`)}
            className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/35 hover:text-white flex items-center gap-1 transition mb-6"
          >
            <DBack className="w-3 h-3" /> RESTART QUIZ
          </button>
          <div className="grid grid-cols-[1fr_380px] gap-8">
            <div className="space-y-5">
              {/* Score ring box */}
              <div className="glass rounded-2xl p-7 flex items-center gap-8 border border-white/5">
                <div className="relative shrink-0">
                  <ScoreRing score={score} total={total} size={120} />
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center">
                      <div className="font-display text-[38px] leading-none text-ac font-bold">{score}</div>
                      <div className="text-[11px] text-white/40 font-mono">/ {total}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">QUIZ RESULT · 이해도 점검</div>
                  <div className="font-display text-[40px] leading-[1.05] mt-2 font-bold text-white">{titleText}</div>
                  <div className="text-[14px] text-white/55 mt-2 font-light">
                    {book.title} · CH 1–3 · 정답률 {Math.round((score / total) * 100)}% · STANDARD
                  </div>
                  <div className="flex gap-2 mt-5">
                    <button
                      onClick={() => navigate(`/books/${book.id}/quiz`)}
                      className="glass-soft rounded-full px-5 py-2.5 text-[12px] text-white/75 hover:bg-white/10 transition active:scale-[0.98]"
                    >
                      다시 풀기
                    </button>
                    <button
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="rounded-full px-5 py-2.5 text-[12px] text-white font-medium transition active:scale-[0.98]"
                      style={{ background: 'linear-gradient(135deg,#7AA3D6,#3E6FA9)' }}
                    >
                      상세로 돌아가기
                    </button>
                  </div>
                </div>
              </div>

              {/* Breakdown list */}
              <div className="glass rounded-2xl p-6 border border-white/5">
                <div className="font-display text-[18px] mb-4 font-bold">문항별 채점 결과</div>
                <div className="space-y-4">
                  {answers.map((ans, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full grid place-items-center text-[10px] font-mono font-bold shrink-0 ${
                              ans.ok ? 'bg-[#5FC9A0] text-white' : 'bg-[#D46A6A] text-white'
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <div className="text-[13px] font-medium leading-snug">{ans.q}</div>
                        </div>
                        <span className={`text-[11px] font-bold shrink-0 ${ans.ok ? 'text-[#5FC9A0]' : 'text-[#D46A6A]'}`}>
                          {ans.ok ? '정답' : '오답'}
                        </span>
                      </div>
                      <div className="mt-2 pl-7 text-[12px] text-white/55 space-y-1 font-light">
                        <div>
                          <span className="text-white/35 mr-1">내가 선택한 답:</span>
                          {ans.chosen}
                        </div>
                        {!ans.ok && (
                          <div>
                            <span className="text-white/35 mr-1">올바른 정답:</span>
                            {ans.correct}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar statistics */}
            <aside className="space-y-4">
              <div className="glass rounded-2xl p-5 border border-white/5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">학습 제안</div>
                <div className="text-[18px] font-display mt-2 font-semibold">
                  {score >= 4 ? '다음 챕터로 진행하세요!' : '해당 챕터를 복습해 보세요.'}
                </div>
                <p className="text-[12px] text-white/55 mt-1.5 font-light leading-relaxed">
                  {score >= 4
                    ? '이해도가 매우 높습니다. 퀴즈를 무사히 마쳤으니 이제 다음 챕터의 AI 요약본이나 삽화 갤러리를 확인해 보시는 것을 추천합니다.'
                    : '오답 해설을 꼼꼼히 확인하고, 필요한 경우 해당 챕터의 요약본을 다시 한 번 읽어보시는 것을 권장합니다.'}
                </p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};
