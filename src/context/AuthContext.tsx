import React, { useState, useEffect } from 'react';
import client, { setAccessToken } from '../api/client';
import { AuthContext } from './AuthContextObject';
import type { User } from './AuthContextObject';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 로컬스토리지를 초기 상태값(initial state)에서 직접 조회하여 동기 세션 복원
  const [isMockMode, setIsMockMode] = useState<boolean>(() => {
    const savedMockMode = localStorage.getItem('bt_mock_mode');
    return savedMockMode !== null ? savedMockMode === 'true' : true;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('bt_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [accessTokenState, setAccessTokenState] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('bt_token');
    return savedToken || null;
  });

  // setAccessToken은 외부 모듈(client.ts)의 변수를 갱신하므로 Effect에서 1회 수행
  useEffect(() => {
    const savedToken = localStorage.getItem('bt_token');
    if (savedToken) {
      setAccessToken(savedToken);
    }
  }, []);

  const toggleMockMode = () => {
    const nextMode = !isMockMode;
    setIsMockMode(nextMode);
    localStorage.setItem('bt_mock_mode', String(nextMode));
  };

  const login = async (email: string, password: string) => {
    if (isMockMode) {
      // Mock Login
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!email || !password) {
        throw new Error('이메일과 비밀번호를 입력해주세요.');
      }
      const mockToken = 'mock_jwt_access_token_' + Math.random().toString(36).substring(7);
      const mockUser = { nickname: '민지', email };
      
      setAccessTokenState(mockToken);
      setAccessToken(mockToken);
      setUser(mockUser);

      localStorage.setItem('bt_token', mockToken);
      localStorage.setItem('bt_user', JSON.stringify(mockUser));
      return;
    }

    // Real API Call
    try {
      const response = await client.post('/auth/login', { email, password });
      const { accessToken: token, nickname } = response.data.data;
      setAccessTokenState(token);
      setAccessToken(token);
      
      const realUser = { nickname, email };
      setUser(realUser);

      localStorage.setItem('bt_token', token);
      localStorage.setItem('bt_user', JSON.stringify(realUser));
    } catch (error: unknown) {
      let errorMsg = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.';
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response?.data?.message) {
        errorMsg = axiosError.response.data.message;
      }
      throw new Error(errorMsg, { cause: error });
    }
  };

  const signup = async (nickname: string, email: string, password: string) => {
    if (isMockMode) {
      // Mock Signup
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (!nickname || !email || !password) {
        throw new Error('모든 필드를 입력해 주세요.');
      }
      return;
    }

    // Real API Call
    try {
      await client.post('/auth/signup', { nickname, email, password });
    } catch (error: unknown) {
      let errorMsg = '회원가입에 실패했습니다.';
      const axiosError = error as AxiosErrorResponse;
      if (axiosError && axiosError.response?.data?.message) {
        errorMsg = axiosError.response.data.message;
      }
      throw new Error(errorMsg, { cause: error });
    }
  };

  const logout = () => {
    setAccessTokenState(null);
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('bt_token');
    localStorage.removeItem('bt_user');
  };

  const isAuthenticated = !!accessTokenState;

  return (
    <AuthContext.Provider
      value={{
        accessToken: accessTokenState,
        isAuthenticated,
        user,
        isMockMode,
        toggleMockMode,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
