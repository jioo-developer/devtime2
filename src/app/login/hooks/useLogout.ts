import { useMutation } from "@tanstack/react-query";
import { AuthenticatedApiClient } from "@/config/authenticatedApiClient";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clearTokens } from "@/config/utils/tokenStorage";

type LogoutResponse = {
  success: boolean;
  message?: string;
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      return AuthenticatedApiClient.post<LogoutResponse>("/api/auth/logout", {});
    },
    onSuccess: () => {
      // 토큰 삭제
      clearTokens();
      // React Query 캐시 초기화
      queryClient.clear();
      // 로그인 페이지로 이동
      router.replace("/login");
    },
    onError: (error) => {
      console.error("로그아웃 오류:", error);
      clearTokens();
      router.replace("/login");
    },
  });
};
