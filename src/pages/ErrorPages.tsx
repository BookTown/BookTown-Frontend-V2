import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassBtn } from '../components/Primitives';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      <div className="dk-grain absolute inset-0 opacity-40" />
      
      {/* Background Blurs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[350px] h-[350px] rounded-full bg-amber-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full glass-dark border border-white/5 p-8 md:p-12 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="font-display text-[96px] font-extrabold text-white/20 leading-none select-none tracking-tighter">404</div>
        <h1 className="font-serif text-[20px] text-white font-medium mt-4">길을 잃었습니다</h1>
        <p className="text-[12px] text-white/45 font-light leading-relaxed mt-2.5">
          요청하신 페이지가 존재하지 않거나 이전되었습니다.<br />
          아래 버튼을 클릭해 메인 화면으로 돌아가 보세요.
        </p>
        
        <div className="mt-8 flex justify-center">
          <GlassBtn kind="strong" onClick={() => navigate('/health')} className="w-full md:w-auto">
            메인으로 돌아가기
          </GlassBtn>
        </div>
      </div>
    </div>
  );
};

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-purple-500 selection:text-white relative overflow-hidden">
      <div className="dk-grain absolute inset-0 opacity-40" />
      
      {/* Background Blurs */}
      <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-red-950/15 blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md w-full glass-dark border border-white/5 p-8 md:p-12 rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)]">
        <div className="font-display text-[96px] font-extrabold text-white/20 leading-none select-none tracking-tighter">403</div>
        <h1 className="font-serif text-[20px] text-white font-medium mt-4">접근 권한이 없습니다</h1>
        <p className="text-[12px] text-white/45 font-light leading-relaxed mt-2.5">
          이 리소스에 접근할 수 있는 권한이 승인되지 않았습니다.<br />
          문제가 지속되면 시스템 관리자에게 문의해 주세요.
        </p>
        
        <div className="mt-8 flex justify-center">
          <GlassBtn kind="strong" onClick={() => navigate('/health')} className="w-full md:w-auto">
            메인으로 돌아가기
          </GlassBtn>
        </div>
      </div>
    </div>
  );
};
