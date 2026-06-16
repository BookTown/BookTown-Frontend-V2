import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { DArrow, DkCover, DkMark } from '../components/Primitives';

// mock book data from unpack
const EX_BOOKS = [
  { id: 'pride', title: '오만과 편견', author: '제인 오스틴' },
  { id: 'gatsby', title: '위대한 개츠비', author: 'F. 스콧 피츠제럴드' },
];

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isMockMode, toggleMockMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formElement = (compact: boolean) => {
    const f = compact
      ? { h: 'text-[26px]', gap: 'gap-3', pad: 'py-2.5', label: 'text-[11px]' }
      : { h: 'text-[34px]', gap: 'gap-3.5', pad: 'py-3', label: 'text-[12px]' };

    return (
      <form onSubmit={handleLoginSubmit} className="w-full">
        {/* seg toggle */}
        <div className="glass-soft rounded-full p-1 flex mb-6">
          <button
            type="button"
            className="flex-1 py-2 rounded-full text-[12px] bg-white text-[#0B0E14] font-medium transition"
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="flex-1 py-2 rounded-full text-[12px] text-white/65 hover:text-white transition"
          >
            회원가입
          </button>
        </div>

        <h2 className={`font-display ${f.h} leading-[1.05] text-white`}>
          다시 <em className="text-ac2">오셨네요</em>
        </h2>
        <p className="text-[11px] text-white/45 font-mono uppercase tracking-[0.14em] mt-1.5">
          이메일로 계속하기 · {isMockMode ? 'MOCK 데모 세션' : 'JWT 보안 세션'}
        </p>

        <div className={`mt-6 flex flex-col ${f.gap}`}>
          <label className="block">
            <span className={`${f.label} text-white/55`}>이메일</span>
            <div className="mt-1.5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full glass-soft rounded-xl pl-10 pr-3.5 ${f.pad} text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/25`}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label className="block">
            <span className={`${f.label} text-white/55`}>비밀번호</span>
            <div className="mt-1.5 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/35">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="4" y="10" width="16" height="10" rx="2.5" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full glass-soft rounded-xl pl-10 pr-10 ${f.pad} text-[14px] text-white/90 placeholder:text-white/30 focus:outline-none focus:border-white/25`}
                placeholder="8자 이상"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${showPassword ? 'text-ac2' : 'text-white/35'} hover:text-white/70`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>
            <div className="flex justify-between items-center mt-1.5">
              {errorMsg ? (
                <span className="text-[11px] text-red-400 font-medium">{errorMsg}</span>
              ) : (
                <span className="text-[11px] text-white/35 font-light">영문·숫자 조합 8자 이상</span>
              )}
              <span className="text-[11px] text-ac2/80 cursor-pointer hover:text-ac2">비밀번호 재설정 →</span>
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 py-3 rounded-full text-[13px] text-white font-medium glass-btn disabled:opacity-50"
          style={{
            background: 'linear-gradient(135deg,#7AA3D6,#3E6FA9)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 16px rgba(122,163,214,0.4)',
          }}
        >
          {loading ? '로그인 중...' : '로그인'}{' '}
          <DArrow className="w-4 h-4 inline-block ml-1.5 align-[-2px]" />
        </button>

        <div className="flex items-center gap-3 my-5 text-[10px] text-white/30 font-mono uppercase tracking-wider">
          <div className="h-px flex-1 bg-white/10" />
          또는
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <button type="button" className="glass-soft rounded-full py-2.5 text-[12px] text-white/50 cursor-not-allowed" disabled>
            Google
          </button>
          <button type="button" className="glass-soft rounded-full py-2.5 text-[12px] text-white/50 cursor-not-allowed" disabled>
            Kakao
          </button>
        </div>

        {/* Mock Mode Control Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={toggleMockMode}
            className={`px-3 py-1.5 rounded-full text-[10px] font-mono border transition ${
              isMockMode
                ? 'bg-ac2/10 text-ac2 border-ac2/30 shadow-[0_0_12px_rgba(232,184,111,0.2)]'
                : 'bg-white/5 text-white/40 border-white/10'
            }`}
          >
            Mocking API: {isMockMode ? 'ON' : 'OFF'}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="relative w-full min-h-screen dk-surface">
      <div className="dk-grain" />

      {/* 1. Mobile View (md 미만) */}
      <div className="block md:hidden h-full flex flex-col">
        {/* cinematic header band */}
        <div className="relative h-[150px] shrink-0 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(80% 90% at 30% 0%, rgba(122,163,214,0.30), transparent 60%), radial-gradient(60% 80% at 90% 30%, rgba(232,184,111,0.16), transparent 60%)',
            }}
          />
          <div className="absolute right-3 top-8 w-[72px] h-[104px] rotate-[8deg] opacity-90">
            <DkCover book={EX_BOOKS[0]} />
          </div>
          <div className="absolute right-[58px] top-12 w-[64px] h-[92px] -rotate-[10deg] opacity-60">
            <DkCover book={EX_BOOKS[1]} />
          </div>
          <div className="relative px-6 pt-6">
            <DkMark size={24} />
            <div className="font-display text-[20px] mt-5 leading-[1.1] max-w-[180px] text-white">
              고전의 첫 장을<br />
              <em className="text-ac2">다시</em> 펼치는 곳
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto hide-scroll px-6 pt-1 pb-8">
          {formElement(true)}
        </div>
      </div>

      {/* 2. Desktop View (md 이상) */}
      <div className="hidden md:grid h-screen grid-cols-[1.05fr_0.95fr]">
        {/* cinematic aside */}
        <div className="relative overflow-hidden border-r border-white/8 p-12 flex flex-col">
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(70% 60% at 15% 10%, rgba(122,163,214,0.22), transparent 60%), radial-gradient(60% 60% at 100% 100%, rgba(232,184,111,0.12), transparent 60%)',
            }}
          />
          <div className="relative z-10">
            <DkMark size={26} />
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 mt-10">
              A reading companion for the classics
            </div>
            <h1 className="font-display text-[52px] leading-[1.05] mt-4 max-w-[14ch] text-white">
              고전의 첫 장을<br />
              <em className="text-ac2">다시</em> 펼치는 곳.
            </h1>
            <p className="text-[13px] text-white/55 mt-5 max-w-[34ch] leading-[1.7] font-light">
              AI 요약 · 장면 일러스트 · 이해도 퀴즈가 원문 문맥을 근거로 함께합니다.
            </p>
          </div>
          <div className="relative z-10 mt-auto flex items-center gap-2">
            <span className="text-[10px] glass-soft rounded-full px-2.5 py-1 text-white/70 font-mono uppercase tracking-wider">
              JWT · Refresh 회전
            </span>
            <span className="text-[10px] glass-soft rounded-full px-2.5 py-1 text-white/70 font-mono uppercase tracking-wider">
              HttpOnly 쿠키
            </span>
          </div>
          {/* floating covers */}
          <div className="absolute right-[-30px] bottom-6 flex gap-4 rotate-[-8deg] opacity-90 pointer-events-none">
            <div className="w-[120px] h-[172px]">
              <DkCover book={EX_BOOKS[0]} />
            </div>
            <div className="w-[120px] h-[172px]">
              <DkCover book={EX_BOOKS[1]} />
            </div>
          </div>
        </div>

        {/* Form area */}
        <div className="grid place-items-center p-10 overflow-y-auto">
          <div className="w-full max-w-[360px]">{formElement(false)}</div>
        </div>
      </div>
    </div>
  );
};
export default Login;
